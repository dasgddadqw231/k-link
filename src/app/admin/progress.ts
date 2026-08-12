/**
 * 브랜드 하나가 열 단계 중 어디까지 왔는지.
 *
 * 규칙이 하나 있다: **저장된 값만 읽는다.** 여러 값을 엮어 "이 브랜드는 대충
 * 6단계쯤"이라고 짐작하지 않는다. 짐작한 자리는 틀렸을 때도 맞은 것처럼 보이고,
 * 그러면 이 화면을 보고 일을 놓친다. 사람이 판단해야 끝나는 것은 사람이 적는다 —
 * 03 시장 검증이 그래서 시딩 건수가 아니라 날짜 한 칸이다.
 *
 * 축이 넷이라는 것도 여기서 드러난다.
 *  · 01 은 제품에 붙는다 (products.food_group · hs_code · extra_permit)
 *  · 02~03 은 브랜드에 붙는다 (brands.status · validated_on)
 *  · 04 는 제품에 붙는다 (products.fda_status · label_status)
 *  · 05~07 은 선적에 붙는다 (shipments.stage)
 *  · 10 은 허가에 붙는다 (licences.expires_on)
 * 한 브랜드 안에서 A제품은 팔리고 B제품은 등록 대기일 수 있고, 이번 컨테이너는
 * 통관 중인데 다음 발주는 생산 중일 수 있다. 그래서 한 줄에 값 하나로는 못
 * 적는다 — 단계마다 상태를 따로 낸다.
 */
import type {
  Brand,
  FinanceEntry,
  Licence,
  Product,
  Shipment,
  ShipStage,
  StockMove,
} from "../../lib/admin";
import { SHIP_FLOW } from "../../lib/admin";

/** 만료가 이 안에 들어오면 갱신을 시작할 때다. อ.7 갱신은 심사가 붙어 시간이 걸린다. */
export const RENEW_WINDOW_DAYS = 60;

/**
 * done — 지나갔다
 * now  — 지금 여기서 일이 돌고 있다
 * todo — 아직 안 왔다
 *
 * 한때 "적을 칸이 없어서 모른다"는 네 번째 상태가 있었다. 01·03·10이 그랬는데,
 * 지금은 셋 다 칸이 생겨서 쓰이지 않는다. 그 상태를 남겨 두면 범례에 일어날 수
 * 없는 일이 적혀 있게 되므로 지웠다 — 다시 그런 단계가 생기면 그때 되살린다.
 */
export type StageState = "done" | "now" | "todo";

export interface StageCell {
  /** workflow.ts 의 Stage.id 와 같은 값. */
  id: string;
  state: StageState;
  /** 셀 위에 뜨는 한 줄. 셋 다 없으면 상태만 보여 준다. */
  hint?: string;
}

export interface BrandProgress {
  brand: Brand;
  cells: StageCell[];
  products: Product[];
  shipments: Shipment[];
  /** 이 브랜드에 걸리는 허가 + 회사 전체에 걸리는 허가(อ.7 처럼). */
  licences: Licence[];
}

/** 선적이 그 단계를 지났는지 보려면 순서를 숫자로 바꿔야 한다. */
function shipRank(stage: ShipStage): number {
  const i = SHIP_FLOW.indexOf(stage);
  return i < 0 ? 0 : i;
}

/**
 * 선적 단계 하나(05·06·07)의 상태.
 *
 * 지금 그 단계에 서 있는 선적이 있으면 now, 그 단계를 이미 지난 선적이 있으면
 * done, 둘 다 없으면 아직 안 온 것이다. 여러 선적이 흩어져 있으면 지금 있는 쪽이
 * 이긴다 — 한 건이라도 거기서 돌고 있으면 그게 지금 할 일이다.
 */
function shipCell(id: string, stage: ShipStage, shipments: Shipment[]): StageCell {
  const here = shipments.filter((s) => s.stage === stage);
  if (here.length > 0) {
    return { id, state: "now", hint: `선적 ${here.length}건` };
  }
  const past = shipments.filter((s) => shipRank(s.stage) > shipRank(stage));
  if (past.length > 0) return { id, state: "done", hint: `${past.length}건 지남` };
  return { id, state: "todo" };
}

export function brandProgress(
  brand: Brand,
  allProducts: Product[],
  allShipments: Shipment[],
  moves: StockMove[],
  finance: FinanceEntry[],
  allLicences: Licence[],
  /** 오늘. 넘겨받는다 — 함수 안에서 시계를 읽으면 같은 입력이 날마다 다른 답을 낸다. */
  today: Date,
): BrandProgress {
  const products = allProducts.filter((p) => p.active && p.brand_id === brand.id);
  const shipments = allShipments.filter((s) => s.brand_id === brand.id);
  const productIds = new Set(products.map((p) => p.id));

  const signed = brand.status !== "lead" && brand.status !== "meeting";

  // 01 — 갈래를 정했고, HS 코드를 잡았고, 다른 부처가 붙는지 봤는가. 셋 다
  // 채워져야 끝난 것이다. 갈래만 정하고 부처를 안 보면 방콕 항구에서 잡힌다.
  const screened = (p: Product) =>
    p.food_group !== "unknown" && p.hs_code.trim() !== "" && p.extra_permit !== "unknown";

  let screen: StageCell;
  if (products.length === 0) {
    // 제품이 없으면 판정할 대상이 없다. 브랜드 상태가 아직 발굴·미팅이면 그게 지금 할 일이다.
    screen = signed
      ? { id: "screen", state: "todo", hint: "등록된 제품 없음" }
      : { id: "screen", state: "now" };
  } else if (products.every(screened)) {
    const extra = products.filter((p) => p.extra_permit !== "none");
    screen = {
      id: "screen",
      state: "done",
      hint: extra.length > 0 ? `부처 추가 ${extra.length}개` : undefined,
    };
  } else {
    screen = {
      id: "screen",
      state: "now",
      hint: `판정 남음 ${products.filter((p) => !screened(p)).length}개`,
    };
  }

  // 04 — 제품 등록과 라벨 승인 둘 다 끝나야 지나간 것이다. 라벨이 훨씬 오래
  // 걸리므로 등록만 보고 done 을 주면 실제로는 아직 못 파는 상태를 끝났다고 적게 된다.
  const ready = (p: Product) => p.fda_status === "approved" && p.label_status === "approved";
  const moving = (p: Product) =>
    p.fda_status === "preparing" ||
    p.fda_status === "submitted" ||
    p.fda_status === "rejected" ||
    p.label_status === "preparing" ||
    p.label_status === "submitted" ||
    p.label_status === "rejected" ||
    (p.fda_status === "approved" && p.label_status !== "approved");

  let fda: StageCell;
  if (products.length === 0) {
    fda = { id: "fda", state: "todo", hint: "등록된 제품 없음" };
  } else if (products.every(ready)) {
    fda = { id: "fda", state: "done", hint: `제품 ${products.length}개 완료` };
  } else if (products.some(moving)) {
    const waiting = products.filter((p) => p.fda_status === "approved" && p.label_status !== "approved");
    fda = {
      id: "fda",
      state: "now",
      hint: waiting.length > 0 ? `라벨 승인 대기 ${waiting.length}개` : `진행 중 ${products.filter(moving).length}개`,
    };
  } else {
    fda = { id: "fda", state: "todo" };
  }

  // 08 — 시딩 출고는 판매가 아니다. 인플루언서가 달린 출고는 03단계의 일이라
  // 여기서 세면 팔리지도 않은 브랜드가 판매 중으로 보인다.
  const sold = moves.filter(
    (m) => m.kind === "out" && !m.influencer_id && productIds.has(m.product_id),
  );

  const settled = finance.filter((f) => f.brand_id === brand.id && f.category === "settlement");

  // 03 — 시딩 출고가 나갔으면 검증이 돌고 있는 것이고, 사람이 끝났다고 적어야
  // 끝난 것이다. 시딩 건수로 완료를 짐작하지 않는다 — 몇 건이면 충분한지는
  // 규칙이 아니라 판단이다.
  const seeded = moves.filter((m) => m.influencer_id && productIds.has(m.product_id));
  const validate: StageCell = brand.validated_on
    ? { id: "validate", state: "done", hint: `${brand.validated_on} 검증` }
    : seeded.length > 0
      ? { id: "validate", state: "now", hint: `시딩 ${seeded.length}건` }
      : { id: "validate", state: "todo" };

  // 10 — 만료가 있는 것들. 지났으면 그날부터 일이 멈추므로 지난 것이 먼저다.
  const licences = allLicences.filter(
    (l) => l.brand_id === brand.id || (!l.brand_id && !l.product_id) || (l.product_id && productIds.has(l.product_id)),
  );
  const days = (iso: string) =>
    Math.round((new Date(`${iso}T00:00:00`).getTime() - today.getTime()) / 86_400_000);
  const dated = licences.filter((l) => l.expires_on);
  const expired = dated.filter((l) => days(l.expires_on!) < 0);
  const soon = dated.filter((l) => {
    const d = days(l.expires_on!);
    return d >= 0 && d <= RENEW_WINDOW_DAYS;
  });

  let keep: StageCell;
  if (licences.length === 0) {
    keep = { id: "keep", state: "todo", hint: "등록된 허가 없음" };
  } else if (expired.length > 0) {
    keep = { id: "keep", state: "now", hint: `만료됨 ${expired.length}건` };
  } else if (soon.length > 0) {
    keep = { id: "keep", state: "now", hint: `${RENEW_WINDOW_DAYS}일 내 만료 ${soon.length}건` };
  } else {
    keep = { id: "keep", state: "done", hint: `허가 ${licences.length}건 유효` };
  }

  const cells: StageCell[] = [
    screen,
    {
      id: "contract",
      state: signed ? "done" : "todo",
      hint: signed && brand.contract_from ? `${brand.contract_from} 시작` : undefined,
    },
    validate,
    fda,
    shipCell("produce", "produce", shipments),
    shipCell("export", "export", shipments),
    shipCell("import", "import", shipments),
    {
      id: "sell",
      // 끝나는 단계가 아니라서 done 을 주지 않는다. 팔리고 있으면 계속 now 다.
      state: sold.length > 0 ? "now" : "todo",
      hint: sold.length > 0 ? `판매 출고 ${sold.length}건` : undefined,
    },
    {
      id: "settle",
      state: settled.length > 0 ? "now" : "todo",
      hint: settled.length > 0 ? `정산 ${settled.length}건` : undefined,
    },
    keep,
  ];

  return { brand, cells, products, shipments, licences };
}

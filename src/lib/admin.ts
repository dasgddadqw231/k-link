/**
 * 관리자 도구의 데이터 형태.
 *
 * 통화 원칙: 태국 법인이므로 모든 금액이 THB다. 통화 칸도 환율 칸도 두지 않는다 —
 * 한국 매입처럼 원화로 청구받은 건도 실제로 결제한 바트 금액을 적는다. 같은 거래가
 * 두 숫자로 남으면 어느 쪽이 장부인지 매번 되물어야 한다.
 *
 * 재고 원칙: 현재고 필드를 따로 두지 않는다. stock_moves의 합이 곧 현재고라
 * 두 값이 어긋날 일이 없고, 숫자가 왜 그렇게 됐는지 항상 되짚을 수 있다.
 */

export type MoveKind = "in" | "out" | "adjust";
export type Platform = "instagram" | "tiktok" | "youtube" | "facebook" | "other";
export type InfStatus = "lead" | "contacted" | "confirmed" | "shipped" | "posted" | "dropped";
export type Direction = "in" | "out";

/** 입출고 사유. 인플루언서 시딩(seeding)이 두 시스템을 잇는 고리다. */
export const MOVE_REASONS = {
  in: ["import", "return", "count"],
  out: ["sale", "seeding", "sample", "loss"],
  adjust: ["count"],
} as const;

export const IN_CATEGORIES = ["sales", "commission", "other_in"] as const;
/** 마지막의 other는 어디에도 안 맞는 지출을 위한 자리. 분류를 억지로 고르게 하면 장부가 거짓말을 한다. */
export const OUT_CATEGORIES = [
  "goods",
  "logistics",
  "registration",
  "marketing",
  "influencer",
  "payroll",
  "ops",
  "settlement",
  // 환불은 매출을 되돌리는 돈이다. amount에 음수를 넣을 수 없으니 나가는 돈으로 적는다.
  "refund",
  "other",
] as const;

/** 브랜드사를 달아 두는 것이 뜻있는 분류. 정산·수수료·매출·환불은 언제나 상대가 있다. */
export const BRAND_CATEGORIES = ["settlement", "commission", "sales", "refund"] as const;

export const INF_FLOW: InfStatus[] = ["lead", "contacted", "confirmed", "shipped", "posted"];

export type BrandStatus = "lead" | "meeting" | "contracted" | "active" | "ended";
export type FdaStatus = "none" | "preparing" | "submitted" | "approved" | "rejected";

/**
 * 선적 한 건이 지금 어느 단계에 있는지. 프로세스 문서(workflow.ts)의 단계 id를
 * 그대로 쓴다 — 두 곳의 이름이 같아야 화면이 단계를 짐작하지 않고 저장된 값을
 * 그대로 셀 수 있다. done 은 07단계 입고까지 끝난 상태다.
 */
export type ShipStage = "produce" | "export" | "import" | "done";

/**
 * 01단계에서 정하는 식품 갈래. 여기서 전체 일정이 갈린다 — 일반식품은 등록이
 * 아예 필요 없고, 라벨부착·표준식품은 2영업일, 구체적 통제식품은 35~90영업일이다.
 * unknown 은 아직 판정 전이라는 뜻이고, 그 자체가 01단계가 안 끝났다는 신호다.
 */
export type FoodGroup = "unknown" | "general" | "labelled" | "standardised" | "controlled";

/**
 * FDA 말고 더 붙는 부처. unknown 과 none 은 다른 뜻이다 — "아직 안 봤다"와
 * "보니 없더라". 둘을 같게 두면 확인을 안 한 제품이 확인 끝난 제품처럼 보인다.
 */
export type ExtraPermit = "unknown" | "none" | "dld" | "doa" | "other";

/** 만료가 있는 것들. 종류를 열이 아니라 행으로 두는 이유는 앞으로 늘어나기 때문이다. */
export type LicenceKind = "or7" | "ad" | "vat" | "trademark" | "other";
export type AssetKind =
  | "product_shot"
  | "detail_page"
  | "video"
  | "logo"
  | "doc"
  | "content"
  | "other";

export const BRAND_FLOW: BrandStatus[] = [
  "lead",
  "meeting",
  "contracted",
  "active",
  "ended",
];
export const FDA_FLOW: FdaStatus[] = [
  "none",
  "preparing",
  "submitted",
  "approved",
  "rejected",
];
export const SHIP_FLOW: ShipStage[] = ["produce", "export", "import", "done"];
export const FOOD_GROUPS: FoodGroup[] = [
  "unknown",
  "general",
  "labelled",
  "standardised",
  "controlled",
];
export const EXTRA_PERMITS: ExtraPermit[] = ["unknown", "none", "dld", "doa", "other"];
export const LICENCE_KINDS: LicenceKind[] = ["or7", "ad", "vat", "trademark", "other"];
export const ASSET_KINDS: AssetKind[] = [
  "product_shot",
  "detail_page",
  "video",
  "logo",
  "doc",
  "content",
  "other",
];

export const ASSET_BUCKET = "brand-assets";

export interface Brand {
  id: string;
  name: string;
  name_th: string;
  legal_name: string;
  status: BrandStatus;
  commission_pct: number;
  monthly_fee_thb: number;
  contract_from: string | null;
  contract_to: string | null;
  /**
   * 03단계 시장 검증을 마친 날. 비어 있으면 아직 안 본 것이다.
   *
   * 시딩은 인플루언서 탭에 건별로 남지만, 그 기록들을 엮어 "이 브랜드는 검증이
   * 끝났다"를 짐작하면 안 된다 — 몇 건을 보내면 끝난 것인지는 사람이 정한다.
   */
  validated_on: string | null;
  contact_name: string;
  contact_role: string;
  contact_line: string;
  contact_email: string;
  contact_phone: string;
  note: string;
  sort: number;
  updated_at: string;
}

export interface BrandAsset {
  id: string;
  brand_id: string;
  kind: AssetKind;
  title: string;
  path: string;
  mime: string;
  size_bytes: number;
  note: string;
  created_at: string;
}

export interface Product {
  id: string;
  sku: string;
  /** 예전부터 있던 자유 입력 브랜드명. brand_id가 비었을 때만 쓴다. */
  brand: string;
  brand_id: string | null;
  fda_status: FdaStatus;
  /**
   * 라벨 사전승인(สบ.3/1). 04단계는 사실 두 가지 일이고 라벨 쪽이 훨씬 오래
   * 걸리는데, 칸이 fda_status 하나뿐일 때는 "등록은 끝났고 라벨을 기다리는 중"을
   * 적을 수 없었다 — 04단계에서 가장 오래 머무는 자리가 바로 그 상태다.
   *
   * 열이 아직 없는 DB에서 읽으면 undefined가 오므로 읽는 쪽에서 기본값을 준다.
   */
  label_status: FdaStatus;
  fda_number: string;
  fda_on: string | null;
  /** 01단계 판정 결과. 이 세 칸이 채워져야 01단계가 끝난 것이다. */
  food_group: FoodGroup;
  hs_code: string;
  extra_permit: ExtraPermit;
  name_ko: string;
  name_th: string;
  name_en: string;
  unit: string;
  cost_thb: number;
  price_thb: number;
  active: boolean;
  sort: number;
}

/**
 * 선적 한 건. 05~07단계(생산·선적·통관)가 사는 자리다.
 *
 * 이 단계들은 브랜드 단위도 제품 단위도 아니다 — 같은 제품이라도 이번 컨테이너는
 * 통관 중이고 다음 발주는 아직 생산 중일 수 있다. 그래서 별도의 개체가 있어야
 * 그 선적의 B/L·Form AK·LPI를 걸어 둘 데가 생긴다.
 */
export interface Shipment {
  id: string;
  brand_id: string;
  /** 단일 품목 선적이면 채우고, 섞어 보내면 비운다. */
  product_id: string | null;
  /** 사람이 부르는 이름. "2026-03 포지티바 1차" 처럼. */
  code: string;
  stage: ShipStage;
  incoterm: string;
  bl_no: string;
  form_ak: boolean;
  lpi_filed: boolean;
  etd: string | null;
  eta: string | null;
  cleared_on: string | null;
  note: string;
  created_at: string;
  updated_at: string;
}

/**
 * 만료가 있는 것. อ.7(3년), 광고 심의(최대 5년), 상표, 부가세 등록.
 *
 * brand_id·product_id가 둘 다 비어 있으면 회사 전체에 걸리는 허가다 — อ.7이
 * 그렇다. 이게 만료되면 그날부터 모든 브랜드의 수입이 멈추므로, 어느 브랜드에도
 * 걸리지 않는다는 사실이 오히려 중요하다.
 */
export interface Licence {
  id: string;
  kind: LicenceKind;
  name: string;
  number: string;
  brand_id: string | null;
  product_id: string | null;
  issued_on: string | null;
  expires_on: string | null;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface StockMove {
  id: string;
  product_id: string;
  /** 이 입고가 어느 선적으로 들어왔는지. 07단계와 재고를 잇는 고리다. */
  shipment_id: string | null;
  kind: MoveKind;
  qty: number;
  reason: string;
  lot: string;
  expiry: string | null;
  note: string;
  moved_on: string;
  /**
   * 시딩 출고가 어느 인플루언서에게 갔는지. 이름이 아니라 키로 잇는다 —
   * 이름은 바뀌고 겹친다. 인플루언서를 지워도 이 값만 비고 출고 기록은 남는다.
   */
  influencer_id: string | null;
}

export interface ProductStock {
  product_id: string;
  on_hand: number;
  nearest_expiry: string | null;
}

/**
 * 홈에 직접 적는 할 일.
 *
 * 예전에는 재고·유통기한·인플루언서 상태에서 자동으로 뽑아 "지금 챙길 일"을
 * 만들었다. 실제로 챙겨야 할 일은 그 세 갈래로 떨어지지 않아서, 규칙으로 짐작하는
 * 대신 사람이 적는 목록으로 바꿨다.
 */
export interface Todo {
  id: string;
  body: string;
  done: boolean;
  /** 선택. 적어 두면 지난 것부터 위로 올라온다. */
  due_on: string | null;
  sort: number;
  created_at: string;
  updated_at: string;
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  followers: number;
  status: InfStatus;
  fee_thb: number;
  deliverable: string;
  post_url: string;
  note: string;
  next_action_on: string | null;
  updated_at: string;
}

export interface FinanceEntry {
  id: string;
  entry_on: string;
  direction: Direction;
  category: string;
  /** 언제나 THB. 통화 열이 따로 없으니 이 숫자가 곧 장부 금액이다. */
  amount: number;
  memo: string;
  /** receipts 버킷 안의 파일 경로들. 비공개 버킷이라 볼 때 서명 URL을 받아 쓴다. */
  receipts: string[];
  /** 정산·수수료·매출처럼 상대가 있는 거래에 달아 두는 브랜드사. */
  brand_id: string | null;
  /**
   * 이 줄을 만든 재고 이동. 재고 탭에서 매입·판매·환불을 적으면 채워진다.
   *
   * 손으로 적은 거래는 비어 있다. 이동을 지울 때 딸린 돈 기록을 같이 정리하고,
   * 한 이동이 두 번 기표되지 않게 막는 것이 이 키가 하는 일이다.
   */
  stock_move_id: string | null;
}

/**
 * finance_totals 뷰 한 줄. 브랜드·방향·분류별 전 기간 누계.
 *
 * 화면이 읽는 거래 목록에는 한도가 있어서, "계약 이후 전부"를 세는 숫자를 그걸로
 * 만들면 오래된 건이 잘려 나간다. 세는 일은 DB에 맡긴다.
 */
export interface FinanceTotal {
  brand_id: string | null;
  direction: Direction;
  category: string;
  total: number;
  entries: number;
}

export const RECEIPT_BUCKET = "receipts";

/** 방콕 기준 오늘. 서버가 어디에 있든 팀이 보는 날짜와 맞춘다. */
export function todayBkk(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function thb(n: number): string {
  return `฿${Math.round(n).toLocaleString("en-US")}`;
}

export function num(n: number): string {
  return n.toLocaleString("en-US");
}

/** 팔로워는 자릿수만 빠르게 읽히면 된다. */
export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return String(n);
}

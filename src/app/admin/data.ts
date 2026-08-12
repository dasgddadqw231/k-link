/**
 * 관리자 데이터를 한 번에 읽어 화면들이 나눠 쓴다.
 *
 * 왜 한곳에 모으나: 홈 화면이 세 시스템의 숫자를 동시에 보여줘야 하고, 무엇을
 * 고쳐도 다른 탭의 숫자가 같이 맞아야 한다. 소규모 수입사 규모에서는 전체를
 * 다시 읽는 비용이 몇십 킬로바이트라, 낙관적 갱신으로 상태를 흩뜨리는 것보다
 * 매번 다시 읽는 쪽이 틀릴 여지가 없다.
 *
 * 다만 목록에는 한도가 있다(최근 2000건·500건). 한 달치를 보여 주는 데는 넉넉하지만
 * "계약 이후 전부"를 세는 합계는 한도 밖이 잘리면 조용히 작아진다. 그런 누계는
 * finance_totals 뷰에서 받는다 — 세는 일은 DB가 하고 여기서는 읽기만 한다.
 */
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type {
  Brand,
  BrandAsset,
  FinanceEntry,
  FinanceTotal,
  Influencer,
  Licence,
  Product,
  ProductStock,
  Shipment,
  StockMove,
  Todo,
} from "../../lib/admin";

export interface AdminData {
  brands: Brand[];
  assets: BrandAsset[];
  products: Product[];
  stock: Record<string, ProductStock>;
  /** 최근 이동 500건. 한 제품의 온전한 이력은 useProductMoves로 따로 읽는다. */
  moves: StockMove[];
  /** 선적. 05~07단계가 사는 자리다. */
  shipments: Shipment[];
  /**
   * shipments 표가 아직 DB에 없다. 마이그레이션을 적용하기 전이라는 뜻이고,
   * 화면은 이때 "아직 없다"고 말해야 한다 — 빈 목록으로 보여 주면 선적이
   * 한 건도 없는 것과 구분이 안 된다.
   */
  shipmentsMissing: boolean;
  /** 만료가 있는 허가들. 10단계가 사는 자리다. */
  licences: Licence[];
  influencers: Influencer[];
  /** 최근 거래 2000건. 전 기간 누계가 필요하면 financeTotals를 쓴다. */
  finance: FinanceEntry[];
  /** 브랜드별·분류별 전 기간 누계. 목록 한도와 무관하게 항상 전부를 센다. */
  financeTotals: FinanceTotal[];
  todos: Todo[];
  loading: boolean;
  /** 다시 읽는 중. 첫 로딩과 달리 화면은 그대로 두고 표시만 바꾼다. */
  refreshing: boolean;
  /** 마지막으로 읽어 온 시각. 두 사람이 같이 쓸 때 화면이 얼마나 묵었는지 알려준다. */
  syncedAt: Date | null;
  /**
   * 못 읽어 온 목록의 이름들. 비어 있으면 화면의 숫자가 전부 최신이라는 뜻이다.
   *
   * 예전에는 실패한 읽기를 빈 배열로 갈아 끼웠다. 그러면 "제품이 없습니다"가
   * 뜨는데 그게 진짜 없는 건지 못 읽은 건지 알 길이 없어서, 사람이 데이터가
   * 날아간 줄 알고 다시 입력하게 된다.
   */
  loadFailed: string[];
  reload: () => Promise<void>;
}

export function useAdminData(): AdminData {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Record<string, ProductStock>>({});
  const [moves, setMoves] = useState<StockMove[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shipmentsMissing, setShipmentsMissing] = useState(false);
  const [licences, setLicences] = useState<Licence[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [finance, setFinance] = useState<FinanceEntry[]>([]);
  const [financeTotals, setFinanceTotals] = useState<FinanceTotal[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncedAt, setSyncedAt] = useState<Date | null>(null);
  const [loadFailed, setLoadFailed] = useState<string[]>([]);

  const reload = useCallback(async (attempt = 0): Promise<void> => {
    setRefreshing(true);
    const [p, s, m, i, f, ft, b, as, td, sh, lc] = await Promise.all([
      supabase.from("products").select("*").order("sort").order("sku"),
      supabase.from("product_stock").select("*"),
      supabase.from("stock_moves").select("*").order("moved_on", { ascending: false }).limit(500),
      supabase.from("influencers").select("*").order("updated_at", { ascending: false }),
      supabase
        .from("finance_entries")
        .select("*")
        .order("entry_on", { ascending: false })
        .limit(2000),
      supabase.from("finance_totals").select("*"),
      supabase.from("brands").select("*").order("sort").order("name"),
      supabase
        .from("brand_assets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000),
      // 끝난 일은 목록 아래로 내린다. 정렬은 화면이 아니라 여기서 한 번만 정한다.
      supabase
        .from("todos")
        .select("*")
        .order("done")
        .order("due_on", { ascending: true, nullsFirst: false })
        .order("sort")
        .order("created_at"),
      supabase.from("shipments").select("*").order("created_at", { ascending: false }),
      // 만료가 가까운 것부터. 이 목록은 "곧 끝나는 것"을 보려고 읽는다.
      supabase
        .from("licences")
        .select("*")
        .order("expires_on", { ascending: true, nullsFirst: false }),
    ]);

    /*
      실패한 읽기를 빈 목록으로 갈아 끼우지 않는다.

      예전에는 전부 `?? []` 였다. 읽기 하나가 401로 튕기면 화면에 "제품이
      없습니다"가 뜨는데, 그게 진짜 없는 건지 못 읽은 건지 알려 주는 표시가
      아무 데도 없었다. 로그인 직후 토큰 시계 편차(PGRST303)로 실제로 겪은
      일이고, 그 화면을 본 사람은 데이터가 날아간 줄 알고 다시 입력하게 된다.

      그래서 성공한 것만 반영하고, 실패한 자리는 직전 값을 그대로 둔 채 어느
      목록이 묵었는지 이름으로 알린다.

      shipments 의 42P01(표 없음)만 예외다. 그건 실패가 아니라 "마이그레이션
      전"이라는 정상 신호라 따로 표시한다.
    */
    const reads = [
      ["제품", p, () => setProducts(
        ((p.data as Product[]) ?? []).map((row) => ({
          ...row,
          // 나중에 생긴 열들이라 옛 DB에서는 값 없이 온다. 판정 전을 뜻하는
          // unknown 이 기본값인 것이 중요하다 — none 으로 채우면 아직 안 본
          // 제품이 확인 끝난 제품으로 보인다.
          label_status: row.label_status ?? "none",
          food_group: row.food_group ?? "unknown",
          hs_code: row.hs_code ?? "",
          extra_permit: row.extra_permit ?? "unknown",
        })),
      )],
      ["재고", s, () => setStock(
        Object.fromEntries(((s.data as ProductStock[]) ?? []).map((r) => [r.product_id, r])),
      )],
      ["입출고", m, () => setMoves((m.data as StockMove[]) ?? [])],
      ["인플루언서", i, () => setInfluencers((i.data as Influencer[]) ?? [])],
      ["재무", f, () => setFinance((f.data as FinanceEntry[]) ?? [])],
      ["재무 누계", ft, () => setFinanceTotals((ft.data as FinanceTotal[]) ?? [])],
      ["브랜드사", b, () => setBrands((b.data as Brand[]) ?? [])],
      ["파일", as, () => setAssets((as.data as BrandAsset[]) ?? [])],
      ["할 일", td, () => setTodos((td.data as Todo[]) ?? [])],
      ["선적", sh, () => setShipments((sh.data as Shipment[]) ?? [])],
      ["인허가", lc, () => setLicences((lc.data as Licence[]) ?? [])],
    ] as const;

    const missing = sh.error?.code === "42P01";
    const failed = reads
      .filter(([, r]) => r.error && !(r === sh && missing))
      .map(([label]) => label);

    /*
      한 번은 조용히 다시 시도한다. 로그인 직후 토큰이 PostgREST 시계보다 한 발
      앞서서 튕기는 일이 있는데, 그건 다음 요청이면 풀린다. 사람에게 알릴 실패는
      두 번 해 보고도 안 되는 것뿐이다.
    */
    if (failed.length > 0 && attempt === 0) {
      await new Promise((r) => setTimeout(r, 700));
      return reload(1);
    }

    for (const [, r, apply] of reads) if (!r.error) apply();
    setShipmentsMissing(missing);
    setLoadFailed(failed);
    // 다 읽어 왔을 때만 시각을 갱신한다 — 반쪽 화면에 방금 맞췄다고 적으면 안 된다.
    if (failed.length === 0) setSyncedAt(new Date());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  /**
   * 탭으로 돌아오면 다시 읽는다. 한국 본사와 태국 팀이 같은 화면을 각자 열어
   * 두고 쓰기 때문에, 잠깐 다른 창을 보다 돌아왔을 때 남의 변경이 이미 반영돼
   * 있어야 한다. 너무 자주 부르지 않도록 30초는 그냥 넘긴다.
   */
  useEffect(() => {
    let lastAt = Date.now();
    function onVisible() {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastAt < 30_000) return;
      lastAt = Date.now();
      void reload();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [reload]);

  return {
    brands,
    assets,
    products,
    stock,
    moves,
    shipments,
    shipmentsMissing,
    licences,
    influencers,
    finance,
    financeTotals,
    todos,
    loading,
    refreshing,
    syncedAt,
    loadFailed,
    reload,
  };
}

export function onHand(stock: Record<string, ProductStock>, productId: string): number {
  return stock[productId]?.on_hand ?? 0;
}

/**
 * 한 대상(제품·인플루언서)에 걸린 입출고 전부.
 *
 * 목록에 쓰는 moves는 전부를 통틀어 최근 500건이라, 잘 나가는 제품 하나만 있어도
 * 다른 제품의 옛 이력이 밀려 사라진다. 상세 화면에서는 그 대상 것만 읽으면 되고
 * 두 열 모두 색인이 있어 싸다.
 *
 * 다시 읽는 동안에는 넘겨받은 목록을 그대로 보여 준다 — 열자마자 이력이 비었다가
 * 채워지면, 기록이 없는 것인지 아직 안 온 것인지 구분이 안 된다.
 */
function useScopedMoves(
  column: "product_id" | "influencer_id",
  id: string,
  fallback: StockMove[],
): { moves: StockMove[]; reload: () => Promise<void> } {
  const [rows, setRows] = useState<StockMove[] | null>(null);

  const reload = useCallback(async () => {
    const { data } = await supabase
      .from("stock_moves")
      .select("*")
      .eq(column, id)
      .order("moved_on", { ascending: false })
      .order("created_at", { ascending: false });
    setRows((data as StockMove[]) ?? []);
  }, [column, id]);

  useEffect(() => {
    setRows(null);
    void reload();
  }, [reload]);

  return { moves: rows ?? fallback, reload };
}

export function useProductMoves(productId: string, fallback: StockMove[]) {
  return useScopedMoves("product_id", productId, fallback);
}

export function useInfluencerMoves(influencerId: string, fallback: StockMove[]) {
  return useScopedMoves("influencer_id", influencerId, fallback);
}

/**
 * 이 제품에 걸린 입출고가 몇 건인지 DB에 직접 센다.
 *
 * 제품 삭제를 막을지 정하는 숫자다. 목록으로 세면 한도 밖으로 밀려난 이력이
 * 0건으로 보여 "지울 수 있습니다"라고 말해 놓고 DB가 거절한다. 세기 전에는
 * null이라, 답이 오기 전까지는 삭제를 열어 주지 않는다.
 */
export function useMoveCount(productId: string | null): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!productId) return setCount(0);
    setCount(null);
    let alive = true;
    void supabase
      .from("stock_moves")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId)
      .then(({ count: n }) => {
        if (alive) setCount(n ?? 0);
      });
    return () => {
      alive = false;
    };
  }, [productId]);

  return count;
}

/** 브랜드별·분류별 누계에서 한 칸을 꺼낸다. 없으면 0 — 아직 그런 거래가 없다는 뜻이다. */
export function totalOf(
  totals: FinanceTotal[],
  brandId: string | null,
  direction: "in" | "out",
  category: string,
): number {
  const hit = totals.find(
    (t) => t.brand_id === brandId && t.direction === direction && t.category === category,
  );
  return hit ? Number(hit.total) : 0;
}

/** 분류 하나의 전체 누계. 브랜드를 가리지 않는다 — 인플루언서 지출처럼 상대가 없는 돈. */
export function categoryTotal(
  totals: FinanceTotal[],
  direction: "in" | "out",
  category: string,
): number {
  return totals
    .filter((t) => t.direction === direction && t.category === category)
    .reduce((s, t) => s + Number(t.total), 0);
}

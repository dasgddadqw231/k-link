/**
 * 관리자 데이터를 한 번에 읽어 화면들이 나눠 쓴다.
 *
 * 왜 한곳에 모으나: 홈 화면이 세 시스템의 숫자를 동시에 보여줘야 하고, 무엇을
 * 고쳐도 다른 탭의 숫자가 같이 맞아야 한다. 소규모 수입사 규모에서는 전체를
 * 다시 읽는 비용이 몇십 킬로바이트라, 낙관적 갱신으로 상태를 흩뜨리는 것보다
 * 매번 다시 읽는 쪽이 틀릴 여지가 없다.
 */
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type {
  Brand,
  BrandAsset,
  FinanceEntry,
  Influencer,
  Product,
  ProductStock,
  StockMove,
  Todo,
} from "../../lib/admin";

export interface AdminData {
  brands: Brand[];
  assets: BrandAsset[];
  products: Product[];
  stock: Record<string, ProductStock>;
  moves: StockMove[];
  influencers: Influencer[];
  finance: FinanceEntry[];
  todos: Todo[];
  loading: boolean;
  /** 다시 읽는 중. 첫 로딩과 달리 화면은 그대로 두고 표시만 바꾼다. */
  refreshing: boolean;
  /** 마지막으로 읽어 온 시각. 두 사람이 같이 쓸 때 화면이 얼마나 묵었는지 알려준다. */
  syncedAt: Date | null;
  reload: () => Promise<void>;
}

export function useAdminData(): AdminData {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Record<string, ProductStock>>({});
  const [moves, setMoves] = useState<StockMove[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [finance, setFinance] = useState<FinanceEntry[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncedAt, setSyncedAt] = useState<Date | null>(null);

  const reload = useCallback(async () => {
    setRefreshing(true);
    const [p, s, m, i, f, b, as, td] = await Promise.all([
      supabase.from("products").select("*").order("sort").order("sku"),
      supabase.from("product_stock").select("*"),
      supabase.from("stock_moves").select("*").order("moved_on", { ascending: false }).limit(500),
      supabase.from("influencers").select("*").order("updated_at", { ascending: false }),
      supabase
        .from("finance_entries")
        .select("*")
        .order("entry_on", { ascending: false })
        .limit(2000),
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
    ]);

    setBrands((b.data as Brand[]) ?? []);
    setAssets((as.data as BrandAsset[]) ?? []);
    setProducts((p.data as Product[]) ?? []);
    const stockRows = (s.data as ProductStock[]) ?? [];
    setStock(Object.fromEntries(stockRows.map((r) => [r.product_id, r])));
    setMoves((m.data as StockMove[]) ?? []);
    setInfluencers((i.data as Influencer[]) ?? []);
    setFinance((f.data as FinanceEntry[]) ?? []);
    setTodos((td.data as Todo[]) ?? []);
    setSyncedAt(new Date());
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
    influencers,
    finance,
    todos,
    loading,
    refreshing,
    syncedAt,
    reload,
  };
}

export function onHand(stock: Record<string, ProductStock>, productId: string): number {
  return stock[productId]?.on_hand ?? 0;
}

/**
 * 가장 최근에 쓴 원화 환율. 재무와 재고(한국 매입) 양쪽에서 기본값으로 쓴다.
 *
 * 환율은 하루 사이 크게 움직이지 않는데, 매번 고정값을 지우고 다시 적게 하면
 * 아무도 확인하지 않고 그냥 저장하게 된다. finance는 entry_on 역순이라 첫 KRW
 * 항목이 곧 가장 최근 것이다.
 */
export function lastKrwRate(finance: FinanceEntry[]): number | null {
  return finance.find((e) => e.currency === "KRW")?.rate_to_thb ?? null;
}

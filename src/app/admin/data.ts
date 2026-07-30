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
  FinanceEntry,
  Influencer,
  Product,
  ProductStock,
  StockMove,
} from "../../lib/admin";

export interface AdminData {
  products: Product[];
  stock: Record<string, ProductStock>;
  moves: StockMove[];
  influencers: Influencer[];
  finance: FinanceEntry[];
  loading: boolean;
  reload: () => Promise<void>;
}

export function useAdminData(): AdminData {
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Record<string, ProductStock>>({});
  const [moves, setMoves] = useState<StockMove[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [finance, setFinance] = useState<FinanceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [p, s, m, i, f] = await Promise.all([
      supabase.from("products").select("*").order("sort").order("sku"),
      supabase.from("product_stock").select("*"),
      supabase.from("stock_moves").select("*").order("moved_on", { ascending: false }).limit(500),
      supabase.from("influencers").select("*").order("updated_at", { ascending: false }),
      supabase
        .from("finance_entries")
        .select("*")
        .order("entry_on", { ascending: false })
        .limit(2000),
    ]);

    setProducts((p.data as Product[]) ?? []);
    const stockRows = (s.data as ProductStock[]) ?? [];
    setStock(Object.fromEntries(stockRows.map((r) => [r.product_id, r])));
    setMoves((m.data as StockMove[]) ?? []);
    setInfluencers((i.data as Influencer[]) ?? []);
    setFinance((f.data as FinanceEntry[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { products, stock, moves, influencers, finance, loading, reload };
}

export function onHand(stock: Record<string, ProductStock>, productId: string): number {
  return stock[productId]?.on_hand ?? 0;
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const TEAM_EMAIL =
  (import.meta.env.VITE_TEAM_EMAIL as string) || "team@b-y-klink.com";

/**
 * 클라이언트를 모듈 로드 시점이 아니라 처음 쓸 때 만든다.
 *
 * 예전에는 여기서 바로 createClient를 불렀다. 그러면 VITE_SUPABASE_URL이 비었을
 * 때 "supabaseUrl is required"가 모듈 평가 중에 터지고, 이 모듈은 App이 정적으로
 * 끌고 오므로 번들 전체가 죽는다. 랜딩은 Supabase를 쓰지도 않는데 셋 다 흰
 * 화면이 된다 — 프리렌더된 HTML에는 애니메이션 시작값(opacity:0)이 박혀 있고
 * 그걸 되돌릴 자바스크립트가 죽어 있기 때문이다.
 *
 * 지연 생성으로 바꾸면 설정이 빠졌을 때 다치는 범위가 실제로 Supabase를 쓰는
 * 화면(/board·/admin)으로 좁혀진다.
 */
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    if (!url || !key) {
      throw new Error(
        "Supabase 설정이 없습니다. VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정하세요.",
      );
    }
    client = createClient(url, key);
  }
  return client;
}

export const isSupabaseConfigured = Boolean(url && key);

/**
 * 쓰는 쪽 코드를 그대로 두기 위해 같은 이름으로 내보낸다. 속성에 처음 손이 닿는
 * 순간 클라이언트가 만들어진다.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    const value = Reflect.get(getClient(), prop);
    return typeof value === "function" ? value.bind(getClient()) : value;
  },
});

export type Status = "todo" | "doing" | "done" | "blocked" | "na";
export type BoardKey = "strategy" | "docs" | "revenue";

export interface BoardItem {
  id: string;
  board: BoardKey;
  group_key: string;
  group_label_ko: string;
  group_label_th: string;
  title_ko: string;
  title_th: string;
  hint_ko: string;
  hint_th: string;
  value: string;
  status: Status;
  owner: string;
  due_date: string | null;
  sort: number;
  updated_at: string;
}

export interface Comment {
  id: string;
  item_id: string;
  author: string;
  body: string;
  created_at: string;
}

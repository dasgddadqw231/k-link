import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const TEAM_EMAIL =
  (import.meta.env.VITE_TEAM_EMAIL as string) || "team@b-y-klink.com";

export const supabase = createClient(url, key);

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

/**
 * 관리자 도구의 데이터 형태.
 *
 * 통화 원칙: 태국 법인이므로 THB가 기준이다. 한국 매입은 KRW로 적고 그때의
 * 환율을 함께 남긴다 — 나중에 환율이 바뀌어도 당시 장부가 그대로 재현된다.
 *
 * 재고 원칙: 현재고 필드를 따로 두지 않는다. stock_moves의 합이 곧 현재고라
 * 두 값이 어긋날 일이 없고, 숫자가 왜 그렇게 됐는지 항상 되짚을 수 있다.
 */

export type MoveKind = "in" | "out" | "adjust";
export type Platform = "instagram" | "tiktok" | "youtube" | "facebook" | "other";
export type InfStatus = "lead" | "contacted" | "confirmed" | "shipped" | "posted" | "dropped";
export type Direction = "in" | "out";
export type Currency = "THB" | "KRW";

/** 입출고 사유. 인플루언서 시딩(seeding)이 두 시스템을 잇는 고리다. */
export const MOVE_REASONS = {
  in: ["import", "return", "count"],
  out: ["sale", "seeding", "sample", "loss"],
  adjust: ["count"],
} as const;

export const IN_CATEGORIES = ["sales", "other_in"] as const;
export const OUT_CATEGORIES = [
  "goods",
  "logistics",
  "registration",
  "marketing",
  "influencer",
  "payroll",
  "ops",
] as const;

export const INF_FLOW: InfStatus[] = ["lead", "contacted", "confirmed", "shipped", "posted"];

export interface Product {
  id: string;
  sku: string;
  brand: string;
  name_ko: string;
  name_th: string;
  name_en: string;
  unit: string;
  low_stock_at: number;
  cost_krw: number;
  price_thb: number;
  active: boolean;
  sort: number;
}

export interface StockMove {
  id: string;
  product_id: string;
  kind: MoveKind;
  qty: number;
  reason: string;
  lot: string;
  expiry: string | null;
  note: string;
  moved_on: string;
}

export interface ProductStock {
  product_id: string;
  on_hand: number;
  nearest_expiry: string | null;
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
  amount: number;
  currency: Currency;
  rate_to_thb: number;
  amount_thb: number;
  memo: string;
}

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

export function krw(n: number): string {
  return `₩${Math.round(n).toLocaleString("en-US")}`;
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

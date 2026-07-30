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
  "other",
] as const;

/** 브랜드사를 달아 두는 것이 뜻있는 분류. 정산과 수수료는 언제나 상대가 있다. */
export const BRAND_CATEGORIES = ["settlement", "commission", "sales"] as const;

export const INF_FLOW: InfStatus[] = ["lead", "contacted", "confirmed", "shipped", "posted"];

export type BrandStatus = "lead" | "meeting" | "contracted" | "active" | "ended";
export type FdaStatus = "none" | "preparing" | "submitted" | "approved" | "rejected";
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
  fda_number: string;
  fda_on: string | null;
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
  /** receipts 버킷 안의 파일 경로들. 비공개 버킷이라 볼 때 서명 URL을 받아 쓴다. */
  receipts: string[];
  /** 정산·수수료·매출처럼 상대가 있는 거래에 달아 두는 브랜드사. */
  brand_id: string | null;
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

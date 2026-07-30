/**
 * 관리자 전용 문구. 랜딩 카피(../i18n.ts)와 섞지 않는다 —
 * 저쪽은 대외용이라 태국 FDA 표현 규제를 받고, 이쪽은 내부 도구다.
 *
 * 한국 본사와 태국 현지 팀이 같은 화면을 보므로 세 언어를 모두 채운다.
 */

export type AdminLang = "ko" | "th" | "en";

export const ADMIN_LANG_KEY = "klink_admin_lang";

const ko = {
  brandSuffix: "관리자",
  password: "비밀번호",
  enter: "들어가기",
  loginFailed: "비밀번호가 올바르지 않습니다",
  logout: "로그아웃",
  loading: "불러오는 중",
  save: "저장",
  cancel: "취소",
  add: "추가",
  edit: "수정",
  remove: "삭제",
  confirmRemove: "삭제할까요? 되돌릴 수 없습니다.",
  search: "검색",
  all: "전체",
  none: "-",
  note: "메모",
  date: "날짜",
  saveFailed: "저장하지 못했습니다",

  navHome: "홈",
  navStock: "재고",
  navInf: "인플루언서",
  navFin: "재무",

  homeTitle: "오늘의 사업",
  homeLowStock: "재고 부족",
  homeNetMonth: "이번 달 순현금",
  homeInfActive: "진행 중 인플루언서",
  homeSalesMonth: "이번 달 매출",
  homeSku: "개 SKU",
  homePeople: "명",
  homeTodo: "지금 챙길 일",
  homeTodoEmpty: "챙길 일이 없습니다",
  homeLowStockTodo: "재고 보충 필요",
  homeInfDueTodo: "연락할 날짜가 지났습니다",

  stockTitle: "재고",
  stockOnHand: "현재고",
  stockLow: "부족",
  stockOut: "출고",
  stockIn: "입고",
  stockAdjust: "조정",
  stockMove: "입출고",
  stockQty: "수량",
  stockActual: "실사 수량",
  stockActualHint: "지금 세어 본 실제 수량을 적으면 차이만큼 조정됩니다",
  stockEditProduct: "제품 정보 수정",
  stockReason: "사유",
  stockLot: "로트",
  stockExpiry: "유통기한",
  stockHistory: "입출고 내역",
  stockNoHistory: "내역이 없습니다",
  stockNewProduct: "새 제품",
  stockSku: "SKU",
  stockBrand: "브랜드",
  stockName: "제품명",
  stockUnit: "단위",
  stockLowAt: "부족 기준",
  stockCostKrw: "매입가 (KRW)",
  stockPriceThb: "판매가 (THB)",
  stockNoProducts: "제품이 없습니다",
  stockInactive: "판매 중지",
  stockShowInactive: "중지 포함",
  stockTotalValue: "재고 판매가 합계",
  stockExpirySoon: "유통기한 임박",

  rImport: "한국 입고",
  rReturn: "반품 입고",
  rCount: "실사 조정",
  rSale: "판매",
  rSeeding: "인플루언서 발송",
  rSample: "샘플",
  rLoss: "파손·분실",

  infTitle: "인플루언서",
  infNew: "새 인플루언서",
  infName: "이름",
  infHandle: "계정",
  infPlatform: "채널",
  infFollowers: "팔로워",
  infStatus: "진행 상태",
  infFee: "비용 (THB)",
  infDeliverable: "약속한 콘텐츠",
  infPostUrl: "게시물 링크",
  infNextAction: "다음 연락일",
  infNone: "등록된 인플루언서가 없습니다",
  infOpenPost: "게시물 열기",
  infTotalFee: "확정 비용 합계",

  sLead: "발굴",
  sContacted: "컨택",
  sConfirmed: "확정",
  sShipped: "발송",
  sPosted: "게시 완료",
  sDropped: "중단",

  pInstagram: "Instagram",
  pTiktok: "TikTok",
  pYoutube: "YouTube",
  pFacebook: "Facebook",
  pOther: "기타",

  finTitle: "재무",
  finNew: "새 거래",
  finIn: "수입",
  finOut: "지출",
  finNet: "순현금",
  finAmount: "금액",
  finCurrency: "통화",
  finRate: "환율 (1 KRW = ? THB)",
  finRateHint: "지출한 날의 환율을 적으면 그대로 남습니다",
  finCategory: "분류",
  finNone: "거래가 없습니다",
  finByCategory: "지출 내역",
  finEntries: "거래 목록",
  finPrevMonth: "이전 달",
  finNextMonth: "다음 달",

  catSales: "매출",
  catOther_in: "기타 수입",
  catGoods: "제품 매입",
  catLogistics: "물류·통관",
  catRegistration: "인허가",
  catMarketing: "마케팅",
  catInfluencer: "인플루언서",
  catPayroll: "인건비",
  catOps: "사무·기타",
};

export type AdminDict = typeof ko;

const th: AdminDict = {
  brandSuffix: "ผู้ดูแลระบบ",
  password: "รหัสผ่าน",
  enter: "เข้าใช้งาน",
  loginFailed: "รหัสผ่านไม่ถูกต้อง",
  logout: "ออกจากระบบ",
  loading: "กำลังโหลด",
  save: "บันทึก",
  cancel: "ยกเลิก",
  add: "เพิ่ม",
  edit: "แก้ไข",
  remove: "ลบ",
  confirmRemove: "ต้องการลบหรือไม่ ไม่สามารถย้อนกลับได้",
  search: "ค้นหา",
  all: "ทั้งหมด",
  none: "-",
  note: "บันทึกเพิ่มเติม",
  date: "วันที่",
  saveFailed: "บันทึกไม่สำเร็จ",

  navHome: "หน้าแรก",
  navStock: "สต็อก",
  navInf: "อินฟลูเอนเซอร์",
  navFin: "การเงิน",

  homeTitle: "ภาพรวมวันนี้",
  homeLowStock: "สต็อกใกล้หมด",
  homeNetMonth: "เงินสดสุทธิเดือนนี้",
  homeInfActive: "อินฟลูฯ ที่กำลังดำเนินการ",
  homeSalesMonth: "ยอดขายเดือนนี้",
  homeSku: "รายการ",
  homePeople: "คน",
  homeTodo: "สิ่งที่ต้องจัดการ",
  homeTodoEmpty: "ไม่มีสิ่งที่ต้องจัดการ",
  homeLowStockTodo: "ต้องเติมสต็อก",
  homeInfDueTodo: "เลยกำหนดติดต่อแล้ว",

  stockTitle: "สต็อก",
  stockOnHand: "คงเหลือ",
  stockLow: "ใกล้หมด",
  stockOut: "จ่ายออก",
  stockIn: "รับเข้า",
  stockAdjust: "ปรับยอด",
  stockMove: "รับ-จ่าย",
  stockQty: "จำนวน",
  stockActual: "จำนวนที่นับได้",
  stockActualHint: "กรอกจำนวนที่นับได้จริง ระบบจะปรับตามส่วนต่าง",
  stockEditProduct: "แก้ไขข้อมูลสินค้า",
  stockReason: "เหตุผล",
  stockLot: "ล็อต",
  stockExpiry: "วันหมดอายุ",
  stockHistory: "ประวัติรับ-จ่าย",
  stockNoHistory: "ไม่มีประวัติ",
  stockNewProduct: "สินค้าใหม่",
  stockSku: "SKU",
  stockBrand: "แบรนด์",
  stockName: "ชื่อสินค้า",
  stockUnit: "หน่วย",
  stockLowAt: "เกณฑ์ใกล้หมด",
  stockCostKrw: "ต้นทุน (KRW)",
  stockPriceThb: "ราคาขาย (THB)",
  stockNoProducts: "ไม่มีสินค้า",
  stockInactive: "หยุดขาย",
  stockShowInactive: "รวมที่หยุดขาย",
  stockTotalValue: "มูลค่าสต็อกตามราคาขาย",
  stockExpirySoon: "ใกล้วันหมดอายุ",

  rImport: "รับเข้าจากเกาหลี",
  rReturn: "รับคืน",
  rCount: "ปรับตามการนับ",
  rSale: "ขาย",
  rSeeding: "ส่งให้อินฟลูเอนเซอร์",
  rSample: "ตัวอย่าง",
  rLoss: "เสียหาย·สูญหาย",

  infTitle: "อินฟลูเอนเซอร์",
  infNew: "เพิ่มอินฟลูเอนเซอร์",
  infName: "ชื่อ",
  infHandle: "บัญชี",
  infPlatform: "ช่องทาง",
  infFollowers: "ผู้ติดตาม",
  infStatus: "สถานะ",
  infFee: "ค่าตอบแทน (THB)",
  infDeliverable: "คอนเทนต์ที่ตกลงไว้",
  infPostUrl: "ลิงก์โพสต์",
  infNextAction: "วันติดต่อครั้งถัดไป",
  infNone: "ยังไม่มีอินฟลูเอนเซอร์",
  infOpenPost: "เปิดโพสต์",
  infTotalFee: "ค่าตอบแทนที่ยืนยันแล้ว",

  sLead: "ค้นหาแล้ว",
  sContacted: "ติดต่อแล้ว",
  sConfirmed: "ยืนยันแล้ว",
  sShipped: "ส่งของแล้ว",
  sPosted: "โพสต์แล้ว",
  sDropped: "ยกเลิก",

  pInstagram: "Instagram",
  pTiktok: "TikTok",
  pYoutube: "YouTube",
  pFacebook: "Facebook",
  pOther: "อื่น ๆ",

  finTitle: "การเงิน",
  finNew: "รายการใหม่",
  finIn: "รายรับ",
  finOut: "รายจ่าย",
  finNet: "สุทธิ",
  finAmount: "จำนวนเงิน",
  finCurrency: "สกุลเงิน",
  finRate: "อัตราแลกเปลี่ยน (1 KRW = ? THB)",
  finRateHint: "กรอกอัตราของวันนั้น ระบบจะเก็บไว้ตามนั้น",
  finCategory: "หมวด",
  finNone: "ไม่มีรายการ",
  finByCategory: "รายจ่ายแยกหมวด",
  finEntries: "รายการทั้งหมด",
  finPrevMonth: "เดือนก่อน",
  finNextMonth: "เดือนถัดไป",

  catSales: "ยอดขาย",
  catOther_in: "รายรับอื่น",
  catGoods: "ซื้อสินค้า",
  catLogistics: "ขนส่ง·พิธีการศุลกากร",
  catRegistration: "ขึ้นทะเบียน",
  catMarketing: "การตลาด",
  catInfluencer: "อินฟลูเอนเซอร์",
  catPayroll: "เงินเดือน",
  catOps: "สำนักงาน·อื่น ๆ",
};

const en: AdminDict = {
  brandSuffix: "Admin",
  password: "Password",
  enter: "Enter",
  loginFailed: "That password is not correct",
  logout: "Sign out",
  loading: "Loading",
  save: "Save",
  cancel: "Cancel",
  add: "Add",
  edit: "Edit",
  remove: "Delete",
  confirmRemove: "Delete this? It cannot be undone.",
  search: "Search",
  all: "All",
  none: "-",
  note: "Note",
  date: "Date",
  saveFailed: "Could not save",

  navHome: "Home",
  navStock: "Stock",
  navInf: "Influencers",
  navFin: "Finance",

  homeTitle: "Business today",
  homeLowStock: "Low stock",
  homeNetMonth: "Net cash this month",
  homeInfActive: "Influencers in progress",
  homeSalesMonth: "Sales this month",
  homeSku: "SKUs",
  homePeople: "people",
  homeTodo: "Needs attention",
  homeTodoEmpty: "Nothing needs attention",
  homeLowStockTodo: "Needs restocking",
  homeInfDueTodo: "Follow-up date has passed",

  stockTitle: "Stock",
  stockOnHand: "On hand",
  stockLow: "Low",
  stockOut: "Out",
  stockIn: "In",
  stockAdjust: "Adjust",
  stockMove: "Move stock",
  stockQty: "Quantity",
  stockActual: "Counted quantity",
  stockActualHint: "Enter what you actually counted — the difference is recorded",
  stockEditProduct: "Edit product details",
  stockReason: "Reason",
  stockLot: "Lot",
  stockExpiry: "Best before",
  stockHistory: "Movement history",
  stockNoHistory: "No movements yet",
  stockNewProduct: "New product",
  stockSku: "SKU",
  stockBrand: "Brand",
  stockName: "Product name",
  stockUnit: "Unit",
  stockLowAt: "Low-stock threshold",
  stockCostKrw: "Cost (KRW)",
  stockPriceThb: "Price (THB)",
  stockNoProducts: "No products yet",
  stockInactive: "Discontinued",
  stockShowInactive: "Include discontinued",
  stockTotalValue: "Stock at retail value",
  stockExpirySoon: "Expiring soon",

  rImport: "Inbound from Korea",
  rReturn: "Returned",
  rCount: "Stock count",
  rSale: "Sold",
  rSeeding: "Sent to influencer",
  rSample: "Sample",
  rLoss: "Damaged or lost",

  infTitle: "Influencers",
  infNew: "New influencer",
  infName: "Name",
  infHandle: "Handle",
  infPlatform: "Channel",
  infFollowers: "Followers",
  infStatus: "Stage",
  infFee: "Fee (THB)",
  infDeliverable: "Agreed deliverable",
  infPostUrl: "Post link",
  infNextAction: "Next follow-up",
  infNone: "No influencers yet",
  infOpenPost: "Open post",
  infTotalFee: "Committed fees",

  sLead: "Lead",
  sContacted: "Contacted",
  sConfirmed: "Confirmed",
  sShipped: "Product sent",
  sPosted: "Posted",
  sDropped: "Dropped",

  pInstagram: "Instagram",
  pTiktok: "TikTok",
  pYoutube: "YouTube",
  pFacebook: "Facebook",
  pOther: "Other",

  finTitle: "Finance",
  finNew: "New entry",
  finIn: "In",
  finOut: "Out",
  finNet: "Net",
  finAmount: "Amount",
  finCurrency: "Currency",
  finRate: "Rate (1 KRW = ? THB)",
  finRateHint: "Enter that day's rate and it stays on the record",
  finCategory: "Category",
  finNone: "No entries",
  finByCategory: "Spending by category",
  finEntries: "All entries",
  finPrevMonth: "Previous month",
  finNextMonth: "Next month",

  catSales: "Sales",
  catOther_in: "Other income",
  catGoods: "Goods purchase",
  catLogistics: "Logistics & customs",
  catRegistration: "Registration",
  catMarketing: "Marketing",
  catInfluencer: "Influencers",
  catPayroll: "Payroll",
  catOps: "Office & other",
};

export const a: Record<AdminLang, AdminDict> = { ko, th, en };

export const ADMIN_LANG_LABEL: Record<AdminLang, string> = {
  ko: "한국어",
  th: "ไทย",
  en: "EN",
};

export function initialAdminLang(): AdminLang {
  const saved = localStorage.getItem(ADMIN_LANG_KEY) as AdminLang | null;
  if (saved && ["ko", "th", "en"].includes(saved)) return saved;
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("th")) return "th";
  if (nav.startsWith("en")) return "en";
  return "ko";
}

/** 제품명은 언어별 필드가 따로 있고, 비어 있으면 한국어로 되돌린다. */
export function productName(
  p: { name_ko: string; name_th: string; name_en: string },
  lang: AdminLang,
): string {
  if (lang === "th") return p.name_th || p.name_ko;
  if (lang === "en") return p.name_en || p.name_ko;
  return p.name_ko;
}

const REASON_KEYS: Record<string, keyof AdminDict> = {
  import: "rImport",
  return: "rReturn",
  count: "rCount",
  sale: "rSale",
  seeding: "rSeeding",
  sample: "rSample",
  loss: "rLoss",
};

export function reasonLabel(reason: string, c: AdminDict): string {
  const key = REASON_KEYS[reason];
  return key ? (c[key] as string) : reason;
}

const CATEGORY_KEYS: Record<string, keyof AdminDict> = {
  sales: "catSales",
  other_in: "catOther_in",
  goods: "catGoods",
  logistics: "catLogistics",
  registration: "catRegistration",
  marketing: "catMarketing",
  influencer: "catInfluencer",
  payroll: "catPayroll",
  ops: "catOps",
};

export function categoryLabel(category: string, c: AdminDict): string {
  const key = CATEGORY_KEYS[category];
  return key ? (c[key] as string) : category;
}

const STATUS_KEYS = {
  lead: "sLead",
  contacted: "sContacted",
  confirmed: "sConfirmed",
  shipped: "sShipped",
  posted: "sPosted",
  dropped: "sDropped",
} as const;

export function statusLabel(status: keyof typeof STATUS_KEYS, c: AdminDict): string {
  return c[STATUS_KEYS[status]];
}

const PLATFORM_KEYS = {
  instagram: "pInstagram",
  tiktok: "pTiktok",
  youtube: "pYoutube",
  facebook: "pFacebook",
  other: "pOther",
} as const;

export function platformLabel(p: keyof typeof PLATFORM_KEYS, c: AdminDict): string {
  return c[PLATFORM_KEYS[p]];
}

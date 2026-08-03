export type Lang = "ko" | "th" | "en";

export const LANG_KEY = "klink_lang";
export const NAME_KEY = "klink_member";

export const LANG_LABEL: Record<Lang, string> = {
  th: "ไทย",
  en: "EN",
  ko: "한국어",
};

/** 태국 수요측 페이지 전용 문구. 한국어는 LandingKo가 별도로 갖는다. */
export type ThLang = "th" | "en";

/**
 * 랜딩 카피 원칙 — 반드시 유지할 것.
 * 1. 태국 FDA 광고 허가(Sor Bor 4) 취득 전까지 식품의 건강 효능을 주장할 수 없다.
 *    부종 완화, 다이어트, 면역, 피부 개선 등 어떤 기능성 표현도 넣지 말 것.
 *    제품 설명은 원재료, 형태, 용도 같은 사실 기술로만 작성한다.
 * 2. 이 페이지의 독자는 두 부류다. QR로 들어온 태국 소비자, 그리고 태국 유통·리테일.
 *    양쪽 모두에게 "지금 얻을 수 있는 것"을 제시한다. 회사 소개는 훅이 아니다.
 * 3. 아직 못 한 일(인허가 진행 중, 미출시)은 지우지 않되 헤드라인에 두지 않는다.
 */
export const t = {
  th: {
    eyebrow: "เกาหลี × ไทย",
    heroTitle: "ของดีจากเกาหลี\nกำลังจะมาถึงไทย",
    heroSub:
      "บริษัทจดทะเบียนในไทย นำเข้าและดูแลสินค้าเกาหลีคัดสรร ด้วยทีมงานในกรุงเทพฯ",
    heroCtaConsumer: "รับข่าวก่อนใคร",
    heroCtaPartner: "สนใจจัดจำหน่าย",

    productsLabel: "สินค้าชุดแรก",
    productsNote: "ทุกชิ้นเป็นแบบซองเดียวจบ พกง่าย ไม่เหลือทิ้ง",
    madeInKorea: "ผลิตในเกาหลี",
    positivaName: "Positiva",
    positivaKind: "น้ำมันมะกอกแบบซองสติ๊ก",
    positivaDesc: "สติ๊กซองละ 20 มล. ฉีกใช้ได้ทันที มี 2 สูตร",
    olleName: "Olle Shot",
    olleDesc: "น้ำมันมะกอกเอ็กซ์ตร้าเวอร์จินออร์แกนิก 65% + น้ำเลมอนออร์แกนิก 35%",
    oltoName: "Olto Shot",
    oltoDesc: "น้ำมันมะกอกจับคู่กับมะเขือเทศ",
    eunhwiName: "Eunhwi Flow",
    eunhwiKind: "น้ำฟักทอง",
    eunhwiDesc: "ฟักทองแก่บดทั้งลูก บรรจุซองละ 90 มล.",
    eunhwiSkuName: "น้ำฟักทองเกาหลี",
    eunhwiSkuDesc: "ฟักทอง 100% · โรงงานมาตรฐาน HACCP",
    realPhotoLabel: "ภาพสินค้าจริง",

    lineLabel: "สำหรับผู้บริโภค",
    lineTitle: "รู้ก่อน ชิมก่อน",
    lineBody: "เพิ่มเพื่อนใน LINE วันนี้ แล้วรับสองอย่างนี้",
    linePerk1: "รู้วันวางจำหน่ายและจุดจำหน่ายก่อนใคร",
    linePerk2: "ได้รับเชิญร่วมงานชิมสินค้า",
    lineCta: "เพิ่มเพื่อนใน LINE",
    lineMissing: "ยังไม่ได้ตั้งค่าลิงก์ LINE",

    bizLabel: "สำหรับผู้จัดจำหน่ายและร้านค้า",
    bizTitle: "ความเสี่ยงเรื่องนำเข้า\nเรารับไว้เอง",
    bizBody:
      "คุณไม่ต้องยุ่งกับเอกสารนำเข้าหรือการขึ้นทะเบียน หน้าที่ของคุณคือขาย",
    biz1Title: "นิติบุคคลไทย",
    biz1Body:
      "เราเป็นผู้นำเข้าเอง (Importer of Record) ไม่ใช่คนกลางที่ฝากคนอื่นนำเข้า",
    biz2Title: "ขึ้นทะเบียน อย. เอง",
    biz2Body: "ยื่นขึ้นทะเบียนกับ อย. ไทยในนามบริษัทเราโดยตรง ไม่ผ่านตัวแทน",
    biz3Title: "เราทำอินฟลูเอนเซอร์ซีดดิ้งเอง",
    biz3Body: "เราส่งสินค้าให้ครีเอเตอร์ไทยเอง คุณไม่ต้องจัดการเรื่องการตลาดเอง",
    biz4Title: "ติดต่อโรงงานเกาหลีโดยตรง",
    biz4Body: "คัดและสั่งจากผู้ผลิตเกาหลีเอง ไม่ผ่านพ่อค้าคนกลาง",
    /* 도매(Somchai)와 셀렉트숍(Nut) 모두가 가장 먼저 묻는 것. stp.md에 둘 다 적혀 있다. */
    biz5Title: "สั่งจำนวนน้อยได้",
    biz5Body: "เริ่มจากล็อตเล็กเพื่อทดลองวางขาย ไม่ต้องรับสต็อกก้อนใหญ่ตั้งแต่ต้น",
    /* 다섯 개를 지는 쪽과 하나만 하는 쪽. 이 비대칭이 이 섹션의 논지다. */
    bizWeLabel: "รับไว้ 5 อย่าง",
    bizYouWho: "คุณ",
    bizYouLabel: "หน้าที่เดียว",
    bizYouVerb: "ขาย",
    bizYouOnly: "เท่านั้น",
    bizCta: "ขอข้อมูลและเงื่อนไข",
    emailCta: "ส่งอีเมล",

    flowLabel: "เราทำงานอย่างไร",
    flow1Title: "คัดสินค้า",
    flow1Sub: "โซล",
    flow2Title: "นำเข้าและขึ้นทะเบียน",
    flow2Sub: "อย. ไทย",
    flow3Title: "ส่งถึงหน้าร้าน",
    flow3Sub: "กรุงเทพฯ",

    statusNote:
      "ขณะนี้อยู่ระหว่างขึ้นทะเบียนกับ อย. ไทย ยังไม่เปิดจำหน่าย กำหนดวางจำหน่ายปี 2026",
    footerNote: "B&Y k-link co., ltd. — กรุงเทพมหานคร ประเทศไทย",
  },

  en: {
    eyebrow: "KOREA × THAILAND",
    heroTitle: "Korea's best,\non its way to Thailand",
    heroSub:
      "A Thai-registered company importing and distributing selected Korean goods, run by a local team in Bangkok.",
    heroCtaConsumer: "Get launch news",
    heroCtaPartner: "Distribute with us",

    productsLabel: "First products",
    productsNote: "Every item is single-serve — one sachet, nothing left over.",
    madeInKorea: "Made in Korea",
    positivaName: "Positiva",
    positivaKind: "Olive Oil Sticks",
    positivaDesc: "Single-serve 20 ml sticks, in two blends.",
    olleName: "Olle Shot",
    olleDesc: "65% organic extra virgin olive oil, 35% organic lemon juice",
    oltoName: "Olto Shot",
    oltoDesc: "Olive oil paired with tomato",
    eunhwiName: "Eunhwi Flow",
    eunhwiKind: "Pumpkin Juice",
    eunhwiDesc: "Whole Korean-grown pumpkin, in a 90 ml pouch.",
    eunhwiSkuName: "Korean Pumpkin Juice",
    eunhwiSkuDesc: "100% pumpkin · HACCP-certified facility",
    realPhotoLabel: "Actual product",

    lineLabel: "For shoppers",
    lineTitle: "Know it first,\ntaste it first",
    lineBody: "Add us on LINE today and get two things",
    linePerk1: "Launch date and stockists, before anyone else",
    linePerk2: "Invitations to tasting events",
    lineCta: "Add us on LINE",
    lineMissing: "LINE link is not configured yet",

    bizLabel: "For distributors and retailers",
    bizTitle: "We carry\nthe import risk",
    bizBody:
      "No import paperwork, no registration burden on your side. You sell; we handle the rest.",
    biz1Title: "Thai-registered entity",
    biz1Body:
      "We are the Importer of Record ourselves — not a broker borrowing someone else's licence.",
    biz2Title: "Thai FDA filing in-house",
    biz2Body: "Registered under our own company name, without an agency in between.",
    biz3Title: "We run influencer seeding",
    biz3Body: "We send product to Thai creators ourselves. Marketing is not something you have to arrange.",
    biz4Title: "Direct from Korean makers",
    biz4Body: "We select and order straight from the manufacturer, with no middlemen.",
    biz5Title: "Small orders welcome",
    biz5Body:
      "Start with a small lot to test the shelf. You do not have to take a large stock position up front.",
    bizWeLabel: "Five things we carry",
    bizYouWho: "You",
    bizYouLabel: "One job",
    bizYouVerb: "Sell",
    bizYouOnly: "That is all",
    bizCta: "Request terms",
    emailCta: "Send email",

    flowLabel: "How we work",
    flow1Title: "Select the product",
    flow1Sub: "Seoul",
    flow2Title: "Import and register",
    flow2Sub: "Thai FDA",
    flow3Title: "Onto the shelf",
    flow3Sub: "Bangkok",

    statusNote:
      "Thai FDA registration is in progress and we have not started selling. Launch planned for 2026.",
    footerNote: "B&Y k-link co., ltd. — Bangkok, Thailand",
  },
} as const;

/** 보드 전용 문구. 태국어와 한국어만 사용한다. */
export const b = {
  ko: {
    boardTitle: "klink 전략 보드",
    password: "비밀번호",
    yourName: "이름",
    yourNameHint: "댓글에 표시됩니다",
    enter: "들어가기",
    logout: "로그아웃",
    loginFailed: "비밀번호가 올바르지 않습니다",
    nameRequired: "이름을 입력해 주세요",
    tabStrategy: "전략",
    tabDocs: "서류",
    tabRevenue: "수익 구조",
    overallProgress: "전체 진행률",
    owner: "담당",
    fillHere: "여기에 채워 넣으세요",
    comments: "댓글",
    writeComment: "댓글 쓰기",
    send: "보내기",
    noComments: "아직 댓글이 없습니다",
    saved: "저장됨",
    loading: "불러오는 중",
    st: {
      todo: "할 일",
      doing: "진행 중",
      done: "완료",
      blocked: "막힘",
      na: "해당 없음",
    },
  },
  th: {
    boardTitle: "บอร์ดกลยุทธ์ klink",
    password: "รหัสผ่าน",
    yourName: "ชื่อ",
    yourNameHint: "จะแสดงในความคิดเห็น",
    enter: "เข้าใช้งาน",
    logout: "ออกจากระบบ",
    loginFailed: "รหัสผ่านไม่ถูกต้อง",
    nameRequired: "กรุณากรอกชื่อ",
    tabStrategy: "กลยุทธ์",
    tabDocs: "เอกสาร",
    tabRevenue: "โครงสร้างรายได้",
    overallProgress: "ความคืบหน้ารวม",
    owner: "ผู้รับผิดชอบ",
    fillHere: "กรอกข้อมูลที่นี่",
    comments: "ความคิดเห็น",
    writeComment: "เขียนความคิดเห็น",
    send: "ส่ง",
    noComments: "ยังไม่มีความคิดเห็น",
    saved: "บันทึกแล้ว",
    loading: "กำลังโหลด",
    st: {
      todo: "ต้องทำ",
      doing: "กำลังทำ",
      done: "เสร็จแล้ว",
      blocked: "ติดปัญหา",
      na: "ไม่เกี่ยวข้อง",
    },
  },
} as const;

export function pick(lang: "ko" | "th", ko: string, th: string) {
  return lang === "th" ? th || ko : ko;
}

/** 현장에서 QR로 들어오는 사람은 대부분 태국인이므로 태국어를 기본값으로 둔다. */
export function detectLang(): Lang {
  const saved = localStorage.getItem(LANG_KEY) as Lang | null;
  if (saved && ["ko", "th", "en"].includes(saved)) return saved;
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("ko")) return "ko";
  if (nav.startsWith("th")) return "th";
  return "th";
}

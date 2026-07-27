export type Lang = "ko" | "th" | "en";

export const LANG_KEY = "klink_lang";
export const NAME_KEY = "klink_member";

export const LANG_LABEL: Record<Lang, string> = {
  th: "ไทย",
  en: "EN",
  ko: "한국어",
};

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
    madeInKorea: "ผลิตในเกาหลี",
    positivaName: "Positiva",
    positivaKind: "น้ำมันมะกอกแบบซองสติ๊ก",
    positivaDesc: "น้ำมันมะกอกซองละ 20 มล. ฉีกใช้ได้ทันที มี 2 แบบ",
    olleName: "Olle Shot",
    olleDesc: "น้ำมันมะกอกออร์แกนิก เอ็กซ์ตร้าเวอร์จิน",
    oltoName: "Olto Shot",
    oltoDesc: "น้ำมันมะกอกผสมมะเขือเทศ",
    eunhwiName: "Eunhwi Flow",
    eunhwiKind: "น้ำฟักทอง",
    eunhwiDesc: "ฟักทองแก่บดทั้งลูก บรรจุซองละ 90 มล.",
    eunhwiSkuName: "น้ำฟักทองเกาหลี",
    eunhwiSkuDesc: "ฟักทอง 100% · โรงงานมาตรฐาน HACCP",
    realPhotoLabel: "ภาพสินค้าจริง",

    lineLabel: "สำหรับผู้บริโภค",
    lineTitle: "รู้ก่อน ชิมก่อน",
    lineBody: "เพิ่มเพื่อนใน LINE วันนี้ แล้วรับสามอย่างนี้",
    linePerk1: "รู้วันวางจำหน่ายและจุดจำหน่ายก่อนใคร",
    linePerk2: "ได้รับเชิญร่วมงานชิมสินค้า",
    linePerk3: "ดาวน์โหลดสติกเกอร์และวอลเปเปอร์คาแรกเตอร์",
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
    biz3Title: "คาแรกเตอร์เป็นของเรา",
    biz3Body: "ป้ายหน้าร้าน สติกเกอร์ และสื่อออนไลน์ ใช้ได้ทันทีโดยไม่มีค่าลิขสิทธิ์",
    biz4Title: "ติดต่อโรงงานเกาหลีโดยตรง",
    biz4Body: "คัดและสั่งจากผู้ผลิตเกาหลีเอง ไม่ผ่านพ่อค้าคนกลาง",
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

  ko: {
    eyebrow: "KOREA × THAILAND",
    heroTitle: "한국의 좋은 것을\n태국으로",
    heroSub:
      "태국에 등록된 법인이 직접 수입하고 유통합니다. 방콕에서 현지 팀이 움직입니다.",
    heroCtaConsumer: "출시 소식 받기",
    heroCtaPartner: "유통 문의",

    productsLabel: "첫 번째 제품",
    madeInKorea: "대한민국 생산",
    positivaName: "포지티바",
    positivaKind: "올리브오일 스틱",
    positivaDesc: "한 포씩 뜯어 바로 쓰는 20ml 스틱형 올리브오일. 두 가지.",
    olleName: "올레샷",
    olleDesc: "유기농 엑스트라버진 올리브오일",
    oltoName: "올토샷",
    oltoDesc: "올리브오일에 토마토를 더한 스틱",
    eunhwiName: "은휘플로우",
    eunhwiKind: "늙은호박즙",
    eunhwiDesc: "국내산 늙은호박을 통째로 갈아 넣은 90ml 파우치.",
    eunhwiSkuName: "국내산 늙은호박즙",
    eunhwiSkuDesc: "호박 100% · HACCP 인증 시설 생산",
    realPhotoLabel: "실물 사진",

    lineLabel: "소비자분들께",
    lineTitle: "누구보다 먼저",
    lineBody: "LINE 친구 추가 한 번이면 세 가지를 받으십니다",
    linePerk1: "출시일과 판매처를 가장 먼저",
    linePerk2: "시식 행사 초대",
    linePerk3: "캐릭터 스티커·배경화면 다운로드",
    lineCta: "LINE 친구 추가",
    lineMissing: "LINE 링크가 아직 설정되지 않았습니다",

    bizLabel: "유통·리테일 파트너께",
    bizTitle: "수입 리스크는\n저희가 집니다",
    bizBody:
      "수입 서류도 인허가도 파트너가 떠안지 않습니다. 판매에만 집중하시면 됩니다.",
    biz1Title: "태국 법인",
    biz1Body:
      "저희가 직접 수입자(Importer of Record)가 됩니다. 남의 명의를 빌리는 중개상이 아닙니다.",
    biz2Title: "태국 FDA 등록 직접 수행",
    biz2Body: "대행사를 끼지 않고 저희 법인 명의로 직접 신고합니다.",
    biz3Title: "캐릭터 IP 보유",
    biz3Body: "매대 POP, 스티커, 온라인 소재를 라이선스 비용 없이 쓰실 수 있습니다.",
    biz4Title: "한국 제조사 직거래",
    biz4Body: "중간 유통 없이 한국 제조사에서 직접 선별하고 발주합니다.",
    bizCta: "거래 조건 문의",
    emailCta: "이메일 보내기",

    flowLabel: "일하는 방식",
    flow1Title: "제품을 고르고",
    flow1Sub: "서울",
    flow2Title: "수입하고 등록하고",
    flow2Sub: "태국 FDA",
    flow3Title: "매대까지",
    flow3Sub: "방콕",

    statusNote:
      "현재 태국 FDA 등록 진행 중이며 아직 판매를 시작하지 않았습니다. 2026년 출시 예정.",
    footerNote: "B&Y k-link co., ltd. — 태국 방콕",
  },

  en: {
    eyebrow: "KOREA × THAILAND",
    heroTitle: "Korea's best,\non its way to Thailand",
    heroSub:
      "A Thai-registered company importing and distributing selected Korean goods, run by a local team in Bangkok.",
    heroCtaConsumer: "Get launch news",
    heroCtaPartner: "Distribute with us",

    productsLabel: "First products",
    madeInKorea: "Made in Korea",
    positivaName: "Positiva",
    positivaKind: "Olive Oil Sticks",
    positivaDesc: "Single-serve 20 ml olive oil sticks, in two varieties.",
    olleName: "Olle Shot",
    olleDesc: "Organic extra virgin olive oil",
    oltoName: "Olto Shot",
    oltoDesc: "Olive oil blended with tomato",
    eunhwiName: "Eunhwi Flow",
    eunhwiKind: "Pumpkin Juice",
    eunhwiDesc: "Whole Korean-grown pumpkin, in a 90 ml pouch.",
    eunhwiSkuName: "Korean Pumpkin Juice",
    eunhwiSkuDesc: "100% pumpkin · HACCP-certified facility",
    realPhotoLabel: "Actual product",

    lineLabel: "For shoppers",
    lineTitle: "Know it first,\ntaste it first",
    lineBody: "Add us on LINE today and get three things",
    linePerk1: "Launch date and stockists, before anyone else",
    linePerk2: "Invitations to tasting events",
    linePerk3: "Character stickers and wallpapers to download",
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
    biz3Title: "We own the characters",
    biz3Body: "Shelf POP, stickers and online assets, yours to use at no licence cost.",
    biz4Title: "Direct from Korean makers",
    biz4Body: "We select and order straight from the manufacturer, with no middlemen.",
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

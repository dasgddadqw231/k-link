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
 * 태국 FDA 광고 허가(Sor Bor 4) 취득 전까지 식품의 건강 효능을 주장할 수 없다.
 * 부종 완화, 다이어트, 면역, 피부 개선 등 어떤 기능성 표현도 넣지 말 것.
 * 제품 설명은 원재료, 형태, 용도 같은 사실 기술로만 작성한다.
 */
export const t = {
  th: {
    eyebrow: "เกาหลี × ไทย",
    heroTitle: "ของดีจากเกาหลี\nกำลังจะมาถึงไทย",
    heroSub:
      "เราเป็นบริษัทจดทะเบียนในไทย นำเข้าและดูแลสินค้าเกาหลีคัดสรรด้วยทีมงานในกรุงเทพฯ",
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
    statusLabel: "สถานะปัจจุบัน",
    fact1Label: "บริษัท",
    fact1Value: "นิติบุคคลไทย · กรุงเทพฯ",
    fact2Label: "การจดทะเบียน",
    fact2Value: "อยู่ระหว่างยื่น อย.",
    fact3Label: "กำหนดวางจำหน่าย",
    fact3Value: "ปี 2026",
    honestNote:
      "เรายังไม่เปิดขาย ระหว่างนี้เรากำลังดำเนินการขออนุญาตให้ถูกต้องครบถ้วนก่อน",
    forkLabel: "คุณสนใจด้านไหน",
    consumerTitle: "อยากรู้เรื่องสินค้า",
    consumerBody:
      "เพิ่มเพื่อนใน LINE เพื่อรับข่าวสารก่อนใคร ทั้งวันวางจำหน่าย จุดจำหน่าย และกิจกรรมทดลองสินค้า",
    consumerCta: "รับข่าวก่อนใครทาง LINE",
    partnerTitle: "อยากคุยเรื่องธุรกิจ",
    partnerBody:
      "ผู้ซื้อ ร้านค้าปลีก ครีเอเตอร์ และแบรนด์เกาหลีที่มองหาทางเข้าตลาดไทย ติดต่อเราได้โดยตรง",
    partnerCta: "ติดต่อฝ่ายธุรกิจ",
    emailCta: "ส่งอีเมล",
    footerNote: "B&Y k-link co., ltd. — กรุงเทพมหานคร ประเทศไทย",
    lineMissing: "ยังไม่ได้ตั้งค่าลิงก์ LINE",
  },
  ko: {
    eyebrow: "KOREA × THAILAND",
    heroTitle: "한국의 좋은 것을\n태국으로",
    heroSub:
      "태국에 등록된 법인이 직접 수입하고 유통합니다. 방콕에서 현지 팀이 움직입니다.",
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
    statusLabel: "현재 상태",
    fact1Label: "법인",
    fact1Value: "태국 법인 · 방콕",
    fact2Label: "인허가",
    fact2Value: "태국 FDA 등록 진행 중",
    fact3Label: "출시 예정",
    fact3Value: "2026년",
    honestNote:
      "아직 판매를 시작하지 않았습니다. 정식 인허가를 모두 마친 뒤 출시합니다.",
    forkLabel: "어느 쪽이신가요",
    consumerTitle: "제품이 궁금해요",
    consumerBody:
      "LINE 친구 추가하면 출시일, 판매처, 시식 행사 소식을 가장 먼저 보내드립니다.",
    consumerCta: "LINE으로 출시 소식 받기",
    partnerTitle: "사업 이야기를 하고 싶어요",
    partnerBody:
      "바이어, 리테일, 크리에이터, 그리고 태국 진출을 준비하는 한국 브랜드. 직접 연락 주세요.",
    partnerCta: "사업 문의하기",
    emailCta: "이메일 보내기",
    footerNote: "B&Y k-link co., ltd. — 태국 방콕",
    lineMissing: "LINE 링크가 아직 설정되지 않았습니다",
  },
  en: {
    eyebrow: "KOREA × THAILAND",
    heroTitle: "Korea's best,\non its way to Thailand",
    heroSub:
      "A Thai-registered company importing and distributing selected Korean goods, run by a local team in Bangkok.",
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
    statusLabel: "Where we are",
    fact1Label: "Entity",
    fact1Value: "Thai company · Bangkok",
    fact2Label: "Regulatory",
    fact2Value: "Thai FDA registration in progress",
    fact3Label: "Launch",
    fact3Value: "2026",
    honestNote:
      "We have not started selling yet. We launch once every approval is properly in place.",
    forkLabel: "What brings you here",
    consumerTitle: "I want the products",
    consumerBody:
      "Add us on LINE and be first to hear about the launch date, where to buy, and tasting events.",
    consumerCta: "Get launch news on LINE",
    partnerTitle: "Let's talk business",
    partnerBody:
      "Buyers, retailers, creators, and Korean brands looking at Thailand. Reach us directly.",
    partnerCta: "Business enquiry",
    emailCta: "Send email",
    footerNote: "B&Y k-link co., ltd. — Bangkok, Thailand",
    lineMissing: "LINE link is not configured yet",
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

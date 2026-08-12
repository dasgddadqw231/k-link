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
 * 1. 건강 효능 광고는 사전 심의 대상이다(태국 식품법 제40·41조). 심의를 받기
 *    전까지 부종 완화, 다이어트, 면역, 피부 개선 등 어떤 기능성 표현도 넣지 말 것.
 *    제품 설명은 원재료, 형태, 용도 같은 사실 기술로만 작성한다.
 *    (예전에 이 심의를 "Sor Bor 4"라고 적었으나 그 서식 번호는 확인되지 않았다.
 *     근거는 서식이 아니라 조문이다 — docs/stp.md 규제 절 참고.)
 * 2. 이 페이지의 독자는 두 부류다. QR로 들어온 태국 소비자, 그리고 태국 유통·리테일.
 *    양쪽 모두에게 "지금 얻을 수 있는 것"을 제시한다. 회사 소개는 훅이 아니다.
 * 3. 아직 못 한 일(인허가 진행 중, 미출시)은 지우지 않되 헤드라인에 두지 않는다.
 * 4. 우리 설정 상태를 손님에게 보여주지 않는다. LINE 계정이 아직 없으면 "링크가
 *    설정되지 않았습니다"가 아니라 지금 되는 연락 수단을 내민다.
 */
export const t = {
  th: {
    eyebrow: "เกาหลี × ไทย",
    heroTitle: "ของดีจากเกาหลี\nกำลังจะมาถึงไทย",
    heroSub:
      "บริษัทจดทะเบียนในไทย นำเข้าและดูแลสินค้าเกาหลีคัดสรร ด้วยทีมงานในสมุทรสาคร",
    heroCtaConsumer: "รับข่าวก่อนใคร",
    heroCtaPartner: "สนใจจัดจำหน่าย",

    productsLabel: "สินค้าชุดแรก",
    productsNote: "ทุกชิ้นเป็นแบบซองเดียวจบ พกง่าย ไม่เหลือทิ้ง",
    madeInKorea: "ผลิตในเกาหลี",
    positivaName: "Positiva",
    positivaKind: "น้ำมันมะกอกแบบซองสติ๊ก",
    /*
     * 여기 "ซองละ 20 มล."(한 포 20ml)라고 적혀 있었는데, 이 줄은 브랜드 설명이라
     * 올레샷과 올토샷을 한꺼번에 가리킨다. 두 스틱의 용량은 다르다 — 올레샷 20ml,
     * 올토샷 15ml. 한 숫자로 묶을 수 없으므로 여기서는 숫자를 말하지 않고
     * SKU별 배지에 맡긴다. 다시 넣지 말 것.
     */
    positivaDesc: "สติ๊กแบบซองเดียวจบ ฉีกใช้ได้ทันที มี 2 สูตร",
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

    /*
     * 섭취법. 근거는 docs/serving.md.
     *
     * 제목이 "이렇게 드세요"가 아니라 "계량할 필요 없다"인 이유가 그 문서 1절이다 —
     * 태국 소비자는 이미 아침에 올리브유+레몬을 먹으려 하고 있고, 병을 사서 숟가락으로
     * 계량하는 데서 막혀 있다. 아는 사람에게 가르치면 무시당한다.
     *
     * 세 줄의 축은 세 제품에 똑같다: ① 그대로 ② 음식에 ③ 하나 더. 옆으로 비교되게 한다.
     * 효능은 한 글자도 넣지 않는다 — 용법·용도·보관은 심의 대상이 아니지만(สรรพคุณ이
     * 아니다) "좋다", "가볍게", "공복에"가 붙는 순간 대상이 된다.
     */
    serveLabel: "วิธีกิน",
    serveTitle: "ไม่ต้องตวง\nฉีกซองเดียวจบ",
    serveLead: "หนึ่งซองคือหนึ่งครั้ง ดื่มตรง ๆ ก็ได้ ใส่ในอาหารก็ได้",
    serveNote: "ทั้งหมดนี้คือวิธีที่คนเกาหลีกินกันจริง ๆ",
    serveOlleWays: [
      "เขย่าแล้วฉีกดื่มได้เลย",
      "ราดสลัด 1 ซองต่อ 1 จาน น้ำมันมะกอกกับเลมอนผสมมาแล้ว",
      "ราดพาสต้าซีฟู้ดตอนใกล้เสิร์ฟ",
    ],
    serveOltoWays: [
      "เขย่าแล้วฉีกดื่มได้เลย",
      "ราดข้าวผัดหรือพาสต้าตอนใกล้เสิร์ฟ",
      "จิ้มขนมปัง",
    ],
    /*
     * 얼려서 셔벗처럼 먹는 줄이 여기 있었는데 내렸다 — 제조사가 이 파우치는
     * 냉동하면 안 된다고 확인해 줬다(2026-08-13). 한국 블로그에 실증이 있어도
     * 우리가 권하면 우리 말이 된다. 다시 넣지 말 것.
     */
    serveHobakWays: [
      "ฉีกดื่มได้เลย ไม่ต้องแช่เย็น",
      "หรือแช่เย็นไว้ก่อนดื่ม",
      "ผสมนม 2 ส่วน ต่อ น้ำฟักทอง 1 ส่วน",
    ],

    lineLabel: "สำหรับผู้บริโภค",
    lineTitle: "รู้ก่อน ชิมก่อน",
    lineBody: "เพิ่มเพื่อนใน LINE วันนี้ แล้วรับสองอย่างนี้",
    linePerk1: "รู้วันวางจำหน่ายและจุดจำหน่ายก่อนใคร",
    linePerk2: "ได้รับเชิญร่วมงานชิมสินค้า",
    lineCta: "เพิ่มเพื่อนใน LINE",
    /* LINE 계정이 준비되기 전까지 소비자에게 내미는 길. 받는 것은 위 두 가지 그대로다. */
    lineBodyAlt: "ส่งอีเมลมาหาเรา แล้วรับสองอย่างนี้",
    consumerMailSubject: "ขอรับข่าววันวางจำหน่าย",
    partnerMailSubject: "สอบถามเรื่องการจัดจำหน่าย",

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
    footerNote: "บริษัท บีแอนด์วาย เค-ลิ้ง จำกัด (B&Y k-link Co., Ltd.)",
    /* 등기부(DBD)의 표기를 그대로 옮긴다. 상대가 대조할 수 있어야 뜻이 있다. */
    footerLegalLabel: "ทะเบียนนิติบุคคลเลขที่",
    footerOfficeLabel: "สำนักงานแห่งใหญ่",
    footerAddress: "52/6 หมู่ที่ 5 ต.บางน้ำจืด อ.เมืองสมุทรสาคร จ.สมุทรสาคร",
  },

  en: {
    eyebrow: "KOREA × THAILAND",
    heroTitle: "Korea’s best,\non its way to Thailand",
    heroSub:
      "A Thai-registered company importing and distributing selected Korean goods, run by a local team in Samut Sakhon.",
    heroCtaConsumer: "Get launch news",
    heroCtaPartner: "Distribute with us",

    productsLabel: "First products",
    productsNote: "Every item is single-serve — one sachet, nothing left over.",
    madeInKorea: "Made in Korea",
    positivaName: "Positiva",
    positivaKind: "Olive Oil Sticks",
    /* 두 SKU의 용량이 달라서(20ml · 15ml) 브랜드 줄에 숫자를 두지 않는다. */
    positivaDesc: "Single-serve sticks, in two blends.",
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

    /* 태국어 쪽 주석 참고. 두 언어의 shape이 어긋나면 LandingTh가 깨진다. */
    serveLabel: "HOW TO HAVE IT",
    serveTitle: "No measuring.\nOne sachet, done.",
    serveLead:
      "One sachet is one serving — drink it straight, or use it in food.",
    serveNote: "Every one of these is how people in Korea actually have them.",
    serveOlleWays: [
      "Shake, tear, drink",
      "One sachet dresses one plate — the oil and lemon are already mixed",
      "Over seafood pasta, right at the end",
    ],
    serveOltoWays: [
      "Shake, tear, drink",
      "Over fried rice or pasta, at the end",
      "With bread",
    ],
    /* 태국어 쪽 주석 참고 — 냉동은 제조사 확인으로 내렸다. */
    serveHobakWays: [
      "Tear and drink, no chilling needed",
      "Or chill it first",
      "Mix with milk, two parts to one",
    ],

    lineLabel: "For shoppers",
    lineTitle: "Know it first,\ntaste it first",
    lineBody: "Add us on LINE today and get two things",
    linePerk1: "Launch date and stockists, before anyone else",
    linePerk2: "Invitations to tasting events",
    lineCta: "Add us on LINE",
    lineBodyAlt: "Email us and get two things",
    consumerMailSubject: "Launch news request",
    partnerMailSubject: "Distribution enquiry",

    bizLabel: "For distributors and retailers",
    bizTitle: "We carry\nthe import risk",
    bizBody:
      "No import paperwork, no registration burden on your side. You sell; we handle the rest.",
    biz1Title: "Thai-registered entity",
    biz1Body:
      "We are the Importer of Record ourselves — not a broker borrowing someone else’s licence.",
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
    footerNote: "B&Y k-link Co., Ltd.",
    footerLegalLabel: "Thai company registration no.",
    footerOfficeLabel: "Registered office",
    footerAddress:
      "52/6 Moo 5, Bang Nam Chuet, Mueang Samut Sakhon, Samut Sakhon, Thailand",
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

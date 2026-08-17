/**
 * 수출입 업무 흐름의 내용. 화면(Flow.tsx)과 분리해 둔다.
 *
 * 왜 i18n.ts에 넣지 않았나: 저기는 버튼·라벨처럼 짧은 UI 문구를 언어별로 통째
 * 복사해 두는 사전이다. 여기 글은 한 단계가 열 줄씩이라 사전에 섞으면 세 언어가
 * 800줄 떨어져 앉게 되고, 한국어만 고치고 태국어를 빠뜨렸는지 아무도 못 본다.
 * 그래서 문장 단위로 세 언어를 붙여 둔다 — 한 줄만 채워져 있으면 바로 보인다.
 *
 * 이 화면은 도구가 아니라 설명서다. 무역을 한 번도 안 해 본 사람이 혼자 읽고
 * "지금 우리가 어느 단계고 다음에 뭘 해야 하나"를 알 수 있어야 한다. 그래서
 * 단계마다 넘어가는 조건(gate)과 자주 막히는 곳(risk)을 반드시 적는다 — 할 일
 * 목록만 있으면 다 했는지 아닌지를 사람마다 다르게 판단한다.
 *
 * 근거 원칙: 숫자와 서식 이름은 출처를 확인한 것만 적는다. 단계마다 basis에
 * 근거를 달고 아래 SOURCES에 원문을 건다. 확인 못 한 것은 "건별로 확인"이라고
 * 쓰지, 그럴듯한 숫자로 메우지 않는다 — 이 화면을 보고 실제로 서류를 넣는다.
 *
 * 마지막 확인 2026-08-08.
 */
import type { Tab } from "./AdminApp";
import type { AdminLang } from "./i18n";
import type { ExtraPermit, FoodGroup, LicenceKind, ShipStage } from "../../lib/admin";

/** 세 언어를 한자리에 묶은 문장. */
export interface T {
  ko: string;
  th: string;
  en: string;
}

export function t(x: T, lang: AdminLang): string {
  return x[lang];
}

/** 내용을 마지막으로 규정과 맞춰 본 날. 화면 아래에 그대로 보여 준다. */
export const CHECKED_ON = "2026-08-18";

/** 일을 하는 쪽. 브랜드가 손을 떼는 지점을 눈으로 보이게 하려고 나눈다. */
export type Actor = "brand" | "kr" | "th";

export type PhaseKey = "prep" | "permit" | "ship" | "sell";

export interface Phase {
  key: PhaseKey;
  title: T;
  note: T;
}

export const PHASES: Phase[] = [
  {
    key: "prep",
    title: { ko: "시작 전 준비", th: "เตรียมก่อนเริ่ม", en: "Before you start" },
    note: {
      ko: "서류로 먼저 확인하고, 소량으로 시장을 본다",
      th: "ตรวจจากเอกสารก่อน แล้วลองตลาดด้วยจำนวนน้อย",
      en: "Check on paper first, then test the market small",
    },
  },
  {
    key: "permit",
    title: { ko: "허가 받기", th: "ขอใบอนุญาต", en: "Get the licence" },
    note: {
      ko: "허가는 주소에 붙는다 — 태국 법인 명의로 신고한다",
      th: "ใบอนุญาตผูกกับที่อยู่ในไทย จึงยื่นในนามบริษัทไทย",
      en: "The licence attaches to a Thai address — we file in our own name",
    },
  },
  {
    key: "ship",
    title: { ko: "물건 보내기", th: "ส่งสินค้า", en: "Move the goods" },
    note: {
      ko: "수출과 수입이 만나는 곳. 서류가 물건과 한 글자도 달라선 안 된다",
      th: "จุดที่การส่งออกกับการนำเข้ามาบรรจบกัน เอกสารต้องตรงกับของทุกตัวอักษร",
      en: "Where export meets import — paperwork must match the goods exactly",
    },
  },
  {
    key: "sell",
    title: { ko: "팔고 정산하기", th: "ขายและเคลียร์เงิน", en: "Sell and settle" },
    note: {
      ko: "물건이 있는 것과 팔리는 것은 다르다",
      th: "มีของวางขาย กับขายได้จริง เป็นคนละเรื่อง",
      en: "Having stock on a shelf is not the same as selling it",
    },
  },
];

export interface Step {
  actor: Actor;
  text: T;
}

/**
 * 선적이 서 있는 자리의 이름. 값 자체는 단계 id와 같으므로 여기서는 사람이 읽는
 * 말만 준다 — 05~07 카드의 제목을 그대로 쓰면 "생산 · 태국어 라벨"처럼 길어서
 * 목록 안에서는 읽히지 않는다.
 */
export const SHIP_STAGE_LABEL: Record<ShipStage, T> = {
  produce: { ko: "05 생산 중", th: "05 กำลังผลิต", en: "05 In production" },
  export: { ko: "06 선적 · 서류", th: "06 ส่งออก · เอกสาร", en: "06 Shipping and papers" },
  import: { ko: "07 통관 중", th: "07 กำลังผ่านพิธีการ", en: "07 In clearance" },
  done: { ko: "입고 완료", th: "รับเข้าคลังแล้ว", en: "Received" },
};

/** 01단계에서 정하는 식품 갈래. 걸리는 기간을 이름에 같이 적어 둔다 — 그게 이 판정의 뜻이다. */
export const FOOD_GROUP_LABEL: Record<FoodGroup, T> = {
  unknown: { ko: "갈래 미정", th: "ยังไม่ระบุกลุ่ม", en: "Group not set" },
  general: { ko: "일반식품 (등록 불필요)", th: "อาหารทั่วไป (ไม่ต้องขึ้นทะเบียน)", en: "General (no registration)" },
  labelled: { ko: "라벨부착식품 (약 2영업일)", th: "อาหารที่ต้องมีฉลาก (ราว 2 วันทำการ)", en: "Labelled (about 2 working days)" },
  standardised: { ko: "표준식품 (약 2영업일)", th: "อาหารกำหนดคุณภาพ (ราว 2 วันทำการ)", en: "Standardised (about 2 working days)" },
  controlled: { ko: "구체적 통제식품 (35~90영업일)", th: "อาหารควบคุมเฉพาะ (35–90 วันทำการ)", en: "Specifically controlled (35–90 working days)" },
};

/** FDA 말고 더 붙는 부처. 미확인과 없음이 다른 말이라는 것이 이 목록의 요점이다. */
export const EXTRA_PERMIT_LABEL: Record<ExtraPermit, T> = {
  unknown: { ko: "부처 미확인", th: "ยังไม่ตรวจหน่วยงาน", en: "Agencies not checked" },
  none: { ko: "추가 부처 없음", th: "ไม่มีหน่วยงานเพิ่ม", en: "No extra agency" },
  dld: { ko: "축산국 (DLD) 필요", th: "ต้องขอกรมปศุสัตว์ (DLD)", en: "Livestock (DLD) required" },
  doa: { ko: "농업국 (DOA) 필요", th: "ต้องขอกรมวิชาการเกษตร (DOA)", en: "Agriculture (DOA) required" },
  other: { ko: "기타 부처 필요", th: "ต้องขอหน่วยงานอื่น", en: "Another agency required" },
};

export const LICENCE_KIND_LABEL: Record<LicenceKind, T> = {
  or7: { ko: "อ.7 수입 허가 (3년)", th: "ใบอนุญาต อ.7 (3 ปี)", en: "Or.7 import licence (3 yrs)" },
  ad: { ko: "광고 심의 (최대 5년)", th: "อนุมัติโฆษณา (ไม่เกิน 5 ปี)", en: "Advertising approval (up to 5 yrs)" },
  vat: { ko: "부가세 등록", th: "จดทะเบียน VAT", en: "VAT registration" },
  trademark: { ko: "상표", th: "เครื่องหมายการค้า", en: "Trademark" },
  other: { ko: "기타", th: "อื่น ๆ", en: "Other" },
};

/**
 * 무역은 세 가지가 따로 움직인다 — 물건, 서류, 돈. 초보자가 가장 많이 헷갈리는
 * 것이 "물건은 배에 있는데 서류는 어디 있고 돈은 언제 나가나"라서, 단계마다
 * 세 줄로 끊어 적는다. 비어 있으면 그 단계에서는 그게 안 움직인다는 뜻이다.
 */
export interface Lanes {
  goods?: T;
  paper?: T;
  money?: T;
}

export interface Stage {
  /** 주소에 남기고 개요에서 눌러 뛰는 데 쓴다. */
  id: string;
  no: string;
  phase: PhaseKey;
  /** 이 단계에서 일이 어느 나라에서 벌어지는지. 개요 줄에 점으로 찍는다. */
  where: "kr" | "th";
  title: T;
  lead: T;
  /** 용어를 모르는 사람에게 이 단계가 왜 있는지 한 문단으로 설명한다. */
  plain: T;
  does: Step[];
  docs: T[];
  takes: T;
  /**
   * 앞 단계가 끝나야 시작하는 게 아니라 옆 단계와 같이 도는 자리. 번호가 붙어
   * 있으면 사람은 그것을 순서로 읽는데, 여기를 순서대로 하면 일정이 통째로
   * 두세 달 길어진다. 그래서 카드에 못을 박아 둔다.
   */
  alongside?: T;
  gate: T;
  risk: T;
  /**
   * 규정이 아니라 실무에서 돈과 시간이 새는 자리. risk 는 그 단계에서 가장 크게
   * 터지는 것 하나를 문장으로 적고, 여기는 포워더·관세사가 체크리스트로 훑는
   * 항목들을 짧게 나열한다. 둘을 섞으면 제일 중요한 경고가 목록에 묻힌다.
   */
  watch?: T[];
  lanes: Lanes;
  /** 어느 규정·기관에 근거한 단계인지. 아래 SOURCES와 짝이다. */
  basis: T;
  /** 이 단계의 결과가 관리자 화면 어디에 남는지. 설명서를 도구에 잇는 고리다. */
  record?: { tab: Tab; what: T };
  /** 브랜드의 일이 끝나는 지점. 한 번만 참이다. */
  handoff?: boolean;
}

/**
 * 브랜드마다 반복하는 일이 아니라 klink가 처음 한 번 해 두는 일. 단계에 섞으면
 * 브랜드가 자기도 해야 하는 줄 알고 겁을 먹는다. 그래서 따로 뺀다.
 */
export interface PrereqItem {
  title: T;
  body: T;
}

export const PREREQ: PrereqItem[] = [
  {
    title: {
      ko: "정부 전자계정과 식품 시스템 등록",
      th: "บัญชี OPEN ID ของภาครัฐ และลงทะเบียนระบบอาหาร",
      en: "Government e-service account and Food System registration",
    },
    body: {
      ko: "태국 정부 전자민원 계정(OPEN ID)을 만들고 FDA 식품 시스템에 사업자를 등록합니다. 이게 있어야 아래 모든 신청을 온라인으로 넣을 수 있습니다.",
      th: "สร้างบัญชี OPEN ID ของภาครัฐ แล้วลงทะเบียนผู้ประกอบการในระบบอาหารของ อย. ต้องมีสิ่งนี้ก่อนจึงจะยื่นคำขอทั้งหมดด้านล่างทางออนไลน์ได้",
      en: "Create the Thai government e-service (OPEN ID) account and register the operator in the FDA Food System. Nothing below can be filed online without it.",
    },
  },
  {
    title: {
      ko: "식품 수입업 라이선스 (อ.7)",
      th: "ใบอนุญาตนำหรือสั่งอาหารเข้ามาในราชอาณาจักร (อ.7)",
      en: "Food import licence (Or.7)",
    },
    body: {
      ko: "판매 목적으로 식품을 수입할 수 있는 허가입니다. e-Submission으로 신청하고, 승인 전에 FDA가 창고 주소를 실사합니다. 3년마다 갱신하며 취급 품목이 늘면 변경 신청을 해야 합니다.",
      th: "ใบอนุญาตให้นำเข้าอาหารเพื่อจำหน่าย ยื่นผ่านระบบ e-Submission และก่อนอนุมัติ อย. จะเข้าตรวจสถานที่เก็บสินค้า ต่ออายุทุก 3 ปี และหากเพิ่มรายการสินค้าต้องยื่นแก้ไข",
      en: "The licence to import food for sale. Filed through e-Submission; the FDA inspects the warehouse address before approving. Renewed every three years, and amended when the item list grows.",
    },
  },
  {
    title: {
      ko: "수출입 검사 시스템에 증명서 등록 (U1 번호)",
      th: "ลงทะเบียนใบรับรองในระบบตรวจสอบนำเข้า–ส่งออก (เลขขึ้นต้น U1)",
      en: "Register certificates in the import–export inspection system (U1 number)",
    },
    body: {
      ko: "제조품질증명서 같은 서류를 미리 등록해 두면 U1로 시작하는 번호가 나옵니다. 선적마다 같은 서류를 다시 내지 않아도 되고 통관이 빨라집니다.",
      th: "ลงทะเบียนเอกสาร เช่น ใบรับรองมาตรฐานการผลิต ไว้ล่วงหน้าจะได้เลขที่ขึ้นต้นด้วย U1 ทำให้ไม่ต้องยื่นเอกสารเดิมซ้ำทุกครั้งที่นำเข้า และผ่านพิธีการได้เร็วขึ้น",
      en: "Pre-register documents such as the production standard certificate and you get a number starting with U1. The same paper no longer has to be filed every shipment, and clearance speeds up.",
    },
  },
  {
    title: {
      ko: "국가단일창구(NSW)에 LPI 사용자 등록",
      th: "ลงทะเบียนผู้ใช้ LPI ใน National Single Window (NSW)",
      en: "Register as an LPI user on the National Single Window",
    },
    body: {
      ko: "선적 건마다 내는 수입 사전신고(LPI)를 올리려면 관세청 NSW에 사용자로 등록돼 있어야 합니다. 위 세 가지가 끝난 뒤에만 됩니다.",
      th: "การยื่นแจ้งนำเข้ารายเที่ยว (LPI) ต้องลงทะเบียนผู้ใช้กับ NSW ของกรมศุลกากรก่อน และทำได้หลังจากสามข้อข้างต้นเสร็จแล้วเท่านั้น",
      en: "Filing the per-shipment import notification (LPI) requires being a registered user on the customs National Single Window. Only possible after the three items above.",
    },
  },
  {
    title: {
      ko: "부가세 사업자 등록 (Por.Por.01)",
      th: "จดทะเบียนภาษีมูลค่าเพิ่ม (ภ.พ.01)",
      en: "VAT registration (Por.Por.01)",
    },
    body: {
      ko: "수입할 때 낸 부가세를 매입세액으로 돌려받는 주체는 수입자입니다. 등록이 없으면 그 7%가 전부 원가로 남아 판매가가 달라집니다. 연매출 180만 바트를 넘으면 의무이고, 등록 뒤에는 매달 15일까지 PP.30을 냅니다. 전자신고는 8일이 더 붙어 23일까지인데 이건 상시 제도가 아니라 2027년 1월 31일까지 연장된 조치입니다 — 그 뒤를 15일로 잡아 두세요. 서식도 2026년 3월 1일자로 바뀌어 옛 양식은 접수되지 않습니다.",
      th: "ผู้ที่ขอเครดิตภาษีซื้อจาก VAT ที่จ่ายตอนนำเข้าคือผู้นำเข้า หากไม่ได้จดทะเบียน VAT 7% นั้นจะกลายเป็นต้นทุนทั้งก้อนและกระทบราคาขาย เมื่อรายได้เกิน 1.8 ล้านบาทต่อปีถือเป็นหน้าที่ และหลังจดทะเบียนต้องยื่น ภ.พ.30 ทุกเดือนภายในวันที่ 15 การยื่นออนไลน์ขยายเวลาอีก 8 วันเป็นวันที่ 23 แต่เป็นมาตรการขยายเวลาถึง 31 มกราคม 2570 ไม่ใช่เกณฑ์ถาวร ให้วางแผนช่วงหลังจากนั้นที่วันที่ 15 และแบบฟอร์มเปลี่ยนใหม่ตั้งแต่ 1 มีนาคม 2569 แบบเดิมจะไม่รับ",
      en: "The party that reclaims import VAT as input tax is the importer. Without registration that 7% stays in the cost and changes the selling price. It is mandatory above THB 1.8m of annual turnover, and once registered a PP.30 return is filed monthly by the 15th. Online filing adds eight days to the 23rd, but that is an extension confirmed only to 31 January 2027, not a standing rule — plan the period after it at the 15th. The form itself changed on 1 March 2026 and the old one is refused.",
    },
  },
];

export const STAGES: Stage[] = [
  {
    id: "screen",
    no: "01",
    phase: "prep",
    where: "th",
    title: { ko: "제품 검토 · 분류", th: "ตรวจสินค้า · จัดประเภท", en: "Screening and classification" },
    lead: {
      ko: "들어갈 수 있는지, 그리고 어느 등록 경로인지 가른다",
      th: "ดูว่าเข้าได้หรือไม่ และต้องขึ้นทะเบียนทางไหน",
      en: "Decide whether it can enter, and by which registration route",
    },
    plain: {
      ko: "태국은 식품을 네 갈래로 나눕니다. 일반식품은 등록이 아예 필요 없고, 라벨부착식품·표준식품은 이틀이면 되지만, 구체적 통제식품은 서너 달이 걸립니다. 어디에 속하느냐로 일정과 비용이 몇 배 달라지므로, 맨 처음 하는 일이 성분표를 보고 갈래를 정하는 것입니다. 그리고 갈래는 FDA 안에서만 갈리는 게 아닙니다 — 육류나 유제품이 조금이라도 들어가면 축산국 허가가 하나 더 붙습니다.",
      th: "ไทยแบ่งอาหารเป็นสี่กลุ่ม อาหารทั่วไปไม่ต้องขึ้นทะเบียนเลย อาหารที่ต้องมีฉลากและอาหารกำหนดคุณภาพใช้เวลาราวสองวันทำการ แต่อาหารควบคุมเฉพาะใช้เวลาสามถึงสี่เดือน กลุ่มที่สินค้าตกอยู่จึงทำให้ระยะเวลาและค่าใช้จ่ายต่างกันหลายเท่า งานแรกสุดคือดูสูตรส่วนผสมแล้วชี้ว่าอยู่กลุ่มไหน และการแบ่งกลุ่มไม่ได้จบอยู่ที่ อย. เท่านั้น หากมีเนื้อสัตว์หรือนมแม้เพียงเล็กน้อย ก็มีใบอนุญาตจากกรมปศุสัตว์เพิ่มมาอีกหนึ่งใบ",
      en: "Thailand sorts food into four groups. General food needs no registration at all; labelled and standardised food takes about two working days; specifically controlled food takes three to four months. Which group a product falls into changes the timeline and cost several times over, so the first job is to read the formula and place it. And the sorting does not end at the FDA — any trace of meat or dairy adds a livestock permit on top.",
    },
    does: [
      {
        actor: "brand",
        text: {
          ko: "샘플, 성분 배합표(%), 제조공정서, 지금 쓰는 라벨, 시험성적서를 보낸다",
          th: "ส่งตัวอย่างสินค้า สูตรส่วนผสม (%) กรรมวิธีการผลิต ฉลากที่ใช้อยู่ และผลตรวจวิเคราะห์",
          en: "Send samples, the ingredient formula (%), the process document, the current label, and lab reports",
        },
      },
      {
        actor: "th",
        text: {
          ko: "성분을 태국 규정과 대조하고 네 갈래 중 어디인지 판정한다",
          th: "เทียบส่วนผสมกับข้อกำหนดของไทย แล้วชี้ว่าอยู่ในสี่กลุ่มใด",
          en: "Match the ingredients against Thai rules and decide which of the four groups it is",
        },
      },
      {
        actor: "th",
        text: {
          ko: "HS 코드를 잡아 관세율과 소비세(음료면 설탕세) 해당 여부를 확인한다",
          th: "กำหนดพิกัดศุลกากร เพื่อดูอัตราอากรและภาษีสรรพสามิต (ถ้าเป็นเครื่องดื่มคือภาษีความหวาน)",
          en: "Set the HS code to establish the duty rate and whether excise (the sugar tax, for drinks) applies",
        },
      },
      {
        actor: "th",
        text: {
          ko: "성분에 육류·계란·꿀·유제품이나 식물성 원료가 있으면 FDA 말고 어느 부처가 더 붙는지 가른다",
          th: "หากมีส่วนผสมจากเนื้อสัตว์ ไข่ น้ำผึ้ง นม หรือวัตถุดิบจากพืช ให้ชี้ว่าต้องขอจากหน่วยงานใดเพิ่มนอกจาก อย.",
          en: "If the formula contains meat, egg, honey, dairy or plant material, work out which agency applies on top of the FDA",
        },
      },
      {
        actor: "th",
        text: {
          ko: "분류가 애매하면 태국 세관에 품목분류 사전심사를 넣어 번호를 확정한다",
          th: "หากจัดประเภทไม่ชัดเจน ให้ยื่นขอคำวินิจฉัยพิกัดล่วงหน้ากับกรมศุลกากรไทยเพื่อยืนยันรหัส",
          en: "If the classification is ambiguous, file for an advance tariff ruling with Thai customs to lock the code",
        },
      },
    ],
    docs: [
      { ko: "성분 배합표 (%)", th: "สูตรส่วนผสม (%)", en: "Ingredient formula (%)" },
      { ko: "제조공정서", th: "กรรมวิธีการผลิต", en: "Process document" },
      { ko: "현재 라벨 이미지", th: "ภาพฉลากปัจจุบัน", en: "Current label image" },
      { ko: "시험성적서", th: "ผลตรวจวิเคราะห์", en: "Lab analysis report" },
      { ko: "샘플", th: "ตัวอย่างสินค้า", en: "Samples" },
    ],
    takes: {
      ko: "서류가 다 오면 3~5일",
      th: "ถ้าเอกสารครบ 3–5 วัน",
      en: "3–5 days once the documents are complete",
    },
    gate: {
      ko: "등록 경로와 예상 기간·비용이 정해졌다",
      th: "กำหนดเส้นทางการขึ้นทะเบียน พร้อมระยะเวลาและค่าใช้จ่ายโดยประมาณแล้ว",
      en: "The registration route, the expected timeline and the cost are settled",
    },
    risk: {
      ko: "배합비가 %로 적혀 있지 않으면 판정 자체를 못 합니다. 갈래를 잘못 잡으면 두 달 뒤에 처음부터 다시 합니다. 음료는 100ml당 당분이 6g을 넘으면 설탕세가 붙어 원가가 달라지니 이 단계에서 같이 계산하세요.",
      th: "ถ้าสูตรไม่ระบุเป็น % จะตัดสินไม่ได้เลย และถ้าจัดกลุ่มผิด อีกสองเดือนต้องเริ่มใหม่ทั้งหมด สำหรับเครื่องดื่ม ถ้าน้ำตาลเกิน 6 กรัมต่อ 100 มล. จะมีภาษีความหวาน ทำให้ต้นทุนเปลี่ยน จึงควรคำนวณตั้งแต่ขั้นนี้",
      en: "Without percentages in the formula there is nothing to judge. Misplace the group and you restart two months later. For drinks, sugar above 6 g per 100 ml triggers the sugar tax and changes the landed cost — work it out here.",
    },
    watch: [
      {
        ko: "육류·계란·꿀이 든 가공식품은 축산국(DLD) 수입허가가 FDA와 별개로 필요하다. 라면 스프의 육류 추출물, 만두, 육포가 여기 걸린다",
        th: "อาหารแปรรูปที่มีเนื้อสัตว์ ไข่ หรือน้ำผึ้ง ต้องขอใบอนุญาตนำเข้าจากกรมปศุสัตว์ (DLD) แยกจาก อย. เช่น ซุปบะหมี่ที่มีสารสกัดจากเนื้อสัตว์ เกี๊ยว และเนื้อแห้ง",
        en: "Processed food containing meat, egg or honey needs a Department of Livestock Development import permit separately from the FDA — ramen soup base with meat extract, dumplings and jerky all fall here",
      },
      {
        ko: "건조 농산물·곡물·견과 같은 식물성 원료는 식물검역증(Phytosanitary)이 붙을 수 있다. 주류는 국세청 면허라 이 흐름으로는 못 간다",
        th: "วัตถุดิบจากพืช เช่น ผลผลิตอบแห้ง ธัญพืช ถั่ว อาจต้องมีใบรับรองสุขอนามัยพืช ส่วนเครื่องดื่มแอลกอฮอล์ต้องขอใบอนุญาตจากกรมสรรพสามิต จึงใช้ขั้นตอนนี้ไม่ได้",
        en: "Plant material such as dried produce, grain or nuts may need a phytosanitary certificate. Alcohol runs on an excise licence and cannot use this flow at all",
      },
      {
        ko: "HS 코드는 나중에 바꾸면 지난 신고까지 다시 봐야 한다. 애매하면 사전심사로 확정",
        th: "การแก้พิกัดภายหลังทำให้ต้องย้อนดูใบขนเดิมทั้งหมด ถ้าไม่ชัดเจนให้ยืนยันด้วยคำวินิจฉัยล่วงหน้า",
        en: "Changing the HS code later drags every past declaration back into review — lock it with an advance ruling if unsure",
      },
      {
        ko: "관세는 Form AK가 있느냐로 갈린다. 원산지 기준을 이 단계에서 같이 본다",
        th: "อัตราอากรขึ้นกับว่ามี Form AK หรือไม่ จึงควรดูเกณฑ์ถิ่นกำเนิดตั้งแต่ขั้นนี้",
        en: "Duty depends on whether Form AK exists, so check the origin rule at this stage too",
      },
    ],
    lanes: {
      goods: { ko: "샘플만 이동", th: "เคลื่อนเฉพาะตัวอย่าง", en: "Samples only" },
      paper: { ko: "성분표 · 공정서 · 성적서", th: "สูตร · กรรมวิธี · ผลตรวจ", en: "Formula, process, lab report" },
      money: { ko: "검토는 비용 없음", th: "ขั้นตรวจสอบไม่มีค่าใช้จ่าย", en: "Screening is free" },
    },
    basis: {
      ko: "태국 식품법상 식품 4분류 · 태국 FDA 허가 신청 안내 · 동물성 가공식품 축산국(DLD) 수입허가",
      th: "การแบ่งอาหารสี่กลุ่มตามกฎหมายอาหารไทย · แนวทางการขออนุญาตของ อย. · ใบอนุญาตนำเข้าอาหารแปรรูปจากสัตว์ของกรมปศุสัตว์",
      en: "The four food groups under Thai food law · Thai FDA application guidance · DLD import permit for processed animal products",
    },
    record: {
      tab: "brand",
      what: {
        ko: "브랜드사를 새로 등록하고 진행 단계를 “발굴·미팅”으로 둔다",
        th: "เพิ่มแบรนด์ใหม่ และตั้งสถานะเป็น “ลูกค้าเป้าหมาย / นัดคุย”",
        en: "Add the brand and set its stage to “lead / meeting”",
      },
    },
  },
  {
    id: "contract",
    no: "02",
    phase: "prep",
    where: "kr",
    title: { ko: "계약", th: "ทำสัญญา", en: "Agreement" },
    lead: {
      ko: "누가 무엇을 책임지는지 종이에 적는다",
      th: "เขียนลงกระดาษว่าใครรับผิดชอบอะไร",
      en: "Put on paper who is responsible for what",
    },
    plain: {
      ko: "수입자는 klink이고 제조와 품질은 브랜드 몫입니다. 태국 등록번호도 klink 명의로 나오므로, 계약이 끝났을 때 그 번호를 어떻게 할지까지 적어 둡니다. 말로 정한 조건은 반년 뒤에 서로 다르게 기억합니다.",
      th: "ผู้นำเข้าคือ klink ส่วนการผลิตและคุณภาพเป็นของแบรนด์ เลขทะเบียนในไทยก็ออกในนาม klink จึงต้องเขียนไว้ด้วยว่าเมื่อสัญญาสิ้นสุดจะจัดการเลขนั้นอย่างไร เงื่อนไขที่ตกลงด้วยปากเปล่า อีกครึ่งปีต่างฝ่ายจะจำไม่ตรงกัน",
      en: "klink is the importer; manufacturing and quality stay with the brand. The Thai registration number is issued in klink's name too, so write down what happens to it when the contract ends. Terms agreed verbally are remembered differently six months later.",
    },
    does: [
      {
        actor: "brand",
        text: {
          ko: "사업자등록증과 제조사 정보를 넘긴다",
          th: "ส่งหนังสือรับรองบริษัทและข้อมูลโรงงานผู้ผลิต",
          en: "Hand over the business registration and manufacturer details",
        },
      },
      {
        actor: "kr",
        text: {
          ko: "수수료율·월 피·최소 물량·독점 범위를 협의하고 계약서를 만든다",
          th: "เจรจาอัตราคอมมิชชั่น ค่ารายเดือน ยอดสั่งขั้นต่ำ และขอบเขตสิทธิ์ แล้วร่างสัญญา",
          en: "Negotiate commission, monthly fee, minimum order and exclusivity, then draft the contract",
        },
      },
      {
        actor: "kr",
        text: {
          ko: "인코텀즈(예: FOB 부산 / CIF 방콕)와 결제 조건·결제 통화를 정한다",
          th: "กำหนดอินโคเทอมส์ (เช่น FOB ปูซาน / CIF กรุงเทพฯ) เงื่อนไขการชำระเงิน และสกุลเงิน",
          en: "Fix the Incoterm (e.g. FOB Busan / CIF Bangkok), the payment terms and the currency",
        },
      },
      {
        actor: "th",
        text: {
          ko: "태국 상표가 이미 남의 이름으로 등록돼 있지 않은지 확인하고, 누구 명의로 출원할지 정한다",
          th: "ตรวจว่าเครื่องหมายการค้าในไทยถูกจดในชื่อผู้อื่นไปแล้วหรือยัง และตกลงว่าจะยื่นจดในนามใคร",
          en: "Check the Thai trademark is not already registered to someone else, and agree whose name it gets filed in",
        },
      },
      {
        actor: "kr",
        text: {
          ko: "등록 명의와 계약 종료 시 등록번호 처리, 원산지 사후검증 책임 분담을 조항으로 넣는다",
          th: "ใส่ข้อสัญญาเรื่องชื่อผู้ถือทะเบียน การจัดการเลขทะเบียนเมื่อสัญญาสิ้นสุด และการแบ่งความรับผิดกรณีถูกตรวจสอบถิ่นกำเนิดย้อนหลัง",
          en: "Add clauses on who holds the registration, what happens to it at termination, and who carries an origin-verification claw-back",
        },
      },
    ],
    docs: [
      { ko: "계약서", th: "สัญญา", en: "Contract" },
      { ko: "가격·결제 조건 (인코텀즈)", th: "เงื่อนไขราคาและการชำระเงิน (อินโคเทอมส์)", en: "Price and payment terms (Incoterms)" },
      { ko: "사업자등록증", th: "หนังสือรับรองบริษัท", en: "Business registration" },
      { ko: "제조사 정보", th: "ข้อมูลโรงงานผู้ผลิต", en: "Manufacturer details" },
    ],
    takes: { ko: "1~2주", th: "1–2 สัปดาห์", en: "1–2 weeks" },
    gate: {
      ko: "계약서에 서명했고 계약 시작일이 정해졌다",
      th: "ลงนามในสัญญาแล้ว และกำหนดวันเริ่มสัญญาแล้ว",
      en: "The contract is signed and the start date is set",
    },
    risk: {
      ko: "독점 범위와 최소 물량을 안 적으면 나중에 반드시 다툽니다. 등록번호는 수입자 명의라 계약이 끝나면 브랜드가 그 번호를 가져갈 수 없습니다 — 이 사실을 계약 때 말해 두지 않으면 종료 시점에 문제가 됩니다.",
      th: "ถ้าไม่ระบุขอบเขตสิทธิ์และยอดสั่งขั้นต่ำ จะมีข้อพิพาทแน่นอนในภายหลัง และเนื่องจากเลขทะเบียนอยู่ในชื่อผู้นำเข้า เมื่อสัญญาสิ้นสุดแบรนด์จะนำเลขนั้นไปไม่ได้ ถ้าไม่บอกกันตั้งแต่ตอนทำสัญญา จะกลายเป็นปัญหาตอนเลิกสัญญา",
      en: "Leaving exclusivity and minimum order unwritten guarantees a dispute later. The registration sits in the importer's name, so the brand cannot take it along when the contract ends — say so at signing or it becomes the fight at termination.",
    },
    watch: [
      {
        ko: "인코텀즈를 안 정하면 운임·보험을 누가 내는지, 물건이 어디서부터 누구 위험인지가 안 정해진다",
        th: "ถ้าไม่กำหนดอินโคเทอมส์ จะไม่ชัดว่าใครจ่ายค่าระวางและประกัน และความเสี่ยงในสินค้าโอนที่จุดใด",
        en: "Without an Incoterm, nobody has agreed who pays freight and insurance or where risk in the goods passes",
      },
      {
        ko: "결제 통화를 원·바트·달러 중 무엇으로 하느냐가 곧 환위험을 누가 지느냐다",
        th: "การเลือกสกุลเงินระหว่างวอน บาท หรือดอลลาร์ คือการตัดสินว่าใครรับความเสี่ยงอัตราแลกเปลี่ยน",
        en: "Choosing won, baht or dollar as the settlement currency is the same as choosing who carries the FX risk",
      },
      {
        ko: "FTA 특혜세율은 수입자가 신청한다. 사후검증에서 원산지가 부인되면 태국 세관은 klink에 추징하는데, 증빙은 브랜드가 갖고 있다",
        th: "อัตรา FTA ผู้นำเข้าเป็นผู้ขอใช้ หากถูกตรวจสอบย้อนหลังแล้วถิ่นกำเนิดไม่ผ่าน ศุลกากรไทยจะเรียกเก็บจาก klink ทั้งที่หลักฐานอยู่กับแบรนด์",
        en: "The FTA rate is claimed by the importer, so if origin fails a later verification Thai customs bills klink — while the evidence sits with the brand",
      },
      {
        ko: "태국 상표를 남이 먼저 잡아 두면 세관 지식재산 신고로 우리 물건이 통관에서 막힌다. 계약 때 확인하고 바로 출원한다",
        th: "หากมีผู้อื่นจดเครื่องหมายการค้าในไทยไว้ก่อน สินค้าของเราอาจถูกกักที่ศุลกากรผ่านระบบแจ้งสิทธิ์ทรัพย์สินทางปัญญา ควรตรวจตอนทำสัญญาแล้วยื่นจดทันที",
        en: "If someone else registered the mark in Thailand first, a customs IP recordation can hold our own goods. Check it at contract time and file straight away",
      },
      {
        ko: "원산지 증빙은 수입자·수출자·생산자 모두 5년 보관 의무가 있다",
        th: "หลักฐานถิ่นกำเนิดต้องเก็บไว้ 5 ปี ทั้งผู้นำเข้า ผู้ส่งออก และผู้ผลิต",
        en: "Origin evidence must be kept for five years by importer, exporter and producer alike",
      },
    ],
    lanes: {
      paper: { ko: "계약서 · 인코텀즈 · 결제 조건", th: "สัญญา · อินโคเทอมส์ · เงื่อนไขชำระเงิน", en: "Contract, Incoterms, payment terms" },
      money: { ko: "수수료 · 월 피 · 결제 통화 확정", th: "สรุปคอมมิชชั่น ค่ารายเดือน และสกุลเงิน", en: "Commission, monthly fee and currency fixed" },
    },
    basis: {
      ko: "인코텀즈 2020 · FTA 원산지증빙 5년 보관 의무와 사후검증 제도 · 등록이 수입자 명의로 나오는 구조",
      th: "อินโคเทอมส์ 2020 · หน้าที่เก็บหลักฐานถิ่นกำเนิด 5 ปีและระบบตรวจสอบย้อนหลัง · โครงสร้างที่ทะเบียนออกในชื่อผู้นำเข้า",
      en: "Incoterms 2020 · the five-year origin record-keeping duty and post-clearance verification · registration being held by the importer",
    },
    record: {
      tab: "brand",
      what: {
        ko: "계약 조건(수수료율·월 피·계약 기간)을 적고 진행 단계를 “계약”으로 옮긴다",
        th: "บันทึกเงื่อนไขสัญญา (คอมมิชชั่น ค่ารายเดือน ระยะสัญญา) และเปลี่ยนสถานะเป็น “ทำสัญญาแล้ว”",
        en: "Record the contract terms and move the stage to “contracted”",
      },
    },
  },
  {
    id: "validate",
    no: "03",
    phase: "prep",
    where: "th",
    title: { ko: "시장 검증", th: "ทดสอบตลาด", en: "Market test" },
    lead: {
      ko: "큰 물량을 넣기 전에 소량으로 반응을 본다",
      th: "ลองด้วยจำนวนน้อยก่อนสั่งล็อตใหญ่",
      en: "See the response on a small quantity before committing volume",
    },
    plain: {
      ko: "등록은 시간이 걸립니다. 그동안 소량만 들여와 인플루언서에게 보내고 반응을 봅니다. 안 팔릴 물건을 컨테이너째 떠안는 일을 여기서 막습니다. 다만 등록 전에는 판매를 목적으로 수입할 수 없으므로, 이 물량은 시딩과 시식에만 씁니다.",
      th: "การขึ้นทะเบียนใช้เวลา ระหว่างนั้นเรานำเข้าจำนวนน้อยเพื่อส่งให้อินฟลูเอนเซอร์และดูผลตอบรับ ขั้นนี้กันไม่ให้ต้องแบกสินค้าที่ขายไม่ออกทั้งตู้ แต่ก่อนขึ้นทะเบียนจะนำเข้าเพื่อจำหน่ายไม่ได้ ของล็อตนี้จึงใช้เพื่อซีดดิ้งและการชิมเท่านั้น",
      en: "Registration takes time. Meanwhile we bring in a small quantity, seed it to influencers and watch the response — that is what stops anyone carrying a container of something that will not sell. But food cannot be imported for sale before registration, so this quantity is used only for seeding and tasting.",
    },
    does: [
      {
        actor: "brand",
        text: {
          ko: "소량 물량을 출고한다",
          th: "ส่งสินค้าจำนวนน้อยออกมา",
          en: "Ship a small quantity",
        },
      },
      {
        actor: "th",
        text: {
          ko: "허용되는 경로와 수량을 세관·FDA에 건별로 확인한 뒤 반입한다",
          th: "ยืนยันช่องทางและปริมาณที่อนุญาตกับศุลกากรและ อย. เป็นรายกรณี แล้วจึงนำเข้า",
          en: "Confirm the permitted route and quantity with customs and the FDA case by case, then bring it in",
        },
      },
      {
        actor: "th",
        text: {
          ko: "인플루언서에게 시딩하고 반응을 정리해 본물량과 판매가를 제안한다",
          th: "ส่งให้อินฟลูเอนเซอร์ สรุปผลตอบรับ แล้วเสนอปริมาณล็อตจริงและราคาขาย",
          en: "Seed it to influencers, summarise the response, and propose the real order size and price",
        },
      },
    ],
    docs: [
      { ko: "견본품 인보이스", th: "อินวอยซ์ตัวอย่างสินค้า", en: "Sample invoice" },
      { ko: "소량 패킹리스트", th: "แพ็คกิ้งลิสต์จำนวนน้อย", en: "Small-lot packing list" },
      { ko: "수입 사전신고 (LPI)", th: "แจ้งนำเข้ารายเที่ยว (LPI)", en: "Per-shipment notification (LPI)" },
    ],
    takes: { ko: "4~6주", th: "4–6 สัปดาห์", en: "4–6 weeks" },
    alongside: {
      ko: "04 태국 FDA 등록과 같이 돕니다. 이 단계가 끝나기를 기다렸다가 등록을 시작하면 전체 일정이 그만큼 늦어집니다 — 등록을 먼저 걸어 두고, 그 대기 시간 안에서 시장을 봅니다.",
      th: "ทำคู่ขนานไปกับขั้นที่ 04 การขึ้นทะเบียนกับ อย. หากรอให้ขั้นนี้จบก่อนแล้วค่อยเริ่มขึ้นทะเบียน ตารางงานทั้งหมดจะยืดออกไปเท่านั้น ให้ยื่นขึ้นทะเบียนไว้ก่อน แล้วทดสอบตลาดในช่วงที่รออนุมัติ",
      en: "Runs alongside stage 04, the FDA registration. Waiting for this stage to finish before filing pushes the whole schedule back by exactly that much — file the registration first and test the market inside the waiting time.",
    },
    /*
     * 시딩이 처음 도는 곳이 여기다. 08단계에는 광고 문구를 심의 범위 안에 두라는
     * 경고가 있는데, 정작 이 단계에는 없었다 — 그런데 여기는 등록도 라벨 승인도
     * 광고 심의도 없는 상태라 기댈 범위 자체가 없다. 08보다 더 좁게 가야 한다.
     */
    watch: [
      {
        ko: "이 단계에는 기댈 광고 심의가 없다. 크리에이터 브리프에 효능 표현 금지 목록을 넣고, 원재료·형태·먹는 법까지만 말하게 한다 — 남이 대신 한 말도 우리 광고다(08단계와 같은 선이지만, 여기는 승인된 범위가 아직 0이다)",
        th: "ขั้นนี้ยังไม่มีโฆษณาที่ผ่านการอนุมัติให้อ้างอิง ให้ใส่รายการคำต้องห้ามเรื่องสรรพคุณไว้ในไกด์ไลน์ของครีเอเตอร์ และให้พูดได้แค่ส่วนประกอบ รูปแบบบรรจุ และวิธีกิน คำพูดของคนอื่นก็ถือเป็นโฆษณาของเรา (เส้นเดียวกับขั้นที่ 08 แต่ขั้นนี้ขอบเขตที่อนุมัติแล้วยังเป็นศูนย์)",
        en: "There is no approved advertising to lean on here. Put the forbidden benefit wording in the creator brief and keep them to ingredients, format and how to eat it — what someone else says on our behalf is still our advertising, and at this stage the approved scope is nil rather than narrow",
      },
      {
        ko: "시딩용으로 들여온 물량이 판매로 새지 않게 한다. 크리에이터에게 '구매처'를 안내하거나 증정 이벤트를 걸면 등록 전 판매로 읽힌다",
        th: "อย่าให้ของที่นำเข้ามาเพื่อซีดดิ้งไหลไปสู่การขาย หากบอกช่องทางซื้อกับครีเอเตอร์หรือจัดกิจกรรมแจกของ จะถูกตีความว่าเป็นการขายก่อนขึ้นทะเบียน",
        en: "Keep the seeding lot from leaking into sales — pointing creators at a place to buy, or running a giveaway, reads as selling before registration",
      },
    ],
    gate: {
      ko: "시딩 결과를 보고 본물량과 판매가를 정했다",
      th: "ดูผลจากการซีดดิ้งแล้ว และกำหนดปริมาณล็อตจริงกับราคาขายได้",
      en: "The seeding results are in and the order size and price are decided",
    },
    risk: {
      ko: "“견본품이라 세금이 없다”는 더 이상 맞지 않습니다. 2026년 1월 1일부터 1바트 이상 모든 수입품에 관세와 부가세가 붙습니다. 수량이 많으면 판매용으로 보고 통관에서 잡히고, 등록 전 판매는 그 자체가 위반입니다. 허용 경로와 수량은 건별로 확인하세요.",
      th: "คำว่า “เป็นตัวอย่างจึงไม่มีภาษี” ใช้ไม่ได้อีกแล้ว ตั้งแต่ 1 มกราคม 2569 สินค้านำเข้าตั้งแต่ 1 บาทขึ้นไปต้องเสียอากรและภาษีมูลค่าเพิ่ม ถ้าจำนวนมากจะถูกถือว่าเป็นการค้าและถูกกัก และการขายก่อนขึ้นทะเบียนถือเป็นความผิดในตัวเอง ช่องทางและปริมาณที่อนุญาตต้องยืนยันเป็นรายกรณี",
      en: "“It's a sample, so there's no tax” no longer holds: from 1 January 2026 duty and VAT apply to every import from 1 baht up. A large quantity is treated as commercial and held, and selling before registration is itself a violation. Confirm the permitted route and volume case by case.",
    },
    lanes: {
      goods: { ko: "소량 — 시딩·시식용", th: "จำนวนน้อย — เพื่อซีดดิ้งและชิม", en: "Small lot — seeding and tasting" },
      paper: { ko: "견본 인보이스 · LPI", th: "อินวอยซ์ตัวอย่าง · LPI", en: "Sample invoice, LPI" },
      money: { ko: "소량에도 관세·부가세", th: "แม้จำนวนน้อยก็มีอากรและ VAT", en: "Duty and VAT even on a small lot" },
    },
    basis: {
      ko: "2026년 1월 1일 시행 소액 수입품 과세 · 등록 전 판매 목적 수입 금지",
      th: "การเก็บภาษีสินค้านำเข้ามูลค่าต่ำ มีผล 1 มกราคม 2569 · ห้ามนำเข้าเพื่อจำหน่ายก่อนขึ้นทะเบียน",
      en: "Low-value import taxation effective 1 January 2026 · no import for sale before registration",
    },
    record: {
      tab: "inf",
      what: {
        ko: "인플루언서 탭에서 발송·게시를 기록하고, 재고 탭에서 시딩 출고로 잡는다",
        th: "บันทึกการส่งและการโพสต์ในแท็บอินฟลูเอนเซอร์ และตัดสต็อกเป็นการเบิกซีดดิ้ง",
        en: "Log the send and the post under Influencers, and book it as a seeding stock-out",
      },
    },
  },
  {
    id: "fda",
    no: "04",
    phase: "permit",
    where: "th",
    title: { ko: "태국 FDA 등록", th: "ขึ้นทะเบียนกับ อย.", en: "Thai FDA registration" },
    lead: {
      ko: "klink 명의로 신고해 อย. 번호와 라벨 승인을 받는다",
      th: "ยื่นในนาม klink เพื่อรับเลขสารบบอาหารและการอนุมัติฉลาก",
      en: "File in klink's name to obtain the อย. number and label approval",
    },
    plain: {
      ko: "태국 수입 허가는 회사가 아니라 주소에 붙습니다. 태국 안의 창고 주소로 발급되고 FDA가 그 주소를 실사합니다. 서울 주소로는 받을 수 없어서, 태국 법인인 klink가 수입자가 되어 신고합니다. 이 단계는 사실 두 가지 일입니다 — 제품 등록(อย. 번호)과 라벨 사전승인이고, 라벨 쪽이 훨씬 오래 걸립니다.",
      th: "ใบอนุญาตนำเข้าของไทยผูกกับที่อยู่ ไม่ใช่ตัวบริษัท ออกตามที่อยู่คลังสินค้าในไทย และ อย. จะเข้าตรวจสถานที่นั้น ที่อยู่ในกรุงโซลจึงขอไม่ได้ บริษัทไทยอย่าง klink จึงเป็นผู้นำเข้าและเป็นผู้ยื่น ขั้นนี้จริง ๆ มีสองงาน คือการขึ้นทะเบียนสินค้า (เลข อย.) กับการอนุมัติฉลากล่วงหน้า ซึ่งฝั่งฉลากใช้เวลานานกว่ามาก",
      en: "A Thai import licence attaches to an address, not a company. It is issued against a warehouse address in Thailand and the FDA inspects it. A Seoul address cannot hold one, so klink files as importer. This stage is really two jobs — product registration (the อย. number) and label pre-approval — and the label side takes far longer.",
    },
    does: [
      {
        actor: "th",
        text: {
          ko: "e-Submission으로 제품을 등록해 식품일련번호(อย.)를 받는다",
          th: "ขึ้นทะเบียนสินค้าผ่าน e-Submission เพื่อรับเลขสารบบอาหาร (อย.)",
          en: "Register the product through e-Submission to obtain the food serial number (อย.)",
        },
      },
      {
        actor: "th",
        text: {
          ko: "라벨 사전승인(สบ.3/1)을 신청하고 태국어 라벨을 확정한다",
          th: "ยื่นขออนุมัติฉลากล่วงหน้า (สบ.3/1) และสรุปฉลากภาษาไทย",
          en: "Apply for label pre-approval (Sor Bor 3/1) and finalise the Thai label",
        },
      },
      {
        actor: "brand",
        text: {
          ko: "자유판매증명서(식약처)와 제조품질증명서를 원본으로 챙겨 준다",
          th: "จัดหาหนังสือรับรองการจำหน่ายเสรี (จาก MFDS) และใบรับรองมาตรฐานการผลิต เป็นฉบับจริง",
          en: "Supply the free-sale certificate (from Korea's MFDS) and the production standard certificate as originals",
        },
      },
    ],
    docs: [
      { ko: "자유판매증명서 (CFS)", th: "หนังสือรับรองการจำหน่ายเสรี (CFS)", en: "Certificate of Free Sale (CFS)" },
      {
        ko: "제조품질증명서 (HACCP · ISO 22000 등)",
        th: "ใบรับรองมาตรฐานการผลิต (HACCP · ISO 22000 ฯลฯ)",
        en: "Production standard certificate (HACCP, ISO 22000, etc.)",
      },
      { ko: "성분 분석 성적서", th: "ผลวิเคราะห์ส่วนประกอบ", en: "Ingredient analysis report" },
      { ko: "태국어 라벨 도안", th: "อาร์ตเวิร์กฉลากภาษาไทย", en: "Thai label artwork" },
      { ko: "위임장", th: "หนังสือมอบอำนาจ", en: "Letter of authorisation" },
    ],
    takes: {
      ko: "제품 등록은 갈래에 따라 2영업일~90영업일. 라벨 사전승인은 별도로 약 60일",
      th: "การขึ้นทะเบียนสินค้าใช้ 2–90 วันทำการตามกลุ่ม ส่วนการอนุมัติฉลากแยกต่างหาก ราว 60 วัน",
      en: "Product registration: 2 to 90 working days depending on the group. Label pre-approval is separate, around 60 days",
    },
    alongside: {
      ko: "전체에서 가장 긴 단계입니다. 03 시장 검증을 이 대기 시간 안에서 같이 돌리세요. 02 계약이 끝나는 즉시 여기부터 겁니다.",
      th: "เป็นขั้นที่ใช้เวลานานที่สุด ให้เดินขั้นที่ 03 ทดสอบตลาดไปพร้อมกันในช่วงที่รอ และเริ่มขั้นนี้ทันทีที่ขั้นที่ 02 ทำสัญญาเสร็จ",
      en: "The longest stage of all. Run stage 03, the market test, inside this waiting time, and start this one the moment the contract at stage 02 is signed.",
    },
    gate: {
      ko: "อย. 번호가 나왔고 라벨 도안이 승인됐다",
      th: "ได้เลขสารบบอาหาร และฉลากผ่านการอนุมัติแล้ว",
      en: "The อย. number is issued and the label artwork is approved",
    },
    risk: {
      ko: "제조품질증명서는 발급일로부터 1년 이내여야 하고, 제조국 정부나 정부가 인정한 기관이 발급한 것이어야 합니다. 온라인으로 확인되는 증명서는 공증이 필요 없지만, 확인이 안 되면 태국어·영어 번역과 공증을 붙여야 합니다. 반려는 대개 이 서류에서 납니다.",
      th: "ใบรับรองมาตรฐานการผลิตต้องออกไม่เกิน 1 ปี และต้องออกโดยหน่วยงานรัฐของประเทศผู้ผลิตหรือหน่วยงานที่รัฐรับรอง ใบรับรองที่ตรวจสอบออนไลน์ได้ไม่ต้องรับรองสำเนา แต่ถ้าตรวจสอบไม่ได้ต้องแนบคำแปลภาษาไทยหรืออังกฤษพร้อมรับรอง การถูกตีกลับส่วนใหญ่เกิดจากเอกสารนี้",
      en: "The production standard certificate must be less than a year old and issued by the producing country's government or a body it recognises. Certificates verifiable online need no notarisation; those that are not need a Thai or English translation, notarised. Most rejections come from this document.",
    },
    watch: [
      {
        ko: "자유판매증명서(CFS)는 식약처 발급에 수출 실적 증빙을 요구할 수 있다. 그런데 수출신고는 06단계다 — 03단계 소량 선적 때 나온 필증을 쓸 수 있는지 브랜드가 식약처에 먼저 확인한다",
        th: "หนังสือรับรองการจำหน่ายเสรี (CFS) ที่ออกโดย MFDS อาจต้องใช้หลักฐานการส่งออก แต่การยื่นใบขนสินค้าขาออกอยู่ในขั้นที่ 06 ให้แบรนด์สอบถาม MFDS ก่อนว่าใช้ใบขนจากการส่งตัวอย่างในขั้นที่ 03 ได้หรือไม่",
        en: "The certificate of free sale can require proof of an actual export, yet the export declaration only happens at stage 06 — the brand should ask the MFDS first whether the declaration from the small stage 03 shipment will do",
      },
      {
        ko: "제품 등록과 라벨 승인은 같이 넣는다. 등록이 이틀에 끝나도 라벨이 60일이면 출발선은 60일이다",
        th: "ยื่นขึ้นทะเบียนสินค้าและขออนุมัติฉลากไปพร้อมกัน แม้การขึ้นทะเบียนจะเสร็จในสองวัน แต่ถ้าฉลากใช้ 60 วัน จุดเริ่มจริงก็คือ 60 วัน",
        en: "File the product registration and the label approval together — registration finishing in two days means nothing if the label takes sixty",
      },
      {
        ko: "축산국 허가가 걸리는 품목이면 그 신청도 여기서 같이 넣는다. FDA가 끝난 뒤에 시작하면 두 번 기다린다",
        th: "หากสินค้าต้องขอใบอนุญาตจากกรมปศุสัตว์ ให้ยื่นพร้อมกันในขั้นนี้ หากรอให้ อย. เสร็จก่อนจะกลายเป็นรอสองรอบ",
        en: "If the item needs a livestock permit, file that here too — starting it after the FDA is done means waiting twice",
      },
      {
        ko: "라벨 도안에 섭취방법(วิธีรับประทาน)을 같이 넣는다. 표시 의무 항목은 아니지만, 광고 사전승인은 라벨에 이미 승인된 범위를 기준으로 판단하므로 라벨에 적힌 섭취방법은 승인 없이 마케팅에 그대로 쓸 수 있다. 나중에 넣으려면 변경 신고를 다시 넣어야 한다",
        th: "ใส่วิธีรับประทานลงในอาร์ตเวิร์กฉลากไปพร้อมกัน ไม่ใช่รายการบังคับ แต่การอนุญาตโฆษณาตัดสินจากขอบเขตที่ฉลากได้รับอนุมัติไว้แล้ว วิธีรับประทานที่อยู่บนฉลากจึงนำไปใช้ในการตลาดได้เลยโดยไม่ต้องขออนุญาต หากมาเพิ่มทีหลังต้องยื่นแก้ไขใหม่",
        en: "Put the directions for use (วิธีรับประทาน) on the label artwork at the same time. It is not a mandatory item, but advertising approval is judged against what the label already carries, so directions printed on the label can be used in marketing as they stand. Adding them afterwards means filing an amendment",
      },
    ],
    lanes: {
      goods: { ko: "움직이지 않음", th: "ไม่มีการเคลื่อนย้าย", en: "Nothing moves" },
      paper: { ko: "CFS · 품질증명 · 라벨 도안", th: "CFS · ใบรับรองมาตรฐาน · อาร์ตเวิร์กฉลาก", en: "CFS, standard certificate, label artwork" },
      money: { ko: "등록 수수료 (갈래별로 다름)", th: "ค่าธรรมเนียมขึ้นทะเบียน (ต่างกันตามกลุ่ม)", en: "Registration fees (varies by group)" },
    },
    basis: {
      ko: "태국 FDA 식품 수입 절차 · 2024년 11월 제조시스템 증명 고시 · 한국 식약처 수출 증명서 발급",
      th: "ขั้นตอนการนำเข้าอาหารของ อย. · ประกาศเรื่องใบรับรองระบบการผลิต พฤศจิกายน 2567 · การออกใบรับรองเพื่อส่งออกของ MFDS เกาหลี",
      en: "Thai FDA food import procedure · November 2024 production-system certificate notification · Korean MFDS export certificate issuance",
    },
    record: {
      tab: "stock",
      what: {
        ko: "제품마다 FDA 상태·등록번호·등록일을 적는다",
        th: "บันทึกสถานะ อย. เลขทะเบียน และวันที่ ในแต่ละสินค้า",
        en: "Record each product's FDA status, number and date",
      },
    },
  },
  {
    id: "produce",
    no: "05",
    phase: "ship",
    where: "kr",
    title: { ko: "생산 · 태국어 라벨", th: "ผลิต · ฉลากภาษาไทย", en: "Production and Thai label" },
    lead: {
      ko: "발주를 받아 만들고, 승인된 라벨을 한국에서 붙인다",
      th: "รับใบสั่งซื้อ ผลิต แล้วติดฉลากที่อนุมัติแล้วตั้งแต่ในเกาหลี",
      en: "Take the order, produce, and apply the approved label in Korea",
    },
    plain: {
      ko: "태국어 라벨은 통관 전에 이미 붙어 있어야 합니다. 도착한 뒤에 붙이는 게 아닙니다. 그리고 붙이는 라벨은 04단계에서 승인받은 도안 그대로여야 합니다 — 한 글자라도 다르면 승인받지 않은 라벨입니다.",
      th: "ฉลากภาษาไทยต้องติดมาก่อนผ่านพิธีการนำเข้า ไม่ใช่ไปติดหลังของถึงไทย และฉลากที่ติดต้องตรงกับอาร์ตเวิร์กที่อนุมัติในขั้นที่ 04 ทุกประการ ต่างแม้ตัวอักษรเดียวก็ถือว่าเป็นฉลากที่ไม่ได้รับอนุมัติ",
      en: "The Thai label must already be on the pack before clearance, not applied after arrival. And it has to be exactly the artwork approved at stage 04 — one character different makes it an unapproved label.",
    },
    does: [
      {
        actor: "th",
        text: {
          ko: "발주서(PO)를 내고 수량과 납기를 확정한다",
          th: "ออกใบสั่งซื้อ (PO) และยืนยันจำนวนกับกำหนดส่ง",
          en: "Issue the purchase order and fix quantity and delivery date",
        },
      },
      {
        actor: "brand",
        text: {
          ko: "생산·포장하고 승인된 태국어 라벨을 부착한다",
          th: "ผลิต บรรจุ และติดฉลากภาษาไทยที่ได้รับอนุมัติ",
          en: "Produce, pack, and apply the approved Thai label",
        },
      },
      {
        actor: "kr",
        text: {
          ko: "출고 전에 실물을 검품한다 — 라벨 15개 표시 항목, 알레르기 표시, 로트·유통기한 인쇄",
          th: "ตรวจสินค้าจริงก่อนส่งออก — ฉลากครบ 15 รายการ การแจ้งสารก่อภูมิแพ้ และการพิมพ์ล็อตกับวันหมดอายุ",
          en: "Inspect the actual goods before they leave — the 15 label items, the allergen statement, and the printed lot and expiry",
        },
      },
      {
        actor: "th",
        text: {
          ko: "검품 사진을 승인 도안과 대조하고, 남은 유통기한이 채널 요구를 넘는지 본다",
          th: "เทียบภาพจากการตรวจกับอาร์ตเวิร์กที่อนุมัติ และดูว่าอายุสินค้าที่เหลือผ่านเกณฑ์ของช่องทางขายหรือไม่",
          en: "Compare the inspection photos against the approved artwork and check the remaining shelf life against what the channel demands",
        },
      },
    ],
    docs: [
      { ko: "발주서 (PO)", th: "ใบสั่งซื้อ (PO)", en: "Purchase order (PO)" },
      { ko: "승인된 라벨 도안", th: "อาร์ตเวิร์กฉลากที่อนุมัติแล้ว", en: "Approved label artwork" },
      { ko: "로트 · 유통기한 표기안", th: "แบบระบุล็อตและวันหมดอายุ", en: "Lot and expiry marking plan" },
      { ko: "검품 사진 · 검품 보고", th: "ภาพและรายงานการตรวจสินค้า", en: "Inspection photos and report" },
    ],
    takes: { ko: "생산 2~4주", th: "ผลิต 2–4 สัปดาห์", en: "2–4 weeks of production" },
    gate: {
      ko: "실물 라벨이 승인 도안과 같고 로트·유통기한이 찍혀 있다",
      th: "ฉลากจริงตรงกับอาร์ตเวิร์กที่อนุมัติ และมีล็อตกับวันหมดอายุพิมพ์อยู่",
      en: "The physical label matches the approved artwork and carries lot and expiry",
    },
    risk: {
      ko: "라벨 고시 제450호의 경과 기간이 2026년 7월에 끝났습니다. 예전 도안이 창고에 남아 있어도 지금은 그 라벨로 못 팝니다. 알레르기 표시 대상에 조개류와 오징어가 추가됐으니 예전 문구를 그대로 쓰지 마세요.",
      th: "ระยะผ่อนผันของประกาศฉลากฉบับที่ 450 สิ้นสุดในเดือนกรกฎาคม 2569 แม้ยังมีอาร์ตเวิร์กเดิมค้างอยู่ในคลัง ก็ใช้ขายไม่ได้แล้ว และมีการเพิ่มหอยและหมึกเข้าในรายการสารก่อภูมิแพ้ จึงห้ามใช้ข้อความเดิม",
      en: "The grace period under labelling Notification 450 ended in July 2026. Old artwork sitting in a warehouse can no longer be sold. Shellfish and squid were added to the allergen list, so do not reuse the old wording.",
    },
    watch: [
      {
        ko: "검품은 한국에서 한다. 배에 실린 뒤에 발견한 라벨 오류는 고칠 방법이 없다",
        th: "การตรวจสินค้าทำในเกาหลี ความผิดพลาดของฉลากที่พบหลังขึ้นเรือแล้วแก้ไม่ได้",
        en: "Inspection happens in Korea — a label error found after loading cannot be fixed",
      },
      {
        ko: "리테일은 입고 시 남은 유통기한을 계약으로 요구한다. 규정이 아니라 거래 조건이라 채널마다 다르다",
        th: "ร้านค้าปลีกกำหนดอายุสินค้าคงเหลือ ณ วันรับของไว้ในสัญญา ไม่ใช่ข้อกฎหมายแต่เป็นเงื่อนไขการค้า จึงต่างกันไปตามช่องทาง",
        en: "Retailers write a minimum remaining shelf life into the trade terms — a commercial condition, not a rule, so it differs by channel",
      },
      {
        ko: "생산일이 이르면 도착 시점의 남은 기간이 줄어든다. 생산·선적 일정을 붙여서 잡는다",
        th: "ยิ่งผลิตเร็ว อายุที่เหลือ ณ วันของถึงยิ่งสั้น จึงควรวางแผนวันผลิตกับวันส่งให้ชิดกัน",
        en: "Producing early eats the shelf life left on arrival — keep the production and sailing dates close together",
      },
    ],
    lanes: {
      goods: { ko: "한국 공장에서 생산·포장", th: "ผลิตและบรรจุที่โรงงานในเกาหลี", en: "Produced and packed in Korea" },
      paper: { ko: "발주서 · 승인 라벨 도안", th: "ใบสั่งซื้อ · อาร์ตเวิร์กที่อนุมัติ", en: "PO, approved artwork" },
      money: { ko: "브랜드가 생산비 선투입", th: "แบรนด์ออกค่าผลิตไปก่อน", en: "The brand funds production up front" },
    },
    basis: {
      ko: "공중보건부 고시 제450호 (2024) · 통관 전 태국어 라벨 부착 의무",
      th: "ประกาศกระทรวงสาธารณสุข ฉบับที่ 450 (2567) · หน้าที่ติดฉลากภาษาไทยก่อนผ่านพิธีการ",
      en: "MOPH Notification No. 450 (2024) · Thai label required before clearance",
    },
    record: {
      tab: "fin",
      what: {
        ko: "매입(상품)을 지출로 적는다. 재고는 아직 잡지 않는다",
        th: "บันทึกค่าสินค้าเป็นรายจ่าย ยังไม่รับเข้าสต็อก",
        en: "Book the goods cost as an expense; do not add stock yet",
      },
    },
  },
  {
    id: "export",
    no: "06",
    phase: "ship",
    where: "kr",
    title: { ko: "선적 · 사전신고", th: "ส่งออก · แจ้งล่วงหน้า", en: "Shipping and pre-notification" },
    lead: {
      ko: "서류를 만들어 배에 싣고, 도착 전에 태국에 미리 알린다",
      th: "จัดทำเอกสาร ขึ้นเรือ และแจ้งไทยล่วงหน้าก่อนของถึง",
      en: "Prepare the documents, load the ship, and notify Thailand before arrival",
    },
    plain: {
      ko: "여기서 브랜드의 일이 끝나고 klink가 받습니다. 초보자가 가장 많이 놓치는 것이 사전신고(LPI)입니다 — 선적 건마다 태국 세관 시스템에 미리 올려야 하고, 이게 없으면 물건이 도착해도 통관이 시작되지 않습니다. 원산지증명서도 선적이 끝난 뒤에는 발급이 까다로워지므로 이 단계에서 같이 처리합니다.",
      th: "งานของแบรนด์จบตรงนี้ แล้ว klink รับช่วงต่อ สิ่งที่มือใหม่พลาดบ่อยที่สุดคือการแจ้งล่วงหน้า (LPI) ซึ่งต้องยื่นเข้าระบบศุลกากรไทยทุกเที่ยวเรือ ถ้าไม่มี ของถึงแล้วก็ยังเริ่มพิธีการไม่ได้ ส่วนหนังสือรับรองถิ่นกำเนิดจะขอยากขึ้นหลังส่งของแล้ว จึงต้องทำพร้อมกันในขั้นนี้",
      en: "The brand's job ends here and klink takes over. What beginners miss most is the pre-notification (LPI): it has to be filed into the Thai customs system for every shipment, and without it clearance does not start even after the goods land. The certificate of origin also gets difficult to obtain after shipping, so it is handled here too.",
    },
    does: [
      {
        actor: "brand",
        text: {
          ko: "상업송장과 포장명세서를 발행한다 — 수량이 실물과 정확히 같아야 한다",
          th: "ออกอินวอยซ์การค้าและแพ็คกิ้งลิสต์ โดยจำนวนต้องตรงกับของจริงทุกประการ",
          en: "Issue the commercial invoice and packing list — the quantities must match the goods exactly",
        },
      },
      {
        actor: "kr",
        text: {
          ko: "수출신고를 한다. 수출신고필증이 부가세 영세율 증빙이자 관세환급 신청의 근거다",
          th: "ยื่นใบขนสินค้าขาออก ซึ่งใบขนนี้เป็นหลักฐานภาษีมูลค่าเพิ่มอัตราศูนย์ และเป็นฐานในการขอคืนอากร",
          en: "File the export declaration — the certificate is both the zero-rated VAT evidence and the basis for a duty refund claim",
        },
      },
      {
        actor: "kr",
        text: {
          ko: "선적 완료 전에 Form AK를 신청한다. 놓쳤으면 선적일로부터 1년 안에 소급발급을 받는다",
          th: "ขอ Form AK ก่อนการส่งออกเสร็จสิ้น หากพลาดให้ขอออกย้อนหลังภายใน 1 ปีนับจากวันส่งออก",
          en: "Apply for Form AK before shipment completes; if that is missed, obtain a retroactive one within a year of the shipment date",
        },
      },
      {
        actor: "kr",
        text: {
          ko: "인코텀즈에 맞춰 적하보험을 들고, 목재 팔레트를 쓰면 열처리 마크를 확인한다",
          th: "ทำประกันภัยสินค้าตามอินโคเทอมส์ และหากใช้พาเลทไม้ให้ตรวจเครื่องหมายอบความร้อน",
          en: "Take out cargo insurance per the Incoterm, and if wooden pallets are used, check the heat-treatment mark",
        },
      },
      {
        actor: "th",
        text: {
          ko: "선적 건마다 수입 사전신고(LPI)를 국가단일창구에 올린다",
          th: "ยื่นแจ้งนำเข้ารายเที่ยว (LPI) เข้าระบบ National Single Window ทุกเที่ยว",
          en: "File the per-shipment import notification (LPI) on the National Single Window",
        },
      },
    ],
    docs: [
      { ko: "상업송장 (Invoice)", th: "อินวอยซ์การค้า (Invoice)", en: "Commercial invoice" },
      { ko: "포장명세서 (Packing List)", th: "แพ็คกิ้งลิสต์ (Packing List)", en: "Packing list" },
      { ko: "수출신고필증", th: "ใบขนสินค้าขาออก", en: "Export declaration certificate" },
      { ko: "원산지증명서 (Form AK)", th: "หนังสือรับรองถิ่นกำเนิด (Form AK)", en: "Certificate of origin (Form AK)" },
      { ko: "선하증권 (B/L) 또는 항공운송장 (AWB)", th: "ใบตราส่ง (B/L) หรือ (AWB)", en: "Bill of lading (B/L) or air waybill (AWB)" },
      { ko: "적하보험증권", th: "กรมธรรม์ประกันภัยสินค้า", en: "Cargo insurance policy" },
      { ko: "수입 사전신고 (LPI)", th: "แจ้งนำเข้ารายเที่ยว (LPI)", en: "Per-shipment notification (LPI)" },
    ],
    takes: {
      ko: "FCL 해상 7~10일 · 항공 2~3일. LCL은 혼재와 분류가 붙어 창고까지 2~3주. LPI는 도착 2~3일 전까지 올리고 확인에 1~2일",
      th: "FCL ทางเรือ 7–10 วัน · ทางอากาศ 2–3 วัน ส่วน LCL ต้องรวมเวลารวมตู้และแยกตู้ รวมถึงคลังราว 2–3 สัปดาห์ และ LPI ยื่นก่อนของถึง 2–3 วัน ใช้เวลาตรวจ 1–2 วัน",
      en: "FCL: 7–10 days by sea, 2–3 by air. LCL adds consolidation and deconsolidation — 2–3 weeks to the warehouse. File the LPI 2–3 days before arrival; verification takes 1–2 days",
    },
    gate: {
      ko: "B/L(또는 AWB)을 받았고, Form AK가 발급됐고, LPI가 접수됐다",
      th: "ได้รับ B/L (หรือ AWB) แล้ว ได้ Form AK แล้ว และยื่น LPI เรียบร้อย",
      en: "The B/L (or AWB) is in hand, Form AK is issued, and the LPI is filed",
    },
    risk: {
      ko: "원료를 수입해 한국에서 담기만 한 제품은 한국산으로 인정되지 않을 수 있습니다 — 부가가치 40% 또는 세번변경 기준을 먼저 확인하세요. Form AK가 없으면 FTA 특혜세율 대신 일반세율을 냅니다. 인보이스 수량이 실물과 한 개만 달라도 통관이 멈춥니다.",
      th: "สินค้าที่นำเข้าวัตถุดิบมาแล้วเพียงบรรจุในเกาหลี อาจไม่ถือว่ามีถิ่นกำเนิดเกาหลี ต้องตรวจเกณฑ์มูลค่าเพิ่ม 40% หรือการเปลี่ยนพิกัดก่อน ถ้าไม่มี Form AK จะเสียอัตราปกติแทนอัตรา FTA และถ้าจำนวนในอินวอยซ์ต่างจากของจริงแม้ชิ้นเดียว พิธีการจะหยุดทันที",
      en: "A product whose inputs are imported and merely packed in Korea may not count as Korean origin — check the 40% value-content or tariff-change rule first. No Form AK means the general duty rate instead of the FTA rate. If the invoice count differs from the goods by even one unit, clearance stops.",
    },
    watch: [
      {
        ko: "원본 B/L을 우편으로 보내면 배보다 늦게 도착해 물건을 못 찾는다. 서렌더나 해상화물운송장을 쓴다",
        th: "ถ้าส่ง B/L ต้นฉบับทางไปรษณีย์ อาจถึงช้ากว่าเรือจนรับของไม่ได้ ให้ใช้เซอร์เรนเดอร์หรือ Sea Waybill แทน",
        en: "An original B/L couriered separately can arrive after the vessel and block release — use a telex release or a sea waybill",
      },
      {
        ko: "싱가포르·포트클랑을 거치면 직접운송원칙을 입증해야 FTA 세율을 받는다. 환적 경로가 적힌 서류를 챙긴다",
        th: "หากผ่านสิงคโปร์หรือปอร์ตกลัง ต้องพิสูจน์หลักการขนส่งโดยตรงจึงจะได้อัตรา FTA ให้เก็บเอกสารที่ระบุเส้นทางถ่ายลำไว้",
        en: "Routing via Singapore or Port Klang means proving direct consignment to keep the FTA rate — keep documents showing the transhipment route",
      },
      {
        ko: "부산에서 방콕까지는 열대 항로다. 컨테이너 안이 뜨거워지고 결로가 생기니 건조제와 라이닝을 넣는다",
        th: "เส้นทางปูซาน–กรุงเทพฯ ผ่านเขตร้อน ภายในตู้จะร้อนและเกิดหยดน้ำ จึงควรใส่สารดูดความชื้นและวัสดุกันชื้น",
        en: "Busan to Bangkok is a tropical run — the box gets hot and sweats, so add desiccant and lining",
      },
      {
        ko: "소량이면 LCL이 된다. 운임은 싸지만 혼재 대기와 도착지 CFS 비용이 붙는다",
        th: "ปริมาณน้อยจะเป็น LCL ค่าระวางถูกกว่าแต่ต้องรอรวมตู้ และมีค่า CFS ที่ปลายทาง",
        en: "Small volumes ship LCL — cheaper freight, but you wait for consolidation and pay CFS charges at destination",
      },
    ],
    lanes: {
      goods: { ko: "배·비행기 위 — 아직 재고 아님", th: "อยู่บนเรือหรือเครื่องบิน ยังไม่ใช่สต็อก", en: "On the vessel — not stock yet" },
      paper: { ko: "인보이스 · PL · Form AK · B/L · LPI", th: "อินวอยซ์ · PL · Form AK · B/L · LPI", en: "Invoice, PL, Form AK, B/L, LPI" },
      money: { ko: "운임·보험 지출 · 브랜드는 환급 신청", th: "จ่ายค่าระวางและประกัน · แบรนด์ยื่นขอคืนภาษี", en: "Freight and insurance paid; the brand files for refunds" },
    },
    basis: {
      ko: "한-아세안 FTA 원산지 규정과 소급발급·직접운송원칙 · 태국 FDA 수입 사전신고(LPI) 제도 · 수출 부가세 영세율과 관세환급",
      th: "กฎถิ่นกำเนิด FTA อาเซียน–เกาหลี รวมถึงการออกย้อนหลังและหลักการขนส่งโดยตรง · ระบบ LPI ของ อย. · ภาษีมูลค่าเพิ่มอัตราศูนย์และการคืนอากรของเกาหลี",
      en: "ASEAN–Korea FTA origin rules including retroactive issuance and direct consignment · the Thai FDA LPI system · Korean zero-rated export VAT and duty drawback",
    },
    record: {
      tab: "fin",
      what: {
        ko: "물류비와 보험료를 지출로 적는다. 재고는 창고에 들어온 날 잡는다",
        th: "บันทึกค่าขนส่งและค่าประกันเป็นรายจ่าย ส่วนสต็อกรับเข้าวันที่ของเข้าคลังจริง",
        en: "Book freight and insurance as expenses; stock is received on the day it reaches the warehouse",
      },
    },
    handoff: true,
  },
  {
    id: "import",
    no: "07",
    phase: "ship",
    where: "th",
    title: { ko: "통관 · 입고", th: "พิธีการนำเข้า · รับเข้าคลัง", en: "Customs and receiving" },
    lead: {
      ko: "세금을 내고 검사를 통과시켜 창고에 넣는다",
      th: "ชำระภาษี ผ่านการตรวจ แล้วนำเข้าคลัง",
      en: "Pay the taxes, pass inspection, and put it in the warehouse",
    },
    plain: {
      ko: "수입신고를 하면 세관이 초록선과 빨간선으로 나눕니다. 초록선이면 세금만 내고 바로 나가고, 빨간선이면 서류를 더 내고 화물을 열어 봅니다. 세금은 물건값에 운임과 보험을 더한 금액(CIF)에 관세를 얹고, 그 합계에 부가세를 붙입니다. 인허가 주체가 klink이므로 여기서 막힐 위험을 브랜드가 지지 않습니다.",
      th: "เมื่อยื่นใบขนสินค้าขาเข้า ศุลกากรจะแบ่งเป็นช่องเขียวกับช่องแดง ช่องเขียวคือชำระภาษีแล้วปล่อยของ ช่องแดงต้องยื่นเอกสารเพิ่มและเปิดตรวจสินค้า ภาษีคิดจากราคาสินค้ารวมค่าระวางและประกัน (CIF) บวกอากรขาเข้า แล้วคิด VAT จากยอดรวมนั้น เนื่องจากผู้ถือใบอนุญาตคือ klink ความเสี่ยงที่จะติดตรงนี้จึงไม่ตกกับแบรนด์",
      en: "File the import declaration and customs sorts it into a green line or a red line. Green means pay and go; red means more documents and a physical inspection. Tax is computed on goods plus freight and insurance (CIF), duty is added, and VAT is charged on that total. Because klink holds the licence, the brand carries none of the risk of being stuck here.",
    },
    does: [
      {
        actor: "th",
        text: {
          ko: "수입신고를 하고 FDA 확인과 세관 검사를 받는다",
          th: "ยื่นใบขนสินค้าขาเข้า ผ่านการตรวจของ อย. และศุลกากร",
          en: "File the import declaration and clear FDA and customs inspection",
        },
      },
      {
        actor: "th",
        text: {
          ko: "관세와 부가세를 내고, 해당되면 소비세(음료 설탕세)도 낸다",
          th: "ชำระอากรและภาษีมูลค่าเพิ่ม และหากเข้าข่ายให้ชำระภาษีสรรพสามิต (ภาษีความหวานสำหรับเครื่องดื่ม)",
          en: "Pay duty and VAT, plus excise (the beverage sugar tax) where it applies",
        },
      },
      {
        actor: "th",
        text: {
          ko: "창고에 입고하고 로트와 유통기한을 그 자리에서 기록한다",
          th: "รับเข้าคลัง และบันทึกล็อตกับวันหมดอายุทันที",
          en: "Receive into the warehouse and record lot and expiry on the spot",
        },
      },
    ],
    docs: [
      { ko: "수입신고서", th: "ใบขนสินค้าขาเข้า", en: "Import declaration" },
      { ko: "인보이스 · 패킹리스트", th: "อินวอยซ์ · แพ็คกิ้งลิสต์", en: "Invoice and packing list" },
      { ko: "B/L 또는 AWB", th: "B/L หรือ AWB", en: "B/L or AWB" },
      { ko: "อย. 등록번호", th: "เลขสารบบอาหาร", en: "อย. registration number" },
      { ko: "원산지증명서 (Form AK)", th: "หนังสือรับรองถิ่นกำเนิด (Form AK)", en: "Certificate of origin (Form AK)" },
    ],
    takes: {
      ko: "초록선이면 2~5일. 빨간선이면 검사 결과에 따라 더 걸린다",
      th: "ช่องเขียว 2–5 วัน ช่องแดงนานกว่านั้นขึ้นกับผลตรวจ",
      en: "2–5 days on the green line; longer on the red line depending on the inspection",
    },
    gate: {
      ko: "물건이 창고에 들어왔고 로트와 유통기한이 시스템에 적혔다",
      th: "ของเข้าคลังแล้ว และบันทึกล็อตกับวันหมดอายุในระบบแล้ว",
      en: "The goods are in the warehouse and lot and expiry are in the system",
    },
    risk: {
      ko: "부가세 7%는 2026년 9월 30일까지의 한시 세율이고 표준세율은 10%입니다 — 그 이후를 지금 원가에 반영해 두세요. 로트와 유통기한을 안 적으면 몇 달 뒤 임박 재고를 찾을 방법이 없습니다. 수입 식품에서 돈이 가장 크게 새는 곳입니다.",
      th: "อัตรา VAT 7% เป็นอัตราลดชั่วคราวถึง 30 กันยายน 2569 อัตราปกติคือ 10% จึงควรสะท้อนไว้ในต้นทุนตั้งแต่ตอนนี้ และถ้าไม่บันทึกล็อตกับวันหมดอายุ อีกไม่กี่เดือนจะหาสินค้าใกล้หมดอายุไม่เจอ ซึ่งเป็นจุดที่เงินรั่วมากที่สุดของสินค้านำเข้า",
      en: "The 7% VAT is a temporary rate running to 30 September 2026; the standard rate is 10% — build that into the cost model now. Skip the lot and expiry and there is no way to find near-expiry stock months later, which is where imported food loses the most money.",
    },
    watch: [
      {
        ko: "무료 기간이 지나면 체선료·지체료가 하루 단위로 붙는다. 서류 하나 때문에 며칠 서면 그게 곧 비용이다",
        th: "เมื่อพ้นระยะปลอดค่าใช้จ่าย ค่าเดมเมอร์เรจและค่าดีเทนชันจะคิดเป็นรายวัน ติดเพราะเอกสารใบเดียวไม่กี่วันก็กลายเป็นต้นทุนทันที",
        en: "Once free time runs out, demurrage and detention accrue daily — a few days stuck over one document is a direct cost",
      },
      {
        ko: "빨간선으로 빠지면 검사비와 샘플 시험비가 따로 나온다. 원가에 없던 항목이다",
        th: "หากถูกจัดเข้าช่องแดง จะมีค่าตรวจและค่าทดสอบตัวอย่างเพิ่มต่างหาก ซึ่งไม่ได้อยู่ในต้นทุนที่คำนวณไว้",
        en: "A red-line routing adds inspection and sample-testing fees that were never in the cost sheet",
      },
      {
        ko: "관세·부가세 말고도 터미널 비용, 통관수수료, 내륙운송이 붙는다. 아래 원가 표에 다 적어 뒀다",
        th: "นอกจากอากรและ VAT ยังมีค่าท่าเรือ ค่าดำเนินพิธีการ และค่าขนส่งในประเทศ ดูรายการทั้งหมดในตารางต้นทุนด้านล่าง",
        en: "Beyond duty and VAT come terminal charges, brokerage and inland haulage — all of them are in the cost table above",
      },
    ],
    lanes: {
      goods: { ko: "항구 → 창고. 여기서부터 재고", th: "จากท่าเรือเข้าคลัง เริ่มนับเป็นสต็อกตรงนี้", en: "Port to warehouse — stock starts here" },
      paper: { ko: "수입신고서 · อย. 번호 · Form AK", th: "ใบขนสินค้าขาเข้า · เลข อย. · Form AK", en: "Import declaration, อย. number, Form AK" },
      money: { ko: "관세 + 부가세 (+ 소비세)", th: "อากร + VAT (+ ภาษีสรรพสามิต)", en: "Duty + VAT (+ excise)" },
    },
    basis: {
      ko: "태국 관세청 전자통관(초록선·빨간선) · 부가세 한시세율 7% (2026-09-30까지) · 음료 설탕세",
      th: "ระบบพิธีการอิเล็กทรอนิกส์ของกรมศุลกากร (ช่องเขียว/ช่องแดง) · VAT อัตราลด 7% ถึง 30 ก.ย. 2569 · ภาษีความหวานในเครื่องดื่ม",
      en: "Thai e-customs green/red channels · reduced 7% VAT through 30 Sep 2026 · beverage sugar tax",
    },
    record: {
      tab: "stock",
      what: {
        ko: "입고(사유: 수입)로 잡고 로트·유통기한을 함께 적는다. 관세·물류비는 재무에 적는다",
        th: "รับเข้าสต็อก (เหตุผล: นำเข้า) พร้อมล็อตและวันหมดอายุ ส่วนอากรและค่าขนส่งบันทึกในการเงิน",
        en: "Book a stock-in (reason: import) with lot and expiry; log duty and freight under Finance",
      },
    },
  },
  {
    id: "sell",
    no: "08",
    phase: "sell",
    where: "th",
    title: { ko: "유통 · 판매", th: "กระจายสินค้า · ขาย", en: "Distribution and sales" },
    lead: {
      ko: "매대에 올리고 수요를 같이 만든다",
      th: "วางขายหน้าร้าน พร้อมสร้างดีมานด์ไปด้วย",
      en: "Get it on shelves and create the demand for it",
    },
    plain: {
      ko: "물건이 있는 것과 팔리는 것은 다릅니다. 입점과 인플루언서 시딩을 같이 돌립니다. 다만 효능이나 건강상 이점을 말하려면 광고를 미리 FDA에 내서 심의를 받아야 합니다 — 심의 없이 말하면 그 자체가 위반입니다.",
      th: "มีของวางขายกับขายได้จริงเป็นคนละเรื่อง เราจึงเดินงานเข้าร้านควบคู่กับการซีดดิ้งอินฟลูเอนเซอร์ แต่หากจะกล่าวถึงสรรพคุณหรือประโยชน์ต่อสุขภาพ ต้องยื่นโฆษณาให้ อย. พิจารณาก่อน การพูดโดยไม่ผ่านการพิจารณาถือเป็นความผิดในตัวเอง",
      en: "Having stock is not selling it, so listings and influencer seeding run together. But any claim about benefits or health effects must be submitted to the FDA for prior review — saying it without approval is itself the violation.",
    },
    does: [
      {
        actor: "th",
        text: {
          ko: "도매·리테일에 입점하고 소량 발주를 받아 준다",
          th: "เข้าร้านค้าส่งและค้าปลีก พร้อมรับออร์เดอร์จำนวนน้อย",
          en: "Land wholesale and retail listings and accept small orders",
        },
      },
      {
        actor: "th",
        text: {
          ko: "인플루언서 시딩과 라이브커머스를 돌리고, 광고 문구는 심의 범위 안에서만 쓴다",
          th: "เดินงานซีดดิ้งและไลฟ์คอมเมิร์ซ โดยใช้ข้อความโฆษณาเฉพาะที่อยู่ในขอบเขตที่ได้รับอนุมัติ",
          en: "Run seeding and live commerce, keeping copy inside what has been approved",
        },
      },
      {
        actor: "th",
        text: {
          ko: "판매 출고를 기록하고 재고 회전과 유통기한을 같이 본다",
          th: "บันทึกการเบิกขาย และดูอัตราหมุนเวียนสต็อกคู่กับวันหมดอายุ",
          en: "Book sales stock-outs and watch turnover against expiry",
        },
      },
    ],
    docs: [
      { ko: "거래 조건표", th: "ตารางเงื่อนไขการค้า", en: "Trade terms sheet" },
      { ko: "제품 이미지 · 상세페이지", th: "ภาพสินค้า · หน้ารายละเอียด", en: "Product images and detail page" },
      { ko: "광고 심의 승인본", th: "โฆษณาที่ได้รับอนุมัติ", en: "Approved advertising copy" },
      { ko: "할랄 인증 (채널이 요구하면)", th: "ใบรับรองฮาลาล (หากช่องทางขายกำหนด)", en: "Halal certificate (if the channel asks)" },
    ],
    takes: { ko: "상시", th: "ดำเนินการต่อเนื่อง", en: "Ongoing" },
    gate: {
      ko: "끝나는 단계가 아닙니다. 재고가 유통기한보다 빨리 도는지가 판단 기준입니다",
      th: "ไม่ใช่ขั้นที่จบลง ตัวชี้วัดคือสต็อกหมุนเร็วกว่าวันหมดอายุหรือไม่",
      en: "This stage does not end. The measure is whether stock turns faster than it expires",
    },
    risk: {
      ko: "건강 효능은 광고 사전 심의를 받은 범위 안에서만 말할 수 있습니다. 인플루언서에게 주는 가이드에도 이 선을 넣으세요 — 남이 대신 한 말도 우리 광고로 봅니다.",
      th: "การกล่าวถึงประโยชน์ต่อสุขภาพทำได้เฉพาะภายในขอบเขตที่ได้รับอนุมัติล่วงหน้า ต้องใส่ข้อจำกัดนี้ในไกด์ไลน์ที่ให้อินฟลูเอนเซอร์ด้วย เพราะคำพูดของคนอื่นก็ถือเป็นโฆษณาของเรา",
      en: "Health benefits may only be stated inside what was pre-approved. Put that limit in the influencer brief too — what someone else says on our behalf still counts as our advertising.",
    },
    lanes: {
      goods: { ko: "창고 → 매대 · 인플루언서", th: "จากคลังไปหน้าร้านและอินฟลูเอนเซอร์", en: "Warehouse to shelf and influencers" },
      paper: { ko: "거래 조건표 · 광고 심의 승인본", th: "เงื่อนไขการค้า · โฆษณาที่อนุมัติ", en: "Trade terms, approved ad copy" },
      money: { ko: "매출이 들어오기 시작", th: "เริ่มมีรายได้เข้ามา", en: "Revenue starts coming in" },
    },
    basis: {
      ko: "태국 식품법 제40·41조 광고 사전 심의 · 할랄은 CICOT 인증(의무 아님)",
      th: "มาตรา 40 และ 41 พ.ร.บ. อาหาร เรื่องการพิจารณาโฆษณาล่วงหน้า · ฮาลาลออกโดย CICOT (ไม่บังคับ)",
      en: "Food Act sections 40–41 on prior advertising review · Halal via CICOT (not mandatory)",
    },
    record: {
      tab: "stock",
      what: {
        ko: "재고 탭에 판매 출고를 적으면 매출도 재무에 함께 올라간다. 시딩은 인플루언서 탭에 적는다",
        th: "บันทึกการเบิกขายในแท็บสต็อก แล้วยอดขายจะขึ้นในแท็บการเงินให้ด้วย ส่วนซีดดิ้งบันทึกในแท็บอินฟลูเอนเซอร์",
        en: "Record a sale under Stock and the revenue lands in Finance with it; seeding goes under Influencers",
      },
    },
  },
  {
    id: "settle",
    no: "09",
    phase: "sell",
    where: "th",
    title: { ko: "정산", th: "เคลียร์ยอด", en: "Settlement" },
    lead: {
      ko: "판 만큼 계산해서 브랜드에 보낸다",
      th: "คิดตามยอดที่ขายได้ แล้วโอนให้แบรนด์",
      en: "Work out what sold and pay the brand",
    },
    plain: {
      ko: "매출에서 수수료와 비용을 빼고 브랜드 몫을 송금합니다. 장부는 바트 하나로 적으므로, 원화로 보냈어도 그날 실제로 빠져나간 바트를 적습니다 — 은행 명세와 맞아야 합니다.",
      th: "หักค่าคอมมิชชั่นและค่าใช้จ่ายจากยอดขาย แล้วโอนส่วนของแบรนด์ บัญชีบันทึกเป็นบาทสกุลเดียว แม้จะโอนเป็นวอน ก็ให้ลงยอดบาทที่ตัดออกจริงในวันนั้น เพื่อให้ตรงกับใบแจ้งยอดธนาคาร",
      en: "Deduct commission and costs from revenue and remit the brand's share. The books are in baht alone, so even a won transfer is logged as the baht that actually left that day — it has to match the bank statement.",
    },
    does: [
      {
        actor: "th",
        text: {
          ko: "월 매출과 비용을 집계한다",
          th: "รวมยอดขายและค่าใช้จ่ายรายเดือน",
          en: "Total the month's revenue and costs",
        },
      },
      {
        actor: "kr",
        text: {
          ko: "수수료와 월 피를 반영한 정산서를 브랜드에 보낸다",
          th: "ส่งใบสรุปยอดที่หักคอมมิชชั่นและค่ารายเดือนแล้วให้แบรนด์",
          en: "Send the brand a statement with commission and monthly fee applied",
        },
      },
      {
        actor: "th",
        text: {
          ko: "송금하고 빠져나간 바트 금액과 영수증을 남긴다",
          th: "โอนเงิน พร้อมบันทึกยอดบาทที่ตัดออกและเก็บหลักฐานไว้",
          en: "Remit, recording the baht that left and keeping the receipt on file",
        },
      },
    ],
    docs: [
      { ko: "정산서", th: "ใบสรุปยอด", en: "Settlement statement" },
      { ko: "송금 증빙", th: "หลักฐานการโอนเงิน", en: "Remittance proof" },
      { ko: "세금계산서", th: "ใบกำกับภาษี", en: "Tax invoice" },
    ],
    takes: { ko: "매월", th: "ทุกเดือน", en: "Monthly" },
    gate: {
      ko: "브랜드가 정산 금액을 확인했고 송금이 끝났다",
      th: "แบรนด์ยืนยันยอดแล้ว และโอนเงินเรียบร้อย",
      en: "The brand has confirmed the amount and the transfer is done",
    },
    risk: {
      ko: "정산·수수료 항목에는 반드시 브랜드사를 달아 두세요 — 상대가 없는 정산 기록은 몇 달 뒤 누구 것인지 알 수 없습니다. 원화로 청구받았더라도 장부에는 실제로 송금한 바트 금액을 적습니다.",
      th: "รายการเคลียร์ยอดกับค่าคอมมิชชั่นต้องผูกแบรนด์ไว้เสมอ เพราะรายการที่ไม่มีคู่สัญญา อีกไม่กี่เดือนจะไม่รู้ว่าเป็นของใคร และแม้จะถูกเรียกเก็บเป็นเงินวอน ให้บันทึกยอดบาทที่โอนจริง",
      en: "Always attach the brand to settlement and commission entries — an entry with no counterparty is unidentifiable a few months on. Even when billed in won, record the baht you actually transferred.",
    },
    lanes: {
      paper: { ko: "정산서 · 송금 증빙", th: "ใบสรุปยอด · หลักฐานการโอน", en: "Statement, remittance proof" },
      money: { ko: "매출 − 수수료 − 비용 → 브랜드", th: "รายได้ − คอมมิชชั่น − ค่าใช้จ่าย → แบรนด์", en: "Revenue − commission − costs → brand" },
    },
    basis: {
      ko: "규정이 아니라 계약 조건 — 장부는 바트 하나로 적으므로 송금한 바트 금액이 근거가 된다",
      th: "ไม่ใช่ข้อกฎหมาย แต่เป็นเงื่อนไขตามสัญญา บัญชีบันทึกเป็นบาทสกุลเดียว ยอดบาทที่โอนจึงเป็นหลักฐาน",
      en: "Not a regulation but a contract term — the books are kept in baht alone, so the baht transferred is what they rest on",
    },
    record: {
      tab: "fin",
      what: {
        ko: "정산·수수료 분류로 적고 브랜드사를 달아 둔다. 금액은 실제 송금한 바트로 적는다",
        th: "บันทึกในหมวดเคลียร์ยอด/คอมมิชชั่น พร้อมผูกแบรนด์ และกรอกยอดเป็นบาทที่โอนจริง",
        en: "Log under settlement or commission with the brand attached, in the baht actually transferred",
      },
    },
  },
  {
    id: "keep",
    no: "10",
    phase: "sell",
    where: "th",
    title: { ko: "사후관리 · 갱신", th: "ดูแลหลังขาย · ต่ออายุ", en: "Aftercare and renewals" },
    lead: {
      ko: "허가는 만료되고, 물건은 가끔 회수해야 한다",
      th: "ใบอนุญาตมีวันหมดอายุ และบางครั้งต้องเรียกสินค้าคืน",
      en: "Licences expire, and sometimes goods have to come back",
    },
    plain: {
      ko: "앞의 아홉 단계는 한 번 팔릴 때까지의 길입니다. 이 단계는 끝나지 않고 계속 도는 일입니다 — 허가를 만료 전에 갱신하고, 문제가 생긴 로트를 회수하고, 세금을 매달 신고합니다. 로트와 유통기한을 07단계에서 적어 두는 이유가 여기에 있습니다. 회수는 로트 단위로 하는데, 어느 로트가 어디로 갔는지 모르면 매대에 있는 것을 전부 빼야 합니다.",
      th: "เก้าขั้นก่อนหน้าคือเส้นทางจนขายได้ครั้งแรก ส่วนขั้นนี้ไม่มีวันจบและต้องทำต่อเนื่อง คือต่ออายุใบอนุญาตก่อนหมดอายุ เรียกคืนล็อตที่มีปัญหา และยื่นภาษีทุกเดือน เหตุผลที่ต้องบันทึกล็อตและวันหมดอายุตั้งแต่ขั้นที่ 07 อยู่ตรงนี้ เพราะการเรียกคืนทำเป็นล็อต หากไม่รู้ว่าล็อตไหนไปที่ใด ก็ต้องเก็บของออกจากชั้นวางทั้งหมด",
      en: "The nine stages before this are the road to a first sale. This one never finishes: licences get renewed before they lapse, bad lots get pulled, taxes get filed every month. This is why lot and expiry are recorded back at stage 07 — a recall runs by lot, and not knowing where a lot went means clearing every shelf instead of one.",
    },
    does: [
      {
        actor: "th",
        text: {
          ko: "อ.7은 3년, 광고 심의는 5년 만기다. 만료 두 달 전에 갱신을 건다",
          th: "อ.7 มีอายุ 3 ปี และการอนุมัติโฆษณา 5 ปี ให้เริ่มต่ออายุก่อนหมดสองเดือน",
          en: "The Or.7 runs three years and an advertising approval five — start the renewal two months before either lapses",
        },
      },
      {
        actor: "th",
        text: {
          ko: "라벨·성분·제조사가 바뀌면 팔기 전에 변경 신고를 넣는다. 승인된 도안과 다른 라벨은 승인받지 않은 라벨이다",
          th: "หากฉลาก ส่วนผสม หรือผู้ผลิตเปลี่ยน ต้องยื่นแก้ไขก่อนวางขาย ฉลากที่ต่างจากอาร์ตเวิร์กที่อนุมัติถือว่าไม่ได้รับอนุมัติ",
          en: "When the label, formula or manufacturer changes, file the amendment before selling — a label that differs from the approved artwork is an unapproved label",
        },
      },
      {
        actor: "th",
        text: {
          ko: "회수가 필요하면 로트로 범위를 잡고 FDA에 알린 뒤 거래처에서 거둬들인다",
          th: "หากต้องเรียกคืน ให้กำหนดขอบเขตเป็นล็อต แจ้ง อย. แล้วเก็บสินค้าคืนจากคู่ค้า",
          en: "If a recall is needed, scope it by lot, notify the FDA, and collect it back from the trade",
        },
      },
      {
        actor: "th",
        text: {
          ko: "부가세는 매달 PP.30으로 신고한다. 수입할 때 낸 부가세는 여기서 매입세액으로 돌려받는다",
          th: "ยื่น ภ.พ.30 ทุกเดือน ภาษีซื้อจาก VAT ที่จ่ายตอนนำเข้าจะถูกเครดิตคืนตรงนี้",
          en: "File PP.30 monthly — the VAT paid at import is reclaimed here as input tax",
        },
      },
      {
        actor: "brand",
        text: {
          ko: "원산지 사후검증 요청이 오면 생산 기록과 원가 자료를 낸다. 증빙은 5년 보관이다",
          th: "หากมีคำขอตรวจสอบถิ่นกำเนิดย้อนหลัง ให้ส่งบันทึกการผลิตและข้อมูลต้นทุน หลักฐานต้องเก็บ 5 ปี",
          en: "If an origin verification lands, supply the production records and cost data — the evidence is kept for five years",
        },
      },
    ],
    docs: [
      { ko: "갱신 신청서", th: "คำขอต่ออายุ", en: "Renewal application" },
      { ko: "변경 신고서", th: "คำขอแก้ไขรายการ", en: "Amendment filing" },
      { ko: "회수 기록 (로트별)", th: "บันทึกการเรียกคืน (รายล็อต)", en: "Recall record (by lot)" },
      { ko: "부가세 신고서 (PP.30)", th: "แบบแสดงรายการ ภ.พ.30", en: "VAT return (PP.30)" },
      { ko: "원산지 증빙 보관본", th: "หลักฐานถิ่นกำเนิดที่เก็บไว้", en: "Retained origin evidence" },
    ],
    takes: { ko: "상시 — 세금은 매달, 갱신은 3년·5년 주기", th: "ต่อเนื่อง — ภาษีทุกเดือน ต่ออายุทุก 3 ปีและ 5 ปี", en: "Ongoing — tax monthly, renewals on a three- and five-year cycle" },
    gate: {
      ko: "끝나는 단계가 아닙니다. 만료일이 달력에 들어가 있고 로트가 추적되면 됩니다",
      th: "ไม่ใช่ขั้นที่จบลง ขอเพียงวันหมดอายุอยู่ในปฏิทินและตามล็อตได้",
      en: "This stage does not end. It is in order when the expiry dates are on a calendar and lots can be traced",
    },
    risk: {
      ko: "อ.7이 만료되면 그날부터 수입이 멈춥니다. 갱신은 심사가 붙는 절차라 만료 당일에 넣으면 늦습니다. 그리고 회수를 로트로 못 좁히면 그 브랜드 물건 전량을 빼야 하므로, 07단계에서 로트를 안 적은 대가가 여기서 한 번에 나옵니다.",
      th: "หาก อ.7 หมดอายุ การนำเข้าจะหยุดตั้งแต่วันนั้นทันที การต่ออายุมีขั้นตอนพิจารณา หากยื่นในวันที่หมดอายุถือว่าช้าไปแล้ว และหากจำกัดขอบเขตการเรียกคืนเป็นล็อตไม่ได้ ก็ต้องถอนสินค้าของแบรนด์นั้นออกทั้งหมด ราคาของการไม่บันทึกล็อตในขั้นที่ 07 จะมาเรียกเก็บที่นี่ทีเดียว",
      en: "The day the Or.7 lapses, importing stops. Renewal goes through review, so filing on the expiry date is already late. And a recall that cannot be narrowed to a lot means pulling every unit of that brand — the price of skipping lot numbers at stage 07 arrives here, all at once.",
    },
    watch: [
      {
        ko: "창고 주소를 옮기면 허가를 다시 봐야 한다. อ.7은 회사가 아니라 주소에 붙어 있다",
        th: "หากย้ายที่อยู่คลังสินค้า ต้องดำเนินการกับใบอนุญาตใหม่ เพราะ อ.7 ผูกกับที่อยู่ ไม่ใช่ตัวบริษัท",
        en: "Moving the warehouse means revisiting the licence — the Or.7 attaches to the address, not the company",
      },
      {
        ko: "취급 품목이 늘면 อ.7 변경 신청을 먼저 넣는다. 리스트에 없는 품목은 그 허가로 못 들여온다",
        th: "หากเพิ่มรายการสินค้า ต้องยื่นแก้ไข อ.7 ก่อน สินค้าที่ไม่อยู่ในรายการนำเข้าด้วยใบอนุญาตนั้นไม่ได้",
        en: "Adding items means amending the Or.7 first — anything not on the list cannot come in under it",
      },
      {
        ko: "유통기한 임박 재고는 폐기해도 장부에서 사라지지 않는다. 폐기 기록을 남겨야 비용으로 인정된다",
        th: "สินค้าใกล้หมดอายุแม้จะทำลายทิ้ง ก็ไม่หายไปจากบัญชีเอง ต้องมีบันทึกการทำลายจึงจะถือเป็นค่าใช้จ่ายได้",
        en: "Near-expiry stock does not leave the books just because it was thrown away — the disposal has to be recorded to count as a cost",
      },
    ],
    lanes: {
      goods: { ko: "회수 시 매대 → 창고", th: "เมื่อเรียกคืน จากชั้นวางกลับเข้าคลัง", en: "Shelf back to warehouse on a recall" },
      paper: { ko: "갱신 · 변경 · 회수 기록", th: "การต่ออายุ · การแก้ไข · บันทึกเรียกคืน", en: "Renewals, amendments, recall records" },
      money: { ko: "매달 부가세 신고 · 갱신 수수료", th: "ยื่น VAT ทุกเดือน · ค่าธรรมเนียมต่ออายุ", en: "Monthly VAT filing, renewal fees" },
    },
    basis: {
      ko: "อ.7 3년 유효기간과 변경 신청 · 광고 승인 유효기간 최대 5년 · 태국 부가세 월 신고(PP.30) · FTA 원산지 증빙 5년 보관",
      th: "อายุ 3 ปีของ อ.7 และการยื่นแก้ไข · การอนุมัติโฆษณามีอายุไม่เกิน 5 ปี · การยื่น ภ.พ.30 รายเดือน · การเก็บหลักฐานถิ่นกำเนิด FTA 5 ปี",
      en: "The three-year Or.7 term and its amendments · advertising approval valid up to five years · monthly Thai VAT returns (PP.30) · five-year FTA origin record-keeping",
    },
    record: {
      tab: "stock",
      what: {
        ko: "회수·폐기는 재고 탭에 사유를 달아 출고로 잡는다. 갱신 수수료와 세금은 재무 탭에 적는다",
        th: "การเรียกคืนและการทำลายให้ตัดสต็อกพร้อมระบุเหตุผล ส่วนค่าธรรมเนียมต่ออายุและภาษีบันทึกในแท็บการเงิน",
        en: "Book recalls and disposals as stock-outs with a reason; renewal fees and tax go under Finance",
      },
    },
  },
];

/**
 * 창고에 물건이 놓일 때까지 붙는 돈.
 *
 * 초보자가 원가를 틀리는 방식은 늘 같다 — 물건값과 관세만 세고 나머지를 빠뜨린다.
 * 그래서 관세·부가세보다 터미널 비용과 지체료가 더 크게 물릴 때가 있다. 순서대로
 * 쌓아 보여 주고, 세금이 어느 금액을 기준으로 계산되는지를 중간에 끊어 표시한다.
 */
export interface CostGroup {
  key: string;
  title: T;
  /** 이 묶음이 끝나는 자리에서 무슨 금액이 만들어지는지. */
  makes?: T;
  items: { label: T; note: T }[];
}

export const COST_GROUPS: CostGroup[] = [
  {
    key: "cif",
    title: { ko: "물건이 배에 실릴 때까지", th: "จนกว่าสินค้าจะขึ้นเรือ", en: "Until the goods are loaded" },
    makes: {
      ko: "여기까지의 합이 CIF — 태국 세금은 이 금액부터 계산합니다",
      th: "ผลรวมถึงจุดนี้คือ CIF ภาษีของไทยคำนวณจากยอดนี้",
      en: "The total so far is CIF — Thai tax is computed from this figure",
    },
    items: [
      {
        label: { ko: "물건값", th: "ค่าสินค้า", en: "Goods value" },
        note: {
          ko: "브랜드에 지급하는 매입가",
          th: "ราคาซื้อที่จ่ายให้แบรนด์",
          en: "The purchase price paid to the brand",
        },
      },
      {
        label: { ko: "국내 운송 · 수출 통관", th: "ขนส่งในประเทศ · พิธีการส่งออก", en: "Inland haulage and export clearance" },
        note: {
          ko: "인코텀즈에 따라 브랜드가 낼 수도, klink가 낼 수도 있다",
          th: "ขึ้นกับอินโคเทอมส์ว่าแบรนด์หรือ klink เป็นผู้จ่าย",
          en: "Falls on the brand or on klink depending on the Incoterm",
        },
      },
      {
        label: { ko: "국제 운임", th: "ค่าระวางระหว่างประเทศ", en: "International freight" },
        note: {
          ko: "FCL이냐 LCL이냐, 해상이냐 항공이냐로 크게 갈린다",
          th: "ต่างกันมากตาม FCL หรือ LCL และทางเรือหรือทางอากาศ",
          en: "Varies widely between FCL and LCL, sea and air",
        },
      },
      {
        label: { ko: "적하보험", th: "ประกันภัยสินค้า", en: "Cargo insurance" },
        note: {
          ko: "안 들면 운송 중 손상은 전액 손실이다",
          th: "ถ้าไม่ทำ ความเสียหายระหว่างขนส่งจะสูญทั้งหมด",
          en: "Without it, transit damage is a total loss",
        },
      },
    ],
  },
  {
    key: "tax",
    title: { ko: "세금", th: "ภาษี", en: "Taxes" },
    makes: {
      ko: "부가세는 CIF에 관세를 더한 금액에 붙습니다 — 운임을 빼고 계산하면 모자랍니다",
      th: "VAT คิดจาก CIF บวกอากร หากคำนวณโดยไม่รวมค่าระวางจะขาด",
      en: "VAT applies to CIF plus duty — leave freight out and the figure comes up short",
    },
    items: [
      {
        label: { ko: "관세", th: "อากรขาเข้า", en: "Import duty" },
        note: {
          ko: "HS 코드와 Form AK 유무로 정해진다",
          th: "กำหนดตามพิกัดศุลกากรและการมี Form AK หรือไม่",
          en: "Set by the HS code and whether Form AK is present",
        },
      },
      {
        label: { ko: "소비세 (해당 시)", th: "ภาษีสรรพสามิต (ถ้าเข้าข่าย)", en: "Excise (where it applies)" },
        note: {
          ko: "당분 든 음료의 설탕세 등. 품목이 걸리면 원가가 눈에 띄게 오른다",
          th: "เช่น ภาษีความหวานของเครื่องดื่ม หากสินค้าเข้าข่าย ต้นทุนจะสูงขึ้นชัดเจน",
          en: "Such as the sugar tax on drinks — where it bites, the cost moves visibly",
        },
      },
      {
        label: { ko: "부가세", th: "ภาษีมูลค่าเพิ่ม", en: "VAT" },
        note: {
          ko: "지금은 7%지만 2026년 9월 30일까지의 한시 세율이다",
          th: "ขณะนี้ 7% แต่เป็นอัตราลดชั่วคราวถึง 30 กันยายน 2569",
          en: "7% today, but that is a reduced rate running only to 30 September 2026",
        },
      },
    ],
  },
  {
    key: "local",
    title: { ko: "태국에서 창고까지", th: "จากท่าเรือถึงคลังในไทย", en: "From the port to the warehouse" },
    items: [
      {
        label: { ko: "터미널 · 서류 비용", th: "ค่าท่าเรือ · ค่าเอกสาร", en: "Terminal and documentation charges" },
        note: {
          ko: "THC, D/O, LCL이면 CFS 비용까지. 견적에서 가장 자주 빠진다",
          th: "THC, D/O และหากเป็น LCL ยังมีค่า CFS ด้วย เป็นรายการที่ตกหล่นจากใบเสนอราคาบ่อยที่สุด",
          en: "THC, D/O, and CFS if LCL — the line most often missing from a quote",
        },
      },
      {
        label: { ko: "통관 수수료", th: "ค่าดำเนินพิธีการศุลกากร", en: "Customs brokerage" },
        note: {
          ko: "관세사·포워더에 지급",
          th: "จ่ายให้ตัวแทนออกของหรือผู้รับจัดการขนส่ง",
          en: "Paid to the broker or forwarder",
        },
      },
      {
        label: { ko: "내륙운송 · 창고 입고", th: "ขนส่งในประเทศ · รับเข้าคลัง", en: "Inland transport and receiving" },
        note: {
          ko: "여기까지 와야 재고로 잡는다",
          th: "ต้องถึงจุดนี้จึงนับเป็นสต็อก",
          en: "Only at this point does it become stock",
        },
      },
    ],
  },
  {
    key: "delay",
    title: { ko: "늦어지면 붙는 것", th: "ค่าใช้จ่ายเมื่อล่าช้า", en: "What delay adds" },
    items: [
      {
        label: { ko: "체선료 · 지체료", th: "ค่าเดมเมอร์เรจ · ค่าดีเทนชัน", en: "Demurrage and detention" },
        note: {
          ko: "무료 기간이 지나면 하루 단위로 쌓인다. 서류 하나 때문에 서는 날이 곧 돈이다",
          th: "เมื่อพ้นระยะปลอดค่าใช้จ่ายจะคิดเป็นรายวัน วันที่ติดเพราะเอกสารใบเดียวคือเงินที่เสียไป",
          en: "Accrues daily once free time ends — a day stuck over one document is money",
        },
      },
      {
        label: { ko: "검사 · 시험 비용", th: "ค่าตรวจ · ค่าทดสอบ", en: "Inspection and testing" },
        note: {
          ko: "빨간선으로 빠지거나 샘플 검사를 받으면 나온다",
          th: "เกิดขึ้นเมื่อถูกจัดเข้าช่องแดงหรือถูกสุ่มตรวจตัวอย่าง",
          en: "Charged when the shipment goes red line or samples are pulled",
        },
      },
    ],
  },
];

/**
 * 전체가 몇 달인지.
 *
 * 단계마다 기간은 적혀 있었지만 합은 어디에도 없었다. 브랜드 담당자가 가장 먼저
 * 묻는 것이 "그래서 언제부터 팔려요"인데 그 답이 화면에 없으면, 단계를 아무리
 * 잘 써 놔도 읽는 사람은 자기 머리로 아홉 개를 더한다. 그리고 그 덧셈은 틀린다 —
 * 03과 04가 같이 돌기 때문이다.
 */
export interface Route {
  title: T;
  span: T;
  body: T;
}

export const ROUTES: Route[] = [
  {
    title: { ko: "빠른 쪽", th: "เส้นทางเร็ว", en: "The fast route" },
    span: { ko: "약 4개월", th: "ราว 4 เดือน", en: "about 4 months" },
    body: {
      ko: "일반식품·라벨부착식품·표준식품이면 제품 등록 자체는 이틀입니다. 그래도 라벨 사전승인 60일이 남아서, 검토·계약 3주 + 등록·라벨 9주 + 생산 4주 + 선적·통관 3주가 됩니다. 시장 검증은 이 안에서 같이 돕니다.",
      th: "หากเป็นอาหารทั่วไป อาหารที่ต้องมีฉลาก หรืออาหารกำหนดคุณภาพ การขึ้นทะเบียนใช้เพียงสองวัน แต่ยังเหลือการอนุมัติฉลาก 60 วัน รวมแล้วคือ ตรวจสอบและทำสัญญา 3 สัปดาห์ + ขึ้นทะเบียนและฉลาก 9 สัปดาห์ + ผลิต 4 สัปดาห์ + ส่งและผ่านพิธีการ 3 สัปดาห์ โดยการทดสอบตลาดเดินคู่ขนานอยู่ในช่วงนี้",
      en: "For general, labelled or standardised food the registration itself takes two days — but the 60-day label approval remains. That gives three weeks of screening and contract, nine of registration and label, four of production, three of shipping and clearance, with the market test running inside it.",
    },
  },
  {
    title: { ko: "느린 쪽", th: "เส้นทางช้า", en: "The slow route" },
    span: { ko: "7~8개월", th: "7–8 เดือน", en: "7–8 months" },
    body: {
      ko: "구체적 통제식품이면 제품 등록만 35~90영업일입니다. 여기에 라벨 승인이 겹쳐 허가 단계에서만 다섯 달 안팎이 걸립니다. 01단계에서 갈래를 잘못 잡으면 이 길로 두 달 걸어간 뒤 처음으로 돌아옵니다.",
      th: "หากเป็นอาหารควบคุมเฉพาะ เฉพาะการขึ้นทะเบียนก็ใช้ 35–90 วันทำการ เมื่อรวมกับการอนุมัติฉลาก เฉพาะขั้นขออนุญาตก็กินเวลาราวห้าเดือน หากชี้กลุ่มผิดตั้งแต่ขั้นที่ 01 จะเดินไปทางนี้สองเดือนแล้วต้องกลับมาเริ่มใหม่",
      en: "Specifically controlled food takes 35–90 working days to register on its own. With the label approval overlapping it, the permit phase alone runs to roughly five months. Misplacing the group at stage 01 means walking two months down this road and starting over.",
    },
  },
];

export interface Term {
  term: T;
  body: T;
}

/**
 * 처음 보면 못 알아듣는 말만 모은다. 아는 말을 설명하면 모르는 말이 묻힌다.
 */
export const TERMS: Term[] = [
  {
    term: { ko: "อ.7 (Or.7)", th: "อ.7", en: "Or.7 (อ.7)" },
    body: {
      ko: "판매 목적으로 식품을 수입할 수 있는 허가. 태국 안의 창고 주소에 붙고 승인 전에 FDA가 그 주소를 실사합니다. 3년마다 갱신하며, 취급 품목이 늘면 변경 신청을 해야 합니다.",
      th: "ใบอนุญาตนำหรือสั่งอาหารเข้ามาในราชอาณาจักรเพื่อจำหน่าย ผูกกับที่อยู่คลังสินค้าในไทย และ อย. จะเข้าตรวจก่อนอนุมัติ ต่ออายุทุก 3 ปี และหากเพิ่มรายการสินค้าต้องยื่นแก้ไข",
      en: "The licence to import food for sale. It attaches to a warehouse address in Thailand and the FDA inspects it before approval. Renewed every three years, and amended when items are added.",
    },
  },
  {
    term: { ko: "สบ.3/1 (Sor Bor 3/1)", th: "สบ.3/1", en: "Sor Bor 3/1 (สบ.3/1)" },
    body: {
      ko: "라벨 사전승인. 신청이 통과되면 식품일련번호(อย.)와 라벨 사용 허가가 함께 나옵니다. 승인까지 대략 60일 걸려 일정에서 가장 긴 조각입니다.",
      th: "การอนุมัติฉลากล่วงหน้า เมื่อผ่านแล้วจะได้เลขสารบบอาหารพร้อมสิทธิ์ใช้ฉลาก ใช้เวลาราว 60 วัน จึงเป็นช่วงที่ยาวที่สุดในตารางงาน",
      en: "Label pre-approval. Once granted, the food serial number and permission to use the label come together. It takes about 60 days — the longest single piece of the schedule.",
    },
  },
  {
    term: { ko: "ฆอ. (광고 사전승인)", th: "ฆอ. (อนุญาตโฆษณาอาหาร)", en: "ฆอ. (food advertising approval)" },
    body: {
      ko: "식품 광고 사전승인. 효능·품질·특성(สรรพคุณ)을 말하는 광고에만 필요하고, 제품 사진·가격·구매처나 섭취방법 같은 사실 기술은 대상이 아닙니다. 반대로 영양강조표시와 건강강조표시, 그리고 라벨에 승인된 범위를 넘어서는 말은 전부 승인을 받아야 합니다. 그래서 04단계에서 라벨에 무엇을 넣어 두었는지가 나중에 마케팅에서 쓸 수 있는 말의 범위를 정합니다.",
      th: "การขออนุญาตโฆษณาอาหาร จำเป็นเฉพาะเมื่อโฆษณากล่าวถึงสรรพคุณ คุณภาพ หรือคุณประโยชน์ ส่วนภาพสินค้า ราคา ช่องทางซื้อ หรือวิธีรับประทาน ซึ่งเป็นการบอกข้อเท็จจริง ไม่เข้าข่าย ในทางกลับกัน การกล่าวอ้างทางโภชนาการ การกล่าวอ้างทางสุขภาพ และข้อความที่เกินขอบเขตที่ฉลากได้รับอนุมัติ ต้องขออนุญาตทั้งหมด สิ่งที่ใส่ไว้บนฉลากในขั้นที่ 04 จึงเป็นตัวกำหนดว่าจะพูดอะไรได้ในการตลาดภายหลัง",
      en: "Food advertising approval. It is needed only where the advertising speaks to efficacy, quality or properties (สรรพคุณ) — product photos, price, where to buy and factual directions for use fall outside it. Nutrition claims, health claims and anything beyond what the label already carries all need approval. That is why what goes on the label at stage 04 decides what may be said in marketing later.",
    },
  },
  {
    term: { ko: "อย. (Or.Yor.)", th: "อย.", en: "อย. (Or.Yor.)" },
    body: {
      ko: "태국 식약청과, 그곳이 발급하는 식품일련번호. 소비자가 패키지에서 보는 번호이고 수입자 명의로 나옵니다. 패키지·광고·수입신고서에 적힌 번호가 모두 같아야 합니다.",
      th: "สำนักงานคณะกรรมการอาหารและยา และเลขสารบบอาหารที่ออกให้ เป็นเลขที่ผู้บริโภคเห็นบนบรรจุภัณฑ์ ออกในนามผู้นำเข้า และเลขบนบรรจุภัณฑ์ สื่อโฆษณา และใบขนสินค้าต้องตรงกันทั้งหมด",
      en: "The Thai FDA, and the food serial number it issues. It is what consumers see on the pack, it is issued in the importer's name, and the same number must appear on pack, marketing and customs declaration.",
    },
  },
  {
    term: { ko: "LPI (수입 사전신고)", th: "LPI (แจ้งนำเข้ารายเที่ยว)", en: "LPI (licence per invoice)" },
    body: {
      ko: "선적 건마다 내는 수입 사전신고. 국가단일창구(NSW)나 FDA 전자물류에 도착 2~3일 전까지 올리고 확인에 1~2일 걸립니다. 허가가 아니라 통보이지만, 이게 없으면 통관이 시작되지 않습니다.",
      th: "การแจ้งนำเข้าต่อหนึ่งอินวอยซ์ ยื่นผ่าน NSW หรือระบบ e-Logistics ของ อย. ก่อนของถึง 2–3 วัน และใช้เวลาตรวจ 1–2 วัน ไม่ใช่ใบอนุญาตแต่เป็นการแจ้ง อย่างไรก็ตามถ้าไม่มี พิธีการจะไม่เริ่ม",
      en: "The per-shipment import notification. Filed on the National Single Window or the FDA e-Logistics system 2–3 days before arrival, verified in 1–2 days. It is a notice rather than a permit, but clearance does not start without it.",
    },
  },
  {
    term: { ko: "식품 4분류", th: "อาหารสี่กลุ่ม", en: "The four food groups" },
    body: {
      ko: "일반식품(등록 불필요), 라벨부착식품과 표준식품(약 2영업일·수수료 낮음), 구체적 통제식품(35~90영업일·수수료 높음). 어디에 속하느냐로 전체 일정이 결정되므로 01단계에서 가장 먼저 가릅니다.",
      th: "อาหารทั่วไป (ไม่ต้องขึ้นทะเบียน) อาหารที่ต้องมีฉลากและอาหารกำหนดคุณภาพ (ราว 2 วันทำการ ค่าธรรมเนียมต่ำ) และอาหารควบคุมเฉพาะ (35–90 วันทำการ ค่าธรรมเนียมสูง) กลุ่มที่สินค้าตกอยู่กำหนดตารางงานทั้งหมด จึงต้องชี้ตั้งแต่ขั้นที่ 01",
      en: "General food (no registration), labelled and standardised food (about two working days, low fee), and specifically controlled food (35–90 working days, higher fee). The group decides the whole schedule, which is why stage 01 settles it first.",
    },
  },
  {
    term: { ko: "자유판매증명서 (CFS)", th: "หนังสือรับรองการจำหน่ายเสรี (CFS)", en: "Certificate of Free Sale (CFS)" },
    body: {
      ko: "이 제품이 한국에서 합법적으로 팔리고 있다는 증명. 한국 식약처에 온라인으로 신청해 발급받습니다. 영업허가증 사본, 품목제조보고서 사본, 영문 시험성적서가 필요하고, 수출 실적 증빙을 요구받는 경우가 있습니다. 그런데 이 증명서는 04단계에서 필요하고 수출신고는 06단계라서, 요건을 먼저 확인해 두지 않으면 여기서 순서가 꼬입니다.",
      th: "หนังสือรับรองว่าสินค้านี้จำหน่ายอย่างถูกกฎหมายในเกาหลี ยื่นขอออนไลน์กับ MFDS ของเกาหลี ต้องใช้สำเนาใบอนุญาตประกอบกิจการ สำเนารายงานการผลิตผลิตภัณฑ์ และผลตรวจฉบับภาษาอังกฤษ บางกรณีอาจถูกขอหลักฐานการส่งออกด้วย แต่เอกสารนี้ต้องใช้ในขั้นที่ 04 ขณะที่ใบขนสินค้าขาออกเกิดในขั้นที่ 06 หากไม่ตรวจเงื่อนไขไว้ก่อน ลำดับงานจะพันกันตรงนี้",
      en: "Proof that the product is legally sold in Korea, applied for online with Korea's MFDS. It needs the business licence copy, the product manufacturing report and an English lab report, and proof of an actual export is sometimes asked for. Since the certificate is needed at stage 04 while the export declaration only exists at stage 06, checking the requirement early is what keeps the order from tangling.",
    },
  },
  {
    term: {
      ko: "제조품질증명서 (GMP · HACCP · ISO 22000)",
      th: "ใบรับรองมาตรฐานการผลิต (GMP · HACCP · ISO 22000)",
      en: "Production standard certificate (GMP, HACCP, ISO 22000)",
    },
    body: {
      ko: "공장이 정해진 기준으로 만든다는 증명. 태국 GMP·Codex GMP·HACCP·ISO 22000 또는 동등한 것을 인정합니다. 발급일로부터 1년 이내여야 하고, 온라인으로 확인되면 공증이 필요 없습니다.",
      th: "หลักฐานว่าโรงงานผลิตตามมาตรฐานที่กำหนด รับได้ทั้ง GMP ตามกฎหมายไทย GMP ของ Codex, HACCP, ISO 22000 หรือเทียบเท่า ต้องออกไม่เกิน 1 ปี และถ้าตรวจสอบออนไลน์ได้ก็ไม่ต้องรับรองสำเนา",
      en: "Evidence the factory works to a defined standard: Thai GMP, Codex GMP, HACCP, ISO 22000 or equivalent. It must be under a year old, and needs no notarisation if it can be verified online.",
    },
  },
  {
    term: { ko: "HS 코드", th: "พิกัดศุลกากร (HS Code)", en: "HS code" },
    body: {
      ko: "품목 분류 번호. 관세율이 이 번호로 정해지므로 처음에 잘못 잡으면 세금이 계속 틀립니다. 태국 식품 관세는 품목에 따라 크게 달라집니다.",
      th: "รหัสจัดประเภทสินค้า อัตราอากรกำหนดตามรหัสนี้ ถ้าจัดผิดตั้งแต่ต้น ภาษีจะผิดไปตลอด อัตราอากรอาหารของไทยต่างกันมากตามรายการสินค้า",
      en: "The tariff classification code. Duty follows from it, so getting it wrong at the start makes every later tax figure wrong. Thai food duty varies widely by item.",
    },
  },
  {
    term: { ko: "Form AK", th: "Form AK", en: "Form AK" },
    body: {
      ko: "한-아세안 FTA 원산지증명서. 세관이나 대한상공회의소가 발급하고, 선적이 끝나기 전에 신청하는 것이 원칙입니다. 놓쳤으면 선적일로부터 1년 안에 “ISSUED RETROACTIVELY” 표시로 소급발급을 받을 수 있습니다. 부가가치 40% 또는 세번변경 같은 원산지 기준을 만족해야 하고, 제3국을 거치면 직접운송원칙을 입증해야 특혜세율이 유지됩니다.",
      th: "หนังสือรับรองถิ่นกำเนิดภายใต้ FTA อาเซียน–เกาหลี ออกโดยศุลกากรหรือหอการค้าเกาหลี โดยหลักต้องยื่นก่อนการส่งออกเสร็จสิ้น หากพลาดสามารถขอออกย้อนหลังภายใน 1 ปีนับจากวันส่งออก โดยระบุ “ISSUED RETROACTIVELY” ต้องผ่านเกณฑ์ถิ่นกำเนิด เช่น มูลค่าเพิ่ม 40% หรือการเปลี่ยนพิกัด และหากผ่านประเทศที่สามต้องพิสูจน์หลักการขนส่งโดยตรงจึงจะคงสิทธิ์อัตราพิเศษไว้ได้",
      en: "The ASEAN–Korea FTA certificate of origin, issued by customs or the Korea Chamber of Commerce, normally applied for before shipment completes. If that is missed it can be issued retroactively within a year of the shipment date, marked “ISSUED RETROACTIVELY”. It requires an origin rule such as 40% value content or a tariff change, and if the cargo passes through a third country, direct consignment has to be proven to keep the preferential rate.",
    },
  },
  {
    term: { ko: "인코텀즈 (Incoterms)", th: "อินโคเทอมส์ (Incoterms)", en: "Incoterms" },
    body: {
      ko: "운임과 보험을 누가 어디까지 내고, 물건이 망가졌을 때 그 위험이 어디서 넘어가는지를 정한 국제 약속. FOB 부산이면 배에 실릴 때까지가 브랜드, 그 뒤가 klink입니다. 이걸 안 정하면 사고가 났을 때 비로소 다투게 됩니다.",
      th: "ข้อตกลงสากลที่กำหนดว่าใครจ่ายค่าระวางและประกันถึงจุดใด และความเสี่ยงในสินค้าโอนที่จุดไหน เช่น FOB ปูซาน หมายถึงแบรนด์รับผิดชอบจนสินค้าขึ้นเรือ หลังจากนั้นเป็นของ klink ถ้าไม่กำหนดไว้ จะมาเถียงกันตอนเกิดเหตุ",
      en: "The international shorthand for who pays freight and insurance up to which point, and where risk in the goods passes. FOB Busan means the brand carries it until loading and klink after that. Leave it undefined and the argument starts only once something goes wrong.",
    },
  },
  {
    term: { ko: "적하보험", th: "ประกันภัยสินค้า", en: "Cargo insurance" },
    body: {
      ko: "운송 중 손상·분실을 보상하는 보험. 인코텀즈에 따라 브랜드가 들 수도, klink가 들 수도 있습니다. 아무도 안 들었는데 컨테이너가 물에 젖으면 그 물량은 전액 손실입니다.",
      th: "ประกันที่ชดเชยความเสียหายหรือสูญหายระหว่างขนส่ง ผู้ทำประกันเป็นแบรนด์หรือ klink ขึ้นกับอินโคเทอมส์ หากไม่มีใครทำแล้วสินค้าในตู้เปียกน้ำ ล็อตนั้นสูญทั้งหมด",
      en: "Cover for damage or loss in transit. Depending on the Incoterm it is taken out by the brand or by klink. If nobody took it out and the container gets wet, that shipment is a write-off.",
    },
  },
  {
    term: { ko: "체선료 · 지체료", th: "ค่าเดมเมอร์เรจ · ค่าดีเทนชัน", en: "Demurrage and detention" },
    body: {
      ko: "체선료는 컨테이너가 항구 안에 무료 기간을 넘겨 있을 때, 지체료는 항구 밖으로 가져간 컨테이너를 제때 반납하지 않을 때 붙습니다. 무료 기간은 며칠뿐이라, 통관이 서류 하나 때문에 며칠 밀리면 그 자체가 비용입니다.",
      th: "ค่าเดมเมอร์เรจเกิดเมื่อตู้อยู่ในท่าเกินระยะปลอดค่าใช้จ่าย ส่วนค่าดีเทนชันเกิดเมื่อนำตู้ออกไปแล้วคืนไม่ทันกำหนด ระยะปลอดค่าใช้จ่ายมีเพียงไม่กี่วัน หากพิธีการล่าช้าเพราะเอกสารใบเดียว นั่นคือต้นทุนทันที",
      en: "Demurrage runs when a container sits inside the port past its free time; detention runs when a container taken out is not returned on time. Free time is only a few days, so clearance stalled by one document is itself a cost.",
    },
  },
  {
    term: { ko: "FCL · LCL", th: "FCL · LCL", en: "FCL and LCL" },
    body: {
      ko: "컨테이너 한 대를 통째로 쓰면 FCL, 남의 화물과 나눠 쓰면 LCL입니다. 소량은 LCL이 싸지만 혼재를 기다리고 도착지에서 화물을 나누는 시간과 비용(CFS)이 붙어, 문 앞까지 걸리는 시간은 오히려 깁니다.",
      th: "ใช้ตู้ทั้งตู้คือ FCL แบ่งกับสินค้าของผู้อื่นคือ LCL ปริมาณน้อยใช้ LCL ถูกกว่า แต่ต้องรอรวมตู้และมีเวลากับค่าใช้จ่ายในการแยกตู้ที่ปลายทาง (CFS) เวลาถึงหน้าประตูจึงนานกว่า",
      en: "A whole container to yourself is FCL; sharing one is LCL. Small volumes are cheaper on LCL, but you wait for consolidation and pay to have the load broken out at destination (CFS), so door-to-door time is actually longer.",
    },
  },
  {
    term: { ko: "서렌더 B/L", th: "เซอร์เรนเดอร์ B/L", en: "Telex release" },
    body: {
      ko: "원본 선하증권을 우편으로 보내는 대신 선사가 도착지에 전산으로 인도를 지시하는 방식. 원본을 기다리다 배보다 늦게 도착하면 물건을 못 찾고 그동안 체선료가 쌓이므로, 서로 믿는 거래에서는 이 방식을 씁니다.",
      th: "แทนที่จะส่ง B/L ต้นฉบับทางไปรษณีย์ สายเรือจะแจ้งปลายทางทางระบบให้ปล่อยสินค้า หากรอต้นฉบับแล้วมาถึงช้ากว่าเรือ จะรับของไม่ได้และเกิดค่าเดมเมอร์เรจสะสม คู่ค้าที่ไว้ใจกันจึงใช้วิธีนี้",
      en: "Instead of couriering the original bill of lading, the carrier instructs release at destination electronically. Waiting on an original that arrives after the vessel means the goods sit and demurrage builds, so trusted trades use this.",
    },
  },
  {
    term: { ko: "관세환급 · 부가세 영세율", th: "การคืนอากร · VAT อัตราศูนย์", en: "Duty drawback and zero-rated VAT" },
    body: {
      ko: "한국에서 수출하면 부가세가 0%로 적용되고, 수입 원재료에 낸 관세는 돌려받을 수 있습니다. 둘 다 수출신고필증이 근거이고, 중소기업은 간이정액환급(FOB 금액 × 환급률)을 쓸 수 있습니다. 브랜드가 놓치기 쉬운 실제 현금입니다.",
      th: "การส่งออกจากเกาหลีได้ VAT อัตราศูนย์ และอากรที่จ่ายไปกับวัตถุดิบนำเข้าขอคืนได้ ทั้งสองอย่างใช้ใบขนสินค้าขาออกเป็นหลักฐาน และ SME สามารถใช้วิธีคืนอากรแบบเหมาจ่าย (มูลค่า FOB × อัตราคืน) เป็นเงินสดจริงที่แบรนด์มักมองข้าม",
      en: "Exporting from Korea is zero-rated for VAT, and duty paid on imported inputs can be reclaimed. Both rest on the export declaration certificate, and smaller firms can use the simplified fixed-rate drawback (FOB value × refund rate). Real cash that brands routinely leave on the table.",
    },
  },
  {
    term: { ko: "인보이스 · 패킹리스트", th: "อินวอยซ์ · แพ็คกิ้งลิสต์", en: "Invoice and packing list" },
    body: {
      ko: "무엇을 몇 개 얼마에 보내는지(인보이스), 몇 박스에 어떻게 담았는지(패킹리스트). 세관이 세금을 계산하는 근거이므로 실제 물건과 한 글자도 달라선 안 됩니다.",
      th: "อินวอยซ์ระบุว่าส่งอะไร จำนวนเท่าใด ราคาเท่าใด ส่วนแพ็คกิ้งลิสต์ระบุว่าบรรจุกี่กล่องอย่างไร ศุลกากรใช้คำนวณภาษี จึงต้องตรงกับของจริงทุกตัวอักษร",
      en: "The invoice says what, how many and at what price; the packing list says how it is boxed. Customs computes tax from them, so they must match the goods exactly.",
    },
  },
  {
    term: { ko: "B/L · AWB", th: "B/L · AWB", en: "B/L · AWB" },
    body: {
      ko: "배(B/L)나 비행기(AWB)로 화물을 실었다는 증서. 이게 있어야 도착지에서 물건을 찾습니다.",
      th: "เอกสารรับขนสินค้าทางเรือ (B/L) หรือทางอากาศ (AWB) ต้องมีจึงจะรับของที่ปลายทางได้",
      en: "The carrier's receipt for the cargo, by sea (B/L) or air (AWB). Without it the goods cannot be collected at destination.",
    },
  },
  {
    term: { ko: "CIF", th: "CIF", en: "CIF" },
    body: {
      ko: "물건값에 운임과 보험료를 더한 금액. 태국은 이 금액을 기준으로 관세를 매기고, 여기에 관세를 더한 합계에 부가세를 붙입니다. 원가를 계산할 때 운임을 빼먹으면 세금이 모자랍니다.",
      th: "ราคาสินค้ารวมค่าระวางและค่าประกัน ไทยคิดอากรจากยอดนี้ แล้วคิด VAT จากยอดที่รวมอากรแล้ว ถ้าคำนวณต้นทุนโดยลืมค่าระวาง ภาษีจะขาด",
      en: "Goods value plus freight and insurance. Thai duty is assessed on it, and VAT is charged on that total including duty. Leave freight out of a cost calculation and the tax comes up short.",
    },
  },
  {
    term: { ko: "초록선 · 빨간선", th: "ช่องเขียว · ช่องแดง", en: "Green line / red line" },
    body: {
      ko: "태국 세관이 수입 건을 가르는 방식. 초록선은 세금만 내고 바로 반출, 빨간선은 서류를 더 내고 화물을 열어 봅니다. 서류가 깔끔할수록 초록선으로 갑니다.",
      th: "วิธีที่ศุลกากรไทยแบ่งรายการนำเข้า ช่องเขียวคือชำระภาษีแล้วปล่อยของ ช่องแดงต้องยื่นเอกสารเพิ่มและเปิดตรวจ ยิ่งเอกสารเรียบร้อย ยิ่งได้ช่องเขียว",
      en: "How Thai customs sorts an import. Green means pay and release; red means extra documents and a physical inspection. Cleaner paperwork means green.",
    },
  },
  {
    term: { ko: "설탕세 (소비세)", th: "ภาษีความหวาน (สรรพสามิต)", en: "Sugar tax (excise)" },
    body: {
      ko: "당분이 든 음료에 관세·부가세와 별도로 붙는 세금. 100ml당 당분 함량 구간에 따라 리터당 세율이 정해지고, 2025년 4월 마지막 단계가 시행되며 한 번 더 올랐습니다. 음료를 다룰 때는 원가에 미리 넣으세요.",
      th: "ภาษีที่เก็บจากเครื่องดื่มที่มีน้ำตาล นอกเหนือจากอากรและ VAT อัตราคิดต่อลิตรตามช่วงปริมาณน้ำตาลต่อ 100 มล. และขึ้นอีกครั้งเมื่อระยะสุดท้ายมีผลในเดือนเมษายน 2568 หากทำสินค้าเครื่องดื่มต้องใส่ในต้นทุนตั้งแต่ต้น",
      en: "A tax on sugary drinks on top of duty and VAT. The rate is per litre, banded by grams of sugar per 100 ml, and rose again when the final phase took effect in April 2025. Build it into the cost of any beverage.",
    },
  },
  {
    term: { ko: "로트 (Lot)", th: "ล็อต (Lot)", en: "Lot" },
    body: {
      ko: "같은 날 같은 조건으로 만든 묶음. 문제가 생기면 이 단위로 회수하므로, 입고할 때 로트와 유통기한을 반드시 같이 적습니다.",
      th: "กลุ่มสินค้าที่ผลิตวันเดียวกันภายใต้เงื่อนไขเดียวกัน หากมีปัญหาจะเรียกคืนเป็นล็อต จึงต้องบันทึกล็อตพร้อมวันหมดอายุตอนรับเข้าเสมอ",
      en: "A batch made on the same day under the same conditions. Recalls happen by lot, so lot and expiry are always recorded together at receiving.",
    },
  },
  {
    term: { ko: "시딩 (Seeding)", th: "ซีดดิ้ง (Seeding)", en: "Seeding" },
    body: {
      ko: "인플루언서에게 제품을 보내 후기를 만드는 일. 돈은 안 들어와도 물건은 나가므로, 이 시스템에서는 판매와 똑같이 출고로 잡습니다.",
      th: "การส่งสินค้าให้อินฟลูเอนเซอร์เพื่อให้เกิดรีวิว แม้ไม่มีรายได้เข้ามาแต่สินค้าออกไปจริง ระบบนี้จึงตัดสต็อกเหมือนการขาย",
      en: "Sending product to influencers to generate posts. No money comes in but goods go out, so this system books it as a stock-out just like a sale.",
    },
  },
];

export interface Source {
  label: T;
  url: string;
}

/**
 * 위 숫자와 서식 이름의 출처. 규정은 바뀌므로 링크를 남겨 둔다 — 이 화면이 틀렸을
 * 때 어디를 보고 고쳐야 하는지가 화면 안에 있어야 한다.
 */
export const SOURCES: Source[] = [
  {
    label: {
      ko: "태국 FDA — 식품 수입 절차",
      th: "อย. — ขั้นตอนการนำเข้าอาหาร",
      en: "Thai FDA — food importation",
    },
    url: "https://en.fda.moph.go.th/our-services-new/food-importation/",
  },
  {
    label: {
      ko: "태국 FDA — 식품 허가 신청 종류와 서식",
      th: "อย. — ประเภทคำขอและแบบฟอร์มด้านอาหาร",
      en: "Thai FDA — how to apply for permission on food",
    },
    url: "https://en.fda.moph.go.th/entrepreneurs-food/category/how-to-apply-for-permission-on-food/",
  },
  {
    label: {
      ko: "태국 FDA — 수입 절차와 LPI 등록",
      th: "อย. — ขั้นตอนนำเข้าและการลงทะเบียน LPI",
      en: "Thai FDA — importation steps and LPI registration",
    },
    url: "https://en.fda.moph.go.th/entrepreneurs-food/food-importation-01",
  },
  {
    label: {
      ko: "한국식품산업협회 — 태국 수출절차 및 수출정보",
      th: "สมาคมอุตสาหกรรมอาหารเกาหลี — ขั้นตอนส่งออกไปไทย",
      en: "Korea Food Industry Association — exporting to Thailand",
    },
    url: "https://www.kfia.or.kr/kfia/sub.php?menukey=1474",
  },
  {
    label: {
      ko: "식약처 — 수출 관련 증명서(자유판매증명서) 안내",
      th: "MFDS เกาหลี — ใบรับรองเพื่อการส่งออก (CFS)",
      en: "Korea MFDS — export certificates (CFS)",
    },
    url: "https://www.mfds.go.kr/brd/m_1155/list.do",
  },
  {
    label: {
      ko: "태국 FDA — 식품 광고 승인 신청 (e-Submission)",
      th: "อย. — การยื่นขออนุญาตโฆษณาอาหารผ่าน e-Submission",
      en: "Thai FDA — food advertising approval via e-Submission",
    },
    url: "https://food.fda.moph.go.th/e-submission-system/esub-002",
  },
  {
    label: {
      ko: "Tilleke & Gibbins — 라벨 고시 제450호 개정",
      th: "Tilleke & Gibbins — ประกาศฉลากฉบับที่ 450",
      en: "Tilleke & Gibbins — labelling Notification No. 450",
    },
    url: "https://www.tilleke.com/insights/thailand-updates-food-labeling-requirements/",
  },
  {
    label: {
      ko: "AMCHAM Thailand — 수입식품 증명서 요건 개정 (2025-01)",
      th: "AMCHAM Thailand — ข้อกำหนดใบรับรองอาหารนำเข้าฉบับปรับปรุง (ม.ค. 2568)",
      en: "AMCHAM Thailand — revised food import certificate requirements (Jan 2025)",
    },
    url: "https://www.amchamthailand.com/2025/01/21/amcham-food-agri-alert-thailands-acceptance-of-foreign-nutrition-facts-labels-2/",
  },
  {
    label: {
      ko: "주태국 대사관 — 대태국 수출 한-아세안 FTA 원산지증명서 유의사항",
      th: "สถานทูตเกาหลีประจำไทย — ข้อควรระวัง Form AK สำหรับส่งออกมาไทย",
      en: "Korean Embassy in Thailand — Form AK guidance for exports to Thailand",
    },
    url: "https://overseas.mofa.go.kr/th-ko/brd/m_3216/view.do?seq=983454",
  },
  {
    label: {
      ko: "DHL Thailand — 수입 사전신고(LPI) 안내",
      th: "DHL Thailand — คำอธิบาย License per Invoice",
      en: "DHL Thailand — licence per invoice explained",
    },
    url: "https://www.dhl.com/discover/en-th/logistics-advice/import-export-advice/licence-per-invoice-explained-for-thai-importers",
  },
  {
    label: {
      ko: "The Nation — 2026년 1월 1일 소액 수입품 과세 시행",
      th: "The Nation — เก็บภาษีสินค้านำเข้ามูลค่าต่ำ ตั้งแต่ 1 ม.ค. 2569",
      en: "The Nation — VAT and duty on low-value imports from 1 Jan 2026",
    },
    url: "https://www.nationthailand.com/business/economy/40059880",
  },
  {
    label: {
      ko: "PwC — 태국 부가세 (한시세율 7%)",
      th: "PwC — ภาษีมูลค่าเพิ่มของไทย (อัตราลด 7%)",
      en: "PwC — Thailand VAT (reduced 7% rate)",
    },
    url: "https://taxsummaries.pwc.com/thailand/corporate/other-taxes",
  },
  {
    label: {
      ko: "관세청 FTA 포털 — 원산지검증 개요와 증빙 보관 의무",
      th: "ศุลกากรเกาหลี FTA Portal — การตรวจสอบถิ่นกำเนิดและหน้าที่เก็บหลักฐาน",
      en: "Korea Customs FTA portal — origin verification and record-keeping",
    },
    url: "https://www.customs.go.kr/ftaportalkor/cm/cntnts/cntntsView.do?mi=3477&cntntsId=1121",
  },
  {
    label: {
      ko: "관세청 — 2025 FTA 빈번 민원 사례집 (소급발급 · 제3자 송장 · 직접운송)",
      th: "ศุลกากรเกาหลี — รวมกรณีสอบถาม FTA 2025 (ออกย้อนหลัง · อินวอยซ์บุคคลที่สาม · ขนส่งโดยตรง)",
      en: "Korea Customs — 2025 FTA frequent-enquiry casebook (retroactive C/O, third-party invoice, direct consignment)",
    },
    url: "https://www.customs.go.kr/upload/call/FTA.pdf",
  },
  {
    label: {
      ko: "관세청 유니패스 — 수출지원 관세환급 안내",
      th: "ศุลกากรเกาหลี UNI-PASS — การคืนอากรเพื่อการส่งออก",
      en: "Korea Customs UNI-PASS — export duty drawback",
    },
    url: "https://unipass.customs.go.kr/clip/ctensrch/openULS0401006Q.do",
  },
  {
    label: {
      ko: "ONE Thailand — 체선료·지체료 요율과 무료 기간",
      th: "ONE Thailand — อัตราค่าเดมเมอร์เรจ ค่าดีเทนชัน และระยะปลอดค่าใช้จ่าย",
      en: "ONE Thailand — detention and demurrage charges and free time",
    },
    url: "https://th.one-line.com/detention-and-demurrage-charges",
  },
  {
    label: {
      ko: "한국무역협회 — 수출입화물 목재포장재 검역 절차",
      th: "สมาคมการค้าระหว่างประเทศเกาหลี — การกักกันวัสดุบรรจุภัณฑ์ไม้",
      en: "KITA — quarantine procedure for wood packaging material",
    },
    url: "https://kita.net/mberJobSport/shippers/trnsBusiManual/transportMnl_1_4.do",
  },
  {
    label: {
      ko: "USDA FAS — 동물성 가공식품 축산국(DLD) 수입허가 요건",
      th: "USDA FAS — ข้อกำหนดใบอนุญาตนำเข้าอาหารแปรรูปจากสัตว์ของกรมปศุสัตว์",
      en: "USDA FAS — DLD import permit requirement for processed animal products",
    },
    url: "https://www.fas.usda.gov/data/thailand-new-thai-regulation-affecting-us-cooked-food-exports",
  },
  {
    label: {
      ko: "태국 국세청 — 부가세 등록과 월 신고 (PP.30)",
      th: "กรมสรรพากร — การจดทะเบียน VAT และการยื่น ภ.พ.30 รายเดือน",
      en: "Thai Revenue Department — VAT registration and monthly PP.30 filing",
    },
    url: "https://www.rd.go.th/english/6043.html",
  },
  {
    label: {
      ko: "USDA FAS — 태국 식품 수입 규정 연례 보고 (2025)",
      th: "USDA FAS — รายงานประจำปีกฎระเบียบนำเข้าอาหารของไทย (2025)",
      en: "USDA FAS — Thailand FAIRS annual report (2025)",
    },
    url: "https://apps.fas.usda.gov/newgainapi/api/Report/DownloadReportByFileName?fileName=FAIRS+Country+Report+Annual_Bangkok_Thailand_TH2025-0050.pdf",
  },
];

/** 화면 문구. 단계 글과 같은 파일에 둬야 세 언어가 같이 움직인다. */
export const F = {
  pageTitle: {
    ko: "수출입 업무 흐름",
    th: "ขั้นตอนการส่งออก–นำเข้า",
    en: "Export–import workflow",
  },
  pageLead: {
    ko: "한국 브랜드의 제품이 태국 매대에 오르기까지 열 단계입니다. 단계마다 누가 무엇을 하고, 무엇이 있어야 다음으로 넘어가는지 적어 뒀습니다. 물건·서류·돈이 각각 어디 있는지와 원가에 무엇이 붙는지는 단계 뒤에 표로 정리해 뒀습니다.",
    th: "จากสินค้าของแบรนด์เกาหลีจนถึงชั้นวางในไทย มีทั้งหมดสิบขั้น แต่ละขั้นระบุไว้ว่าใครทำอะไร และต้องมีอะไรจึงจะไปขั้นต่อไปได้ ส่วนตำแหน่งของสินค้า เอกสาร และเงิน รวมถึงต้นทุนที่บวกเพิ่ม สรุปเป็นตารางไว้ท้ายขั้นตอน",
    en: "Ten stages take a Korean brand's product onto a Thai shelf. Each one says who does what, and what has to exist before it moves on. Where the goods, the paperwork and the money each sit, and what gets added to the cost, are set out in tables after the stages.",
  },
  routesTitle: {
    ko: "전체 얼마나 걸리나",
    th: "ทั้งหมดใช้เวลาเท่าไร",
    en: "How long the whole thing takes",
  },
  routesLead: {
    ko: "단계를 순서대로 더하면 안 됩니다 — 시장 검증은 등록을 기다리는 동안 같이 돕니다. 갈리는 것은 01단계에서 정해지는 식품 갈래입니다.",
    th: "อย่านำระยะเวลาของแต่ละขั้นมาบวกกันตรง ๆ เพราะการทดสอบตลาดเดินคู่ขนานไปในช่วงที่รอขึ้นทะเบียน สิ่งที่ทำให้ต่างกันคือกลุ่มอาหารที่ชี้ไว้ในขั้นที่ 01",
    en: "Do not add the stages up in sequence — the market test runs while the registration is pending. What splits the two routes is the food group settled at stage 01.",
  },
  lblAlongside: {
    ko: "순서가 아니라 동시에",
    th: "ทำพร้อมกัน ไม่ใช่ตามลำดับ",
    en: "At the same time, not in sequence",
  },
  overview: { ko: "한눈에 보기", th: "ภาพรวม", en: "At a glance" },
  overviewHint: {
    ko: "단계를 누르면 그 설명으로 내려갑니다",
    th: "แตะที่ขั้นตอนเพื่อเลื่อนไปยังคำอธิบาย",
    en: "Tap a stage to jump to its description",
  },
  lanesTitle: {
    ko: "물건 · 서류 · 돈은 따로 움직입니다",
    th: "สินค้า เอกสาร และเงิน เคลื่อนไหวแยกกัน",
    en: "Goods, paper and money move separately",
  },
  lanesLead: {
    ko: "무역이 어려운 이유는 이 셋이 같이 안 다니기 때문입니다. 물건은 배 위에 있는데 서류는 이미 태국에 가 있고, 돈은 아직 안 나갔을 수 있습니다. 단계마다 셋이 각각 어디 있는지 봐 두면 헷갈리지 않습니다.",
    th: "การค้าระหว่างประเทศยากเพราะสามสิ่งนี้ไม่ได้ไปพร้อมกัน สินค้าอาจอยู่บนเรือ ขณะที่เอกสารถึงไทยแล้ว ส่วนเงินยังไม่ได้จ่าย ถ้าดูว่าแต่ละขั้นทั้งสามอยู่ตรงไหน ก็จะไม่สับสน",
    en: "Trade is confusing because these three do not travel together. The goods can be at sea while the paperwork is already in Thailand and the money has not moved at all. Track where each one is at each stage and it stops being confusing.",
  },
  laneGoods: { ko: "물건", th: "สินค้า", en: "Goods" },
  lanePaper: { ko: "서류", th: "เอกสาร", en: "Paper" },
  laneMoney: { ko: "돈", th: "เงิน", en: "Money" },
  prereqTitle: {
    ko: "처음 한 번만 — klink가 미리 갖춰 두는 것",
    th: "ทำครั้งเดียวตอนเริ่ม — สิ่งที่ klink เตรียมไว้ล่วงหน้า",
    en: "One time only — what klink has in place already",
  },
  prereqLead: {
    ko: "아래 네 가지는 브랜드마다 다시 하는 일이 아니라 klink가 한 번 해 두고 유지하는 것입니다. 브랜드는 손댈 일이 없습니다.",
    th: "สี่ข้อด้านล่างไม่ใช่สิ่งที่ต้องทำใหม่ทุกแบรนด์ แต่เป็นสิ่งที่ klink ทำไว้ครั้งเดียวและดูแลต่อเนื่อง แบรนด์ไม่ต้องยุ่งเลย",
    en: "The four items below are not repeated per brand — klink sets them up once and maintains them. The brand touches none of it.",
  },
  actorBrand: { ko: "브랜드", th: "แบรนด์", en: "Brand" },
  actorKr: { ko: "klink 한국", th: "klink เกาหลี", en: "klink Korea" },
  actorTh: { ko: "klink 태국", th: "klink ไทย", en: "klink Thailand" },
  whereKr: { ko: "한국", th: "เกาหลี", en: "Korea" },
  whereTh: { ko: "태국", th: "ไทย", en: "Thailand" },
  lblPlain: { ko: "쉽게 말하면", th: "พูดง่าย ๆ คือ", en: "In plain words" },
  lblDoes: { ko: "하는 일", th: "สิ่งที่ต้องทำ", en: "What gets done" },
  lblDocs: { ko: "필요한 서류", th: "เอกสารที่ต้องใช้", en: "Documents needed" },
  lblTakes: { ko: "걸리는 시간", th: "ระยะเวลา", en: "How long" },
  lblGate: {
    ko: "다음으로 넘어가는 조건",
    th: "เงื่อนไขไปขั้นถัดไป",
    en: "Ready for the next stage when",
  },
  lblRisk: { ko: "자주 막히는 곳", th: "จุดที่มักติด", en: "Where it usually gets stuck" },
  lblWatch: { ko: "실무 점검", th: "รายการตรวจหน้างาน", en: "Practitioner's checks" },
  costsTitle: {
    ko: "창고에 놓일 때까지 붙는 돈",
    th: "ต้นทุนทั้งหมดจนสินค้าเข้าคลัง",
    en: "What it costs to get it onto the shelf in our warehouse",
  },
  costsLead: {
    ko: "원가를 틀리는 방식은 늘 같습니다 — 물건값과 관세만 세고 나머지를 빠뜨립니다. 터미널 비용과 지체료가 관세보다 클 때도 있습니다.",
    th: "การคำนวณต้นทุนผิดมักเป็นแบบเดียวกัน คือคิดแค่ค่าสินค้ากับอากรแล้วลืมที่เหลือ บางครั้งค่าท่าเรือและค่าล่าช้ายังมากกว่าอากรเสียอีก",
    en: "Costing goes wrong the same way every time — count the goods and the duty, forget the rest. Terminal charges and delay fees can exceed the duty itself.",
  },
  lblRecord: { ko: "어디에 기록하나", th: "บันทึกที่ไหน", en: "Where it gets recorded" },
  lblBasis: { ko: "근거", th: "อ้างอิงจาก", en: "Based on" },
  handoff: {
    ko: "여기서 브랜드의 일이 끝납니다",
    th: "งานของแบรนด์จบตรงนี้",
    en: "The brand's work ends here",
  },
  progressTitle: { ko: "브랜드별 진행", th: "ความคืบหน้ารายแบรนด์", en: "Progress by brand" },
  progressLead: {
    ko: "브랜드마다 열 단계 중 어디까지 왔는지입니다. 저장된 값만 세고 짐작하지 않습니다. 줄을 펴면 각 단계의 값을 여기서 바로 고칠 수 있습니다.",
    th: "แสดงว่าแต่ละแบรนด์มาถึงขั้นใดจากสิบขั้น นับเฉพาะค่าที่บันทึกไว้จริงและไม่คาดเดา เมื่อกางแถวออกจะแก้ค่าของแต่ละขั้นได้จากตรงนี้เลย",
    en: "How far each brand has come through the ten stages, counted from stored values only and never inferred. Open a row to edit each stage's values right here.",
  },
  progressEmpty: {
    ko: "브랜드사 탭에서 브랜드를 등록하면 여기에 진행 상황이 나옵니다",
    th: "เมื่อเพิ่มแบรนด์ในแท็บแบรนด์ ความคืบหน้าจะแสดงที่นี่",
    en: "Add a brand under the Brands tab and its progress appears here",
  },
  legDone: { ko: "지남", th: "ผ่านแล้ว", en: "Passed" },
  legNow: { ko: "지금", th: "กำลังทำ", en: "Now" },
  legTodo: { ko: "아직", th: "ยังไม่ถึง", en: "Not yet" },
  shipTitle: { ko: "선적", th: "การส่งสินค้า", en: "Shipments" },
  shipNone: { ko: "선적 없음", th: "ยังไม่มีการส่ง", en: "No shipments" },
  shipAdd: { ko: "선적 추가", th: "เพิ่มการส่ง", en: "Add shipment" },
  shipCode: { ko: "선적 이름", th: "ชื่อการส่ง", en: "Shipment name" },
  shipCodeHint: {
    ko: "예: 2026-03 1차",
    th: "เช่น 2026-03 รอบที่ 1",
    en: "e.g. 2026-03 first lot",
  },
  shipNext: { ko: "다음 단계로", th: "ไปขั้นถัดไป", en: "Advance" },
  shipDelete: { ko: "삭제", th: "ลบ", en: "Delete" },
  shipMissing: {
    ko: "선적 표가 아직 데이터베이스에 없습니다. supabase/migrations 의 마이그레이션을 적용하면 05~07단계를 여기서 따라갈 수 있습니다.",
    th: "ยังไม่มีตาราง shipments ในฐานข้อมูล เมื่อรันไฟล์ migration ใน supabase/migrations แล้วจะติดตามขั้นที่ 05–07 ได้จากที่นี่",
    en: "The shipments table is not in the database yet. Apply the migration in supabase/migrations and stages 05–07 become trackable here.",
  },
  labelStatus: { ko: "라벨 승인", th: "อนุมัติฉลาก", en: "Label approval" },
  fdaStatus: { ko: "제품 등록", th: "ขึ้นทะเบียนสินค้า", en: "Product registration" },
  panelScreen: { ko: "01 · 04 제품", th: "01 · 04 สินค้า", en: "01 · 04 Products" },
  panelValidate: { ko: "03 시장 검증", th: "03 ทดสอบตลาด", en: "03 Market test" },
  panelKeep: { ko: "10 허가 · 만료", th: "10 ใบอนุญาต · วันหมดอายุ", en: "10 Licences and expiry" },
  noProducts: {
    ko: "이 브랜드에 등록된 제품이 없습니다",
    th: "ยังไม่มีสินค้าของแบรนด์นี้",
    en: "No products for this brand yet",
  },
  hsCode: { ko: "HS 코드", th: "พิกัดศุลกากร", en: "HS code" },
  validatedOn: { ko: "검증 완료일", th: "วันที่ทดสอบเสร็จ", en: "Validated on" },
  markToday: { ko: "오늘로", th: "เป็นวันนี้", en: "Today" },
  clear: { ko: "지우기", th: "ล้าง", en: "Clear" },
  licNone: { ko: "등록된 허가 없음", th: "ยังไม่มีใบอนุญาต", en: "No licences yet" },
  licAdd: { ko: "허가 추가", th: "เพิ่มใบอนุญาต", en: "Add licence" },
  licName: { ko: "이름 · 번호", th: "ชื่อ · เลขที่", en: "Name or number" },
  licExpires: { ko: "만료일", th: "วันหมดอายุ", en: "Expires" },
  licCompanyWide: {
    ko: "회사 전체",
    th: "ทั้งบริษัท",
    en: "Company-wide",
  },
  licExpired: { ko: "만료됨", th: "หมดอายุแล้ว", en: "Expired" },
  licSoon: { ko: "곧 만료", th: "ใกล้หมดอายุ", en: "Expiring soon" },
  statusTitle: { ko: "지금 상태", th: "สถานะตอนนี้", en: "Where we are now" },
  statusBrands: { ko: "브랜드사 진행 단계", th: "สถานะแบรนด์", en: "Brands by stage" },
  statusFda: { ko: "제품 FDA 상태", th: "สถานะ อย. ของสินค้า", en: "Products by FDA status" },
  statusEmpty: {
    ko: "아직 등록된 것이 없습니다",
    th: "ยังไม่มีข้อมูล",
    en: "Nothing recorded yet",
  },
  termsTitle: { ko: "용어", th: "คำศัพท์", en: "Terms" },
  termsLead: {
    ko: "처음 보면 못 알아듣는 말만 모았습니다.",
    th: "รวมเฉพาะคำที่เห็นครั้งแรกแล้วไม่เข้าใจ",
    en: "Only the words that mean nothing the first time you see them.",
  },
  sourcesTitle: { ko: "근거 자료", th: "แหล่งอ้างอิง", en: "Sources" },
  sourcesLead: {
    ko: "위 숫자와 서식 이름은 아래에서 확인한 것입니다. 규정이 바뀌면 여기부터 다시 보세요.",
    th: "ตัวเลขและชื่อแบบฟอร์มข้างต้นตรวจสอบจากแหล่งด้านล่าง หากกฎเปลี่ยน ให้เริ่มตรวจจากที่นี่",
    en: "The numbers and form names above were checked against these. When the rules change, start here.",
  },
  checkedOn: { ko: "마지막 확인", th: "ตรวจสอบล่าสุด", en: "Last checked" },
  toTop: { ko: "맨 위로", th: "ขึ้นบนสุด", en: "Back to top" },
  foot: {
    ko: "기간과 요건은 일반적인 기준입니다. 품목과 시점에 따라 달라지고 규정도 바뀌니, 실제로 서류를 넣기 전에 최신 요건을 확인하세요.",
    th: "ระยะเวลาและข้อกำหนดที่ระบุเป็นค่ากลางทั่วไป อาจต่างกันตามชนิดสินค้าและช่วงเวลา และกฎเกณฑ์มีการเปลี่ยนแปลง จึงควรตรวจสอบข้อกำหนดล่าสุดก่อนยื่นเอกสารจริง",
    en: "The durations and requirements here are typical figures. They vary by product and by date, and the rules change — confirm the current requirements before filing anything.",
  },
} as const;

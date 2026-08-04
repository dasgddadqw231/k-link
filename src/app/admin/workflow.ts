/**
 * 수출입 업무 흐름의 내용. 화면(Flow.tsx)과 분리해 둔다.
 *
 * 왜 i18n.ts에 넣지 않았나: 저기는 버튼·라벨처럼 짧은 UI 문구를 언어별로 통째
 * 복사해 두는 사전이다. 여기 글은 한 단계가 열 줄씩이라 사전에 섞으면 세 언어가
 * 800줄 떨어져 앉게 되고, 한국어만 고치고 태국어를 빠뜨렸는지 아무도 못 본다.
 * 그래서 문장 단위로 세 언어를 붙여 둔다 — 한 줄만 채워져 있으면 바로 보인다.
 *
 * 이 화면은 도구가 아니라 설명서다. 처음 들어온 사람이 "지금 우리가 어느 단계고
 * 다음에 뭘 해야 하나"를 혼자 읽고 알 수 있어야 한다. 그래서 단계마다 넘어가는
 * 조건(gate)과 자주 막히는 곳(risk)을 반드시 적는다 — 할 일 목록만 있으면
 * 다 했는지 아닌지를 사람마다 다르게 판단한다.
 */
import type { Tab } from "./AdminApp";
import type { AdminLang } from "./i18n";

/** 세 언어를 한자리에 묶은 문장. */
export interface T {
  ko: string;
  th: string;
  en: string;
}

export function t(x: T, lang: AdminLang): string {
  return x[lang];
}

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
    title: {
      ko: "시작 전 준비",
      th: "เตรียมก่อนเริ่ม",
      en: "Before you start",
    },
    note: {
      ko: "서류로 먼저 확인하고, 소량으로 시장을 본다",
      th: "ตรวจจากเอกสารก่อน แล้วลองตลาดด้วยจำนวนน้อย",
      en: "Check on paper first, then test the market small",
    },
  },
  {
    key: "permit",
    title: {
      ko: "허가 받기",
      th: "ขอใบอนุญาต",
      en: "Get the licence",
    },
    note: {
      ko: "허가는 주소에 붙는다 — 태국 법인 명의로 신고한다",
      th: "ใบอนุญาตผูกกับที่อยู่ในไทย จึงยื่นในนามบริษัทไทย",
      en: "The licence attaches to a Thai address — we file in our own name",
    },
  },
  {
    key: "ship",
    title: {
      ko: "물건 보내기",
      th: "ส่งสินค้า",
      en: "Move the goods",
    },
    note: {
      ko: "수출과 수입이 만나는 곳. 서류가 물건과 한 글자도 달라선 안 된다",
      th: "จุดที่การส่งออกกับการนำเข้ามาบรรจบกัน เอกสารต้องตรงกับของทุกตัวอักษร",
      en: "Where export meets import — paperwork must match the goods exactly",
    },
  },
  {
    key: "sell",
    title: {
      ko: "팔고 정산하기",
      th: "ขายและเคลียร์เงิน",
      en: "Sell and settle",
    },
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
  gate: T;
  risk: T;
  /** 이 단계의 결과가 관리자 화면 어디에 남는지. 설명서를 도구에 잇는 고리다. */
  record?: { tab: Tab; what: T };
  /** 브랜드의 일이 끝나는 지점. 한 번만 참이다. */
  handoff?: boolean;
}

export const STAGES: Stage[] = [
  {
    id: "screen",
    no: "01",
    phase: "prep",
    where: "th",
    title: { ko: "제품 검토", th: "ตรวจสอบสินค้า", en: "Product screening" },
    lead: {
      ko: "이 제품이 태국에 들어갈 수 있는지부터 본다",
      th: "ดูก่อนว่าสินค้านี้เข้าไทยได้หรือไม่",
      en: "Find out whether this product can enter Thailand at all",
    },
    plain: {
      ko: "태국은 쓸 수 없는 성분과 라벨에 적어야 할 항목이 정해져 있습니다. 물건을 보내기 전에 서류만으로 먼저 확인합니다. 여기서 막히면 뒤의 일곱 단계는 아무 의미가 없습니다.",
      th: "ไทยกำหนดไว้ว่าส่วนผสมใดใช้ไม่ได้ และฉลากต้องแสดงอะไรบ้าง เราจึงตรวจจากเอกสารก่อนส่งของจริง ถ้าติดตั้งแต่ขั้นนี้ อีกเจ็ดขั้นที่เหลือก็ไม่มีความหมาย",
      en: "Thailand restricts which ingredients may be used and what a label must state. We check all of that on paper before anything ships. If a product fails here, the seven stages after it are pointless.",
    },
    does: [
      {
        actor: "brand",
        text: {
          ko: "샘플, 성분 배합표(%), 제조공정서, 지금 쓰는 라벨 이미지를 보낸다",
          th: "ส่งตัวอย่างสินค้า สูตรส่วนผสม (%) กรรมวิธีการผลิต และภาพฉลากที่ใช้อยู่",
          en: "Send samples, the ingredient formula (%), the process document, and the current label",
        },
      },
      {
        actor: "th",
        text: {
          ko: "성분을 태국 규정과 대조하고 식품 분류(일반식품·통제 대상 식품)를 판정한다",
          th: "เทียบส่วนผสมกับข้อกำหนดของ อย. และจัดประเภทอาหาร (อาหารทั่วไป / อาหารควบคุมเฉพาะ)",
          en: "Match the ingredients against Thai rules and classify the food type (general or controlled)",
        },
      },
      {
        actor: "th",
        text: {
          ko: "가격대와 포장 단위가 태국 시장에 맞는지 본다",
          th: "ดูว่าระดับราคาและขนาดบรรจุเหมาะกับตลาดไทยหรือไม่",
          en: "Judge whether the price point and pack format fit the Thai market",
        },
      },
    ],
    docs: [
      { ko: "성분 배합표", th: "สูตรส่วนผสม", en: "Ingredient formula" },
      { ko: "제조공정서", th: "กรรมวิธีการผลิต", en: "Process document" },
      { ko: "현재 라벨 이미지", th: "ภาพฉลากปัจจุบัน", en: "Current label image" },
      { ko: "샘플", th: "ตัวอย่างสินค้า", en: "Samples" },
      {
        ko: "HACCP·자가품질검사 성적서",
        th: "ใบรับรอง HACCP · ผลตรวจคุณภาพ",
        en: "HACCP / QC test report",
      },
    ],
    takes: {
      ko: "서류가 다 오면 3~5일",
      th: "ถ้าเอกสารครบ 3–5 วัน",
      en: "3–5 days once the documents are complete",
    },
    gate: {
      ko: "“등록 가능”이라는 판정이 나왔다",
      th: "ได้ข้อสรุปว่า “ขึ้นทะเบียนได้”",
      en: "A verdict of “registrable” is on record",
    },
    risk: {
      ko: "배합비가 %로 적혀 있지 않으면 판정 자체를 못 합니다. 효능·기능성 문구가 들어간 라벨은 그대로 쓸 수 없습니다.",
      th: "ถ้าสูตรไม่ระบุเป็น % จะตัดสินไม่ได้เลย และฉลากที่มีข้อความอ้างสรรพคุณใช้ตามเดิมไม่ได้",
      en: "Without percentages in the formula there is nothing to judge. A label carrying health claims cannot be used as it stands.",
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
      ko: "수입자는 klink이고 제조와 품질은 브랜드 몫입니다. 이 경계와 수수료·월 피·계약 기간을 계약서에 적습니다. 말로 정한 조건은 반년 뒤에 서로 다르게 기억합니다.",
      th: "ผู้นำเข้าคือ klink ส่วนการผลิตและคุณภาพเป็นของแบรนด์ เส้นแบ่งนี้พร้อมค่าคอมมิชชั่น ค่ารายเดือน และระยะสัญญา ต้องเขียนไว้ในสัญญา เงื่อนไขที่ตกลงด้วยปากเปล่า อีกครึ่งปีต่างฝ่ายจะจำไม่ตรงกัน",
      en: "klink is the importer; manufacturing and quality stay with the brand. That line, plus commission, monthly fee and term, goes into the contract. Terms agreed verbally are remembered differently six months later.",
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
        actor: "th",
        text: {
          ko: "태국 법인이 수입자가 되는 조건을 확인한다",
          th: "ตรวจเงื่อนไขที่บริษัทไทยจะเป็นผู้นำเข้า",
          en: "Confirm the terms under which the Thai entity acts as importer",
        },
      },
    ],
    docs: [
      { ko: "계약서", th: "สัญญา", en: "Contract" },
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
      ko: "독점 범위와 최소 물량을 안 적으면 나중에 반드시 다툽니다. 계약 종료일도 비워 두지 마세요 — 자동 연장인지 아닌지가 그때 문제가 됩니다.",
      th: "ถ้าไม่ระบุขอบเขตสิทธิ์และยอดสั่งขั้นต่ำ จะมีข้อพิพาทแน่นอนในภายหลัง และอย่าเว้นวันสิ้นสุดสัญญาไว้ เพราะจะกลายเป็นปัญหาว่าต่ออัตโนมัติหรือไม่",
      en: "Leaving exclusivity and minimum order unwritten guarantees a dispute later. Do not leave the end date blank either — whether it auto-renews becomes the question.",
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
      ko: "FDA 등록은 시간이 걸립니다. 그동안 소량만 들여와 인플루언서에게 보내고 반응을 봅니다. 안 팔릴 물건을 컨테이너째 떠안는 일을 여기서 막습니다. 브랜드가 가장 무서워하는 것이 초도 물량이라, 이 단계가 계약을 성사시키는 카드이기도 합니다.",
      th: "การขึ้นทะเบียนกับ อย. ใช้เวลา ระหว่างนั้นเรานำเข้ามาจำนวนน้อยเพื่อส่งให้อินฟลูเอนเซอร์และดูผลตอบรับ ขั้นนี้คือสิ่งที่กันไม่ให้ต้องแบกสินค้าที่ขายไม่ออกทั้งตู้ และเพราะสิ่งที่แบรนด์กลัวที่สุดคือล็อตแรก ขั้นนี้จึงเป็นไพ่ที่ปิดดีลได้ด้วย",
      en: "Registration takes time. Meanwhile we bring in a small quantity, seed it to influencers and watch the response. This is what stops anyone from carrying a container of something that will not sell — and since first-order risk is the brand's biggest fear, this stage often closes the deal.",
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
          ko: "견본으로 반입하고 인플루언서에게 시딩한다",
          th: "นำเข้าเป็นตัวอย่าง แล้วส่งให้อินฟลูเอนเซอร์ทดลอง",
          en: "Bring it in as samples and seed it to influencers",
        },
      },
      {
        actor: "th",
        text: {
          ko: "반응을 정리해 본물량 규모와 판매가를 제안한다",
          th: "สรุปผลตอบรับ แล้วเสนอปริมาณล็อตจริงและราคาขาย",
          en: "Summarise the response and propose the real order size and retail price",
        },
      },
    ],
    docs: [
      {
        ko: "견본품 인보이스 (No Commercial Value)",
        th: "อินวอยซ์ตัวอย่างสินค้า (No Commercial Value)",
        en: "Sample invoice (No Commercial Value)",
      },
      { ko: "소량 패킹리스트", th: "แพ็คกิ้งลิสต์จำนวนน้อย", en: "Small-lot packing list" },
    ],
    takes: { ko: "4~6주", th: "4–6 สัปดาห์", en: "4–6 weeks" },
    gate: {
      ko: "시딩 결과를 보고 본물량과 판매가를 정했다",
      th: "ดูผลจากการซีดดิ้งแล้ว และกำหนดปริมาณล็อตจริงกับราคาขายได้",
      en: "The seeding results are in and the order size and price are decided",
    },
    risk: {
      ko: "견본품이라도 수량이 많으면 판매용으로 보고 통관에서 잡습니다. 등록 전에 들여오는 소량의 법적 경로와 허용 수량은 건별로 세관에 확인하세요 — 아직 우리 쪽에서 확정된 규칙이 아닙니다.",
      th: "แม้จะแจ้งว่าเป็นตัวอย่าง ถ้าจำนวนมากศุลกากรจะถือว่าเป็นการค้าและกักไว้ ช่องทางและปริมาณที่นำเข้าได้ก่อนขึ้นทะเบียน ต้องยืนยันกับศุลกากรเป็นกรณีไป เรายังไม่มีกฎที่ยืนยันแล้วในเรื่องนี้",
      en: "Even declared as samples, a large quantity is treated as commercial and held. Confirm the legal route and allowed volume for pre-registration imports case by case — we do not yet have a settled rule for this.",
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
    title: { ko: "태국 FDA 등록", th: "ขึ้นทะเบียน อย. ไทย", en: "Thai FDA registration" },
    lead: {
      ko: "klink 법인 명의로 신고하고 อย. 번호를 받는다",
      th: "ยื่นในนามบริษัท klink และรับเลขสารบบอาหาร อย.",
      en: "File in klink's name and obtain the อย. registration number",
    },
    plain: {
      ko: "태국 수입 허가는 회사가 아니라 주소에 붙습니다. 태국 안의 창고 주소로 발급되고, 승인 전에 FDA가 그 주소를 실사합니다. 서울 주소로는 받을 수 없습니다. 그래서 태국 법인인 klink가 수입자가 되어 신고하고, 소비자가 패키지에서 보는 등록번호도 klink 명의로 나옵니다.",
      th: "ใบอนุญาตนำเข้าของไทยผูกกับ “ที่อยู่” ไม่ใช่ตัวบริษัท ออกให้ตามที่อยู่คลังสินค้าในไทย และก่อนอนุมัติ อย. จะเข้าตรวจสถานที่จริง ที่อยู่ในกรุงโซลจึงขอไม่ได้ ด้วยเหตุนี้บริษัทไทยอย่าง klink จึงเป็นผู้นำเข้าและเป็นผู้ยื่น เลขทะเบียนที่ผู้บริโภคเห็นบนบรรจุภัณฑ์ก็ออกในนาม klink",
      en: "A Thai import licence attaches to an address, not to a company. It is issued against a warehouse address inside Thailand, and the FDA inspects that address before approving. A Seoul address cannot hold one. That is why klink, as the Thai entity, files as importer — and the registration number printed on the pack is in klink's name.",
    },
    does: [
      {
        actor: "th",
        text: {
          ko: "수입 허가(Sor Bor 3)의 취급 품목에 제품을 올린다",
          th: "เพิ่มสินค้าเข้าในรายการของใบอนุญาตนำเข้า (สบ.3)",
          en: "Add the product to the item list on the import licence (Sor Bor 3)",
        },
      },
      {
        actor: "brand",
        text: {
          ko: "제조사가 발급하는 서류(자유판매증명·성분·공정)를 원본으로 챙겨 준다",
          th: "จัดหาเอกสารจากโรงงานผู้ผลิต (หนังสือรับรองการจำหน่ายเสรี ส่วนผสม กรรมวิธี) เป็นฉบับจริง",
          en: "Supply the manufacturer's documents (free-sale certificate, ingredients, process) as originals",
        },
      },
      {
        actor: "th",
        text: {
          ko: "라벨 사전승인(Sor Bor 3/1)을 받고 태국어 라벨을 확정한다",
          th: "ขออนุมัติฉลากล่วงหน้า (สบ.3/1) และสรุปฉลากภาษาไทย",
          en: "Obtain label pre-approval (Sor Bor 3/1) and finalise the Thai label",
        },
      },
    ],
    docs: [
      {
        ko: "자유판매증명서 (CFS)",
        th: "หนังสือรับรองการจำหน่ายเสรี (CFS)",
        en: "Certificate of Free Sale (CFS)",
      },
      { ko: "제조사 증명", th: "หนังสือรับรองผู้ผลิต", en: "Manufacturer's certificate" },
      { ko: "성분 분석 성적서", th: "ผลวิเคราะห์ส่วนประกอบ", en: "Ingredient analysis report" },
      { ko: "태국어 라벨 도안", th: "อาร์ตเวิร์กฉลากภาษาไทย", en: "Thai label artwork" },
      { ko: "위임장", th: "หนังสือมอบอำนาจ", en: "Letter of authorisation" },
    ],
    takes: {
      ko: "서류가 완비되면 심사 약 5영업일 — 서류를 모으는 데 보통 4~8주",
      th: "ถ้าเอกสารครบ พิจารณาราว 5 วันทำการ แต่การรวบรวมเอกสารมักใช้ 4–8 สัปดาห์",
      en: "About 5 working days to review once documents are complete — collecting them usually takes 4–8 weeks",
    },
    gate: {
      ko: "อย. 식품 등록번호가 나왔고 라벨이 승인됐다",
      th: "ได้เลขสารบบอาหาร อย. และฉลากผ่านการอนุมัติแล้ว",
      en: "The อย. registration number is issued and the label is approved",
    },
    risk: {
      ko: "원본·공증·태국어 번역이 빠져 반려되는 경우가 대부분입니다. 사본으로는 접수가 안 됩니다. 취급 품목이 늘면 허가를 갱신해야 하니, 나중에 넣을 제품은 미리 같이 올리는 편이 쌉니다.",
      th: "ที่ถูกตีกลับส่วนใหญ่มาจากขาดฉบับจริง ขาดการรับรอง หรือขาดคำแปลภาษาไทย สำเนาอย่างเดียวยื่นไม่ได้ และถ้าเพิ่มรายการสินค้าต้องแก้ไขใบอนุญาต จึงถูกกว่าถ้ายื่นสินค้าที่จะขายทีหลังไปพร้อมกันเลย",
      en: "Most rejections come from a missing original, notarisation or Thai translation — copies are not accepted. Adding items later means amending the licence, so filing products you plan to sell later in the same batch is cheaper.",
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
    id: "export",
    no: "05",
    phase: "ship",
    where: "kr",
    title: { ko: "발주 · 한국 출고", th: "สั่งซื้อ · ส่งออกจากเกาหลี", en: "Order and export" },
    lead: {
      ko: "주문서를 넣고 한국에서 배에 싣는다",
      th: "ออกใบสั่งซื้อ แล้วขึ้นเรือจากเกาหลี",
      en: "Issue the order and load it out of Korea",
    },
    plain: {
      ko: "여기부터가 수출입니다. 브랜드는 한국에서 내보내는 일까지 하고, 그 뒤는 klink가 받습니다. 태국어 라벨은 이 단계에서 붙습니다 — 도착한 뒤에 붙이는 게 아닙니다.",
      th: "จากตรงนี้คือการส่งออก แบรนด์รับผิดชอบจนถึงการส่งออกจากเกาหลี หลังจากนั้น klink รับช่วงต่อ ฉลากภาษาไทยติดในขั้นนี้ ไม่ใช่ไปติดหลังของถึงไทย",
      en: "Export starts here. The brand's job runs until the goods leave Korea; klink takes over after that. The Thai label goes on at this stage — not after arrival.",
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
          ko: "생산·포장하고 태국어 라벨을 부착한 뒤 인보이스와 패킹리스트를 발행한다",
          th: "ผลิต บรรจุ ติดฉลากภาษาไทย แล้วออกอินวอยซ์และแพ็คกิ้งลิสต์",
          en: "Produce, pack, apply the Thai label, then issue the invoice and packing list",
        },
      },
      {
        actor: "kr",
        text: {
          ko: "포워더를 정하고 원산지증명(Form AK)을 확인한 뒤 선적한다",
          th: "เลือกผู้รับจัดการขนส่ง ตรวจหนังสือรับรองถิ่นกำเนิด (Form AK) แล้วส่งออก",
          en: "Appoint the forwarder, check the certificate of origin (Form AK), and ship",
        },
      },
    ],
    docs: [
      { ko: "발주서 (PO)", th: "ใบสั่งซื้อ (PO)", en: "Purchase order (PO)" },
      { ko: "상업송장 (Invoice)", th: "อินวอยซ์การค้า (Invoice)", en: "Commercial invoice" },
      { ko: "포장명세서 (Packing List)", th: "แพ็คกิ้งลิสต์ (Packing List)", en: "Packing list" },
      { ko: "원산지증명서 (Form AK)", th: "หนังสือรับรองถิ่นกำเนิด (Form AK)", en: "Certificate of origin (Form AK)" },
      { ko: "선하증권 (B/L) 또는 항공운송장 (AWB)", th: "ใบตราส่ง (B/L) หรือ (AWB)", en: "Bill of lading (B/L) or air waybill (AWB)" },
    ],
    takes: {
      ko: "생산 2~4주 + 해상 7~10일 (항공은 2~3일)",
      th: "ผลิต 2–4 สัปดาห์ + ทางเรือ 7–10 วัน (ทางอากาศ 2–3 วัน)",
      en: "2–4 weeks production + 7–10 days by sea (2–3 days by air)",
    },
    gate: {
      ko: "B/L(또는 AWB)을 받았고 서류의 수량이 실제 물건과 일치한다",
      th: "ได้รับ B/L (หรือ AWB) แล้ว และจำนวนในเอกสารตรงกับของจริง",
      en: "The B/L (or AWB) is in hand and the documents match the actual goods",
    },
    risk: {
      ko: "태국어 라벨이 안 붙은 채로 오면 통관 전에 창고에 묶입니다. 인보이스 수량과 실제 수량이 한 개만 달라도 통관이 멈춥니다. 유통기한 표기 형식에도 규정이 있으니 라벨 승인본 그대로 인쇄하세요.",
      th: "ถ้าของมาถึงโดยไม่มีฉลากภาษาไทย จะถูกกักไว้ที่คลังก่อนผ่านพิธีการ และถ้าจำนวนในอินวอยซ์ต่างจากของจริงแม้ชิ้นเดียว การตรวจปล่อยจะหยุดทันที รูปแบบการแสดงวันหมดอายุก็มีข้อกำหนด จึงต้องพิมพ์ตามฉลากที่ได้รับอนุมัติเท่านั้น",
      en: "Goods arriving without the Thai label sit in a warehouse before clearance. If the invoice quantity differs from the actual count by even one unit, clearance stops. Expiry-date formatting is regulated too — print exactly the approved label.",
    },
    record: {
      tab: "fin",
      what: {
        ko: "매입(상품)과 물류비를 지출로 적는다. 재고는 아직 잡지 않는다 — 창고에 들어온 날 입고입니다",
        th: "บันทึกค่าสินค้าและค่าขนส่งเป็นรายจ่าย ยังไม่ตัดเข้าสต็อก เพราะสต็อกจะรับเข้าในวันที่ของเข้าคลังจริง",
        en: "Book the goods cost and freight as expenses. Do not add stock yet — stock is received on the day it reaches the warehouse",
      },
    },
    handoff: true,
  },
  {
    id: "import",
    no: "06",
    phase: "ship",
    where: "th",
    title: { ko: "태국 통관 · 입고", th: "พิธีการนำเข้า · รับเข้าคลัง", en: "Customs and receiving" },
    lead: {
      ko: "세관과 FDA를 통과시키고 창고에 넣는다",
      th: "ผ่านศุลกากรและ อย. แล้วนำเข้าคลัง",
      en: "Clear customs and the FDA, then put it in the warehouse",
    },
    plain: {
      ko: "수입 신고를 하고, 관세와 부가세를 내고, 검사를 통과하면 물건이 나옵니다. 인허가 주체가 klink이므로 여기서 막힐 위험을 브랜드가 지지 않습니다. 물건을 받으면 로트와 유통기한을 그 자리에서 적습니다.",
      th: "ยื่นใบขนสินค้า ชำระอากรและภาษีมูลค่าเพิ่ม ผ่านการตรวจแล้วจึงรับของออกมาได้ เนื่องจากผู้ถือใบอนุญาตคือ klink ความเสี่ยงที่จะติดตรงนี้จึงไม่ตกกับแบรนด์ เมื่อรับของแล้วให้บันทึกล็อตและวันหมดอายุทันที",
      en: "We file the import declaration, pay duty and VAT, and release the goods once inspection passes. Because klink holds the licence, the brand carries none of the risk of being stuck here. When the goods arrive, the lot and expiry go into the system on the spot.",
    },
    does: [
      {
        actor: "th",
        text: {
          ko: "수입신고를 하고 FDA 수입 확인을 받는다",
          th: "ยื่นใบขนสินค้าขาเข้าและขอการรับรองนำเข้าจาก อย.",
          en: "File the import declaration and obtain FDA import clearance",
        },
      },
      {
        actor: "th",
        text: {
          ko: "관세와 부가세(7%)를 내고 필요하면 샘플 검사에 대응한다",
          th: "ชำระอากรและภาษีมูลค่าเพิ่ม 7% และรองรับการสุ่มตรวจตัวอย่างหากมี",
          en: "Pay duty and 7% VAT, and handle sample testing if required",
        },
      },
      {
        actor: "th",
        text: {
          ko: "창고에 입고하고 로트·유통기한을 기록한다",
          th: "รับเข้าคลัง พร้อมบันทึกล็อตและวันหมดอายุ",
          en: "Receive into the warehouse and record lot and expiry",
        },
      },
    ],
    docs: [
      { ko: "수입신고서", th: "ใบขนสินค้าขาเข้า", en: "Import declaration" },
      { ko: "인보이스 · 패킹리스트", th: "อินวอยซ์ · แพ็คกิ้งลิสต์", en: "Invoice and packing list" },
      { ko: "B/L 또는 AWB", th: "B/L หรือ AWB", en: "B/L or AWB" },
      { ko: "อย. 등록번호", th: "เลขสารบบอาหาร อย.", en: "อย. registration number" },
      { ko: "원산지증명서 (Form AK)", th: "หนังสือรับรองถิ่นกำเนิด (Form AK)", en: "Certificate of origin (Form AK)" },
    ],
    takes: {
      ko: "서류에 이상이 없으면 2~5일",
      th: "ถ้าเอกสารไม่มีปัญหา 2–5 วัน",
      en: "2–5 days if the paperwork is clean",
    },
    gate: {
      ko: "물건이 창고에 들어왔고 로트와 유통기한이 시스템에 적혔다",
      th: "ของเข้าคลังแล้ว และบันทึกล็อตกับวันหมดอายุในระบบแล้ว",
      en: "The goods are in the warehouse and lot and expiry are in the system",
    },
    risk: {
      ko: "로트와 유통기한을 안 적으면 몇 달 뒤 유통기한 임박 재고를 찾을 방법이 없습니다. 수입 건기식에서 돈이 가장 크게 새는 곳입니다. Form AK를 빠뜨리면 관세를 일반세율로 냅니다.",
      th: "ถ้าไม่บันทึกล็อตและวันหมดอายุ อีกไม่กี่เดือนจะหาสินค้าที่ใกล้หมดอายุไม่เจอ นี่คือจุดที่เงินรั่วมากที่สุดของสินค้านำเข้ากลุ่มนี้ และถ้าลืม Form AK จะต้องเสียอากรในอัตราปกติ",
      en: "Skip the lot and expiry and there is no way to find near-expiry stock months later — this is where imported supplements lose the most money. Miss the Form AK and you pay the general duty rate.",
    },
    record: {
      tab: "stock",
      what: {
        ko: "입고(사유: 수입)로 잡고 로트·유통기한을 함께 적는다. 관세·물류비는 재무에 지출로 적는다",
        th: "รับเข้าสต็อก (เหตุผล: นำเข้า) พร้อมล็อตและวันหมดอายุ ส่วนอากรและค่าขนส่งบันทึกเป็นรายจ่ายในการเงิน",
        en: "Book a stock-in (reason: import) with lot and expiry; log duty and freight as expenses under Finance",
      },
    },
  },
  {
    id: "sell",
    no: "07",
    phase: "sell",
    where: "th",
    title: { ko: "유통 · 판매", th: "กระจายสินค้า · ขาย", en: "Distribution and sales" },
    lead: {
      ko: "매대에 올리고 수요를 같이 만든다",
      th: "วางขายหน้าร้าน พร้อมสร้างดีมานด์ไปด้วย",
      en: "Get it on shelves and create the demand for it",
    },
    plain: {
      ko: "물건이 있는 것과 팔리는 것은 다릅니다. 도매·리테일 입점과 인플루언서 시딩을 같이 돌립니다. 리테일이 신규 수입 브랜드를 받는 이유는 소량으로 시작할 수 있고 수요를 우리가 만들어 주기 때문입니다.",
      th: "มีของวางขายกับขายได้จริงเป็นคนละเรื่อง เราจึงเดินงานเข้าร้านค้าส่ง–ค้าปลีก ควบคู่กับการซีดดิ้งอินฟลูเอนเซอร์ เหตุผลที่ร้านยอมรับแบรนด์นำเข้าใหม่คือสั่งจำนวนน้อยได้ และเราสร้างดีมานด์ให้",
      en: "Having stock is not selling it. We push retail and wholesale listings alongside influencer seeding. Retailers take a new imported brand because they can order small and because we generate the demand ourselves.",
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
          ko: "인플루언서 시딩과 라이브커머스를 돌린다",
          th: "เดินงานซีดดิ้งอินฟลูเอนเซอร์และไลฟ์คอมเมิร์ซ",
          en: "Run influencer seeding and live commerce",
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
      { ko: "진열 자료 (POP)", th: "สื่อ ณ จุดขาย (POP)", en: "Point-of-sale material (POP)" },
    ],
    takes: { ko: "상시", th: "ดำเนินการต่อเนื่อง", en: "Ongoing" },
    gate: {
      ko: "끝나는 단계가 아닙니다. 재고가 유통기한보다 빨리 도는지가 판단 기준입니다",
      th: "ไม่ใช่ขั้นที่จบลง ตัวชี้วัดคือสต็อกหมุนเร็วกว่าวันหมดอายุหรือไม่",
      en: "This stage does not end. The measure is whether stock turns faster than it expires",
    },
    risk: {
      ko: "광고 허가(Sor Bor 4)를 받기 전에는 건강 효능을 광고할 수 없습니다. 인플루언서에게 주는 가이드에도 이 선을 넣으세요 — 남이 대신 한 말도 우리 광고로 봅니다.",
      th: "ก่อนได้ใบอนุญาตโฆษณา (สบ.4) จะโฆษณาสรรพคุณด้านสุขภาพไม่ได้ ต้องใส่ข้อจำกัดนี้ในไกด์ไลน์ที่ให้อินฟลูเอนเซอร์ด้วย เพราะคำพูดของคนอื่นก็ถือเป็นโฆษณาของเรา",
      en: "Health claims cannot be advertised before the advertising licence (Sor Bor 4). Put that limit in the influencer brief too — what someone else says on our behalf still counts as our advertising.",
    },
    record: {
      tab: "stock",
      what: {
        ko: "판매 출고는 재고 탭, 시딩은 인플루언서 탭, 매출은 재무 탭에 적는다",
        th: "การเบิกขายบันทึกในแท็บสต็อก ซีดดิ้งในแท็บอินฟลูเอนเซอร์ และรายได้ในแท็บการเงิน",
        en: "Sales stock-outs under Stock, seeding under Influencers, revenue under Finance",
      },
    },
  },
  {
    id: "settle",
    no: "08",
    phase: "sell",
    where: "th",
    title: { ko: "정산", th: "เคลียร์ยอด", en: "Settlement" },
    lead: {
      ko: "판 만큼 계산해서 브랜드에 보낸다",
      th: "คิดตามยอดที่ขายได้ แล้วโอนให้แบรนด์",
      en: "Work out what sold and pay the brand",
    },
    plain: {
      ko: "매출에서 수수료와 비용을 빼고 브랜드 몫을 송금합니다. 통화가 두 개라 그날의 환율을 함께 적습니다 — 나중에 환율이 바뀌어도 그때 장부를 그대로 재현할 수 있어야 합니다.",
      th: "หักค่าคอมมิชชั่นและค่าใช้จ่ายจากยอดขาย แล้วโอนส่วนของแบรนด์ เนื่องจากมีสองสกุลเงิน ต้องบันทึกอัตราแลกเปลี่ยนของวันนั้นไว้ด้วย เพื่อให้ย้อนดูบัญชีวันนั้นได้แม้อัตราจะเปลี่ยนไปแล้ว",
      en: "Deduct commission and costs from revenue and remit the brand's share. Two currencies are involved, so the rate used that day is recorded with it — the books for that day must still reproduce later.",
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
          ko: "송금하고 환율과 영수증을 함께 남긴다",
          th: "โอนเงิน พร้อมเก็บอัตราแลกเปลี่ยนและหลักฐานไว้",
          en: "Remit, keeping the exchange rate and the receipt on file",
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
      ko: "환율을 안 적어 두면 나중에 장부를 다시 못 맞춥니다. 정산·수수료 항목에는 반드시 브랜드사를 달아 두세요 — 상대가 없는 정산 기록은 몇 달 뒤 누구 것인지 알 수 없습니다.",
      th: "ถ้าไม่บันทึกอัตราแลกเปลี่ยน ภายหลังจะกระทบยอดบัญชีไม่ได้ และรายการเคลียร์ยอดกับค่าคอมมิชชั่นต้องผูกแบรนด์ไว้เสมอ เพราะรายการที่ไม่มีคู่สัญญา อีกไม่กี่เดือนจะไม่รู้ว่าเป็นของใคร",
      en: "Without the recorded rate the books cannot be reconciled later. Always attach the brand to settlement and commission entries — an entry with no counterparty is unidentifiable a few months on.",
    },
    record: {
      tab: "fin",
      what: {
        ko: "정산·수수료 분류로 적고 브랜드사를 달아 둔다. 원화 거래는 그날 환율을 함께 적는다",
        th: "บันทึกในหมวดเคลียร์ยอด/คอมมิชชั่น พร้อมผูกแบรนด์ และหากเป็นสกุลวอนให้ใส่อัตราแลกเปลี่ยนของวันนั้น",
        en: "Log under settlement or commission with the brand attached; for KRW entries record that day's rate",
      },
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
    term: { ko: "Sor Bor 3 (สบ.3)", th: "สบ.3", en: "Sor Bor 3 (สบ.3)" },
    body: {
      ko: "판매를 목적으로 식품을 수입할 수 있는 허가. 태국 안의 창고 주소에 붙고, 승인 전에 FDA가 그 주소를 실사합니다. 유효기간 3년이며 취급 품목 목록이 함께 묶여 있어 품목이 늘면 갱신해야 합니다.",
      th: "ใบอนุญาตนำเข้าอาหารเพื่อจำหน่าย ผูกกับที่อยู่คลังสินค้าในไทย และก่อนอนุมัติ อย. จะเข้าตรวจสถานที่ อายุ 3 ปี และผูกกับรายการสินค้า ถ้าเพิ่มรายการต้องแก้ไขใบอนุญาต",
      en: "The licence to import food for sale. It attaches to a warehouse address inside Thailand and the FDA inspects that address before approval. Valid three years, and tied to a list of items — adding items means amending it.",
    },
  },
  {
    term: { ko: "Sor Bor 3/1", th: "สบ.3/1", en: "Sor Bor 3/1" },
    body: {
      ko: "통제 대상 식품의 라벨을 미리 승인받는 양식. 여기서 승인이 나야 패키지에 찍히는 등록번호를 받습니다.",
      th: "แบบขออนุมัติฉลากล่วงหน้าสำหรับอาหารควบคุมเฉพาะ ต้องผ่านขั้นนี้จึงจะได้เลขทะเบียนที่พิมพ์บนบรรจุภัณฑ์",
      en: "The form for pre-approving the label of a controlled food. Approval here is what yields the number printed on the pack.",
    },
  },
  {
    term: { ko: "Sor Bor 4", th: "สบ.4", en: "Sor Bor 4" },
    body: {
      ko: "광고 허가. 이걸 받기 전에는 건강 효능을 광고할 수 없습니다. 우리 랜딩 페이지와 인플루언서 문구가 효능을 말하지 않는 이유입니다.",
      th: "ใบอนุญาตโฆษณา ก่อนได้รับจะโฆษณาสรรพคุณด้านสุขภาพไม่ได้ นี่คือเหตุผลที่หน้าเว็บและข้อความของอินฟลูเอนเซอร์ของเราไม่พูดถึงสรรพคุณ",
      en: "The advertising licence. Until it is granted, no health claims may be advertised — which is why our landing pages and influencer copy avoid them.",
    },
  },
  {
    term: { ko: "อย. (Or.Yor.)", th: "อย.", en: "อย. (Or.Yor.)" },
    body: {
      ko: "태국 식약청과, 그곳이 발급하는 식품 등록번호. 소비자가 패키지에서 보는 번호이고 수입자 명의로 나옵니다.",
      th: "สำนักงานคณะกรรมการอาหารและยา และเลขสารบบอาหารที่ออกให้ เป็นเลขที่ผู้บริโภคเห็นบนบรรจุภัณฑ์ และออกในนามผู้นำเข้า",
      en: "The Thai FDA, and the food registration number it issues. It is what consumers see on the pack, and it is issued in the importer's name.",
    },
  },
  {
    term: { ko: "자유판매증명서 (CFS)", th: "หนังสือรับรองการจำหน่ายเสรี (CFS)", en: "Certificate of Free Sale (CFS)" },
    body: {
      ko: "이 제품이 한국에서 실제로 합법적으로 팔리고 있다는 증명. 관할 관청이나 상공회의소가 발급하며, 원본이 있어야 접수됩니다.",
      th: "หนังสือรับรองว่าสินค้านี้จำหน่ายอย่างถูกกฎหมายในเกาหลีจริง ออกโดยหน่วยงานรัฐหรือหอการค้า และต้องใช้ฉบับจริงในการยื่น",
      en: "Proof that the product is legally sold in Korea. Issued by the competent authority or chamber of commerce; the original is required for filing.",
    },
  },
  {
    term: { ko: "HS 코드", th: "พิกัดศุลกากร (HS Code)", en: "HS code" },
    body: {
      ko: "품목 분류 번호. 관세율이 이 번호로 정해지므로 처음에 잘못 잡으면 세금이 계속 틀립니다.",
      th: "รหัสจัดประเภทสินค้า อัตราอากรกำหนดตามรหัสนี้ ถ้าจัดผิดตั้งแต่ต้น ภาษีจะผิดไปตลอด",
      en: "The tariff classification code. Duty rates follow from it, so getting it wrong at the start makes every later tax figure wrong.",
    },
  },
  {
    term: { ko: "Form AK", th: "Form AK", en: "Form AK" },
    body: {
      ko: "한-아세안 FTA 원산지증명서. 있으면 관세가 내려가고 없으면 일반세율을 냅니다. 선적 전에 챙기는 서류입니다.",
      th: "หนังสือรับรองถิ่นกำเนิดภายใต้ FTA อาเซียน–เกาหลี ถ้ามีจะได้อัตราอากรที่ลดลง ถ้าไม่มีต้องเสียอัตราปกติ ต้องเตรียมก่อนการส่งออก",
      en: "The Korea–ASEAN FTA certificate of origin. With it, duty drops; without it, you pay the general rate. It has to be arranged before shipment.",
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
    term: { ko: "부가세 7%", th: "ภาษีมูลค่าเพิ่ม 7%", en: "7% VAT" },
    body: {
      ko: "태국 부가가치세. 수입할 때 물건값에 관세를 더한 금액을 기준으로 붙습니다. 원가 계산에서 빠뜨리기 쉬운 항목입니다.",
      th: "ภาษีมูลค่าเพิ่มของไทย คิดจากมูลค่าสินค้ารวมอากรขาเข้า เป็นรายการที่มักตกหล่นตอนคำนวณต้นทุน",
      en: "Thai value-added tax, charged on the goods value plus import duty. It is the line most often left out of a cost calculation.",
    },
  },
  {
    term: { ko: "태국어 라벨", th: "ฉลากภาษาไทย", en: "Thai-language label" },
    body: {
      ko: "통관 전에 이미 붙어 있어야 합니다. 번역의 문제가 아니라 표시 항목과 형식이 규정돼 있어, 승인받은 도안 그대로 인쇄해야 합니다.",
      th: "ต้องติดมาก่อนผ่านพิธีการนำเข้า ไม่ใช่แค่เรื่องการแปล เพราะรายการที่ต้องแสดงและรูปแบบถูกกำหนดไว้ ต้องพิมพ์ตามอาร์ตเวิร์กที่ได้รับอนุมัติ",
      en: "It must already be on the pack before clearance. This is not a translation question — the required items and format are regulated, so print exactly the approved artwork.",
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

/** 화면 문구. 단계 글과 같은 파일에 둬야 세 언어가 같이 움직인다. */
export const F = {
  pageTitle: {
    ko: "수출입 업무 흐름",
    th: "ขั้นตอนการส่งออก–นำเข้า",
    en: "Export–import workflow",
  },
  pageLead: {
    ko: "한국 브랜드의 제품이 태국 매대에 오르기까지 여덟 단계입니다. 단계마다 누가 무엇을 하고, 무엇이 있어야 다음으로 넘어가는지 적어 뒀습니다.",
    th: "จากสินค้าของแบรนด์เกาหลีจนถึงชั้นวางในไทย มีทั้งหมดแปดขั้น แต่ละขั้นระบุไว้ว่าใครทำอะไร และต้องมีอะไรจึงจะไปขั้นต่อไปได้",
    en: "Eight stages take a Korean brand's product onto a Thai shelf. Each one says who does what, and what has to exist before it moves on.",
  },
  overview: { ko: "한눈에 보기", th: "ภาพรวม", en: "At a glance" },
  overviewHint: {
    ko: "단계를 누르면 그 설명으로 내려갑니다",
    th: "แตะที่ขั้นตอนเพื่อเลื่อนไปยังคำอธิบาย",
    en: "Tap a stage to jump to its description",
  },
  whoLabel: { ko: "누가 하나요", th: "ใครทำ", en: "Who does it" },
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
  lblRecord: { ko: "어디에 기록하나", th: "บันทึกที่ไหน", en: "Where it gets recorded" },
  handoff: {
    ko: "여기서 브랜드의 일이 끝납니다",
    th: "งานของแบรนด์จบตรงนี้",
    en: "The brand's work ends here",
  },
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
  foot: {
    ko: "기간과 요건은 일반적인 기준입니다. 품목과 시점에 따라 달라지고 규정도 바뀌니, 실제로 진행하기 전에 최신 요건을 확인하세요.",
    th: "ระยะเวลาและข้อกำหนดที่ระบุเป็นค่ากลางทั่วไป อาจต่างกันตามชนิดสินค้าและช่วงเวลา และกฎเกณฑ์มีการเปลี่ยนแปลง จึงควรตรวจสอบข้อกำหนดล่าสุดก่อนดำเนินการจริง",
    en: "The durations and requirements here are typical figures. They vary by product and by date, and the rules change — confirm the current requirements before acting on them.",
  },
} as const;

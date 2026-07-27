import { motion } from "motion/react";
import { MessageCircle, Mail, ArrowRight, MapPin, Tag, BadgeCheck } from "lucide-react";

const LINE_URL = (import.meta.env.VITE_LINE_URL as string) || "";
const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string) || "";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

/**
 * 한국어 페이지의 독자는 태국 소비자가 아니라 태국 진출을 검토하는 한국 브랜드다.
 * 근거는 docs/stp.md 트랙 A. 캐릭터를 전면에 세우지 않고, 규제 사실로 설득한다.
 */

/** 태국 법인이 아니면 애초에 성립하지 않는 요건들. 이 페이지의 유일한 논거다. */
const barriers = [
  {
    Icon: MapPin,
    title: "허가는 회사가 아니라 주소에 붙습니다",
    body: "판매 목적의 식품 수입 허가(Sor Bor 3)는 태국 내 창고·시설 주소로 발급되고, 승인 전에 태국 FDA의 현장 실사를 거칩니다. 유효기간은 3년입니다. 서울 주소로는 신청 자체가 성립하지 않습니다.",
  },
  {
    Icon: Tag,
    title: "태국어 라벨은 통관 전에 붙어 있어야 합니다",
    body: "수입 식품은 태국에 들어오기 전 태국어 라벨이 부착된 상태여야 합니다. 번역의 문제가 아니라 표시 항목과 형식이 규정돼 있습니다.",
  },
  {
    Icon: BadgeCheck,
    title: "อย. 번호 없이는 매대에 오르지 못합니다",
    body: "통제 대상 식품은 라벨 사전승인을 받아야 하고, 승인되면 소비자가 패키지에서 확인하는 식품 등록번호가 부여됩니다. 이 번호는 수입자 명의로 나옵니다.",
  },
];

/** 각 단계에서 누가 무엇을 하는지. 브랜드의 가장 큰 불안은 "그래서 내가 뭘 해야 하나"다. */
const steps = [
  {
    no: "01",
    title: "제품 검토",
    brand: "샘플, 성분표, 제조공정서",
    klink: "태국 시장 적합성과 등록 가능 여부 확인",
  },
  {
    no: "02",
    title: "태국 FDA 등록",
    brand: "제조사 발급 서류 협조",
    klink: "저희 법인 명의로 신고, 라벨 사전승인",
  },
  {
    no: "03",
    title: "수입 · 통관",
    brand: "한국에서 출고",
    klink: "수입자로서 통관, 태국어 라벨 부착",
  },
  {
    no: "04",
    title: "유통 · 판매",
    brand: "—",
    klink: "도매·리테일 입점, 캐릭터 기반 매대 마케팅",
  },
];

const alternatives = [
  {
    name: "KOTRA · 무역관",
    body: "시장 정보와 바이어 매칭까지. 수입자가 되어주지는 않습니다.",
  },
  {
    name: "수출 대행사",
    body: "바이어는 찾아줍니다. 인허가 주체도 재고 리스크도 브랜드가 집니다.",
  },
  {
    name: "대형 유통사",
    body: "유통망은 넓지만 이미 검증된 브랜드만 받습니다.",
  },
];

/** 숫자는 전부 출처를 붙인다. 근거 없는 숫자는 브랜드 담당자가 가장 먼저 의심한다. */
const marketFacts = [
  {
    value: "13,660개",
    label: "태국 7-Eleven 점포 수",
    body: "편의점 시장의 약 72%를 한 체인이 쥐고 있습니다.",
    source: "CP All, 2022년 말 기준",
  },
  {
    value: "4배",
    label: "TikTok Shop 태국 매출 증가",
    body: "연매출이 121억에서 544억 바트로 늘며 Lazada를 제쳤습니다. 라이브커머스가 실질 채널입니다.",
    source: "2025년",
  },
  {
    value: "69~89바트",
    label: "'작은 프리미엄' 가격대",
    body: "가계부채로 큰 지출은 줄고, 1회분 소포장으로 소비가 이동하고 있습니다.",
    source: "USDA FAS 방콕, 2025.12",
  },
];

const brands = [
  {
    name: "포지티바",
    kind: "올리브오일 스틱",
    desc: "유기농 엑스트라버진 20ml 스틱과 토마토를 더한 스틱, 2종",
    img: "/brands/positiva-mascot.webp",
    tint: "#EAEFDD",
  },
  {
    name: "은휘플로우",
    kind: "늙은호박즙",
    desc: "국내산 늙은호박 100%, 90ml 파우치, HACCP 인증 시설 생산",
    img: "/brands/eunhwi-mascot.webp",
    tint: "#FAEEDA",
  },
];

export default function LandingKo() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#0A0E1A] antialiased">
      {/* HERO — 한국 브랜드 담당자에게 필요한 건 귀여움이 아니라 실행 능력의 증거다 */}
      <section className="relative overflow-hidden bg-[#0A0E1A] px-6 pb-16 pt-24 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 75% at 50% 0%, rgba(12,63,128,0.6) 0%, rgba(10,14,26,0) 62%)",
          }}
        />
        <div className="relative mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/brands/klink-mark.webp"
              alt="B&Y k-link"
              className="mb-7 h-12 w-auto drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              한국 브랜드의 태국 진출
            </span>
            <h1 className="mt-4 text-[2.4rem] font-bold leading-[1.15] tracking-tight sm:text-[2.9rem]">
              태국 진출을
              <br />
              대행하지 않습니다
              <br />
              <span className="text-[#7FB2F0]">수입자가 됩니다</span>
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-white/60">
              태국에 등록된 저희 법인 명의로 수입 허가를 갖고, 태국 FDA 등록부터
              통관, 매대 입점까지 진행합니다. 브랜드는 한국에서 출고만 하시면
              됩니다.
            </p>

            <div className="mt-8 flex flex-col gap-2.5">
              <a
                href="#contact"
                className="flex h-14 items-center justify-center gap-2 rounded-xl bg-white font-bold text-[#0A0E1A] transition-colors active:bg-white/85"
              >
                진출 상담 신청
                <ArrowRight size={18} />
              </a>
              <a
                href="#process"
                className="flex h-14 items-center justify-center gap-2 rounded-xl border border-white/20 font-bold text-white/90 transition-colors active:bg-white/10"
              >
                어떻게 진행되는지 보기
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 문제 정의 — 규제 사실로 못박는다. 여기가 무너지면 나머지가 다 무의미하다. */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-lg px-5">
          <motion.div {...fadeUp}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0C3F80]">
              왜 혼자서는 안 되는가
            </p>
            <h2 className="mt-3 text-[1.9rem] font-bold leading-[1.2] tracking-tight">
              허가는 회사가 아니라
              <br />
              주소에 붙습니다
            </h2>
          </motion.div>

          <div className="mt-8 space-y-2.5">
            {barriers.map((b, i) => (
              <motion.div
                key={b.title}
                {...fadeUp}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-black/6 bg-[#FBFAF8] p-5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0C3F80]/8 text-[#0C3F80]">
                  <b.Icon size={17} />
                </span>
                <h3 className="mt-3.5 text-[15.5px] font-bold leading-snug tracking-tight">
                  {b.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-500">
                  {b.body}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fadeUp}
            className="mt-6 border-l-2 border-[#0C3F80] pl-4 text-[14.5px] font-semibold leading-relaxed"
          >
            그래서 한국 브랜드가 단독으로 태국에 식품을 파는 방법은 존재하지
            않습니다. 태국 법인을 수입자로 세우는 것이 유일한 경로입니다.
          </motion.p>
        </div>
      </section>

      {/* 역할 분담 — "그래서 내가 뭘 해야 하나"에 답한다 */}
      <section id="process" className="scroll-mt-4 bg-[#FBF7EF] py-16">
        <div className="mx-auto max-w-lg px-5">
          <motion.div {...fadeUp}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
              진행 방식
            </p>
            <h2 className="mt-3 text-[1.9rem] font-bold leading-[1.2] tracking-tight">
              브랜드가 하는 일과
              <br />
              저희가 하는 일
            </h2>
          </motion.div>

          <ol className="mt-8 space-y-2.5">
            {steps.map((s, i) => (
              <motion.li
                key={s.no}
                {...fadeUp}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-black/5 bg-white p-5"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[12px] font-black tracking-tight text-[#0C3F80]">
                    {s.no}
                  </span>
                  <h3 className="text-[16px] font-bold tracking-tight">{s.title}</h3>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-neutral-50 p-3">
                    <dt className="text-[10.5px] font-bold uppercase tracking-wider text-neutral-400">
                      브랜드
                    </dt>
                    <dd className="mt-1.5 text-[13px] leading-snug text-neutral-600">
                      {s.brand}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-[#0C3F80]/6 p-3">
                    <dt className="text-[10.5px] font-bold uppercase tracking-wider text-[#0C3F80]">
                      klink
                    </dt>
                    <dd className="mt-1.5 text-[13px] font-medium leading-snug">
                      {s.klink}
                    </dd>
                  </div>
                </dl>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* 대안 비교 — 담당자는 이미 KOTRA를 다녀왔다. 그 경험과 대조시킨다. */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-lg px-5">
          <motion.div {...fadeUp}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
              다른 선택지와 비교
            </p>
            <h2 className="mt-3 text-[1.9rem] font-bold leading-[1.2] tracking-tight">
              어디까지 해주는가
            </h2>
          </motion.div>

          <div className="mt-8 space-y-2.5">
            {alternatives.map((a, i) => (
              <motion.div
                key={a.name}
                {...fadeUp}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-black/6 bg-[#FBFAF8] px-5 py-4"
              >
                <h3 className="text-[14.5px] font-bold tracking-tight text-neutral-500">
                  {a.name}
                </h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-neutral-400">
                  {a.body}
                </p>
              </motion.div>
            ))}

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.15 }}
              className="rounded-2xl bg-[#0A0E1A] px-5 py-5 text-white"
            >
              <h3 className="text-[15.5px] font-bold tracking-tight">B&amp;Y k-link</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/70">
                저희 법인 명의로 수입하고 등록합니다. 인허가 주체가 저희이므로
                통관에서 막힐 위험을 브랜드가 지지 않습니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 준비 중인 브랜드 — 캐릭터를 "우리가 만드는 마케팅 자산" 문맥에 놓는다 */}
      <section className="bg-[#FBF7EF] py-16">
        <div className="mx-auto max-w-lg px-5">
          <motion.div {...fadeUp}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
              지금 준비 중인 브랜드
            </p>
            <h2 className="mt-3 text-[1.9rem] font-bold leading-[1.2] tracking-tight">
              브랜드마다 캐릭터를
              <br />
              같이 만듭니다
            </h2>
            <p className="mt-3.5 text-[14px] leading-relaxed text-neutral-500">
              태국은 마스코트로 브랜드를 세우는 문법이 이미 자리잡은 시장입니다.
              수입 식품 대부분은 매대에서 쓸 자산이 없습니다. 저희는 캐릭터를
              만들어 진열 POP과 온라인 소재로 씁니다.
            </p>
          </motion.div>

          <div className="mt-8 space-y-2.5">
            {brands.map((b, i) => (
              <motion.article
                key={b.name}
                {...fadeUp}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4"
              >
                <div
                  className="relative h-20 w-20 shrink-0 rounded-2xl"
                  style={{ backgroundColor: b.tint }}
                >
                  <img
                    src={b.img}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain p-2 drop-shadow-[0_3px_5px_rgba(0,0,0,0.10)]"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-[16px] font-bold tracking-tight">{b.name}</h3>
                    <span className="text-[12px] font-semibold text-[#0C3F80]">
                      {b.kind}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">
                    {b.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 왜 지금 태국인가 — 숫자는 전부 출처를 붙인다 */}
      <section className="bg-[#0A0E1A] py-16 text-white">
        <div className="mx-auto max-w-lg px-5">
          <motion.div {...fadeUp}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5B9BE8]">
              왜 지금 태국인가
            </p>
            <h2 className="mt-3 text-[1.9rem] font-bold leading-[1.2] tracking-tight">
              대형 리테일 없이도
              <br />
              시작할 수 있습니다
            </h2>
          </motion.div>

          <div className="mt-8 space-y-2.5">
            {marketFacts.map((f, i) => (
              <motion.div
                key={f.label}
                {...fadeUp}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[1.7rem] font-bold leading-none tracking-tight text-[#7FB2F0]">
                    {f.value}
                  </span>
                  <span className="text-[13px] font-semibold text-white/80">
                    {f.label}
                  </span>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">
                  {f.body}
                </p>
                <p className="mt-2 text-[11px] text-white/30">{f.source}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 상담 */}
      <section id="contact" className="scroll-mt-4 bg-white py-16">
        <motion.div {...fadeUp} className="mx-auto max-w-lg px-5">
          <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight">
            태국, 한번 보시겠습니까
          </h2>
          <p className="mt-3.5 text-[14.5px] leading-relaxed text-neutral-500">
            제품 카테고리와 현재 국내 유통 상황만 알려주시면, 태국에서 등록이
            가능한 품목인지부터 확인해 드립니다. 검토 단계에서는 비용이 들지
            않습니다.
          </p>

          <div className="mt-7 space-y-2.5">
            {CONTACT_EMAIL && (
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  "태국 진출 상담 요청",
                )}`}
                className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#0A0E1A] font-bold text-white transition-colors active:bg-[#0A0E1A]/85"
              >
                <Mail size={18} />
                이메일로 문의
              </a>
            )}
            {LINE_URL && (
              <a
                href={LINE_URL}
                target="_blank"
                rel="noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-xl border border-neutral-200 font-bold transition-colors active:bg-neutral-50"
              >
                <MessageCircle size={18} />
                LINE으로 문의
              </a>
            )}
            {!CONTACT_EMAIL && !LINE_URL && (
              <p className="rounded-xl border border-dashed border-neutral-300 py-4 text-center text-[12px] text-neutral-400">
                연락처가 아직 설정되지 않았습니다
              </p>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-black/5 px-6 py-10 text-center">
        <img
          src="/brands/klink-mark.webp"
          alt=""
          className="mx-auto mb-3 h-8 w-auto opacity-40"
        />
        <p className="text-[12px] leading-relaxed text-neutral-400">
          B&amp;Y k-link co., ltd. — 태국 방콕
        </p>
        <p className="mx-auto mt-4 max-w-sm text-[11.5px] leading-relaxed text-neutral-300">
          현재 첫 제품군의 태국 FDA 등록을 진행 중이며 아직 판매를 시작하지
          않았습니다. 2026년 출시 예정.
        </p>
      </footer>
    </div>
  );
}

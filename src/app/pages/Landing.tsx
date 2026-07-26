import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Mail, ArrowRight, Check } from "lucide-react";
import { t, LANG_KEY, LANG_LABEL, detectLang, type Lang } from "../i18n";

/** 값이 없으면 해당 버튼을 렌더링하지 않는다. 없는 연락처를 지어내지 않기 위함. */
const LINE_URL = (import.meta.env.VITE_LINE_URL as string) || "";
const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string) || "";

export default function Landing() {
  const [lang, setLang] = useState<Lang>("th");
  const c = t[lang];

  useEffect(() => setLang(detectLang()), []);

  function switchLang(next: Lang) {
    setLang(next);
    localStorage.setItem(LANG_KEY, next);
    document.documentElement.lang = next;
  }

  /** 브랜드 캐릭터는 누끼 이미지다. 타일 배경색은 캐릭터 색에서 뽑아 맞춘다. */
  const brands = [
    {
      name: c.positivaName,
      kind: c.positivaKind,
      desc: c.positivaDesc,
      mascot: "/brands/positiva-mascot.webp",
      mascotTint: "#EAEFDD",
      accent: "#5E7241",
      items: [
        {
          name: c.olleName,
          sub: c.olleDesc,
          size: "20 ml",
          img: "/brands/positiva-olleshot.webp",
          tint: "#FBF0D6",
        },
        {
          name: c.oltoName,
          sub: c.oltoDesc,
          size: "20 ml",
          img: "/brands/positiva-oltoshot.webp",
          tint: "#FBE5D9",
        },
      ],
    },
    {
      name: c.eunhwiName,
      kind: c.eunhwiKind,
      desc: c.eunhwiDesc,
      mascot: "/brands/eunhwi-mascot.webp",
      mascotTint: "#FAEEDA",
      accent: "#A6641B",
      items: [
        {
          name: c.eunhwiSkuName,
          sub: c.eunhwiSkuDesc,
          size: "90 ml",
          img: "/brands/eunhwi-character.webp",
          tint: "#FBF1DA",
        },
        {
          name: c.realPhotoLabel,
          sub: c.madeInKorea,
          size: "",
          img: "/brands/eunhwi-product.webp",
          tint: "#F1F1EF",
          photo: true,
        },
      ],
    },
  ];

  const facts = [
    { label: c.fact1Label, value: c.fact1Value },
    { label: c.fact2Label, value: c.fact2Value },
    { label: c.fact3Label, value: c.fact3Value },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#0A0E1A] antialiased">
      {/* 언어 전환 — 현장에서 즉시 바꿀 수 있도록 항상 상단 고정 */}
      <div className="fixed right-4 top-4 z-50 flex items-center gap-0.5 rounded-full border border-white/15 bg-black/35 p-0.5 backdrop-blur-md">
        {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => switchLang(l)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-colors ${
              lang === l ? "bg-white text-[#0A0E1A]" : "text-white/70"
            }`}
          >
            {LANG_LABEL[l]}
          </button>
        ))}
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A0E1A] px-6 pb-20 pt-24 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, rgba(12,63,128,0.55) 0%, rgba(10,14,26,0) 65%)",
          }}
        />
        <div className="relative mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <img
              src="/favicon.png"
              alt="B&Y k-link"
              className="mb-8 h-16 w-auto drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/45">
              {c.eyebrow}
            </span>
            <h1 className="mt-5 whitespace-pre-line text-[2.6rem] font-bold leading-[1.15] tracking-tight sm:text-5xl">
              {c.heroTitle}
            </h1>
            <div className="mt-7 h-px w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <p className="mt-7 text-[15px] leading-relaxed text-white/65">{c.heroSub}</p>
          </motion.div>
        </div>
      </section>

      {/* 현재 상태 — 레퍼런스가 없을 때는 검증 가능한 사실이 유일한 신뢰 근거다 */}
      {/* relative z-10 — 히어로의 absolute 그라디언트가 위로 덮는 것을 막는다 */}
      <section className="relative z-10 mx-auto -mt-8 max-w-lg px-5">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_24px_rgba(10,14,26,0.06)]">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0C3F80]">
            {c.statusLabel}
          </p>
          <dl className="space-y-3.5">
            {facts.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-4">
                <dt className="shrink-0 text-[13px] text-neutral-400">{f.label}</dt>
                <dd className="text-right text-[14px] font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 border-t border-neutral-100 pt-4 text-[12.5px] leading-relaxed text-neutral-500">
            {c.honestNote}
          </p>
        </div>
      </section>

      {/* 제품 — 실물 3종이 현재 유일한 구체적 증거다. 캐릭터로 기억에 남긴다. */}
      <section className="mt-14 bg-[#FBF7EF] py-14">
        <div className="mx-auto max-w-lg px-5">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            {c.productsLabel}
          </p>
          <div className="space-y-4">
            {brands.map((brand, i) => (
              <motion.article
                key={brand.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08 }}
                className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_2px_20px_rgba(10,14,26,0.05)]"
              >
                <header className="flex items-center gap-4 px-5 pt-5">
                  <div
                    className="relative h-16 w-16 shrink-0 rounded-2xl"
                    style={{ backgroundColor: brand.mascotTint }}
                  >
                    <img
                      src={brand.mascot}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-contain p-1.5 drop-shadow-[0_3px_5px_rgba(0,0,0,0.10)]"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className="text-lg font-bold tracking-tight">{brand.name}</h3>
                      <span
                        className="text-[12px] font-semibold"
                        style={{ color: brand.accent }}
                      >
                        {brand.kind}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">
                      {brand.desc}
                    </p>
                  </div>
                </header>

                <div className="grid grid-cols-2 gap-2.5 p-4">
                  {brand.items.map((item) => (
                    <div
                      key={item.name}
                      className="overflow-hidden rounded-2xl"
                      style={{ backgroundColor: item.tint }}
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={item.img}
                          alt={item.name}
                          loading="lazy"
                          className={
                            item.photo
                              ? "absolute inset-0 h-full w-full object-cover"
                              : "absolute inset-0 h-full w-full object-contain p-3 drop-shadow-[0_6px_9px_rgba(0,0,0,0.12)]"
                          }
                        />
                        {item.size && (
                          <span className="absolute right-2 top-2 rounded-full bg-white/75 px-2 py-0.5 text-[10px] font-bold tracking-tight text-neutral-600 backdrop-blur-sm">
                            {item.size}
                          </span>
                        )}
                      </div>
                      <div className="px-3 pb-3.5 pt-2.5">
                        <p className="text-[13px] font-bold leading-tight tracking-tight">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[11.5px] leading-snug text-neutral-500">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 분기 — 고객과 관계자는 다음 행동이 다르다 */}
      <section className="mx-auto max-w-lg px-5 pb-28 pt-14">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
          {c.forkLabel}
        </p>

        <div className="mb-3.5 rounded-2xl bg-[#0A0E1A] p-7 text-white">
          <h3 className="text-xl font-bold tracking-tight">{c.consumerTitle}</h3>
          <p className="mt-2.5 text-[14px] leading-relaxed text-white/60">
            {c.consumerBody}
          </p>
          {LINE_URL ? (
            <a
              href={LINE_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex h-14 items-center justify-center gap-2 rounded-xl bg-[#06C755] font-bold transition-colors active:bg-[#05b34c]"
            >
              <MessageCircle size={19} />
              {c.consumerCta}
            </a>
          ) : (
            <p className="mt-6 rounded-xl border border-dashed border-white/20 py-4 text-center text-[12px] text-white/40">
              {c.lineMissing}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-black/8 bg-white p-7">
          <h3 className="text-xl font-bold tracking-tight">{c.partnerTitle}</h3>
          <p className="mt-2.5 text-[14px] leading-relaxed text-neutral-500">
            {c.partnerBody}
          </p>
          <div className="mt-6 space-y-2.5">
            {LINE_URL && (
              <a
                href={LINE_URL}
                target="_blank"
                rel="noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#0C3F80] font-bold text-white transition-colors active:bg-[#0a3468]"
              >
                {c.partnerCta}
                <ArrowRight size={18} />
              </a>
            )}
            {CONTACT_EMAIL && (
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex h-14 items-center justify-center gap-2 rounded-xl border border-neutral-200 font-bold transition-colors active:bg-neutral-50"
              >
                <Mail size={18} />
                {c.emailCta}
              </a>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 px-6 py-8 text-center">
        <img src="/favicon.png" alt="" className="mx-auto mb-3 h-7 w-auto opacity-40" />
        <p className="text-[12px] text-neutral-400">{c.footerNote}</p>
      </footer>

      {/* 모바일 하단 고정 CTA — QR 유입의 이탈 지점을 막는다 */}
      {LINE_URL && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/92 px-4 py-3 backdrop-blur-md sm:hidden">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-13 items-center justify-center gap-2 rounded-xl bg-[#06C755] py-3.5 font-bold text-white"
          >
            <Check size={18} />
            {c.consumerCta}
          </a>
        </div>
      )}
    </div>
  );
}

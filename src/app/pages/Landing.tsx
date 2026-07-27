import { useEffect, useState } from "react";
import { LANG_KEY, LANG_LABEL, detectLang, type Lang } from "../i18n";
import LandingKo from "./LandingKo";
import LandingTh from "./LandingTh";

/**
 * 언어 전환은 번역이 아니라 독자 전환이다. 근거는 docs/stp.md.
 * 한국어 → 태국 진출을 검토하는 한국 브랜드(공급측)
 * 태국어·영어 → 태국 소비자·유통·리테일(수요측)
 */
export default function Landing() {
  const [lang, setLang] = useState<Lang>("th");

  useEffect(() => {
    const detected = detectLang();
    setLang(detected);
    document.documentElement.lang = detected;
  }, []);

  function switchLang(next: Lang) {
    setLang(next);
    localStorage.setItem(LANG_KEY, next);
    document.documentElement.lang = next;
    window.scrollTo(0, 0);
  }

  return (
    <>
      {/* 현장에서 즉시 바꿀 수 있도록 항상 상단 고정. 두 페이지 모두 히어로가 어두워 흰 글씨가 읽힌다. */}
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

      {lang === "ko" ? <LandingKo /> : <LandingTh lang={lang} />}
    </>
  );
}

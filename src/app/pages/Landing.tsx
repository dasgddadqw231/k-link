import { useEffect } from "react";
import { LANG_KEY, LANG_LABEL, type Lang } from "../i18n";
import { LANG_PATH } from "../seo";
import LandingKo from "./LandingKo";
import LandingTh from "./LandingTh";

/**
 * 언어 전환은 번역이 아니라 독자 전환이다. 근거는 docs/stp.md.
 * 한국어 → 태국 진출을 검토하는 한국 브랜드(공급측)
 * 태국어·영어 → 태국 소비자·유통·리테일(수요측)
 *
 * 언어는 URL이 결정한다. 전환은 버튼이 아니라 실제 링크여야 크롤러가 다른 언어판을
 * 따라갈 수 있다. 페이지가 세 장뿐이라 전체 로드 비용도 문제가 되지 않는다.
 */
export default function Landing({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /**
   * 선택은 클릭 시점에만 저장한다. 마운트 때 저장하면 루트(태국어)에 들어온 순간
   * 'th'가 박혀서, 자식 effect가 부모보다 먼저 도는 탓에 LangRedirect가
   * 브라우저 언어를 보기도 전에 무력화된다.
   */
  function remember(next: Lang) {
    localStorage.setItem(LANG_KEY, next);
  }

  return (
    <>
      {/* 현장에서 즉시 바꿀 수 있도록 항상 상단 고정. 두 페이지 모두 히어로가 밝아 어두운 글씨가 읽힌다. */}
      <nav
        aria-label="Language"
        className="fixed right-4 top-4 z-50 flex items-center gap-0.5 rounded-full border border-black/10 bg-white/75 p-0.5 shadow-sm backdrop-blur-md"
      >
        {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
          <a
            key={l}
            href={LANG_PATH[l]}
            hrefLang={l}
            onClick={() => remember(l)}
            aria-current={lang === l ? "true" : undefined}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-colors ${
              lang === l ? "bg-[#2563EB] text-white" : "text-neutral-500"
            }`}
          >
            {LANG_LABEL[l]}
          </a>
        ))}
      </nav>

      {lang === "ko" ? <LandingKo /> : <LandingTh lang={lang} />}
    </>
  );
}

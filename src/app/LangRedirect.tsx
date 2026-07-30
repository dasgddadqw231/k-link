import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { LANG_KEY, type Lang } from "./i18n";
import { LANG_PATH } from "./seo";

/**
 * 루트는 태국어로 프리렌더된다. 검색엔진은 그 상태 그대로 색인한다.
 * 브라우저에서만, 저장된 선택이나 브라우저 언어가 한국어·영어면 해당 주소로 옮긴다.
 *
 * 서버 리다이렉트가 아니라 클라이언트에서 처리하는 이유: 크롤러는 리다이렉트를 따라가지
 * 않고 루트의 태국어 본문을 그대로 본다. canonical과 hreflang이 나머지를 정리한다.
 */
export default function LangRedirect({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    const preferred: Lang | null =
      saved && ["ko", "th", "en"].includes(saved)
        ? saved
        : navigator.language.toLowerCase().startsWith("ko")
          ? "ko"
          : null;

    if (preferred && preferred !== "th") {
      setRedirecting(true);
      navigate(LANG_PATH[preferred], { replace: true });
    }
  }, [navigate]);

  // 리다이렉트가 확정된 순간에는 태국어 화면이 깜빡이지 않게 비운다.
  // 배경은 랜딩의 종이색과 같아야 한다 — 다른 색이면 그 색이 한 프레임 번쩍인다.
  if (redirecting) return <div className="min-h-screen bg-[#FCFCFD]" />;
  return <>{children}</>;
}

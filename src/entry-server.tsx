import { renderToString } from "react-dom/server";
import Landing from "./app/pages/Landing";
import type { Lang } from "./app/i18n";

/**
 * 빌드 때만 실행된다. 랜딩만 렌더하고 /board는 건드리지 않는다 —
 * 보드는 Supabase 클라이언트를 모듈 로드 시점에 만들고, 색인 대상도 아니다.
 * Landing이 라우터 훅을 쓰지 않으므로 라우터 컨텍스트 없이 렌더된다.
 */
export function render(lang: Lang) {
  return renderToString(<Landing lang={lang} />);
}

/** 프리렌더 스크립트가 한 번들에서 다 꺼내 쓰도록 메타도 같이 내보낸다. */
export {
  META,
  LANG_PATH,
  HREFLANG,
  SITE_URL,
  organizationJsonLd,
  productsJsonLd,
} from "./app/seo";

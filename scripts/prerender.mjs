/**
 * 빌드된 SPA에 언어별 정적 HTML을 얹는다.
 *
 * 왜 필요한가: 이 사이트는 클라이언트 렌더링이라 크롤러가 받는 HTML이 비어 있었다.
 * 구글은 자바스크립트를 실행하지만 2단계 색인이라 지연되고, LINE·페이스북·네이버
 * 크롤러는 아예 실행하지 않는다. QR로 받은 링크가 메신저에서 공유될 때 미리보기가
 * 뜨지 않는 게 그 때문이다.
 *
 * 하이드레이션은 하지 않는다. 프리렌더 결과는 크롤러와 첫 페인트를 위한 것이고,
 * 브라우저는 기존대로 createRoot로 다시 그린다. 마크업 불일치로 앱이 깨질 위험을
 * 감수하는 것보다 낫다.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

const { render, META, LANG_PATH, HREFLANG, SITE_URL, organizationJsonLd, productsJsonLd } =
  await import(resolve(dist, "server/entry-server.js"));

const template = readFileSync(resolve(dist, "index.html"), "utf-8");
const OG_IMAGE = `${SITE_URL}/og.jpg`;

function head(lang) {
  const meta = META[lang];
  const canonical = SITE_URL + (LANG_PATH[lang] === "/" ? "/" : LANG_PATH[lang]);
  const alternates = Object.keys(LANG_PATH)
    .map(
      (l) =>
        `<link rel="alternate" hreflang="${HREFLANG[l]}" href="${SITE_URL}${
          LANG_PATH[l] === "/" ? "/" : LANG_PATH[l]
        }" />`,
    )
    .join("\n    ");

  return `<meta name="description" content="${esc(meta.description)}" />
    <link rel="canonical" href="${canonical}" />
    ${alternates}
    <link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="B&amp;Y k-link" />
    <meta property="og:locale" content="${meta.ogLocale}" />
    <meta property="og:title" content="${esc(meta.title)}" />
    <meta property="og:description" content="${esc(meta.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(meta.title)}" />
    <meta name="twitter:description" content="${esc(meta.description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <script type="application/ld+json">${JSON.stringify(organizationJsonLd())}</script>
    <script type="application/ld+json">${JSON.stringify(productsJsonLd())}</script>`;
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

for (const lang of ["th", "en", "ko"]) {
  const html = template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(
      /<title>.*?<\/title>/,
      `<title>${esc(META[lang].title)}</title>\n    ${head(lang)}`,
    )
    .replace('<div id="root"></div>', `<div id="root">${render(lang)}</div>`);

  const path = LANG_PATH[lang];
  const out = path === "/" ? resolve(dist, "index.html") : resolve(dist, path.slice(1), "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`prerendered ${path.padEnd(4)} → ${(html.length / 1024).toFixed(1)}kB`);
}

/**
 * 보드는 색인 대상이 아니라 프리렌더하지 않는다. 다만 빈 셸을 따로 두지 않으면
 * dist/index.html(태국어 랜딩)을 받아 보드가 뜨기 전에 랜딩이 한 번 번쩍인다.
 */
mkdirSync(resolve(dist, "board"), { recursive: true });
writeFileSync(
  resolve(dist, "board/index.html"),
  template.replace(
    "<title>",
    '<meta name="robots" content="noindex, nofollow" />\n    <title>',
  ),
);
console.log("board shell (noindex, 프리렌더 없음)");

import type { Lang } from "./i18n";

export const SITE_URL = "https://www.b-y-klink.com";

/**
 * 언어 = URL. 검색엔진은 localStorage를 모른다. 언어마다 색인 가능한 주소가 있어야
 * hreflang이 성립하고, 언어별로 다른 키워드로 잡힌다.
 * 태국 시장이 주 독자이므로 루트를 태국어에 준다.
 */
export const LANG_PATH: Record<Lang, string> = {
  th: "/",
  en: "/en",
  ko: "/ko",
};

export const PATH_LANG: Record<string, Lang> = {
  "/": "th",
  "/en": "en",
  "/ko": "ko",
};

/** hreflang 표기용 로케일. 태국어·영어는 태국 독자, 한국어는 한국 독자를 향한다. */
export const HREFLANG: Record<Lang, string> = {
  th: "th-TH",
  en: "en",
  ko: "ko-KR",
};

export interface PageMeta {
  title: string;
  description: string;
  ogLocale: string;
}

/**
 * 언어별 메타는 독자가 다르므로 문장도 달라야 한다.
 * 태국어·영어는 소비자와 유통을, 한국어는 태국 진출을 검토하는 브랜드를 향한다.
 * 제목은 60자, 설명은 155자 안쪽으로 유지한다.
 */
export const META: Record<Lang, PageMeta> = {
  th: {
    title: "B&Y k-link — นำเข้าสินค้าเกาหลีคัดสรร โดยบริษัทจดทะเบียนในไทย",
    description:
      "น้ำมันมะกอกแบบซองสติ๊ก Positiva และน้ำฟักทองเกาหลี Eunhwi Flow กำลังจะมาถึงไทย เราเป็นผู้นำเข้าเอง ดูแลการขึ้นทะเบียน อย. และจัดส่งถึงหน้าร้าน",
    ogLocale: "th_TH",
  },
  en: {
    title: "B&Y k-link — Korean food brands, imported into Thailand",
    description:
      "Positiva olive oil sticks and Eunhwi Flow pumpkin juice, coming to Thailand. A Thai-registered importer handling FDA registration, customs and retail placement.",
    ogLocale: "en_US",
  },
  ko: {
    title: "B&Y k-link — 한국 브랜드의 태국 진출, 수입자가 되어 드립니다",
    description:
      "태국 식품 수입 허가는 태국 내 주소에 귀속됩니다. 태국 법인인 저희가 수입자로서 태국 FDA 등록부터 통관, 매대 입점까지 진행합니다. 브랜드는 출고만 하시면 됩니다.",
    ogLocale: "ko_KR",
  },
};

/**
 * 검색결과에 회사 정보로 뜨게 하는 최소 구조화 데이터. 없는 사실은 넣지 않는다.
 *
 * 주소와 등록번호는 태국 상무부 사업개발국(DBD) 등기부 그대로다. 여기는 사람이
 * 읽는 자리가 아니라 기계가 대조하는 자리라, 푸터에 적은 것과 한 글자도 달라선
 * 안 된다. 예전에는 여기에 Bangkok이 들어 있었는데 등기상 본점은 사뭇사콘이다.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "B&Y k-link Co., Ltd.",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description:
      "A Thai-registered company importing and distributing selected Korean food brands.",
    taxID: "0745569003634",
    email: "info@b-y-klink.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "52/6 Moo 5, Bang Nam Chuet",
      addressLocality: "Mueang Samut Sakhon",
      addressRegion: "Samut Sakhon",
      addressCountry: "TH",
    },
  };
}

/**
 * 제품은 아직 판매 전이라 offers/price를 넣지 않는다.
 * 있지도 않은 판매 정보를 구조화 데이터로 넣으면 리치 리절트 위반이다.
 */
export function productsJsonLd() {
  const items = [
    {
      name: "Positiva Olle Shot",
      description:
        "Single-serve 20 ml stick: 65% organic extra virgin olive oil, 35% organic lemon juice.",
      image: `${SITE_URL}/brands/sku-olleshot.webp`,
      brand: "Positiva",
    },
    {
      name: "Positiva Olto Shot",
      description: "Single-serve 20 ml stick: olive oil paired with tomato.",
      image: `${SITE_URL}/brands/sku-oltoshot.webp`,
      brand: "Positiva",
    },
    {
      name: "Eunhwi Flow Korean Pumpkin Juice",
      description:
        "90 ml pouch made from 100% Korean-grown mature pumpkin, produced in a HACCP-certified facility.",
      image: `${SITE_URL}/brands/sku-hobak.webp`,
      brand: "Eunhwi Flow",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        description: p.description,
        image: p.image,
        brand: { "@type": "Brand", name: p.brand },
      },
    })),
  };
}

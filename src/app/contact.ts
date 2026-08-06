/**
 * 연락처 한 곳.
 *
 * 페이지마다 따로 읽던 시절에 한국어 페이지만 기본값을 갖고 태국어·영어 페이지는
 * 빈 문자열로 남았다. 그 결과 태국 유통 담당자가 다섯 장짜리 제안을 다 읽고 나면
 * 연락할 방법이 한 줄도 없는 화면을 봤다. 값은 여기서만 정한다.
 *
 * 전화번호는 한국 번호라 한국어 페이지에만 쓴다. 태국 소비자·유통에게 +82 휴대폰을
 * 내미는 것은 연락 수단이 아니라 장벽이다.
 */
export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string) || "info@b-y-klink.com";

export const CONTACT_PHONE =
  (import.meta.env.VITE_CONTACT_PHONE as string) || "010-7376-7012";

/** tel: 링크는 하이픈을 못 읽는 다이얼러가 있어 숫자만 남긴다. */
export const TEL_HREF = `tel:${CONTACT_PHONE.replace(/[^0-9+]/g, "")}`;

/**
 * LINE은 아직 계정이 없으면 빈 값이다. 이 값이 비었을 때 "링크가 설정되지
 * 않았습니다"를 손님에게 보여주지 않는다 — 그건 우리 설정 상태이지 손님이 알
 * 일이 아니다. 대신 이메일로 길을 낸다.
 */
export const LINE_URL = (import.meta.env.VITE_LINE_URL as string) || "";

/** 메일 제목을 미리 채워 두면 어느 페이지에서 온 문의인지 받는 쪽에서 갈린다. */
export function mailto(subject: string, body?: string) {
  const q = body
    ? `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : `?subject=${encodeURIComponent(subject)}`;
  return `mailto:${CONTACT_EMAIL}${q}`;
}

import { Fragment, type ReactNode } from "react";

/**
 * 랜딩 두 장(LandingKo · LandingTh)이 공유하는 단 하나의 디자인 시스템.
 *
 * 이 파일 밖에서 색·타이포 값을 직접 쓰지 않는다. 이전 버전이 정돈돼 보이지
 * 않았던 이유가 그것이었다 — 배경이 여덟 가지(차가운 블루와 따뜻한 크림이 번갈아),
 * 글자 크기가 스무 가지, 반경이 네 가지였다. 값을 늘리고 싶으면 여기서 늘린다.
 *
 * 색은 한 계열만 쓴다. 중성 종이색 위에 잉크, 그리고 브랜드 네이비는 큰 색면이
 * 아니라 선·아이콘·버튼 같은 좁은 면적에만 얹는다. 위계는 색이 아니라 활자
 * 크기와 여백이 만든다.
 */

export const C = {
  paper: "#FCFCFD",
  alt: "#F4F6F8",
  ink: "#12161F",
  ink2: "#5A6373",
  ink3: "#8B94A3",
  navy: "#0C3F80",
  navyDeep: "#092F61",
  hair: "#E3E7ED",
  /** LINE 브랜드 색. LINE 버튼 말고 다른 데 쓰지 않는다. */
  line: "#06C755",
} as const;

/** 타이포 스케일. 본문은 400, 제목은 600/700 — 전부 볼드로 만들지 않는다. */
export const T = {
  display:
    "text-[32px] leading-[1.14] font-bold tracking-[-0.022em] sm:text-[40px] md:text-[52px] md:leading-[1.06]",
  h2: "text-[25px] leading-[1.2] font-bold tracking-[-0.02em] md:text-[34px] md:leading-[1.14]",
  h3: "text-[16.5px] font-semibold leading-[1.45] tracking-[-0.01em]",
  lead: "text-[16px] leading-[1.7] text-[#5A6373] md:text-[17px] md:leading-[1.72]",
  body: "text-[15px] leading-[1.72] text-[#5A6373]",
  small: "text-[13.5px] leading-[1.6] text-[#8B94A3]",
} as const;

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1080px] px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

/** 섹션 배경은 두 가지뿐이다. 색으로 구획을 나누지 않고 여백으로 나눈다. */
export function Section({
  children,
  tone = "paper",
  id,
  className = "",
}: {
  children: ReactNode;
  tone?: "paper" | "alt";
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`${tone === "alt" ? "bg-[#F4F6F8]" : "bg-[#FCFCFD]"} ${
        id ? "scroll-mt-4 " : ""
      }py-20 md:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * 라벨은 짧은 선 + 글자다. 예전처럼 자간을 벌리지 않는다 — 한글과 태국어는
 * 자간을 벌리면 글자가 흩어져 보이고, 그게 아마추어 인상의 큰 부분이었다.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span aria-hidden className="h-px w-7 bg-[#0C3F80]" />
      <span className="text-[12.5px] font-semibold text-[#0C3F80]">{children}</span>
    </span>
  );
}

export function SectionHead({
  label,
  title,
  lead,
  className = "",
}: {
  label?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[46ch] ${className}`}>
      {label && <Eyebrow>{label}</Eyebrow>}
      <h2 className={`${label ? "mt-5" : ""} whitespace-pre-line ${T.h2}`}>
        {title}
      </h2>
      {lead && <p className={`mt-5 ${T.lead}`}>{lead}</p>}
    </div>
  );
}

/** 카드는 흰 면 + 머리카락 굵기 선. 그림자를 쌓지 않는다. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#E3E7ED] bg-white p-6 md:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "line";
  external?: boolean;
  className?: string;
};

export function Btn({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: BtnProps) {
  const base =
    "inline-flex h-13 items-center justify-center gap-2 rounded-xl px-7 text-[15px] font-semibold transition-colors";
  const skin = {
    primary: "bg-[#0C3F80] text-white hover:bg-[#092F61] active:bg-[#092F61]",
    secondary:
      "border border-[#D7DCE4] bg-white text-[#12161F] hover:border-[#0C3F80] hover:text-[#0C3F80]",
    line: "bg-[#06C755] text-white hover:bg-[#05B34C] active:bg-[#05B34C]",
  }[variant];

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : null)}
      className={`${base} ${skin} ${className}`}
    >
      {children}
    </a>
  );
}

/** 제품 사진은 자기 배경을 물고 있다. 중성 프레임에 얹어 내용으로 다룬다. */
export function Figure({
  src,
  alt,
  badge,
  ratio = "aspect-[4/5]",
  className = "",
}: {
  src: string;
  alt: string;
  badge?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-[#E3E7ED] bg-[#F4F6F8] ${ratio} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {badge && (
        <span className="absolute right-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#5A6373] backdrop-blur-sm">
          {badge}
        </span>
      )}
    </div>
  );
}

/**
 * 푸터에 연락처가 없으면 회사가 실재하는지 확인할 방법이 없다. 상대를 처음 보는
 * 사람이 진위를 확인하러 내려오는 자리가 여기다 — 상호만 적어 두면 그 확인이
 * 실패하고, 그 실패는 곧 "아직 회사 같지 않다"로 읽힌다.
 */
export function Footer({
  children,
  note,
  links,
  legal,
}: {
  children: ReactNode;
  note?: ReactNode;
  /** [보이는 글자, href] 쌍. 없는 연락처를 지어내지 않도록 페이지가 넘긴 것만 건다. */
  links?: [string, string][];
  /** 법인등록번호와 등기상 본점. 상대가 등기부와 대조할 수 있어야 의미가 있다. */
  legal?: ReactNode;
}) {
  return (
    <footer className="border-t border-[#E3E7ED] bg-[#FCFCFD] py-14">
      <Container className="text-center">
        <img
          src="/brands/klink-mark.webp"
          alt=""
          className="mx-auto mb-4 h-7 w-auto opacity-35"
        />
        <p className="text-[13px] text-[#5A6373]">{children}</p>

        {legal && (
          <p className="mx-auto mt-2 max-w-[60ch] text-[12px] leading-relaxed text-[#8B94A3]">
            {legal}
          </p>
        )}

        {links && links.length > 0 && (
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[13px]">
            {links.map(([label, href], i) => (
              <Fragment key={href}>
                {i > 0 && (
                  <span aria-hidden className="text-[#C4CBD5]">
                    ·
                  </span>
                )}
                <a
                  href={href}
                  className="text-[#5A6373] underline decoration-[#D7DCE4] underline-offset-4 transition-colors hover:text-[#0C3F80] hover:decoration-[#0C3F80]"
                >
                  {label}
                </a>
              </Fragment>
            ))}
          </p>
        )}

        {note && (
          <p className={`mx-auto mt-5 max-w-[52ch] ${T.small}`}>{note}</p>
        )}
      </Container>
    </footer>
  );
}

/**
 * 관리자 화면 공용 조각.
 *
 * 반응형 원칙: 모바일에서는 창이 아래에서 올라오고(엄지로 닫기 쉬움) PC에서는
 * 가운데 뜬다. 같은 컴포넌트 하나로 처리해서 화면마다 분기하지 않는다.
 */
import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export const BLUE = "#0C3F80";

export const inputCls =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-[#0C3F80] md:text-sm";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-neutral-500">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-neutral-400">{hint}</span>}
    </label>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  full,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  full?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40";
  const look =
    variant === "primary"
      ? "bg-[#0C3F80] text-white hover:bg-[#0a3468]"
      : variant === "danger"
        ? "text-rose-600 hover:bg-rose-50"
        : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${look} ${full ? "w-full" : ""}`}
    >
      {children}
    </button>
  );
}

/**
 * 선택지가 적을 때는 드롭다운보다 칩이 낫다. 값이 다 보이고 탭 한 번에 끝난다.
 */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  labelOf,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labelOf: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            value === o
              ? "bg-[#0C3F80] text-white"
              : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
          }`}
        >
          {labelOf(o)}
        </button>
      ))}
    </div>
  );
}

/** 가로 스크롤되는 필터 줄. 모바일에서 칩이 줄바꿈으로 쌓이는 걸 막는다. */
export function FilterRow({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-5 mb-4 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
      {children}
    </div>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
        active
          ? "bg-neutral-900 text-white"
          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-xl md:max-h-[85vh] md:max-w-lg md:rounded-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="font-bold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            className="-mr-1.5 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer && (
          <div className="border-t border-neutral-100 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/** 숫자 하나가 주인공인 타일. 색은 뜻이 있을 때만 쓴다. */
export function Tile({
  label,
  value,
  sub,
  tone = "plain",
  onClick,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "plain" | "good" | "bad" | "warn";
  onClick?: () => void;
}) {
  const color =
    tone === "good"
      ? "text-emerald-600"
      : tone === "bad"
        ? "text-rose-600"
        : tone === "warn"
          ? "text-amber-600"
          : "text-neutral-900";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="rounded-2xl border border-neutral-200 bg-white p-4 text-left transition-colors enabled:hover:border-neutral-300 md:p-5"
    >
      <p className="mb-1.5 text-xs font-semibold text-neutral-500">{label}</p>
      <p className={`text-xl font-black tabular-nums md:text-2xl ${color}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-neutral-400">{sub}</p>}
    </button>
  );
}

export function Card({
  children,
  title,
  action,
}: {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {title && (
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
          <h3 className="text-sm font-bold text-neutral-800">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="px-5 py-14 text-center text-sm text-neutral-400">{children}</p>;
}

export function Pill({
  children,
  tone = "gray",
}: {
  children: ReactNode;
  tone?: "gray" | "blue" | "green" | "amber" | "rose";
}) {
  const look = {
    gray: "bg-neutral-100 text-neutral-500",
    blue: "bg-blue-50 text-[#0C3F80]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  }[tone];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${look}`}
    >
      {children}
    </span>
  );
}

/** 모바일 하단 탭에 가려지지 않게 여유를 둔 페이지 컨테이너. */
export function Page({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-5 pb-28 md:px-8 md:pt-8 md:pb-12">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-black tracking-tight text-neutral-900 md:text-2xl">
          {title}
        </h1>
        {action}
      </div>
      {children}
    </div>
  );
}

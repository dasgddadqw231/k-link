/**
 * 관리자 화면 공용 조각.
 *
 * 반응형 원칙: 모바일에서는 창이 아래에서 올라오고(엄지로 닫기 쉬움) PC에서는
 * 가운데 뜬다. 같은 컴포넌트 하나로 처리해서 화면마다 분기하지 않는다.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Check, Search, X } from "lucide-react";

export const BLUE = "#0C3F80";

/**
 * 뜨는 것들의 여닫는 시간.
 *
 * 나갈 때를 들어올 때보다 짧게 둔다 — 닫기는 이미 결정한 동작이라 기다리면
 * 느리게 느껴지고, 열기는 눈이 따라올 시간이 필요하다.
 */
const OVERLAY_OUT_MS = 160;

/**
 * 화면을 덮는 것들은 <body> 밑으로 내보낸다.
 *
 * 탭을 넘길 때 본문에 transform이 걸린다. transform이 걸린 조상이 있으면
 * position: fixed가 화면이 아니라 그 조상을 기준으로 잡혀서, 열려 있던 창이
 * 어긋난 자리에 그려진다. 포털로 빼 두면 본문이 무엇을 하든 상관이 없다.
 */
function Overlay({ children }: { children: ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

/**
 * 닫힘을 애니메이션으로 넘긴다.
 *
 * 부모는 창을 조건부로 그리고 있어서, 닫으라는 신호가 오면 그 즉시 사라진다.
 * 그래서 먼저 나가는 모습을 보여 주고, 끝난 뒤에 부모에게 알린다. 저장처럼
 * 부모가 스스로 닫는 경우는 그대로 즉시 사라진다 — 토스트가 결과를 말해 주니
 * 굳이 붙잡아 둘 이유가 없다.
 */
function useLeave(onClose: () => void) {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const close = useCallback(() => {
    if (timer.current !== null) return; // 두 번 눌러도 한 번만 닫는다
    setLeaving(true);
    timer.current = window.setTimeout(onClose, OVERLAY_OUT_MS);
  }, [onClose]);

  return { leaving, close };
}

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
  const { leaving, close } = useLeave(onClose);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <Overlay>
      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
        <div
          className={`absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px] motion-reduce:animate-none ${
            leaving
              ? "animate-out fade-out fill-mode-forwards duration-150"
              : "animate-in fade-in duration-200"
          }`}
          onClick={close}
        />
        {/*
          모바일은 아래에서 올라온다 — 손이 닿는 곳에서 자라나는 것처럼 보여야
          어디서 온 창인지 알 수 있다. PC는 가운데 뜨는 창이라 올라올 아래가
          없으니 살짝 커지며 나타난다.
        */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={`relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-xl motion-reduce:animate-none md:max-h-[85vh] md:max-w-lg md:rounded-2xl ${
            leaving
              ? "animate-out slide-out-to-bottom-full fill-mode-forwards duration-150 ease-in md:slide-out-to-bottom-0 md:fade-out md:zoom-out-95"
              : "animate-in slide-in-from-bottom-full duration-300 ease-out md:slide-in-from-bottom-0 md:fade-in md:zoom-in-95 md:duration-200"
          }`}
        >
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="font-bold text-neutral-900">{title}</h2>
            <button
              onClick={close}
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
    </Overlay>
  );
}

/**
 * 숫자 하나가 주인공인 타일. 색은 뜻이 있을 때만 쓴다.
 *
 * 누를 곳이 없으면 button이 아니라 div로 낸다 — 눌리지 않는 버튼은 키보드
 * 순서에서 헛걸음을 만들고, 마우스 커서도 거짓말을 한다.
 */
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
  const box = "rounded-2xl border border-neutral-200 bg-white p-4 text-left md:p-5";
  const body = (
    <>
      <p className="mb-1.5 text-xs font-semibold text-neutral-500">{label}</p>
      <p className={`text-xl font-black tabular-nums md:text-2xl ${color}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-neutral-400">{sub}</p>}
    </>
  );

  if (!onClick) return <div className={box}>{body}</div>;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${box} w-full transition-colors hover:border-neutral-300`}
    >
      {body}
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

/**
 * 저장했다는 확인.
 *
 * 왜 필요한가: 입고를 잡는 화면은 저장 후에도 열려 있다(로트마다 한 번씩 적으니까).
 * 아무 반응이 없으면 팀원이 한 번 더 누르고, 그러면 재고가 두 배로 들어온다.
 * 눌린 자리에서 가장 가까운 곳 — 모바일은 하단 탭 위, PC는 오른쪽 아래 — 에 띄운다.
 */
type ToastTone = "ok" | "bad";
const ToastCtx = createContext<(msg: string, tone?: ToastTone) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastHost({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; tone: ToastTone; at: number } | null>(
    null,
  );

  const [leaving, setLeaving] = useState(false);

  const show = useCallback((msg: string, tone: ToastTone = "ok") => {
    setToast({ msg, tone, at: performance.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    setLeaving(false);
    // 사라질 때도 스르르 나간다. 툭 없어지면 뭔가 잘못된 것처럼 보인다.
    const out = setTimeout(() => setLeaving(true), 2400);
    const gone = setTimeout(() => setToast(null), 2400 + OVERLAY_OUT_MS);
    return () => {
      clearTimeout(out);
      clearTimeout(gone);
    };
  }, [toast]);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && (
        <Overlay>
          <div
            key={toast.at}
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-5 md:inset-x-auto md:right-6 md:bottom-6 md:px-0"
          >
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg motion-reduce:animate-none ${
                toast.tone === "ok" ? "bg-neutral-900" : "bg-rose-600"
              } ${
                leaving
                  ? "animate-out fade-out slide-out-to-bottom-2 fill-mode-forwards duration-150"
                  : "animate-in fade-in slide-in-from-bottom-3 duration-250 ease-out"
              }`}
            >
              {toast.tone === "ok" ? <Check size={15} /> : <AlertTriangle size={15} />}
              {toast.msg}
            </div>
          </div>
        </Overlay>
      )}
    </ToastCtx.Provider>
  );
}

/**
 * 되돌릴 수 없는 일을 하기 전에 묻는 창.
 *
 * 브라우저 기본 confirm()을 쓰지 않는다. 저 창은 세 언어를 못 따라가고, 무엇이
 * 함께 사라지는지(입출고 기록 몇 건) 같은 실제 대가를 보여줄 자리가 없다.
 */
export function Confirm({
  open,
  title,
  body,
  detail,
  confirmLabel,
  cancelLabel,
  tone = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body?: string;
  detail?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  tone?: "danger" | "warn";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { leaving, close } = useLeave(onCancel);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <Overlay>
    <div className="fixed inset-0 z-[70] grid place-items-center px-6">
      <div
        className={`absolute inset-0 bg-neutral-900/50 motion-reduce:animate-none ${
          leaving
            ? "animate-out fade-out fill-mode-forwards duration-150"
            : "animate-in fade-in duration-150"
        }`}
        onClick={close}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        className={`relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl motion-reduce:animate-none ${
          leaving
            ? "animate-out fade-out zoom-out-95 fill-mode-forwards duration-150 ease-in"
            : "animate-in fade-in zoom-in-95 duration-200 ease-out"
        }`}
      >
        <div className="mb-3 flex items-start gap-3">
          <span
            className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${
              tone === "danger" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            <AlertTriangle size={16} />
          </span>
          <h2 className="pt-1 font-bold text-neutral-900">{title}</h2>
        </div>

        {body && <p className="mb-4 text-sm leading-relaxed text-neutral-500">{body}</p>}
        {detail && <div className="mb-4">{detail}</div>}

        <div className="flex items-center justify-end gap-2">
          <Btn onClick={close} variant="ghost">
            {cancelLabel}
          </Btn>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
              tone === "danger"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
    </Overlay>
  );
}

/** 목록이 열 줄을 넘어가면 필터 칩만으로는 못 찾는다. */
export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative mb-4">
      <Search
        size={15}
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputCls} pl-9`}
      />
    </div>
  );
}

/** 다른 탭에서 넘어온 작업이 진행 중임을 알리는 띠. */
export function Banner({
  label,
  value,
  hint,
  onCancel,
  cancelLabel,
}: {
  label: string;
  value: string;
  hint?: string;
  onCancel: () => void;
  cancelLabel: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[#0C3F80]/20 bg-blue-50/60 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold tracking-wide text-[#0C3F80]/70 uppercase">
          {label}
        </p>
        <p className="truncate text-sm font-bold text-[#0C3F80]">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-[#0C3F80]/70">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={onCancel}
        title={cancelLabel}
        className="-mr-1 -mt-0.5 shrink-0 rounded-lg p-1.5 text-[#0C3F80]/50 transition-colors hover:bg-white/70 hover:text-[#0C3F80]"
      >
        <X size={16} />
      </button>
    </div>
  );
}

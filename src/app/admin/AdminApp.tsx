/**
 * /admin — 재고·인플루언서·재무를 한 화면에서 본다.
 *
 * 네비게이션은 화면 크기에 따라 자리를 바꾼다. PC는 왼쪽 사이드바(항상 보이고
 * 본문이 넓다), 모바일은 하단 탭(엄지가 닿는 곳). 햄버거 메뉴는 쓰지 않는다 —
 * 화면이 네 개뿐인데 탭 하나를 열기 위해 두 번 누르게 만들 이유가 없다.
 *
 * 어느 탭을 보고 있는지는 주소(#stock)에 남긴다. 새로 고쳐도 자리를 잃지 않고,
 * "이거 좀 봐" 하고 링크를 보낼 수 있다.
 *
 * 탭 사이 이동은 Jump 하나로 다룬다. 홈의 "챙길 일"을 누르면 그 제품 창이 바로
 * 열려야 하고, 인플루언서 발송은 재고 출고로 이어져야 한다 — 탭만 바꿔 놓고
 * 사람이 다시 찾게 만들면 두 시스템이 이어져 있다고 할 수 없다.
 *
 * 로그인은 보드와 같은 팀 공용 계정을 쓴다. 관리자 화면은 기록에 이름을 남길
 * 일이 없어 보드처럼 이름을 따로 묻지 않는다.
 */
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  Home,
  Package,
  Megaphone,
  Wallet,
  Store,
  Route,
  LogOut,
  Lock,
  RefreshCw,
} from "lucide-react";
import { supabase, TEAM_EMAIL } from "../../lib/supabase";
import {
  a,
  ADMIN_LANG_KEY,
  ADMIN_LANG_LABEL,
  initialAdminLang,
  type AdminLang,
} from "./i18n";
import { useAdminData, type AdminData } from "./data";
import { BLUE, ToastHost, inputCls } from "./ui";
import Dashboard from "./Dashboard";
import Flow from "./Flow";
import Brands from "./Brands";
import Inventory from "./Inventory";
import Influencers from "./Influencers";
import Finance from "./Finance";

export type Tab = "home" | "flow" | "brand" | "stock" | "inf" | "fin";

/** 탭 이동에 딸려 가는 맥락. 어디로 갈지와, 가서 무엇을 열지를 같이 넘긴다. */
export interface Jump {
  tab: Tab;
  /** 재고 탭에서 바로 열어 둘 제품. */
  productId?: string;
  /**
   * 이 인플루언서에게 보낸 물건을 출고로 잡는 중.
   * 이름이 아니라 id를 넘긴다 — 출고 기록에 키로 남겨야 이름을 바꿔도 안 끊긴다.
   */
  seedingId?: string;
}

const TABS = [
  { key: "home" as Tab, icon: Home, label: "navHome" as const },
  // 홈 바로 옆에 둔다. 처음 들어온 사람이 숫자를 보기 전에 읽어야 할 화면이다.
  { key: "flow" as Tab, icon: Route, label: "navFlow" as const },
  { key: "brand" as Tab, icon: Store, label: "navBrand" as const },
  { key: "stock" as Tab, icon: Package, label: "navStock" as const },
  { key: "inf" as Tab, icon: Megaphone, label: "navInf" as const },
  { key: "fin" as Tab, icon: Wallet, label: "navFin" as const },
];

const TAB_KEYS = TABS.map((t) => t.key);

function tabFromHash(): Tab {
  const h = window.location.hash.replace(/^#/, "") as Tab;
  return TAB_KEYS.includes(h) ? h : "home";
}

export default function AdminApp() {
  const [lang, setLang] = useState<AdminLang>(initialAdminLang);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const c = a[lang];

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  function switchLang(next: AdminLang) {
    setLang(next);
    localStorage.setItem(ADMIN_LANG_KEY, next);
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-neutral-400">
        {c.loading}...
      </div>
    );
  }

  if (!session) return <Login lang={lang} switchLang={switchLang} />;

  return <Shell lang={lang} switchLang={switchLang} />;
}

/**
 * 모바일 상단바는 자리가 좁다. 언어·새로고침·로그아웃까지 넣으려면 브랜드명이
 * 양보해야 한다 — 방금 자기가 연 앱의 이름을 다시 읽어야 하는 사람은 없다.
 */
function Wordmark({ suffix, tight }: { suffix: string; tight?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <img src="/logo.png" alt="" className="h-8 w-auto shrink-0" />
      {/*
        줄바꿈을 막는다. 좁은 화면에서 이게 풀리면 '관리자'가 다음 줄로 떨어지고
        옆의 언어 칩까지 눌려 한 글자씩 세로로 쌓인다.
      */}
      <span className="truncate text-sm font-black tracking-tight whitespace-nowrap">
        <span className={tight ? "hidden sm:inline" : undefined}>
          B&amp;Y <span style={{ color: BLUE }}>k-link</span>
        </span>
        <span className={`font-semibold text-neutral-400 ${tight ? "sm:ml-1.5" : "ml-1.5"}`}>
          {suffix}
        </span>
      </span>
    </div>
  );
}

/**
 * 지금 보는 숫자가 언제 것인지 알려주고, 원하면 바로 다시 읽는다.
 * 두 나라에서 같은 화면을 각자 열어 두기 때문에 "내 화면이 최신인가"가 실제 질문이다.
 */
function SyncButton({ data, label }: { data: AdminData; label: string }) {
  const at = data.syncedAt;
  const time = at
    ? at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  return (
    <button
      onClick={() => void data.reload()}
      disabled={data.refreshing}
      title={time ? `${label} ${time}` : label}
      className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-neutral-400 tabular-nums transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50"
    >
      <RefreshCw size={13} className={data.refreshing ? "animate-spin" : undefined} />
      <span className="hidden md:inline">{time}</span>
    </button>
  );
}

function LangToggle({
  lang,
  switchLang,
}: {
  lang: AdminLang;
  switchLang: (l: AdminLang) => void;
}) {
  return (
    <div className="flex w-fit shrink-0 items-center gap-0.5 rounded-full bg-neutral-100 p-1 text-[11px] font-semibold">
      {(["ko", "th", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchLang(l)}
          className={`shrink-0 rounded-full px-2 py-1 whitespace-nowrap transition-colors ${
            lang === l
              ? "bg-white text-[#0C3F80] shadow-sm"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          {ADMIN_LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

function Login({
  lang,
  switchLang,
}: {
  lang: AdminLang;
  switchLang: (l: AdminLang) => void;
}) {
  const c = a[lang];
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({
      email: TEAM_EMAIL,
      password: pw,
    });
    if (error) setErr(c.loginFailed);
    setBusy(false);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8">
        {/*
          로그인 화면은 세로 여유가 있으니 이름과 언어를 한 줄에 밀어 넣지 않는다.
          좁은 화면에서 한 줄로 두면 둘 중 하나가 반드시 잘린다.
        */}
        <div className="mb-7">
          <Wordmark suffix={c.brandSuffix} />
          <div className="mt-4">
            <LangToggle lang={lang} switchLang={switchLang} />
          </div>
        </div>

        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
          <Lock size={13} style={{ color: BLUE }} />
          {c.password}
        </label>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setErr(""); // 고치는 중에 옛 오류가 남아 있으면 지금 틀린 줄 안다.
          }}
          onKeyDown={(e) => e.key === "Enter" && !busy && submit()}
          className={`${inputCls} mb-4`}
        />

        {err && <p className="mb-3 text-sm text-rose-600">{err}</p>}

        <button
          onClick={submit}
          disabled={busy || !pw}
          className="w-full rounded-xl bg-[#0C3F80] py-3 font-semibold text-white transition-colors hover:bg-[#0a3468] disabled:opacity-50"
        >
          {busy ? `${c.loading}...` : c.enter}
        </button>
      </div>
    </div>
  );
}

function Shell({
  lang,
  switchLang,
}: {
  lang: AdminLang;
  switchLang: (l: AdminLang) => void;
}) {
  const c = a[lang];
  const [nav, setNav] = useState<Jump>(() => ({ tab: tabFromHash() }));
  const data = useAdminData();
  const tab = nav.tab;

  /** 탭을 주소에 적어 둔다. 히스토리를 쌓지 않아 뒤로 가기는 /admin을 벗어난다. */
  useEffect(() => {
    const want = `#${tab}`;
    if (window.location.hash !== want) {
      window.history.replaceState(null, "", `${window.location.pathname}${want}`);
    }
  }, [tab]);

  /**
   * 탭을 바꾸면 맨 위에서 시작한다.
   *
   * 재무를 한참 내려 보다가 홈으로 넘어가면 홈의 중간부터 보이던 문제가 있었다.
   * 새 화면이 페이드로 들어오는 동안 이미 위로 올라와 있어서 튀지 않는다.
   */
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

  /** 주소를 직접 고쳐 들어오는 경우도 따라간다. */
  useEffect(() => {
    function onHash() {
      setNav((prev) => {
        const next = tabFromHash();
        return next === prev.tab ? prev : { tab: next };
      });
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (j: Tab | Jump) => setNav(typeof j === "string" ? { tab: j } : j);

  return (
    <ToastHost>
      {/* 로그인 화면에서 여기로 넘어오는 것도 한 번 스며들게 한다. */}
      <div className="min-h-screen animate-in bg-neutral-50 fade-in duration-500 motion-reduce:animate-none">
        {/* PC 사이드바 */}
        <aside className="fixed top-0 left-0 hidden h-screen w-56 flex-col border-r border-neutral-200 bg-white md:flex">
          <div className="px-5 py-5">
            <Wordmark suffix={c.brandSuffix} />
          </div>
          <nav className="flex-1 px-3">
            {TABS.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => go(key)}
                aria-current={tab === key ? "page" : undefined}
                className={`mb-0.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  tab === key
                    ? "bg-[#0C3F80] text-white"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                }`}
              >
                <Icon size={17} />
                {c[label]}
              </button>
            ))}
          </nav>
          <div className="border-t border-neutral-100 px-4 py-3.5">
            <div className="mb-1.5 flex justify-end">
              <SyncButton data={data} label={c.syncedAt} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <LangToggle lang={lang} switchLang={switchLang} />
              <button
                onClick={() => supabase.auth.signOut()}
                title={c.logout}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </aside>

        {/* 모바일 상단바 */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-neutral-200 bg-white/90 px-5 py-3 backdrop-blur md:hidden">
          <Wordmark suffix={c.brandSuffix} tight />
          <div className="flex shrink-0 items-center gap-1">
            <SyncButton data={data} label={c.syncedAt} />
            <LangToggle lang={lang} switchLang={switchLang} />
            <button
              onClick={() => supabase.auth.signOut()}
              title={c.logout}
              className="rounded-lg p-2 text-neutral-400 transition-colors active:bg-neutral-100"
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <main className="md:ml-56">
          {data.loading ? (
            <p className="py-24 text-center text-sm text-neutral-400">{c.loading}...</p>
          ) : (
            /*
              탭이 바뀔 때 새 화면이 자라 들어온다. key가 탭이라 탭이 바뀔 때만
              다시 그려지고, 같은 탭 안에서 상태가 변하는 동안(예: 발송 기록을
              끝냈을 때)에는 화면이 깜빡이지 않는다.

              여기에 transform이 걸리는 동안 position: fixed가 이 요소를 기준으로
              잡힌다. 그래서 창·확인·토스트는 모두 포털로 <body> 밑에 그린다.
            */
            <div
              key={tab}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out motion-reduce:animate-none"
            >
              {tab === "home" ? (
                <Dashboard lang={lang} data={data} go={go} />
              ) : tab === "flow" ? (
                <Flow lang={lang} data={data} go={go} />
              ) : tab === "brand" ? (
                <Brands lang={lang} data={data} />
              ) : tab === "stock" ? (
                <Inventory
                  lang={lang}
                  data={data}
                  focusProductId={nav.productId}
                  seedingId={nav.seedingId}
                  onSeedingDone={() => setNav({ tab: "stock" })}
                />
              ) : tab === "inf" ? (
                <Influencers lang={lang} data={data} go={go} />
              ) : (
                <Finance lang={lang} data={data} />
              )}
            </div>
          )}
        </main>

        {/* 모바일 하단 탭 */}
        <nav className="fixed bottom-0 z-20 flex w-full border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
          {TABS.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => go(key)}
              aria-current={tab === key ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${
                tab === key ? "text-[#0C3F80]" : "text-neutral-400"
              }`}
            >
              <Icon size={20} strokeWidth={tab === key ? 2.4 : 2} />
              {/*
                여섯 칸이라 한 칸이 좁다. 태국어 라벨은 길어서 그냥 두면 다음 줄로
                넘어가 탭 높이가 들쭉날쭉해진다. 잘리더라도 줄은 하나로 지킨다.
              */}
              <span className="w-full truncate px-0.5 text-center">{c[label]}</span>
            </button>
          ))}
        </nav>
      </div>
    </ToastHost>
  );
}

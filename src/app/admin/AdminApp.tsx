/**
 * /admin — 재고·인플루언서·재무를 한 화면에서 본다.
 *
 * 네비게이션은 화면 크기에 따라 자리를 바꾼다. PC는 왼쪽 사이드바(항상 보이고
 * 본문이 넓다), 모바일은 하단 탭(엄지가 닿는 곳). 햄버거 메뉴는 쓰지 않는다 —
 * 화면이 네 개뿐인데 탭 하나를 열기 위해 두 번 누르게 만들 이유가 없다.
 *
 * 로그인은 보드와 같은 팀 공용 계정을 쓴다. 관리자 화면은 기록에 이름을 남길
 * 일이 없어 보드처럼 이름을 따로 묻지 않는다.
 */
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Home, Package, Megaphone, Wallet, LogOut, Lock } from "lucide-react";
import { supabase, TEAM_EMAIL } from "../../lib/supabase";
import {
  a,
  ADMIN_LANG_KEY,
  ADMIN_LANG_LABEL,
  initialAdminLang,
  type AdminLang,
} from "./i18n";
import { useAdminData } from "./data";
import { BLUE, inputCls } from "./ui";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Influencers from "./Influencers";
import Finance from "./Finance";

export type Tab = "home" | "stock" | "inf" | "fin";

const TABS = [
  { key: "home" as Tab, icon: Home, label: "navHome" as const },
  { key: "stock" as Tab, icon: Package, label: "navStock" as const },
  { key: "inf" as Tab, icon: Megaphone, label: "navInf" as const },
  { key: "fin" as Tab, icon: Wallet, label: "navFin" as const },
];

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

function Wordmark({ suffix }: { suffix: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/logo.png" alt="" className="h-8 w-auto" />
      <span className="text-sm font-black tracking-tight">
        B&amp;Y <span style={{ color: BLUE }}>k-link</span>
        <span className="ml-1.5 font-semibold text-neutral-400">{suffix}</span>
      </span>
    </div>
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
    <div className="flex items-center gap-0.5 rounded-full bg-neutral-100 p-1 text-[11px] font-semibold">
      {(["ko", "th", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchLang(l)}
          className={`rounded-full px-2 py-1 transition-colors ${
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
        <div className="mb-7 flex items-center justify-between gap-3">
          <Wordmark suffix={c.brandSuffix} />
          <LangToggle lang={lang} switchLang={switchLang} />
        </div>

        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
          <Lock size={13} style={{ color: BLUE }} />
          {c.password}
        </label>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className={`${inputCls} mb-4`}
        />

        {err && <p className="mb-3 text-sm text-rose-600">{err}</p>}

        <button
          onClick={submit}
          disabled={busy || !pw}
          className="w-full rounded-xl bg-[#0C3F80] py-3 font-semibold text-white transition-colors hover:bg-[#0a3468] disabled:opacity-50"
        >
          {c.enter}
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
  const [tab, setTab] = useState<Tab>("home");
  const data = useAdminData();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* PC 사이드바 */}
      <aside className="fixed top-0 left-0 hidden h-screen w-56 flex-col border-r border-neutral-200 bg-white md:flex">
        <div className="px-5 py-5">
          <Wordmark suffix={c.brandSuffix} />
        </div>
        <nav className="flex-1 px-3">
          {TABS.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
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
        <div className="flex items-center justify-between gap-2 border-t border-neutral-100 px-4 py-4">
          <LangToggle lang={lang} switchLang={switchLang} />
          <button
            onClick={() => supabase.auth.signOut()}
            title={c.logout}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* 모바일 상단바 */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-5 py-3 backdrop-blur md:hidden">
        <Wordmark suffix={c.brandSuffix} />
        <div className="flex items-center gap-1.5">
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
        ) : tab === "home" ? (
          <Dashboard lang={lang} data={data} go={setTab} />
        ) : tab === "stock" ? (
          <Inventory lang={lang} data={data} />
        ) : tab === "inf" ? (
          <Influencers lang={lang} data={data} />
        ) : (
          <Finance lang={lang} data={data} />
        )}
      </main>

      {/* 모바일 하단 탭 */}
      <nav className="fixed bottom-0 z-20 flex w-full border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {TABS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${
              tab === key ? "text-[#0C3F80]" : "text-neutral-400"
            }`}
          >
            <Icon size={20} strokeWidth={tab === key ? 2.4 : 2} />
            {c[label]}
          </button>
        ))}
      </nav>
    </div>
  );
}

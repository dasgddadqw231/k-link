import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LogOut, Lock } from "lucide-react";
import { supabase, TEAM_EMAIL, type BoardItem, type BoardKey } from "../../lib/supabase";
import { b, pick, LANG_KEY, NAME_KEY } from "../i18n";
import ItemRow from "./ItemRow";

/** 보드는 내부 도구라 한국어와 태국어만 지원한다. */
export type Lang = "ko" | "th";

const TABS: BoardKey[] = ["strategy", "docs", "revenue"];

function initialLang(): Lang {
  const saved = localStorage.getItem(LANG_KEY);
  return saved === "th" ? "th" : "ko";
}

export default function BoardApp() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [member, setMember] = useState(() => localStorage.getItem(NAME_KEY) || "");
  const c = b[lang];

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  function switchLang(next: Lang) {
    setLang(next);
    localStorage.setItem(LANG_KEY, next);
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-neutral-400">
        {c.loading}...
      </div>
    );
  }

  if (!session || !member) {
    return (
      <Login
        lang={lang}
        switchLang={switchLang}
        member={member}
        setMember={setMember}
        needsPassword={!session}
      />
    );
  }

  return (
    <Board lang={lang} switchLang={switchLang} member={member} setMember={setMember} />
  );
}

function LangToggle({
  lang,
  switchLang,
}: {
  lang: Lang;
  switchLang: (l: Lang) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-neutral-100 p-1 text-xs font-semibold">
      {(["ko", "th"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchLang(l)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            lang === l
              ? "bg-white text-[#0C3F80] shadow-sm"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          {l === "ko" ? "한국어" : "ไทย"}
        </button>
      ))}
    </div>
  );
}

function Login({
  lang,
  switchLang,
  member,
  setMember,
  needsPassword,
}: {
  lang: Lang;
  switchLang: (l: Lang) => void;
  member: string;
  setMember: (v: string) => void;
  needsPassword: boolean;
}) {
  const c = b[lang];
  const [pw, setPw] = useState("");
  const [name, setName] = useState(member);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!name.trim()) return setErr(c.nameRequired);
    setBusy(true);
    setErr("");
    if (needsPassword) {
      const { error } = await supabase.auth.signInWithPassword({
        email: TEAM_EMAIL,
        password: pw,
      });
      if (error) {
        setBusy(false);
        return setErr(c.loginFailed);
      }
    }
    localStorage.setItem(NAME_KEY, name.trim());
    setMember(name.trim());
    setBusy(false);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-9 w-auto" />
            <span className="font-black tracking-tight">
              B&amp;Y <span className="text-[#0C3F80]">k-link</span>
            </span>
          </div>
          <LangToggle lang={lang} switchLang={switchLang} />
        </div>

        <h1 className="mb-6 flex items-center gap-2 text-lg font-bold">
          <Lock size={17} className="text-[#0C3F80]" />
          {c.boardTitle}
        </h1>

        <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
          {c.yourName}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={c.yourNameHint}
          className="mb-4 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0C3F80]"
        />

        {needsPassword && (
          <>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
              {c.password}
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="mb-4 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0C3F80]"
            />
          </>
        )}

        {err && <p className="mb-3 text-sm text-rose-600">{err}</p>}

        <button
          onClick={submit}
          disabled={busy}
          className="w-full rounded-xl bg-[#0C3F80] py-3 font-semibold text-white transition-colors hover:bg-[#0a3468] disabled:opacity-50"
        >
          {c.enter}
        </button>
      </div>
    </div>
  );
}

function Board({
  lang,
  switchLang,
  member,
  setMember,
}: {
  lang: Lang;
  switchLang: (l: Lang) => void;
  member: string;
  setMember: (v: string) => void;
}) {
  const c = b[lang];
  const [tab, setTab] = useState<BoardKey>("strategy");
  const [items, setItems] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("board_items")
      .select("*")
      .order("group_key")
      .order("sort")
      .then(({ data }) => {
        setItems((data as BoardItem[]) ?? []);
        setLoading(false);
      });
  }, []);

  function patch(id: string, p: Partial<BoardItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...p } : it)));
  }

  const current = useMemo(() => items.filter((i) => i.board === tab), [items, tab]);

  const groups = useMemo(() => {
    const map = new Map<string, BoardItem[]>();
    for (const it of current) {
      const arr = map.get(it.group_key) ?? [];
      arr.push(it);
      map.set(it.group_key, arr);
    }
    return [...map.entries()];
  }, [current]);

  const counted = current.filter((i) => i.status !== "na");
  const doneCount = counted.filter((i) => i.status === "done").length;
  const pct = counted.length ? Math.round((doneCount / counted.length) * 100) : 0;

  async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem(NAME_KEY);
    setMember("");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-8 w-auto" />
            <span className="text-sm font-black tracking-tight">
              B&amp;Y <span className="text-[#0C3F80]">k-link</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden text-xs text-neutral-500 sm:inline">{member}</span>
            <LangToggle lang={lang} switchLang={switchLang} />
            <button
              onClick={logout}
              title={c.logout}
              className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-4xl gap-1 px-5 pb-2">
          {TABS.map((b) => (
            <button
              key={b}
              onClick={() => setTab(b)}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                tab === b
                  ? "bg-[#0C3F80] text-white"
                  : "text-neutral-500 hover:bg-neutral-100"
              }`}
            >
              {b === "strategy" ? c.tabStrategy : b === "docs" ? c.tabDocs : c.tabRevenue}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-7">
        <div className="mb-7 rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-neutral-600">
              {c.overallProgress}
            </span>
            <span className="text-2xl font-black text-[#0C3F80]">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-[#0C3F80] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            {doneCount} / {counted.length}
          </p>
        </div>

        {loading ? (
          <p className="py-16 text-center text-sm text-neutral-400">{c.loading}...</p>
        ) : (
          groups.map(([key, list]) => {
            const gDone = list.filter((i) => i.status === "done").length;
            const gTotal = list.filter((i) => i.status !== "na").length;
            return (
              <section
                key={key}
                className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white"
              >
                <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/70 px-5 py-3.5">
                  <h3 className="font-bold text-neutral-800">
                    {pick(lang, list[0].group_label_ko, list[0].group_label_th)}
                  </h3>
                  <span className="text-xs font-semibold text-neutral-400">
                    {gDone}/{gTotal}
                  </span>
                </div>
                <div className="px-5">
                  {list.map((it) => (
                    <ItemRow
                      key={it.id}
                      item={it}
                      lang={lang}
                      member={member}
                      onPatch={patch}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>
    </div>
  );
}

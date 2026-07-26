import { useEffect, useRef, useState } from "react";
import { MessageSquare, Check, Loader2 } from "lucide-react";
import { supabase, type BoardItem, type Comment, type Status } from "../../lib/supabase";
import { b, pick } from "../i18n";
import type { Lang } from "./BoardApp";

const STATUSES: Status[] = ["todo", "doing", "done", "blocked", "na"];

const STATUS_STYLE: Record<Status, string> = {
  todo: "bg-neutral-100 text-neutral-600 border-neutral-200",
  doing: "bg-amber-50 text-amber-700 border-amber-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blocked: "bg-rose-50 text-rose-700 border-rose-200",
  na: "bg-neutral-50 text-neutral-400 border-neutral-200",
};

export default function ItemRow({
  item,
  lang,
  member,
  onPatch,
}: {
  item: BoardItem;
  lang: Lang;
  member: string;
  onPatch: (id: string, patch: Partial<BoardItem>) => void;
}) {
  const c = b[lang];
  const [value, setValue] = useState(item.value);
  const [owner, setOwner] = useState(item.owner);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => setValue(item.value), [item.value]);
  useEffect(() => setOwner(item.owner), [item.owner]);

  useEffect(() => {
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("item_id", item.id)
      .then(({ count }) => setCount(count ?? 0));
  }, [item.id]);

  async function save(patch: Partial<BoardItem>) {
    setSaving(true);
    const { error } = await supabase.from("board_items").update(patch).eq("id", item.id);
    setSaving(false);
    if (!error) {
      onPatch(item.id, patch);
      setJustSaved(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setJustSaved(false), 1600);
    }
  }

  async function toggleComments() {
    const next = !open;
    setOpen(next);
    if (next) {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("item_id", item.id)
        .order("created_at", { ascending: true });
      setComments(data ?? []);
    }
  }

  async function addComment() {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    const { data } = await supabase
      .from("comments")
      .insert({ item_id: item.id, author: member, body })
      .select()
      .single();
    if (data) {
      setComments((prev) => [...prev, data as Comment]);
      setCount((n) => (n ?? 0) + 1);
    }
  }

  const title = pick(lang, item.title_ko, item.title_th);
  const hint = pick(lang, item.hint_ko, item.hint_th);
  const filled = value.trim().length > 0;

  return (
    <div className="border-b border-neutral-200 py-5 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold leading-snug text-neutral-900">{title}</h4>
          {hint && (
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{hint}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {saving && <Loader2 size={15} className="animate-spin text-neutral-400" />}
          {justSaved && !saving && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <Check size={13} />
              {c.saved}
            </span>
          )}
          <select
            value={item.status}
            onChange={(e) => save({ status: e.target.value as Status })}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold outline-none ${STATUS_STYLE[item.status]}`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {c.st[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => value !== item.value && save({ value })}
        placeholder={c.fillHere}
        rows={value.split("\n").length > 2 ? 4 : 2}
        className={`mt-3 w-full resize-y rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed outline-none transition-colors focus:border-[#0C3F80] ${
          filled
            ? "border-neutral-200 bg-white"
            : "border-dashed border-neutral-300 bg-neutral-50/60"
        }`}
      />

      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
        <input
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          onBlur={() => owner !== item.owner && save({ owner })}
          placeholder={c.owner}
          className="w-28 rounded-lg border border-neutral-200 px-2.5 py-1.5 outline-none focus:border-[#0C3F80]"
        />
        <input
          type="date"
          value={item.due_date ?? ""}
          onChange={(e) => save({ due_date: e.target.value || null })}
          className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-neutral-600 outline-none focus:border-[#0C3F80]"
        />
        <button
          onClick={toggleComments}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
        >
          <MessageSquare size={14} />
          {c.comments}
          {count !== null && count > 0 && (
            <span className="rounded-full bg-[#0C3F80] px-1.5 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="mt-3 rounded-xl bg-neutral-50 p-3.5">
          {comments.length === 0 ? (
            <p className="text-xs text-neutral-400">{c.noComments}</p>
          ) : (
            <ul className="mb-3 space-y-2.5">
              {comments.map((cm) => (
                <li key={cm.id} className="text-sm">
                  <span className="font-semibold text-[#0C3F80]">{cm.author}</span>
                  <span className="ml-2 text-[11px] text-neutral-400">
                    {new Date(cm.created_at).toLocaleString()}
                  </span>
                  <p className="mt-0.5 whitespace-pre-wrap text-neutral-700">{cm.body}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              placeholder={c.writeComment}
              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#0C3F80]"
            />
            <button
              onClick={addComment}
              className="rounded-lg bg-[#0C3F80] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0a3468]"
            >
              {c.send}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

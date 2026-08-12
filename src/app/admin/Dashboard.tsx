/**
 * 홈 — 숫자 넉 장과 할 일 한 묶음.
 *
 * 화면을 열었을 때 알고 싶은 건 두 가지뿐이다. 돈이 늘었나 줄었나, 그리고 내가
 * 지금 무엇을 놓치고 있나. 차트는 넣지 않는다 — 출시 전 데이터로 그린 그래프는
 * 읽을 게 없고, 숫자 넉 장이 더 빨리 읽힌다.
 *
 * 할 일은 직접 적는다. 예전에는 재고·유통기한·인플루언서 상태에서 규칙으로 뽑아
 * "지금 챙길 일"을 만들었는데, 실제로 챙겨야 하는 일이 그 세 갈래로 떨어지지
 * 않았다. 규칙이 짐작한 목록은 정작 급한 게 빠져 있어도 다 한 것처럼 보인다.
 *
 * 유통기한은 타일로 남긴다. 수입 건기식에서 돈이 가장 크게 새는 곳이라 숫자
 * 하나로는 계속 보이게 두고, 무엇을 할지는 사람이 할 일로 적는다.
 */
import { useState, type FormEvent } from "react";
import { CalendarClock, Plus, Trash2, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";
import {
  monthOf,
  thb,
  todayBkk,
  type Influencer,
  type Todo,
} from "../../lib/admin";
import { a, count, type AdminLang } from "./i18n";
import { onHand, type AdminData } from "./data";
import { Card, Empty, Page, Pill, Tile, inputCls, useToast } from "./ui";
import type { Jump, Tab } from "./AdminApp";

/** 발굴만 해 둔 건은 아직 "진행 중"이 아니다. 실제로 말을 붙인 뒤부터 센다. */
const ACTIVE_STATUSES: Influencer["status"][] = ["contacted", "confirmed", "shipped"];

/** 재고 화면과 같은 기준. 두 화면이 다른 날짜를 말하면 안 된다. */
const EXPIRY_WARN_DAYS = 90;

function daysUntil(date: string, today: string): number {
  const ms = new Date(`${date}T00:00:00Z`).getTime() - new Date(`${today}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

export default function Dashboard({
  lang,
  data,
  go,
}: {
  lang: AdminLang;
  data: AdminData;
  go: (j: Tab | Jump) => void;
}) {
  const c = a[lang];
  const today = todayBkk();
  const thisMonth = monthOf(today);

  const monthEntries = data.finance.filter((e) => monthOf(e.entry_on) === thisMonth);
  const inSum = monthEntries
    .filter((e) => e.direction === "in")
    .reduce((s, e) => s + Number(e.amount), 0);
  const outSum = monthEntries
    .filter((e) => e.direction === "out")
    .reduce((s, e) => s + Number(e.amount), 0);
  // 방향까지 본다. 매출은 들어온 돈이고, 같은 이름의 나간 돈이 생기면 합계가 뒤집힌다.
  const sales = monthEntries
    .filter((e) => e.direction === "in" && e.category === "sales")
    .reduce((s, e) => s + Number(e.amount), 0);
  const net = inSum - outSum;

  /** 이미 다 판 로트의 유통기한은 세지 않는다. 남은 게 없으면 잃을 것도 없다. */
  const expiring = data.products.filter((p) => {
    if (!p.active) return false;
    if (onHand(data.stock, p.id) <= 0) return false;
    const expiry = data.stock[p.id]?.nearest_expiry;
    return !!expiry && daysUntil(expiry, today) <= EXPIRY_WARN_DAYS;
  });

  const activeInf = data.influencers.filter((i) => ACTIVE_STATUSES.includes(i.status));

  return (
    <Page title={c.homeTitle}>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile
          label={c.homeNetMonth}
          value={thb(net)}
          sub={`${c.finIn} ${thb(inSum)} · ${c.finOut} ${thb(outSum)}`}
          tone={net > 0 ? "good" : net < 0 ? "bad" : "plain"}
          onClick={() => go("fin")}
        />
        <Tile
          label={c.homeSalesMonth}
          value={thb(sales)}
          tone="plain"
          onClick={() => go("fin")}
        />
        <Tile
          label={c.homeExpiring}
          value={count(c.homeSkuCount, expiring.length)}
          tone={expiring.length > 0 ? "warn" : "plain"}
          onClick={() => go("stock")}
        />
        <Tile
          label={c.homeInfActive}
          value={count(c.homePeopleCount, activeInf.length)}
          tone="plain"
          onClick={() => go("inf")}
        />
      </div>

      <TodoCard lang={lang} todos={data.todos} today={today} reload={data.reload} />
    </Page>
  );
}

function TodoCard({
  lang,
  todos,
  today,
  reload,
}: {
  lang: AdminLang;
  todos: Todo[];
  today: string;
  reload: () => Promise<void>;
}) {
  const c = a[lang];
  const toast = useToast();
  const [body, setBody] = useState("");
  const [due, setDue] = useState("");
  const [busy, setBusy] = useState(false);

  async function add(e: FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text || busy) return;
    setBusy(true);
    const { error } = await supabase
      .from("todos")
      .insert({ body: text, due_on: due || null });
    setBusy(false);
    if (error) return toast(c.saveFailed, "bad");
    // 적자마자 칸을 비운다. 연달아 적는 게 이 화면의 주된 쓰임이다.
    setBody("");
    setDue("");
    await reload();
  }

  async function toggle(t: Todo) {
    const { error } = await supabase
      .from("todos")
      .update({ done: !t.done, updated_at: new Date().toISOString() })
      .eq("id", t.id);
    if (error) return toast(c.saveFailed, "bad");
    await reload();
  }

  async function remove(t: Todo) {
    const { error } = await supabase.from("todos").delete().eq("id", t.id);
    if (error) return toast(c.saveFailed, "bad");
    toast(c.removed);
    await reload();
  }

  const openCount = todos.filter((t) => !t.done).length;

  return (
    <Card
      title={c.homeTodo}
      action={
        openCount > 0 ? <Pill tone="blue">{count(c.todoOpenCount, openCount)}</Pill> : undefined
      }
    >
      <form onSubmit={add} className="flex flex-col gap-2 px-5 py-4 sm:flex-row">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={c.todoPlaceholder}
          className={`${inputCls} flex-1`}
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className={`${inputCls} w-full sm:w-40`}
          />
          <button
            type="submit"
            disabled={!body.trim() || busy}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-[#0C3F80] px-4 text-sm font-bold text-white transition-colors disabled:opacity-40"
          >
            <Plus size={16} />
            {c.todoAdd}
          </button>
        </div>
      </form>

      {todos.length === 0 ? (
        <Empty>{c.homeTodoEmpty}</Empty>
      ) : (
        <ul className="divide-y divide-neutral-100 border-t border-neutral-100">
          {todos.map((t) => (
            <TodoRow
              key={t.id}
              todo={t}
              lang={lang}
              today={today}
              onToggle={() => toggle(t)}
              onDelete={() => remove(t)}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}

function TodoRow({
  todo,
  lang,
  today,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  lang: AdminLang;
  today: string;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const c = a[lang];
  const overdue = !todo.done && !!todo.due_on && todo.due_on <= today;

  return (
    <li className="flex items-center gap-3 px-5 py-3">
      {/* 체크와 지우기만 버튼이다. 줄 전체를 누르게 하면 지우려다 완료 처리하게 된다. */}
      <button
        onClick={onToggle}
        aria-label={todo.done ? c.todoUndo : c.todoDone}
        className={`grid size-6 shrink-0 place-items-center rounded-md border transition-colors ${
          todo.done
            ? "border-[#0C3F80] bg-[#0C3F80] text-white"
            : "border-neutral-300 text-transparent hover:border-[#0C3F80]"
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm ${
            todo.done ? "text-neutral-400 line-through" : "font-medium text-neutral-800"
          }`}
        >
          {todo.body}
        </span>
      </span>

      {todo.due_on && (
        <Pill tone={overdue ? "rose" : todo.done ? "gray" : "amber"}>
          <CalendarClock size={11} className="mr-1" />
          {todo.due_on}
        </Pill>
      )}

      <button
        onClick={onDelete}
        aria-label={c.todoDelete}
        className="shrink-0 rounded-lg p-1.5 text-neutral-300 transition-colors hover:bg-rose-50 hover:text-rose-600"
      >
        <Trash2 size={15} />
      </button>
    </li>
  );
}

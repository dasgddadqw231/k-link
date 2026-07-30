/**
 * 홈 — 숫자 넉 장과 "지금 챙길 일" 한 묶음.
 *
 * 화면을 열었을 때 알고 싶은 건 두 가지뿐이다. 돈이 늘었나 줄었나, 그리고 내가
 * 지금 무엇을 놓치고 있나. 차트는 넣지 않는다 — 출시 전 데이터로 그린 그래프는
 * 읽을 게 없고, 숫자 넉 장이 더 빨리 읽힌다.
 */
import { AlertTriangle, ChevronRight, Package, Megaphone } from "lucide-react";
import {
  monthOf,
  thb,
  todayBkk,
  num,
  type Influencer,
  type Product,
} from "../../lib/admin";
import { a, productName, statusLabel, type AdminLang } from "./i18n";
import { onHand, type AdminData } from "./data";
import { Card, Empty, Page, Pill, Tile } from "./ui";
import type { Tab } from "./AdminApp";

/** 게시가 끝났거나 중단된 건은 챙길 일이 아니다. */
const OPEN_STATUSES: Influencer["status"][] = ["lead", "contacted", "confirmed", "shipped"];

/** 발굴만 해 둔 건은 아직 "진행 중"이 아니다. 실제로 말을 붙인 뒤부터 센다. */
const ACTIVE_STATUSES: Influencer["status"][] = ["contacted", "confirmed", "shipped"];

export default function Dashboard({
  lang,
  data,
  go,
}: {
  lang: AdminLang;
  data: AdminData;
  go: (t: Tab) => void;
}) {
  const c = a[lang];
  const today = todayBkk();
  const thisMonth = monthOf(today);

  const monthEntries = data.finance.filter((e) => monthOf(e.entry_on) === thisMonth);
  const inSum = monthEntries
    .filter((e) => e.direction === "in")
    .reduce((s, e) => s + Number(e.amount_thb), 0);
  const outSum = monthEntries
    .filter((e) => e.direction === "out")
    .reduce((s, e) => s + Number(e.amount_thb), 0);
  const sales = monthEntries
    .filter((e) => e.category === "sales")
    .reduce((s, e) => s + Number(e.amount_thb), 0);
  const net = inSum - outSum;

  const low = data.products.filter(
    (p) => p.active && onHand(data.stock, p.id) <= p.low_stock_at,
  );
  const activeInf = data.influencers.filter((i) => ACTIVE_STATUSES.includes(i.status));
  const overdue = data.influencers.filter(
    (i) =>
      OPEN_STATUSES.includes(i.status) && i.next_action_on && i.next_action_on <= today,
  );

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
          label={c.homeLowStock}
          value={`${low.length} ${c.homeSku}`}
          tone={low.length > 0 ? "warn" : "plain"}
          onClick={() => go("stock")}
        />
        <Tile
          label={c.homeInfActive}
          value={`${activeInf.length} ${c.homePeople}`}
          tone="plain"
          onClick={() => go("inf")}
        />
      </div>

      <Card title={c.homeTodo}>
        {low.length === 0 && overdue.length === 0 ? (
          <Empty>{c.homeTodoEmpty}</Empty>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {low.map((p) => (
              <LowStockRow
                key={p.id}
                product={p}
                stock={onHand(data.stock, p.id)}
                lang={lang}
                onClick={() => go("stock")}
              />
            ))}
            {overdue.map((i) => (
              <OverdueRow key={i.id} inf={i} lang={lang} onClick={() => go("inf")} />
            ))}
          </ul>
        )}
      </Card>
    </Page>
  );
}

function LowStockRow({
  product,
  stock,
  lang,
  onClick,
}: {
  product: Product;
  stock: number;
  lang: AdminLang;
  onClick: () => void;
}) {
  const c = a[lang];
  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600">
          {stock <= 0 ? <AlertTriangle size={15} /> : <Package size={15} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-neutral-800">
            {productName(product, lang)}
          </span>
          <span className="text-xs text-neutral-400">{c.homeLowStockTodo}</span>
        </span>
        <Pill tone={stock <= 0 ? "rose" : "amber"}>
          {num(stock)} / {num(product.low_stock_at)}
        </Pill>
        <ChevronRight size={15} className="shrink-0 text-neutral-300" />
      </button>
    </li>
  );
}

function OverdueRow({
  inf,
  lang,
  onClick,
}: {
  inf: Influencer;
  lang: AdminLang;
  onClick: () => void;
}) {
  const c = a[lang];
  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#0C3F80]">
          <Megaphone size={15} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-neutral-800">
            {inf.name}
          </span>
          <span className="text-xs text-neutral-400">{c.homeInfDueTodo}</span>
        </span>
        <Pill tone="blue">{statusLabel(inf.status, c)}</Pill>
        <ChevronRight size={15} className="shrink-0 text-neutral-300" />
      </button>
    </li>
  );
}

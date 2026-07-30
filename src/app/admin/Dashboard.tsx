/**
 * 홈 — 숫자 넉 장과 "지금 챙길 일" 한 묶음.
 *
 * 화면을 열었을 때 알고 싶은 건 두 가지뿐이다. 돈이 늘었나 줄었나, 그리고 내가
 * 지금 무엇을 놓치고 있나. 차트는 넣지 않는다 — 출시 전 데이터로 그린 그래프는
 * 읽을 게 없고, 숫자 넉 장이 더 빨리 읽힌다.
 *
 * "챙길 일"은 누르면 그 항목이 바로 열린다. 탭만 바꿔 주고 목록에서 다시 찾게
 * 하면, 할 일 목록이 아니라 알림판이 된다.
 *
 * 유통기한을 빼지 않는다. 수입 건기식에서 돈이 가장 크게 새는 곳이고, 재고
 * 목록에만 뱃지로 있으면 그 탭을 열어 본 사람만 알게 된다.
 */
import type { ReactNode } from "react";
import { AlertTriangle, CalendarClock, ChevronRight, Package, Megaphone } from "lucide-react";
import {
  monthOf,
  thb,
  todayBkk,
  num,
  type Influencer,
  type Product,
} from "../../lib/admin";
import { a, count, productName, statusLabel, type AdminLang } from "./i18n";
import { onHand, type AdminData } from "./data";
import { Card, Empty, Page, Pill, Tile } from "./ui";
import type { Jump, Tab } from "./AdminApp";

/** 게시가 끝났거나 중단된 건은 챙길 일이 아니다. */
const OPEN_STATUSES: Influencer["status"][] = ["lead", "contacted", "confirmed", "shipped"];

/** 발굴만 해 둔 건은 아직 "진행 중"이 아니다. 실제로 말을 붙인 뒤부터 센다. */
const ACTIVE_STATUSES: Influencer["status"][] = ["contacted", "confirmed", "shipped"];

/** 재고 화면과 같은 기준. 두 화면이 다른 날짜를 말하면 안 된다. */
const EXPIRY_WARN_DAYS = 90;

function daysUntil(date: string, today: string): number {
  const ms = new Date(`${date}T00:00:00Z`).getTime() - new Date(`${today}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

interface StockAlert {
  product: Product;
  stock: number;
  low: boolean;
  /** 임박 기준에 들어온 유통기한. 아니면 null. */
  expiry: string | null;
  days: number | null;
}

/** 급한 순서. 다 팔린 것과 이미 지난 유통기한이 먼저다. */
function rank(x: StockAlert): number {
  if (x.stock <= 0) return 4;
  if (x.days !== null && x.days < 0) return 3;
  if (x.low) return 2;
  return 1;
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
    .reduce((s, e) => s + Number(e.amount_thb), 0);
  const outSum = monthEntries
    .filter((e) => e.direction === "out")
    .reduce((s, e) => s + Number(e.amount_thb), 0);
  const sales = monthEntries
    .filter((e) => e.category === "sales")
    .reduce((s, e) => s + Number(e.amount_thb), 0);
  const net = inSum - outSum;

  /**
   * 제품 하나에 한 줄만 준다.
   *
   * 재고도 부족하고 유통기한도 임박한 제품은 흔하다(안 팔려서 남았으니까). 그걸
   * 두 줄로 내면 같은 이름이 연달아 두 번 보여서 목록을 잘못 읽었다고 느낀다.
   * 사유는 한 줄에 이어 붙이고, 오른쪽 뱃지는 가장 급한 것 하나만 보여 준다.
   */
  const alerts = data.products
    .filter((p) => p.active)
    .map((p) => {
      const stock = onHand(data.stock, p.id);
      const expiry = data.stock[p.id]?.nearest_expiry ?? null;
      // 이미 다 판 로트의 유통기한은 챙길 일이 아니다.
      const days = expiry && stock > 0 ? daysUntil(expiry, today) : null;
      return {
        product: p,
        stock,
        low: stock <= p.low_stock_at,
        expiry: days !== null && days <= EXPIRY_WARN_DAYS ? expiry : null,
        days,
      };
    })
    .filter((x) => x.low || x.expiry !== null)
    .sort((x, y) => rank(y) - rank(x));

  const activeInf = data.influencers.filter((i) => ACTIVE_STATUSES.includes(i.status));
  const overdue = data.influencers.filter(
    (i) =>
      OPEN_STATUSES.includes(i.status) && i.next_action_on && i.next_action_on <= today,
  );

  const low = alerts.filter((x) => x.low);
  const nothingToDo = alerts.length === 0 && overdue.length === 0;

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
          value={count(c.homeSkuCount, low.length)}
          tone={low.length > 0 ? "warn" : "plain"}
          onClick={() => go("stock")}
        />
        <Tile
          label={c.homeInfActive}
          value={count(c.homePeopleCount, activeInf.length)}
          tone="plain"
          onClick={() => go("inf")}
        />
      </div>

      <Card title={c.homeTodo}>
        {nothingToDo ? (
          <Empty>{c.homeTodoEmpty}</Empty>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {alerts.map((x) => (
              <StockAlertRow
                key={x.product.id}
                alert={x}
                lang={lang}
                onClick={() => go({ tab: "stock", productId: x.product.id })}
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

/** 챙길 일 한 줄의 뼈대. 세 종류가 같은 리듬으로 읽히게 모양을 공유한다. */
function TodoRow({
  icon,
  iconTone,
  title,
  hint,
  right,
  onClick,
}: {
  icon: ReactNode;
  iconTone: string;
  title: string;
  hint: string;
  right: ReactNode;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50"
      >
        <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${iconTone}`}>
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-neutral-800">{title}</span>
          {/* 줄바꿈을 막는다 — 사유가 두 줄로 늘어나면 줄 높이가 들쭉날쭉해진다. */}
          <span className="block truncate text-xs text-neutral-400">{hint}</span>
        </span>
        {right}
        <ChevronRight size={15} className="shrink-0 text-neutral-300" />
      </button>
    </li>
  );
}

function StockAlertRow({
  alert,
  lang,
  onClick,
}: {
  alert: StockAlert;
  lang: AdminLang;
  onClick: () => void;
}) {
  const c = a[lang];
  const { product, stock, low, expiry, days } = alert;
  const expired = days !== null && days < 0;
  const urgent = stock <= 0 || expired;

  // 아이콘은 무엇이 급한지 가리킨다. 유통기한만 문제면 시계, 그 밖은 재고 쪽 표시.
  const icon =
    stock <= 0 ? (
      <AlertTriangle size={15} />
    ) : !low && expiry ? (
      <CalendarClock size={15} />
    ) : (
      <Package size={15} />
    );

  /**
   * 사유가 하나면 문장으로 무엇을 하라고 말해 준다. 둘이면 문장 두 개를 이어
   * 붙이는 대신 짧은 이름으로 바꾼다 — 모바일 한 줄에 들어가야 읽히고, 어차피
   * 둘 다 걸린 제품은 눌러서 안을 봐야 한다.
   */
  const hint =
    low && expiry
      ? `${c.homeLowStock} · ${expired ? c.stockExpired : c.stockExpirySoon}`
      : low
        ? c.homeLowStockTodo
        : expired
          ? c.homeExpiredTodo
          : c.homeExpiryTodo;

  return (
    <TodoRow
      icon={icon}
      iconTone={urgent ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}
      title={productName(product, lang)}
      hint={hint}
      right={
        <Pill tone={urgent ? "rose" : "amber"}>
          {/* 급한 쪽 숫자만 보여 준다. 재고가 넉넉하면 알고 싶은 건 날짜다. */}
          {low ? `${num(stock)} / ${num(product.low_stock_at)}` : expiry}
        </Pill>
      }
      onClick={onClick}
    />
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
    <TodoRow
      icon={<Megaphone size={15} />}
      iconTone="bg-blue-50 text-[#0C3F80]"
      title={inf.name}
      hint={c.homeInfDueTodo}
      right={<Pill tone="blue">{statusLabel(inf.status, c)}</Pill>}
      onClick={onClick}
    />
  );
}

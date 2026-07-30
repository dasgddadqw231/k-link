/**
 * 브랜드사 — klink가 태국에 올려 주는 한국 브랜드가 곧 고객이다.
 *
 * 한 브랜드사 창 안에 계약·담당자·제품·FDA·정산·콘텐츠가 모두 있다. 탭으로
 * 나누지 않고 위에서 아래로 이어 둔 이유는, 브랜드사 하나를 열었을 때 하는 일이
 * "지금 이 브랜드 상황이 어떤가"를 훑는 것이기 때문이다. 탭을 만들면 그걸 보려고
 * 네 번을 눌러야 한다.
 *
 * FDA 신고 상태는 브랜드가 아니라 제품에 붙어 있다 — 등록번호가 품목마다 따로
 * 나온다. 여기서는 그 제품들의 상태를 모아 보여 주고, 고치는 건 재고 쪽이다.
 *
 * 정산은 별도 장부를 만들지 않고 재무의 거래에 브랜드사를 달아 둔 것을 읽는다.
 * 그래야 "이번 달 순현금"이 정산까지 포함한 진짜 숫자가 된다.
 */
import { useMemo, useState, type ReactNode } from "react";
import { ChevronRight, Mail, MessageCircle, Package, Phone, Plus } from "lucide-react";
import { supabase } from "../../lib/supabase";
import {
  ASSET_BUCKET,
  BRAND_FLOW,
  num,
  thb,
  type Brand,
  type BrandStatus,
  type Product,
} from "../../lib/admin";
import {
  a,
  brandName,
  brandStatusLabel,
  fdaLabel,
  productName,
  type AdminLang,
} from "./i18n";
import { onHand, type AdminData } from "./data";
import { AssetArchive } from "./assets";
import { removeFiles } from "./storage";
import {
  Btn,
  Card,
  Chips,
  Confirm,
  Empty,
  Field,
  FilterChip,
  FilterRow,
  Page,
  Pill,
  SearchBox,
  Sheet,
  inputCls,
  useToast,
} from "./ui";

const STATUS_TONE: Record<BrandStatus, "gray" | "blue" | "green" | "amber" | "rose"> = {
  lead: "gray",
  meeting: "blue",
  contracted: "amber",
  active: "green",
  ended: "gray",
};

/** 계약이 살아 있는 단계. 이 브랜드들이 지금 돈을 만든다. */
const LIVE: BrandStatus[] = ["contracted", "active"];

export default function Brands({
  lang,
  data,
}: {
  lang: AdminLang;
  data: AdminData;
}) {
  const c = a[lang];
  const [filter, setFilter] = useState<BrandStatus | "all">("all");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Brand | "new" | null>(null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.brands.filter(
      (b) =>
        (filter === "all" || b.status === filter) &&
        (needle === "" ||
          `${b.name} ${b.name_th} ${b.legal_name} ${b.contact_name}`
            .toLowerCase()
            .includes(needle)),
    );
  }, [data.brands, filter, q]);

  const live = data.brands.filter((b) => LIVE.includes(b.status));
  const countOf = (s: BrandStatus) => data.brands.filter((b) => b.status === s).length;
  const searchable = data.brands.length > 8;

  return (
    <Page
      title={c.brandTitle}
      action={
        <Btn onClick={() => setEditing("new")}>
          <span className="flex items-center gap-1.5">
            <Plus size={15} />
            {c.add}
          </span>
        </Btn>
      }
    >
      {searchable && (
        <SearchBox value={q} onChange={setQ} placeholder={`${c.search} · ${c.brandName}`} />
      )}

      <FilterRow>
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          {c.all} {data.brands.length}
        </FilterChip>
        {BRAND_FLOW.map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {brandStatusLabel(s, c)} {countOf(s)}
          </FilterChip>
        ))}
      </FilterRow>

      <div className="mb-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4">
        <p className="text-xs font-semibold text-neutral-500">{c.bActive}</p>
        <p className="mt-1 text-xl font-black tabular-nums text-neutral-900">
          {live.length}
          <span className="ml-1 text-xs font-semibold text-neutral-400">
            / {data.brands.length}
          </span>
        </p>
      </div>

      <Card>
        {list.length === 0 ? (
          <Empty>{q.trim() ? c.noMatch : c.brandNone}</Empty>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {list.map((b) => (
              <Row key={b.id} brand={b} lang={lang} data={data} onClick={() => setEditing(b)} />
            ))}
          </ul>
        )}
      </Card>

      {editing && (
        <BrandSheet
          brand={editing === "new" ? null : editing}
          lang={lang}
          data={data}
          onDone={async () => {
            setEditing(null);
            await data.reload();
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </Page>
  );
}

function Row({
  brand,
  lang,
  data,
  onClick,
}: {
  brand: Brand;
  lang: AdminLang;
  data: AdminData;
  onClick: () => void;
}) {
  const c = a[lang];
  const products = data.products.filter((p) => p.brand_id === brand.id);
  const approved = products.filter((p) => p.fda_status === "approved").length;

  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-neutral-50"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-bold text-neutral-900">
              {brandName(brand, lang)}
            </span>
            <Pill tone={STATUS_TONE[brand.status]}>{brandStatusLabel(brand.status, c)}</Pill>
          </span>
          <span className="mt-0.5 block truncate text-xs text-neutral-400">
            {[
              brand.contact_name,
              products.length > 0 ? `${c.brandProducts} ${products.length}` : null,
              products.length > 0 ? `${c.brandFdaDone} ${approved}/${products.length}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>

        <span className="shrink-0 text-right">
          {Number(brand.commission_pct) > 0 && (
            <span className="block text-sm font-bold text-neutral-700 tabular-nums">
              {Number(brand.commission_pct)}%
            </span>
          )}
          {Number(brand.monthly_fee_thb) > 0 && (
            <span className="text-[11px] text-neutral-400 tabular-nums">
              {thb(Number(brand.monthly_fee_thb))}
            </span>
          )}
        </span>

        <ChevronRight size={16} className="shrink-0 text-neutral-300" />
      </button>
    </li>
  );
}

function BrandSheet({
  brand,
  lang,
  data,
  onDone,
  onClose,
}: {
  brand: Brand | null;
  lang: AdminLang;
  data: AdminData;
  onDone: () => void;
  onClose: () => void;
}) {
  const c = a[lang];
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [f, setF] = useState({
    name: brand?.name ?? "",
    name_th: brand?.name_th ?? "",
    legal_name: brand?.legal_name ?? "",
    status: brand?.status ?? ("lead" as BrandStatus),
    commission_pct: String(brand?.commission_pct ?? 0),
    monthly_fee_thb: String(brand?.monthly_fee_thb ?? 0),
    contract_from: brand?.contract_from ?? "",
    contract_to: brand?.contract_to ?? "",
    contact_name: brand?.contact_name ?? "",
    contact_role: brand?.contact_role ?? "",
    contact_line: brand?.contact_line ?? "",
    contact_email: brand?.contact_email ?? "",
    contact_phone: brand?.contact_phone ?? "",
    note: brand?.note ?? "",
  });

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  const products = brand ? data.products.filter((p) => p.brand_id === brand.id) : [];
  const entries = brand ? data.finance.filter((e) => e.brand_id === brand.id) : [];
  const assets = brand ? data.assets.filter((x) => x.brand_id === brand.id) : [];

  /** 제품이나 거래가 걸려 있으면 지울 수 없다. 계약 종료는 삭제가 아니다. */
  const deletable = products.length === 0 && entries.length === 0;

  async function save() {
    setBusy(true);
    setErr("");
    const row = {
      name: f.name.trim(),
      name_th: f.name_th.trim(),
      legal_name: f.legal_name.trim(),
      status: f.status,
      commission_pct: Number(f.commission_pct) || 0,
      monthly_fee_thb: Number(f.monthly_fee_thb) || 0,
      contract_from: f.contract_from || null,
      contract_to: f.contract_to || null,
      contact_name: f.contact_name.trim(),
      contact_role: f.contact_role.trim(),
      contact_line: f.contact_line.trim(),
      contact_email: f.contact_email.trim(),
      contact_phone: f.contact_phone.trim(),
      note: f.note.trim(),
    };
    const { error } = brand
      ? await supabase.from("brands").update(row).eq("id", brand.id)
      : await supabase.from("brands").insert(row);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
    toast(c.saved);
    onDone();
  }

  async function commitRemove() {
    if (!brand) return;
    setConfirming(false);
    setBusy(true);
    // 브랜드사를 지우면 brand_assets 행은 DB가 함께 지운다. 스토리지 파일은
    // 아무도 대신 지워 주지 않으니 여기서 먼저 치운다.
    if (assets.length) {
      await removeFiles(
        ASSET_BUCKET,
        assets.map((x) => x.path),
      );
    }
    const { error } = await supabase.from("brands").delete().eq("id", brand.id);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
    toast(c.removed);
    onDone();
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title={brand ? brandName(brand, lang) : c.brandNew}
      footer={
        <div className="flex items-center gap-2">
          {brand && (
            <Btn onClick={() => setConfirming(true)} variant="danger" disabled={busy}>
              {c.remove}
            </Btn>
          )}
          <div className="flex-1" />
          <Btn onClick={onClose} variant="ghost">
            {c.cancel}
          </Btn>
          <Btn onClick={save} disabled={busy || !f.name.trim()}>
            {c.save}
          </Btn>
        </div>
      }
    >
      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold text-neutral-500">{c.brandStatus}</p>
        <Chips
          options={BRAND_FLOW}
          value={f.status}
          onChange={(s) => set("status", s)}
          labelOf={(s) => brandStatusLabel(s, c)}
        />
      </div>

      <div className="grid gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Field label={c.brandName}>
            <input
              value={f.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={c.brandNameTh}>
            <input
              value={f.name_th}
              onChange={(e) => set("name_th", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label={c.brandLegalName}>
          <input
            value={f.legal_name}
            onChange={(e) => set("legal_name", e.target.value)}
            className={inputCls}
          />
        </Field>

        <Section title={c.brandContract}>
          <div className="grid grid-cols-2 gap-3">
            <Field label={c.brandCommission}>
              <input
                type="number"
                inputMode="decimal"
                value={f.commission_pct}
                onChange={(e) => set("commission_pct", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label={c.brandMonthlyFee}>
              <input
                type="number"
                inputMode="decimal"
                value={f.monthly_fee_thb}
                onChange={(e) => set("monthly_fee_thb", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label={c.brandContractFrom}>
              <input
                type="date"
                value={f.contract_from}
                onChange={(e) => set("contract_from", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label={c.brandContractTo}>
              <input
                type="date"
                value={f.contract_to}
                onChange={(e) => set("contract_to", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        <Section title={c.brandContact}>
          <div className="grid grid-cols-2 gap-3">
            <Field label={c.brandContactName}>
              <input
                value={f.contact_name}
                onChange={(e) => set("contact_name", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label={c.brandContactRole}>
              <input
                value={f.contact_role}
                onChange={(e) => set("contact_role", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="mt-3 grid gap-3">
            <Field label={c.brandContactLine}>
              <input
                value={f.contact_line}
                onChange={(e) => set("contact_line", e.target.value)}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={c.brandContactEmail}>
                <input
                  type="email"
                  value={f.contact_email}
                  onChange={(e) => set("contact_email", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={c.brandContactPhone}>
                <input
                  type="tel"
                  value={f.contact_phone}
                  onChange={(e) => set("contact_phone", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* 저장된 연락처는 바로 누를 수 있게 둔다 — 옮겨 적을 일이 없어진다. */}
          {brand && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {brand.contact_email && (
                <ContactLink
                  href={`mailto:${brand.contact_email}`}
                  icon={<Mail size={13} />}
                  label={brand.contact_email}
                />
              )}
              {brand.contact_phone && (
                <ContactLink
                  href={`tel:${brand.contact_phone}`}
                  icon={<Phone size={13} />}
                  label={brand.contact_phone}
                />
              )}
              {brand.contact_line && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
                  <MessageCircle size={13} />
                  {brand.contact_line}
                </span>
              )}
            </div>
          )}
        </Section>

        <Field label={c.note}>
          <textarea
            rows={3}
            value={f.note}
            onChange={(e) => set("note", e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>

      {/* 아래부터는 읽는 자리. 저장할 것이 없으니 새 브랜드사에는 나오지 않는다. */}
      {brand && (
        <>
          <Section title={c.brandProducts} className="mt-5">
            {products.length === 0 ? (
              <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-400">
                {c.brandProductsNone}
              </p>
            ) : (
              <ul className="divide-y divide-neutral-100 rounded-xl bg-neutral-50 px-4">
                {products.map((p) => (
                  <ProductLine key={p.id} product={p} lang={lang} data={data} />
                ))}
              </ul>
            )}
          </Section>

          <Section title={c.brandSettlement} className="mt-5">
            <Money brand={brand} lang={lang} data={data} />
          </Section>

          <Section title={c.brandAssets} className="mt-5">
            <AssetArchive brand={brand} lang={lang} data={data} />
          </Section>
        </>
      )}

      {err && <p className="mt-4 text-sm text-rose-600">{err}</p>}

      <Confirm
        open={confirming}
        title={deletable ? c.confirmRemove : c.brandDeleteBlockedTitle}
        body={deletable ? undefined : c.brandDeleteBlockedBody}
        detail={
          deletable ? (
            assets.length > 0 ? (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                {c.brandDeleteAssets} {assets.length}
              </p>
            ) : undefined
          ) : (
            <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700">
              {c.brandProducts} {products.length} · {c.finEntries} {entries.length}
            </p>
          )
        }
        confirmLabel={deletable ? c.remove : c.bEnded}
        cancelLabel={c.cancel}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          if (deletable) return void commitRemove();
          // 삭제 대신 계약 종료로 갈아탄다. 저장은 사람이 확인한다.
          setConfirming(false);
          set("status", "ended");
        }}
      />
    </Sheet>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-bold tracking-wide text-neutral-400 uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

function ContactLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0C3F80] transition-colors hover:bg-blue-100"
    >
      {icon}
      <span className="truncate">{label}</span>
    </a>
  );
}

const FDA_TONE: Record<Product["fda_status"], "gray" | "blue" | "green" | "amber" | "rose"> = {
  none: "gray",
  preparing: "blue",
  submitted: "amber",
  approved: "green",
  rejected: "rose",
};

function ProductLine({
  product,
  lang,
  data,
}: {
  product: Product;
  lang: AdminLang;
  data: AdminData;
}) {
  const c = a[lang];
  return (
    <li className="flex items-center gap-2.5 py-2.5">
      <Package size={14} className="shrink-0 text-neutral-400" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-neutral-700">
          {productName(product, lang)}
        </span>
        <span className="text-[11px] text-neutral-400">
          {product.sku}
          {product.fda_number && ` · ${product.fda_number}`}
        </span>
      </span>
      <Pill tone={FDA_TONE[product.fda_status]}>{fdaLabel(product.fda_status, c)}</Pill>
      <span className="shrink-0 text-sm font-bold text-neutral-700 tabular-nums">
        {num(onHand(data.stock, product.id))}
      </span>
    </li>
  );
}

/** 이 브랜드사와 오간 돈. 재무에 달아 둔 브랜드사를 모아 읽는다. */
function Money({
  brand,
  lang,
  data,
}: {
  brand: Brand;
  lang: AdminLang;
  data: AdminData;
}) {
  const c = a[lang];
  const mine = data.finance.filter((e) => e.brand_id === brand.id);

  if (mine.length === 0) {
    return (
      <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-400">
        {c.brandSettlementNone}
      </p>
    );
  }

  const sum = (dir: "in" | "out", cat?: string) =>
    mine
      .filter((e) => e.direction === dir && (!cat || e.category === cat))
      .reduce((s, e) => s + Number(e.amount_thb), 0);

  const rows = [
    { label: c.brandRevenue, value: sum("in", "sales"), tone: "text-emerald-600" },
    { label: c.brandCommissionIn, value: sum("in", "commission"), tone: "text-emerald-600" },
    { label: c.brandPaidOut, value: sum("out", "settlement"), tone: "text-rose-600" },
  ].filter((r) => r.value !== 0);

  return (
    <ul className="divide-y divide-neutral-100 rounded-xl bg-neutral-50 px-4">
      {rows.map((r) => (
        <li key={r.label} className="flex items-baseline justify-between gap-3 py-2.5">
          <span className="text-sm text-neutral-600">{r.label}</span>
          <span className={`text-sm font-bold tabular-nums ${r.tone}`}>{thb(r.value)}</span>
        </li>
      ))}
    </ul>
  );
}

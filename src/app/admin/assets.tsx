/**
 * 콘텐츠 아카이브 — 브랜드가 준 에셋과 klink가 만든 결과물을 한자리에 둔다.
 *
 * 영수증과 다른 점: 여기 파일은 오래 쓰이고 여러 사람이 찾는다. 그래서 제목과
 * 종류를 붙여 두고, 종류로 걸러 볼 수 있게 한다. 파일 이름만으로는 반년 뒤에
 * 무엇이 무엇인지 알 수 없다.
 *
 * 올리는 즉시 brand_assets에 한 줄이 생긴다. 브랜드사 저장 버튼과 묶지 않은
 * 이유는, 파일을 다섯 개 올린 뒤 저장을 안 누르고 닫았을 때 무엇을 지워야 할지
 * 애매해지기 때문이다. 파일은 올린 순간 이미 그 브랜드의 것이다.
 */
import { useRef, useState } from "react";
import { FileText, Film, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import {
  ASSET_BUCKET,
  ASSET_KINDS,
  type AssetKind,
  type Brand,
  type BrandAsset,
} from "../../lib/admin";
import { a, assetKindLabel, type AdminLang } from "./i18n";
import type { AdminData } from "./data";
import { fileSize, isImagePath, removeFiles, upload, useSignedUrl } from "./storage";
import { ReceiptViewer } from "./receipts";
import { Chips, FilterChip, FilterRow, useToast } from "./ui";

export function AssetArchive({
  brand,
  lang,
  data,
}: {
  brand: Brand;
  lang: AdminLang;
  data: AdminData;
}) {
  const c = a[lang];
  const toast = useToast();
  const pick = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<AssetKind>("product_shot");
  const [filter, setFilter] = useState<AssetKind | "all">("all");
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const [viewing, setViewing] = useState<string | null>(null);

  const mine = data.assets.filter((x) => x.brand_id === brand.id);
  const shown = filter === "all" ? mine : mine.filter((x) => x.kind === filter);
  const kindsPresent = ASSET_KINDS.filter((k) => mine.some((x) => x.kind === k));

  async function add(files: FileList) {
    setErr("");
    setBusy((n) => n + files.length);

    for (const file of files) {
      try {
        const { path, mime, size } = await upload(ASSET_BUCKET, file);
        // 제목은 파일 이름에서 확장자만 떼어 채워 둔다. 고치는 건 그 다음 일이다.
        const title = file.name.replace(/\.[^.]+$/, "");
        const { error } = await supabase.from("brand_assets").insert({
          brand_id: brand.id,
          kind,
          title,
          path,
          mime,
          size_bytes: size,
        });
        if (error) throw error;
      } catch {
        setErr(c.brandAssetFailed);
      } finally {
        setBusy((n) => n - 1);
      }
    }

    await data.reload();
    toast(c.saved);
  }

  async function remove(asset: BrandAsset) {
    const { error } = await supabase.from("brand_assets").delete().eq("id", asset.id);
    if (error) return setErr(c.saveFailed);
    await removeFiles(ASSET_BUCKET, [asset.path]);
    await data.reload();
    toast(c.removed);
  }

  return (
    <div>
      {/* 올릴 때 종류를 먼저 고른다 — 올린 뒤에 하나씩 고치게 하면 아무도 안 한다. */}
      <div className="mb-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5">
        <p className="mb-1.5 text-xs font-semibold text-neutral-500">{c.brandAssetKind}</p>
        <Chips
          options={ASSET_KINDS}
          value={kind}
          onChange={setKind}
          labelOf={(k) => assetKindLabel(k, c)}
        />
        <button
          type="button"
          onClick={() => pick.current?.click()}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#0C3F80]/25 bg-white py-2.5 text-sm font-semibold text-[#0C3F80] transition-colors hover:bg-blue-50"
        >
          <Plus size={15} />
          {c.brandAssetAdd}
        </button>
        <p className="mt-1.5 text-[11px] text-neutral-400">{c.brandAssetHint}</p>
      </div>

      <input
        ref={pick}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) void add(e.target.files);
          e.target.value = "";
        }}
      />

      {kindsPresent.length > 1 && (
        <FilterRow>
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            {c.all} {mine.length}
          </FilterChip>
          {kindsPresent.map((k) => (
            <FilterChip key={k} active={filter === k} onClick={() => setFilter(k)}>
              {assetKindLabel(k, c)} {mine.filter((x) => x.kind === k).length}
            </FilterChip>
          ))}
        </FilterRow>
      )}

      {busy > 0 && (
        <div className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 size={14} className="animate-spin" />
          {c.loading}...
        </div>
      )}

      {shown.length === 0 && busy === 0 ? (
        <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-400">
          {c.brandAssetsNone}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {shown.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              lang={lang}
              onOpen={() => setViewing(asset.path)}
              onRemove={() => void remove(asset)}
              onRename={async (title) => {
                await supabase.from("brand_assets").update({ title }).eq("id", asset.id);
                await data.reload();
              }}
            />
          ))}
        </ul>
      )}

      {err && <p className="mt-2 text-sm text-rose-600">{err}</p>}

      {viewing && (
        <ReceiptViewer
          bucket={ASSET_BUCKET}
          path={viewing}
          onClose={() => setViewing(null)}
          openLabel={c.finReceiptOpen}
        />
      )}
    </div>
  );
}

function AssetCard({
  asset,
  lang,
  onOpen,
  onRemove,
  onRename,
}: {
  asset: BrandAsset;
  lang: AdminLang;
  onOpen: () => void;
  onRemove: () => void;
  onRename: (title: string) => Promise<void>;
}) {
  const c = a[lang];
  const image = isImagePath(asset.path);
  const url = useSignedUrl(ASSET_BUCKET, image ? asset.path : null);
  const [title, setTitle] = useState(asset.title);
  const video = asset.mime.startsWith("video/");

  return (
    <li className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={onOpen}
        className="grid aspect-square w-full place-items-center overflow-hidden bg-neutral-50"
      >
        {image ? (
          url ? (
            <img src={url} alt="" className="size-full object-cover" />
          ) : (
            <Loader2 size={16} className="animate-spin text-neutral-300" />
          )
        ) : video ? (
          <Film size={22} className="text-neutral-400" />
        ) : (
          <FileText size={22} className="text-neutral-400" />
        )}
      </button>

      <div className="p-2.5">
        {/*
          제목은 그 자리에서 고친다. 파일 이름이 IMG_4821이면 반년 뒤에 아무
          의미가 없어서, 여는 창을 하나 더 만들면 아무도 안 고친다.
        */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() !== asset.title && void onRename(title.trim())}
          aria-label={c.brandAssetTitle}
          className="w-full truncate bg-transparent text-xs font-semibold text-neutral-700 outline-none focus:text-neutral-900"
        />
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-[10px] text-neutral-400">
            {assetKindLabel(asset.kind, c)}
            {asset.size_bytes > 0 && ` · ${fileSize(asset.size_bytes)}`}
          </span>
          <button
            type="button"
            onClick={onRemove}
            title={c.remove}
            className="shrink-0 rounded p-1 text-neutral-300 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </li>
  );
}

/**
 * 영수증 첨부.
 *
 * 왜 바로 올리나: 사진을 고르는 즉시 올려서 자리를 보여 준다. 저장할 때 한꺼번에
 * 올리면 다섯 장 중 세 장만 올라간 상태를 사용자가 알 수 없고, 미리 보기도 못
 * 준다. 대신 저장하지 않고 창을 닫으면 이 자리에서 올린 것만 지운다.
 *
 * 줄이기·서명 URL 같은 공용 부분은 storage.ts에 있다.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, ImagePlus, Loader2, Paperclip, X } from "lucide-react";
import { RECEIPT_BUCKET } from "../../lib/admin";
import type { AdminDict } from "./i18n";
import { isPdf, removeFiles, upload, useSignedUrl } from "./storage";
import { Btn } from "./ui";

export function ReceiptField({
  paths,
  onChange,
  c,
}: {
  paths: string[];
  onChange: (next: string[]) => void;
  c: AdminDict;
}) {
  const pick = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const [viewing, setViewing] = useState<string | null>(null);

  /**
   * 이 창에서 올린 것들. 저장하지 않고 닫으면 이것만 지운다 — 이미 저장돼
   * 있던 첨부는 남겨야 한다.
   */
  const added = useRef<Set<string>>(new Set());
  const saved = useRef(false);

  useEffect(() => {
    const mine = added.current;
    return () => {
      // 저장했다면 올린 것들은 이제 거래에 속한다. 그대로 둔다.
      if (saved.current || mine.size === 0) return;
      void removeFiles(RECEIPT_BUCKET, [...mine]);
    };
  }, []);

  // 부모가 저장에 성공하면 이 창은 곧 닫힌다. 저장 신호를 따로 받는 대신,
  // 올린 경로가 전부 부모 상태에 남아 있으면 저장된 것으로 본다.
  useEffect(() => {
    if (paths.length > 0 && [...added.current].every((p) => paths.includes(p))) {
      saved.current = true;
    }
  }, [paths]);

  const add = useCallback(
    async (files: FileList) => {
      setErr("");
      setBusy((n) => n + files.length);
      const done: string[] = [];

      for (const file of files) {
        try {
          const { path } = await upload(RECEIPT_BUCKET, file);
          added.current.add(path);
          done.push(path);
        } catch {
          setErr(c.finReceiptFailed);
        } finally {
          setBusy((n) => n - 1);
        }
      }

      if (done.length) onChange([...paths, ...done]);
    },
    [paths, onChange, c],
  );

  async function remove(path: string) {
    onChange(paths.filter((p) => p !== path));
    added.current.delete(path);
    // 참조가 사라지면 파일을 남겨 둘 이유가 없다.
    await removeFiles(RECEIPT_BUCKET, [path]);
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <Paperclip size={13} className="text-neutral-400" />
        <span className="text-xs font-semibold text-neutral-500">
          {c.finReceipts}
          {paths.length > 0 && <span className="ml-1 text-neutral-400">{paths.length}</span>}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {paths.map((p) => (
          <Thumb key={p} path={p} onOpen={() => setViewing(p)} onRemove={() => void remove(p)} />
        ))}

        {Array.from({ length: busy }, (_, i) => (
          <div
            key={`busy-${i}`}
            className="grid size-20 place-items-center rounded-xl border border-neutral-200 bg-neutral-50"
          >
            <Loader2 size={16} className="animate-spin text-neutral-400" />
          </div>
        ))}

        <button
          type="button"
          onClick={() => pick.current?.click()}
          className="grid size-20 place-items-center rounded-xl border border-dashed border-neutral-300 text-neutral-400 transition-colors hover:border-[#0C3F80] hover:text-[#0C3F80]"
          title={c.finReceiptAdd}
        >
          <ImagePlus size={18} />
        </button>
      </div>

      {/*
        capture를 지정하지 않는다. 지정하면 안드로이드에서 카메라만 열리는데,
        영수증은 이미 찍어 둔 사진을 고르는 경우가 더 많다. 선택창에서 카메라도
        고를 수 있으니 둘 다 된다.
      */}
      <input
        ref={pick}
        type="file"
        accept="image/*,application/pdf"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) void add(e.target.files);
          e.target.value = "";
        }}
      />

      <p className="mt-1.5 text-[11px] text-neutral-400">{c.finReceiptHint}</p>
      {err && <p className="mt-1.5 text-sm text-rose-600">{err}</p>}

      {viewing && (
        <ReceiptViewer
          bucket={RECEIPT_BUCKET}
          path={viewing}
          onClose={() => setViewing(null)}
          openLabel={c.finReceiptOpen}
        />
      )}
    </div>
  );
}

function Thumb({
  path,
  onOpen,
  onRemove,
}: {
  path: string;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const url = useSignedUrl(RECEIPT_BUCKET, path);
  const pdf = isPdf(path);

  return (
    <div className="relative size-20 shrink-0">
      <button
        type="button"
        onClick={onOpen}
        className="grid size-20 place-items-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
      >
        {pdf ? (
          <FileText size={20} className="text-neutral-400" />
        ) : url ? (
          <img src={url} alt="" className="size-full object-cover" />
        ) : (
          <Loader2 size={16} className="animate-spin text-neutral-300" />
        )}
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 grid size-6 place-items-center rounded-full bg-neutral-900 text-white shadow-md transition-colors hover:bg-rose-600"
      >
        <X size={13} />
      </button>
    </div>
  );
}

/** 첨부는 글자를 읽어야 하니 화면 전체를 쓴다. 브랜드 에셋 쪽에서도 같이 쓴다. */
export function ReceiptViewer({
  bucket,
  path,
  onClose,
  openLabel,
}: {
  bucket: string;
  path: string;
  onClose: () => void;
  openLabel: string;
}) {
  const url = useSignedUrl(bucket, path);
  const video = /\.(mp4|mov|webm|m4v)$/i.test(path);
  const image = /\.(jpe?g|png|webp|gif|avif)$/i.test(path);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-neutral-900/95">
      <div className="flex justify-end p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {!url ? (
          <Loader2 size={22} className="animate-spin text-white/50" />
        ) : image ? (
          <img src={url} alt="" className="max-h-full max-w-full object-contain" />
        ) : video ? (
          <video src={url} controls className="max-h-full max-w-full" />
        ) : (
          // PDF와 그 밖의 형식은 브라우저마다 표시가 달라 새 탭에 맡긴다.
          <a href={url} target="_blank" rel="noreferrer">
            <Btn>{openLabel}</Btn>
          </a>
        )}
      </div>
    </div>
  );
}

/** 목록에서 어느 거래에 영수증이 붙어 있는지 알려 주는 표시. */
export function ReceiptBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-neutral-400">
      <Paperclip size={11} />
      {count > 1 && count}
    </span>
  );
}

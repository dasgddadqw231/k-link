/**
 * 파일 첨부 공용 부분. 영수증과 브랜드 에셋이 같은 방식을 쓴다.
 *
 * 두 버킷 모두 비공개다. 영수증에는 거래처와 금액이, 브랜드 에셋에는 출시 전
 * 제품컷이 들어 있어 링크를 아는 사람이 볼 수 있게 두면 안 된다. 그래서 화면에
 * 보일 때마다 짧게 사는 서명 URL을 받는다.
 */
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

/** 서명 URL 유효 시간. 창을 열어 둔 채 한참 보다가 열어도 살아 있을 만큼. */
const SIGN_TTL = 60 * 60;

const IMAGE_MAX_EDGE = 1600;
const JPEG_QUALITY = 0.8;

export function isPdf(path: string): boolean {
  return path.toLowerCase().endsWith(".pdf");
}

export function isImagePath(path: string): boolean {
  return /\.(jpe?g|png|webp|gif|avif)$/i.test(path);
}

export function fileSize(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${bytes}B`;
}

/**
 * 사진의 긴 변을 줄인다.
 *
 * 왜: 휴대폰 사진은 한 장에 4MB를 넘는다. 영수증은 글자만 읽히면 되고, 태국
 * 현지 통신 사정에서 원본 여러 장은 올리다 끊긴다. 1600px·JPEG 80%면 글자는
 * 남고 용량은 십분의 일이 된다.
 *
 * 아이폰 HEIC처럼 브라우저가 못 읽는 형식이면 줄이기를 포기하고 원본을 올린다 —
 * 사진을 아예 못 붙이는 것보다 크게 붙는 쪽이 낫다. 영상과 PDF는 손대지 않는다.
 */
export async function shrinkImage(file: File): Promise<{ body: Blob; ext: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  if (!file.type.startsWith("image/")) return { body: file, ext };

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) throw new Error("toBlob failed");
    return { body: blob, ext: "jpg" };
  } catch {
    return { body: file, ext };
  }
}

export interface Uploaded {
  path: string;
  mime: string;
  size: number;
}

/** 줄여서 올리고 저장된 경로를 돌려준다. 실패하면 throw. */
export async function upload(bucket: string, file: File): Promise<Uploaded> {
  const { body, ext } = await shrinkImage(file);
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, body, { contentType: body.type || undefined });
  if (error) throw error;
  return { path, mime: body.type || file.type, size: body.size };
}

export async function removeFiles(bucket: string, paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  await supabase.storage.from(bucket).remove(paths);
}

/** 비공개 버킷이라 썸네일 한 장에도 서명 URL이 필요하다. */
export function useSignedUrl(bucket: string, path: string | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setUrl(null);
      return;
    }
    let alive = true;
    void supabase.storage
      .from(bucket)
      .createSignedUrl(path, SIGN_TTL)
      .then(({ data }) => {
        if (alive) setUrl(data?.signedUrl ?? null);
      });
    return () => {
      alive = false;
    };
  }, [bucket, path]);

  return url;
}

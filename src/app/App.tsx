import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Landing from "./pages/Landing";
import LangRedirect from "./LangRedirect";

/**
 * 보드와 관리자는 필요할 때 받아 온다.
 *
 * 정적으로 import하면 둘이 끌고 오는 Supabase와 관리자 화면 전체가 랜딩과 같은
 * 덩어리에 들어간다. 랜딩은 그 코드를 한 줄도 쓰지 않는데, QR을 찍고 들어온
 * 태국 휴대폰이 그걸 다 받아야 첫 화면이 뜬다. 게다가 그 덩어리 안에서 예외가
 * 하나 나면 랜딩까지 같이 죽는다(lib/supabase.ts 주석 참고).
 *
 * 두 화면 다 색인 대상이 아니고 로그인 뒤에서 쓰므로, 한 박자 늦게 받는 대가는
 * 문제가 되지 않는다.
 */
const BoardApp = lazy(() => import("./board/BoardApp"));
const AdminApp = lazy(() => import("./admin/AdminApp"));

/** 청크를 받는 동안 잠깐 비는 자리. 로그인 화면 앞이라 문구를 길게 두지 않는다. */
function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#FCFCFD]">
      <p className="text-[13px] text-[#8B94A3]">불러오는 중…</p>
    </div>
  );
}

/**
 * 설정이 빠졌을 때 이 두 화면이 흰 화면으로 끝나지 않게 한다.
 *
 * 값을 lib/supabase에서 가져오지 않고 여기서 직접 읽는 이유는, 그 모듈을
 * import하면 코드 분할로 떼어 낸 것이 다시 랜딩 덩어리로 딸려 오기 때문이다.
 * import.meta.env는 빌드 때 상수로 박히므로 여기서 읽는 비용은 없다.
 */
const SUPABASE_READY = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);

function NotConfigured() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#FCFCFD] px-6">
      <div className="max-w-[46ch] text-center">
        <p className="text-[15px] font-semibold text-[#12161F]">
          이 화면은 아직 연결되지 않았습니다
        </p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-[#5A6373]">
          배포 환경에 <code className="text-[#0C3F80]">VITE_SUPABASE_URL</code>과{" "}
          <code className="text-[#0C3F80]">VITE_SUPABASE_ANON_KEY</code>를 설정한
          뒤 다시 배포하면 열립니다.
        </p>
        <a
          href="/"
          className="mt-6 inline-block text-[13px] text-[#0C3F80] underline underline-offset-4"
        >
          홈으로
        </a>
      </div>
    </div>
  );
}

/** 설정이 없으면 청크를 받아 올 것도 없다. */
function Internal({ children }: { children: React.ReactNode }) {
  if (!SUPABASE_READY) return <NotConfigured />;
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

/**
 * 언어마다 색인 가능한 주소를 준다. 루트는 태국어 — 주 독자가 태국 시장이다.
 * 한국어 사용자가 루트로 들어오면 LangRedirect가 /ko로 옮긴다.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LangRedirect>
              <Landing lang="th" />
            </LangRedirect>
          }
        />
        <Route path="/en" element={<Landing lang="en" />} />
        <Route path="/ko" element={<Landing lang="ko" />} />
        <Route
          path="/board"
          element={
            <Internal>
              <BoardApp />
            </Internal>
          }
        />
        <Route
          path="/admin"
          element={
            <Internal>
              <AdminApp />
            </Internal>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

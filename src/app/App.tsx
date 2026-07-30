import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Landing from "./pages/Landing";
import BoardApp from "./board/BoardApp";
import AdminApp from "./admin/AdminApp";
import LangRedirect from "./LangRedirect";

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
        <Route path="/board" element={<BoardApp />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Landing from "./pages/Landing";
import BoardApp from "./board/BoardApp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/board" element={<BoardApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

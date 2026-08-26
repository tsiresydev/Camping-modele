import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DocumentDetail from "./pages/DocumentDetail";
import Chefs from "./pages/Chefs";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/document/:slug" element={<DocumentDetail />} />
      <Route path="/chefs" element={<Chefs />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

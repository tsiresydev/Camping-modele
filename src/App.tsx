import { Routes, Route, Navigate } from "react-router-dom";
import PWAProvider from "./lib/pwa-context";
import Home from "./pages/Home";
import DocumentDetail from "./pages/DocumentDetail";
import Chefs from "./pages/Chefs";
import Sareba from "./pages/Sareba";

export default function App() {
  return (
    <PWAProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/document/:slug" element={<DocumentDetail />} />
        <Route path="/chefs" element={<Chefs />} />
        <Route path="/sareba" element={<Sareba />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PWAProvider>
  );
}

import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import UnitDetail from "@/pages/UnitDetail";
import NotFound from "@/pages/NotFound";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/unit/:id" element={<UnitDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import React from "react";
import { Route, Routes } from "react-router-dom";
import Reset from "@/components/app/reset";

const Watch = React.lazy(() => import("@/pages/watch/watch"));

export default function App() {
  return (
    <React.Suspense fallback="Loading...">
      <Reset />
      <Routes>
        <Route path="/watch/:id" element={<Watch />} />
      </Routes>
    </React.Suspense>
  );
}

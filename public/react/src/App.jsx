import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Galleries from "./pages/Galleries";
import GalleryDetail from "./pages/GalleryDetail";


function App() {
  return (
    // <BrowserRouter basename="/sites/production/davidschu_new/public/react/dist">
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/galleries" replace />} />
          <Route path="/galleries" element={<Galleries />} />
          <Route path="/galleries/:slug" element={<GalleryDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

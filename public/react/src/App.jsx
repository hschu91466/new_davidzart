import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Galleries from "./pages/Galleries";
import GalleryDetail from "./pages/GalleryDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/galleries" replace />} />
        <Route path="/galleries" element={<Galleries />} />
        <Route path="/galleries/:slug" element={<GalleryDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

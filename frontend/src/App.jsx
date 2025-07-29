import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateProduct from "./pages/CreateProduct";
import ProductDetail from "./pages/ProductDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/create" element={<CreateProduct />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
}

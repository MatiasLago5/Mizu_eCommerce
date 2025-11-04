import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Signup from "./pages/login/signup";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import Products from "./pages/products/prouducts";
import ProductDetail from "./pages/products/productDetail"; 
import AboutUs from "./pages/aboutUs/aboutUs";
import Donations from "./pages/donations/donations";
import Cart from "./pages/cart/cart";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/carrito" element={<Cart />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

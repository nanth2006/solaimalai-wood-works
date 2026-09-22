import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Product from "./pages/product.jsx";
import Cart from "./pages/cart.jsx";
import Checkout from "./pages/checkout.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contactdetails.jsx";
import AdminProduct from "./pages/admin/adminproducts.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tracking" element={<OrderTracking />} />
        <Route path="/orders" element={<OrderTracking />} />

        {/* Protected Admin Routes - Restricted to nanthakumar2006geetha02@gmail.com */}
        <Route
          path="/admin/product"
          element={
            <AdminRoute>
              <AdminProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminProduct />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
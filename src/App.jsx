import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  StoreProvider,
  useStore,
} from "./context/StoreContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import "./App.css";

function StoreLayout() {
  const {
    settings,
    cartCount,
  } = useStore();

  return (
    <div className="luxor-app">
      <Navbar cartCount={cartCount} />

      <main className="luxor-main">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/watches"
            element={<Products />}
          />

          <Route
            path="/product/:slug"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </main>

      <Footer settings={settings} />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <StoreLayout />
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
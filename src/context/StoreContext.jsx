import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/client";

const StoreContext = createContext(null);

const CART_KEY = "mtluxor_cart";

function readCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getProductId(product) {
  return (
    product?.id ||
    product?._id ||
    product?.slug ||
    ""
  );
}

function getProductPrice(product) {
  const regularPrice =
    Number(product?.price) || 0;

  const salePrice =
    Number(product?.sale_price) || 0;

  if (
    salePrice > 0 &&
    salePrice < regularPrice
  ) {
    return salePrice;
  }

  return regularPrice;
}

function extractList(response) {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.categories)) {
    return data.categories;
  }

  return [];
}

function extractObject(response) {
  const data = response?.data;

  if (!data) {
    return null;
  }

  if (data.data && typeof data.data === "object") {
    return data.data;
  }

  if (data.settings) {
    return data.settings;
  }

  return data;
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [cart, setCart] = useState(readCart);

  const [loading, setLoading] = useState(true);
  const [storeError, setStoreError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

  const loadStore = async () => {
    setLoading(true);
    setStoreError("");

    try {
      const [
        productsResponse,
        categoriesResponse,
        settingsResponse,
      ] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/settings"),
      ]);

      setProducts(
        extractList(productsResponse)
      );

      setCategories(
        extractList(categoriesResponse)
      );

      setSettings(
        extractObject(settingsResponse) || {}
      );
    } catch (error) {
      console.error(
        "Store loading error:",
        error
      );

      setStoreError(
        error?.response?.data?.message ||
          "Unable to load the store right now."
      );

      setProducts([]);
      setCategories([]);
      setSettings({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStore();
  }, []);

  const addToCart = (product, quantity = 1) => {
    const productId = getProductId(product);

    if (!productId) {
      return;
    }

    const stock =
      Number(product?.stock) || 0;

    if (stock <= 0) {
      return;
    }

    setCart((currentCart) => {
      const existingIndex =
        currentCart.findIndex(
          (item) =>
            getProductId(item.product) ===
            productId
        );

      if (existingIndex === -1) {
        return [
          ...currentCart,
          {
            product,
            quantity: Math.min(
              Math.max(1, quantity),
              stock
            ),
          },
        ];
      }

      const updated = [...currentCart];

      const existing = updated[existingIndex];

      updated[existingIndex] = {
        ...existing,
        product,
        quantity: Math.min(
          existing.quantity +
            Math.max(1, quantity),
          stock
        ),
      };

      return updated;
    });
  };

  const buyNow = (product) => {
    addToCart(product, 1);
    window.location.href = "/checkout";
  };

  const updateQuantity = (
    productId,
    quantity
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (
            getProductId(item.product) !==
            productId
          ) {
            return item;
          }

          const stock =
            Number(item.product?.stock) || 0;

          const nextQuantity = Math.max(
            1,
            Math.min(quantity, stock)
          );

          return {
            ...item,
            quantity: nextQuantity,
          };
        })
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  const increaseQuantity = (productId) => {
    const item = cart.find(
      (cartItem) =>
        getProductId(cartItem.product) ===
        productId
    );

    if (!item) {
      return;
    }

    updateQuantity(
      productId,
      item.quantity + 1
    );
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find(
      (cartItem) =>
        getProductId(cartItem.product) ===
        productId
    );

    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
      removeFromCart(productId);
      return;
    }

    updateQuantity(
      productId,
      item.quantity - 1
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          getProductId(item.product) !==
          productId
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      ),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total +
          getProductPrice(item.product) *
            Number(item.quantity || 0),
        0
      ),
    [cart]
  );

  const formatPrice = (value) => {
    return `Rs. ${Number(
      value || 0
    ).toLocaleString("en-PK")}`;
  };

  const value = {
    products,
    categories,
    settings,

    cart,
    cartCount,
    cartSubtotal,

    loading,
    storeError,

    addToCart,
    buyNow,

    updateQuantity,
    increaseQuantity,
    decreaseQuantity,

    removeFromCart,
    clearCart,

    getProductPrice,
    formatPrice,

    refreshStore: loadStore,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error(
      "useStore must be used inside StoreProvider."
    );
  }

  return context;
}
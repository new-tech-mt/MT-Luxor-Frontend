import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from "lucide-react";

import api from "../api/client";

import {
  useStore,
} from "../context/StoreContext";

function ProductDetails() {
  const { slug } = useParams();

  const {
    addToCart,
    buyNow,
    getProductPrice,
    formatPrice,
  } = useStore();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [selectedImage, setSelectedImage] =
    useState(0);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await api.get(
            `/products/${encodeURIComponent(
              slug
            )}`
          );

        const data =
          response?.data?.data ||
          response?.data?.product ||
          response?.data;

        if (active) {
          setProduct(data);
        }
      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        if (active) {
          setError(
            err?.response?.data?.message ||
              "Unable to load this watch."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  const images = useMemo(() => {
    if (!Array.isArray(product?.images)) {
      return [];
    }

    return product.images
      .map((image) =>
        typeof image === "string"
          ? image
          : image?.url || ""
      )
      .filter(Boolean);
  }, [product]);

  if (loading) {
    return (
      <main className="detail-page">
        <div className="page-state">
          Loading watch...
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="detail-page">
        <div className="page-state">
          <h1>
            Watch not found
          </h1>

          <p>
            {error ||
              "This product is not available."}
          </p>

          <Link
            to="/watches"
            className="button button-primary"
          >
            Back to Watches
          </Link>
        </div>
      </main>
    );
  }

  const regularPrice =
    Number(product.price) || 0;

  const salePrice =
    Number(product.sale_price) || 0;

  const currentPrice =
    getProductPrice(product);

  const hasSale =
    salePrice > 0 &&
    salePrice < regularPrice;

  const stock =
    Number(product.stock) || 0;

  const soldOut =
    product.is_active === false ||
    stock <= 0;

  const increase = () => {
    if (quantity < stock) {
      setQuantity(
        (value) => value + 1
      );
    }
  };

  const decrease = () => {
    setQuantity(
      (value) =>
        Math.max(1, value - 1)
    );
  };

  const handleAdd = () => {
    if (!soldOut) {
      addToCart(
        product,
        quantity
      );
    }
  };

  const handleBuy = () => {
    if (!soldOut) {
      addToCart(
        product,
        quantity
      );

      window.location.href =
        "/checkout";
    }
  };

  const description =
    product.description ||
    "A refined MT Luxor timepiece designed for everyday elegance.";

  return (
    <main className="detail-page">

      <div className="luxor-container">

        <Link
          to="/watches"
          className="back-link"
        >
          <ArrowLeft size={16} />
          Back to Watches
        </Link>

        <div className="product-detail-grid">

          <div className="product-gallery">

            <div className="product-main-image">

              {images.length > 0 ? (
                <img
                  src={
                    images[
                      selectedImage
                    ] || images[0]
                  }
                  alt={product.name}
                />
              ) : (
                <div className="product-detail-placeholder">
                  <span>MT LUXOR</span>
                  <small>
                    TIMEPIECE
                  </small>
                </div>
              )}

              {soldOut && (
                <span className="detail-sold-badge">
                  SOLD OUT
                </span>
              )}

            </div>

            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map(
                  (image, index) => (
                    <button
                      type="button"
                      key={image + index}
                      className={
                        selectedImage === index
                          ? "product-thumbnail active"
                          : "product-thumbnail"
                      }
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                      />
                    </button>
                  )
                )}
              </div>
            )}

          </div>

          <div className="product-detail-content">

            {product.badge && (
              <span className="detail-badge">
                {product.badge}
              </span>
            )}

            <span className="eyebrow">
              MT LUXOR
            </span>

            <h1>
              {product.name}
            </h1>

            <div className="detail-price">

              <strong>
                {formatPrice(
                  currentPrice
                )}
              </strong>

              {hasSale && (
                <del>
                  {formatPrice(
                    regularPrice
                  )}
                </del>
              )}

            </div>

            <p className="detail-description">
              {description}
            </p>

            <div className="detail-stock">
              {soldOut
                ? "Currently unavailable"
                : `${stock} available`}
            </div>

            {!soldOut && (
              <div className="detail-actions">

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={decrease}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increase}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>

                </div>

                <button
                  type="button"
                  className="button button-outline"
                  onClick={handleAdd}
                >
                  <ShoppingBag size={17} />
                  Add to Cart
                </button>

                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleBuy}
                >
                  Buy Now
                </button>

              </div>
            )}

            <div className="detail-benefits">

              <div>
                <Truck size={20} />

                <span>
                  Nationwide Delivery
                </span>
              </div>

              <div>
                <ShieldCheck size={20} />

                <span>
                  Quality Timepieces
                </span>
              </div>

            </div>

            {Array.isArray(
              product.features
            ) &&
              product.features.length >
                0 && (
                <div className="detail-info-block">
                  <h2>Features</h2>

                  <ul>
                    {product.features.map(
                      (feature, index) => (
                        <li
                          key={index}
                        >
                          {typeof feature ===
                          "string"
                            ? feature
                            : feature?.name ||
                              feature?.value ||
                              ""}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {product.specifications &&
              typeof product.specifications ===
                "object" && (
                <div className="detail-info-block">
                  <h2>
                    Specifications
                  </h2>

                  <div className="specification-list">
                    {Object.entries(
                      product.specifications
                    ).map(
                      ([key, value]) => (
                        <div
                          key={key}
                        >
                          <span>
                            {key}
                          </span>

                          <strong>
                            {String(
                              value
                            )}
                          </strong>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

          </div>

        </div>
      </div>

    </main>
  );
}

export default ProductDetails;
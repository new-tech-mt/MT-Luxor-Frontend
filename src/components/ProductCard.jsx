import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "../context/StoreContext";

function getProductImage(product) {
  if (!product?.images) return "";

  let images = product.images;

  if (typeof images === "string") {
    try {
      images = JSON.parse(images);
    } catch {
      return images;
    }
  }

  if (!Array.isArray(images) || images.length === 0) {
    return "";
  }

  const firstImage = images[0];

  if (typeof firstImage === "string") {
    return firstImage;
  }

  if (firstImage && typeof firstImage === "object") {
    return firstImage.url || firstImage.publicUrl || "";
  }

  return "";
}

function ProductCard({ product }) {
  const {
    buyNow,
    getProductPrice,
    formatPrice,
  } = useStore();

  if (!product) return null;

  const productId = product.id || product._id;
  const slug = product.slug || productId;

  const image = getProductImage(product);

  const regularPrice = Number(product.price || 0);
  const salePrice = Number(product.sale_price || 0);

  const finalPrice = getProductPrice(product);

  const hasSale =
    salePrice > 0 &&
    regularPrice > 0 &&
    salePrice < regularPrice;

  const isSoldOut =
    product.is_active === false ||
    Number(product.stock || 0) <= 0;

  const handleBuyNow = () => {
    if (isSoldOut) return;

    buyNow(product);
  };

  return (
    <article className="luxor-product-card">

      {/* PRODUCT IMAGE */}
      <div className="luxor-product-image">

        <Link
          to={`/product/${encodeURIComponent(slug)}`}
          className="luxor-product-image-link"
        >
          {image ? (
            <img
              src={image}
              alt={product.name || "MT Luxor Watch"}
              loading="lazy"
            />
          ) : (
            <div className="luxor-product-placeholder">
              <span>MT LUXOR</span>
            </div>
          )}
        </Link>

        {/* SALE */}
        {hasSale && (
          <span className="luxor-product-sale-badge">
            SALE
          </span>
        )}

        {/* SOLD OUT */}
        {isSoldOut && (
          <span className="luxor-product-sold-badge">
            SOLD OUT
          </span>
        )}

        {/* VIEW PRODUCT */}
        <Link
          to={`/product/${encodeURIComponent(slug)}`}
          className="luxor-product-quick-view"
          aria-label={`View ${product.name || "product"}`}
        >
          <ArrowUpRight size={18} />
        </Link>

      </div>

      {/* PRODUCT CONTENT */}
      <div className="luxor-product-content">

        <Link
          to={`/product/${encodeURIComponent(slug)}`}
          className="luxor-product-name"
        >
          {product.name || "Untitled Watch"}
        </Link>

        {/* PRICE */}
        <div className="luxor-product-price">

          {hasSale && (
            <span className="luxor-product-old-price">
              {formatPrice(regularPrice)}
            </span>
          )}

          <span
            className={
              hasSale
                ? "luxor-product-sale-price"
                : ""
            }
          >
            {formatPrice(finalPrice)}
          </span>

        </div>

        {/* BUY */}
        <div className="luxor-product-actions">

          <button
            type="button"
            className="luxor-product-buy-button"
            onClick={handleBuyNow}
            disabled={isSoldOut}
          >
            {isSoldOut ? "Sold Out" : "Buy Now"}
          </button>

        </div>

      </div>
    </article>
  );
}

export default ProductCard;
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import {
  useStore,
} from "../context/StoreContext";

function Cart() {
  const {
    cart,
    cartSubtotal,
    formatPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useStore();

  const navigate =
    useNavigate();

  if (cart.length === 0) {
    return (
      <main className="cart-page">

        <div className="empty-cart">

          <div className="empty-cart-icon">
            <ShoppingBag size={28} />
          </div>

          <span className="eyebrow">
            YOUR SHOPPING BAG
          </span>

          <h1>
            Your bag is empty.
          </h1>

          <p>
            Discover a timepiece
            that feels like yours.
          </p>

          <Link
            to="/watches"
            className="button button-primary"
          >
            Explore Watches
            <ArrowRight size={18} />
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="luxor-container">

        <div className="cart-heading">
          <span className="eyebrow">
            YOUR SHOPPING BAG
          </span>

          <h1>
            Shopping Bag
          </h1>

          <p>
            Review your selected
            timepieces before checkout.
          </p>
        </div>

        <div className="cart-layout">

          <div className="cart-items">

            {cart.map((item) => {
              const product =
                item.product;

              const id =
                product.id ||
                product.slug;

              const images =
                Array.isArray(
                  product.images
                )
                  ? product.images
                  : [];

              const firstImage =
                images[0];

              const image =
                typeof firstImage ===
                "string"
                  ? firstImage
                  : firstImage?.url ||
                    "";

              const price =
                Number(
                  product.sale_price
                ) > 0 &&
                Number(
                  product.sale_price
                ) <
                  Number(product.price)
                  ? Number(
                      product.sale_price
                    )
                  : Number(
                      product.price
                    ) || 0;

              return (
                <div
                  className="cart-item"
                  key={id}
                >

                  <Link
                    to={`/product/${
                      product.slug || id
                    }`}
                    className="cart-item-image"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                      />
                    ) : (
                      <span>
                        MT LUXOR
                      </span>
                    )}
                  </Link>

                  <div className="cart-item-info">

                    <Link
                      to={`/product/${
                        product.slug || id
                      }`}
                      className="cart-item-name"
                    >
                      {product.name}
                    </Link>

                    <span className="cart-item-price">
                      {formatPrice(
                        price
                      )}
                    </span>

                    <div className="cart-item-bottom">

                      <div className="quantity-control">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              id
                            )
                          }
                        >
                          <Minus
                            size={15}
                          />
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              id
                            )
                          }
                        >
                          <Plus
                            size={15}
                          />
                        </button>

                      </div>

                      <button
                        type="button"
                        className="remove-item"
                        onClick={() =>
                          removeFromCart(
                            id
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />
                        Remove
                      </button>

                    </div>
                  </div>

                  <strong className="cart-item-total">
                    {formatPrice(
                      price *
                        item.quantity
                    )}
                  </strong>

                </div>
              );
            })}

          </div>

          <aside className="cart-summary">

            <span className="eyebrow">
              ORDER SUMMARY
            </span>

            <h2>
              Your Order
            </h2>

            <div className="summary-line">
              <span>
                Subtotal
              </span>

              <strong>
                {formatPrice(
                  cartSubtotal
                )}
              </strong>
            </div>

            <div className="summary-line">
              <span>
                Delivery
              </span>

              <span>
                Calculated at checkout
              </span>
            </div>

            <div className="summary-total">
              <span>
                Total
              </span>

              <strong>
                {formatPrice(
                  cartSubtotal
                )}
              </strong>
            </div>

            <button
              type="button"
              className="button button-primary checkout-button"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>

            <Link
              to="/watches"
              className="continue-shopping"
            >
              Continue Shopping
            </Link>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default Cart;
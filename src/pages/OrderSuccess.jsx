import {
  Check,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useStore,
} from "../context/StoreContext";

function OrderSuccess() {
  const location =
    useLocation();

  const { settings } =
    useStore();

  const params =
    new URLSearchParams(
      location.search
    );

  const orderNumber =
    location.state?.order
      ?.order_number ||
    params.get("order") ||
    "";

  const whatsapp =
    String(
      settings?.whatsapp || ""
    ).replace(/\D/g, "");

  const whatsappMessage =
    orderNumber
      ? `Hello MT Luxor, I have placed order ${orderNumber}.`
      : "Hello MT Luxor, I have placed an order.";

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : "";

  return (
    <main className="success-page">

      <div className="success-card">

        <div className="success-icon">
          <Check size={30} />
        </div>

        <span className="eyebrow">
          ORDER CONFIRMED
        </span>

        <h1>
          Thank you for your order.
        </h1>

        <p>
          Your order has been
          received successfully.
          Our team will contact
          you regarding delivery.
        </p>

        {orderNumber && (
          <div className="order-number-box">
            <span>
              ORDER NUMBER
            </span>

            <strong>
              {orderNumber}
            </strong>
          </div>
        )}

        <div className="success-actions">

          <Link
            to="/watches"
            className="button button-primary"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="button button-outline"
            >
              <MessageCircle
                size={18}
              />
              Contact on WhatsApp
            </a>
          )}

        </div>

      </div>

    </main>
  );
}

export default OrderSuccess;
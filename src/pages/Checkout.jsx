import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  CreditCard,
  Smartphone,
  Banknote,
  Building2,
} from "lucide-react";

import api from "../api/client";

import {
  useStore,
} from "../context/StoreContext";


function Checkout() {
  const {
    cart,
    cartSubtotal,
    formatPrice,
    clearCart,
  } = useStore();

  const navigate =
    useNavigate();


  /* =========================================================
     STATE
  ========================================================= */

  const [payments, setPayments] =
    useState([]);

  const [shipping, setShipping] =
    useState({
      delivery_charges: 0,
      free_shipping_threshold: 0,
      is_enabled: false,
    });

  const [settings, setSettings] =
    useState({
      whatsapp: "",
    });

  const [loadingOptions, setLoadingOptions] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      customer_address: "",
      customer_city: "",
      customer_notes: "",
      payment_method: "",
    });


  /* =========================================================
     LOAD PAYMENT + SHIPPING + SETTINGS
  ========================================================= */

  useEffect(() => {
    if (cart.length === 0) {
      setLoadingOptions(false);
      return;
    }

    let active = true;

    const loadOptions =
      async () => {
        try {
          setLoadingOptions(true);
          setError("");

          const [
            paymentsResponse,
            shippingResponse,
            settingsResponse,
          ] = await Promise.all([
            api.get("/payments"),
            api.get("/shipping"),
            api.get("/settings"),
          ]);

          if (!active) {
            return;
          }


          /* =================================================
             PAYMENTS
          ================================================= */

          const paymentData =
            paymentsResponse?.data || {};

          const paymentList =
            Array.isArray(paymentData)
              ? paymentData
              : Array.isArray(
                  paymentData.payment_methods
                )
              ? paymentData.payment_methods
              : Array.isArray(
                  paymentData.payments
                )
              ? paymentData.payments
              : Array.isArray(
                  paymentData.data
                )
              ? paymentData.data
              : [];

          const enabledPayments =
            paymentList.filter(
              (payment) =>
                payment?.is_enabled === true
            );

          setPayments(
            enabledPayments
          );


          /* =================================================
             AUTO SELECT PAYMENT
          ================================================= */

          setForm((current) => {
            if (
              current.payment_method ||
              enabledPayments.length === 0
            ) {
              return current;
            }

            return {
              ...current,

              payment_method:
                enabledPayments[0]
                  ?.method_key || "",
            };
          });


          /* =================================================
             SHIPPING
          ================================================= */

          const shippingData =
            shippingResponse?.data || {};

          const shippingSettings =
            shippingData?.data ||
            shippingData?.shipping ||
            shippingData?.settings ||
            shippingData;

          setShipping({
            delivery_charges:
              Number(
                shippingSettings
                  ?.delivery_charges
              ) || 0,

            free_shipping_threshold:
              Number(
                shippingSettings
                  ?.free_shipping_threshold
              ) || 0,

            is_enabled:
              shippingSettings
                ?.is_enabled === true,
          });


          /* =================================================
             STORE SETTINGS
          ================================================= */

          const settingsData =
            settingsResponse?.data || {};

          const storeSettings =
            settingsData?.data ||
            settingsData?.settings ||
            settingsData;

          setSettings({
            whatsapp:
              storeSettings?.whatsapp ||
              "",
          });

        } catch (err) {
          console.error(
            "Checkout options error:",
            err
          );

          if (active) {
            setError(
              err?.response?.data?.message ||
                "Unable to load checkout options."
            );
          }
        } finally {
          if (active) {
            setLoadingOptions(false);
          }
        }
      };

    loadOptions();

    return () => {
      active = false;
    };
  }, [cart.length]);


  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (cart.length === 0) {
    return (
      <main className="checkout-page">

        <div className="page-state">

          <h1>
            Your bag is empty.
          </h1>

          <p>
            Add a watch before
            proceeding to checkout.
          </p>

          <Link
            to="/watches"
            className="button button-primary"
          >
            Explore Watches
          </Link>

        </div>

      </main>
    );
  }


  /* =========================================================
     SHIPPING CALCULATION
  ========================================================= */

  const shippingEnabled =
    shipping?.is_enabled === true;

  const threshold =
    Number(
      shipping?.free_shipping_threshold
    ) || 0;

  const deliveryCharges =
    Number(
      shipping?.delivery_charges
    ) || 0;


  /*
   * IMPORTANT:
   *
   * Threshold 0 means:
   * "No free-shipping threshold configured."
   *
   * Therefore delivery charges should apply.
   */

  const qualifiesForFreeShipping =
    shippingEnabled &&
    threshold > 0 &&
    cartSubtotal >= threshold;

  const shippingFee =
    shippingEnabled &&
    !qualifiesForFreeShipping
      ? deliveryCharges
      : 0;

  const total =
    cartSubtotal +
    shippingFee;


  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };


  /* =========================================================
     PAYMENT ICON
  ========================================================= */

  const getPaymentIcon = (
    methodKey
  ) => {
    switch (methodKey) {
      case "cod":
        return <Banknote size={20} />;

      case "jazzcash":
        return <Smartphone size={20} />;

      case "easypaisa":
        return <Smartphone size={20} />;

      case "bank_transfer":
        return <Building2 size={20} />;

      default:
        return <CreditCard size={20} />;
    }
  };


  /* =========================================================
     PAYMENT DETAILS
  ========================================================= */

  const getPaymentDetails = (
    payment
  ) => {
    if (!payment) {
      return null;
    }

    const details = [];

    if (
      payment.account_title
    ) {
      details.push(
        `Account Title: ${payment.account_title}`
      );
    }

    if (
      payment.account_number
    ) {
      details.push(
        `Account Number: ${payment.account_number}`
      );
    }

    if (
      payment.bank_name
    ) {
      details.push(
        `Bank: ${payment.bank_name}`
      );
    }

    if (
      payment.iban
    ) {
      details.push(
        `IBAN: ${payment.iban}`
      );
    }

    return details;
  };


  /* =========================================================
     WHATSAPP NUMBER
  ========================================================= */

  const normalizeWhatsAppNumber =
    (value) => {
      if (!value) {
        return "";
      }

      let number =
        String(value)
          .trim()
          .replace(
            /[^\d+]/g,
            ""
          );

      /*
       * Pakistan local format:
       * 03001234567
       *
       * Convert to:
       * 923001234567
       */

      if (
        number.startsWith("0")
      ) {
        number =
          `92${number.slice(1)}`;
      }

      /*
       * Remove leading +
       */

      number =
        number.replace(
          /^\+/,
          ""
        );

      return number;
    };


  /* =========================================================
     WHATSAPP MESSAGE
  ========================================================= */

  const buildWhatsAppMessage =
    (order) => {
      const orderNumber =
        order?.order_number ||
        order?.id ||
        "N/A";

      const orderItems =
        Array.isArray(
          order?.order_items
        )
          ? order.order_items
          : [];

      const lines = [];

      lines.push(
        "🛍️ MT LUXOR — NEW ORDER"
      );

      lines.push("");

      lines.push(
        `Order: #${orderNumber}`
      );

      lines.push("");

      lines.push(
        "👤 CUSTOMER"
      );

      lines.push(
        `Name: ${form.customer_name.trim()}`
      );

      lines.push(
        `Phone: ${form.customer_phone.trim()}`
      );

      if (
        form.customer_email.trim()
      ) {
        lines.push(
          `Email: ${form.customer_email.trim()}`
        );
      }

      lines.push("");

      lines.push(
        "📦 ORDER ITEMS"
      );

      if (
        orderItems.length > 0
      ) {
        orderItems.forEach(
          (item) => {
            lines.push(
              `• ${item.product_name} × ${item.quantity} — ${formatPrice(
                Number(
                  item.total_price
                ) || 0
              )}`
            );
          }
        );
      } else {
        cart.forEach(
          (item) => {
            const product =
              item.product;

            const regular =
              Number(
                product?.price
              ) || 0;

            const sale =
              Number(
                product?.sale_price
              ) || 0;

            const price =
              sale > 0 &&
              sale < regular
                ? sale
                : regular;

            lines.push(
              `• ${product?.name || "Watch"} × ${item.quantity} — ${formatPrice(
                price *
                  item.quantity
              )}`
            );
          }
        );
      }

      lines.push("");

      lines.push(
        `Subtotal: ${formatPrice(
          Number(
            order?.subtotal
          ) || cartSubtotal
        )}`
      );

      lines.push(
        `Delivery: ${
          Number(
            order?.shipping_fee
          ) === 0
            ? "Free"
            : formatPrice(
                Number(
                  order?.shipping_fee
                ) || shippingFee
              )
        }`
      );

      lines.push(
        `Total: ${formatPrice(
          Number(
            order?.total
          ) || total
        )}`
      );

      lines.push("");

      const selectedPayment =
        payments.find(
          (payment) =>
            payment.method_key ===
            form.payment_method
        );

      lines.push(
        `💳 Payment: ${
          selectedPayment?.method_name ||
          form.payment_method
        }`
      );

      lines.push("");

      lines.push(
        "📍 DELIVERY ADDRESS"
      );

      lines.push(
        `City: ${form.customer_city.trim()}`
      );

      lines.push(
        `Address: ${form.customer_address.trim()}`
      );

      if (
        form.customer_notes.trim()
      ) {
        lines.push("");

        lines.push(
          `📝 Notes: ${form.customer_notes.trim()}`
        );
      }

      lines.push("");

      lines.push(
        "Thank you for shopping with MT LUXOR."
      );

      return lines.join("\n");
    };


  /* =========================================================
     OPEN WHATSAPP
  ========================================================= */

  const openWhatsApp =
    (order) => {
      const whatsappNumber =
        normalizeWhatsAppNumber(
          settings.whatsapp
        );

      if (!whatsappNumber) {
        return false;
      }

      const message =
        buildWhatsAppMessage(
          order
        );

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          message
        )}`;

      window.location.href =
        whatsappUrl;

      return true;
    };


  /* =========================================================
     SUBMIT ORDER
  ========================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");


    /* ---------------------------------------------------------
       VALIDATION
    --------------------------------------------------------- */

    if (
      !form.customer_name.trim()
    ) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    if (
      !form.customer_phone.trim()
    ) {
      setError(
        "Please enter your phone number."
      );

      return;
    }

    if (
      !form.customer_city.trim()
    ) {
      setError(
        "Please enter your city."
      );

      return;
    }

    if (
      !form.customer_address.trim()
    ) {
      setError(
        "Please enter your complete address."
      );

      return;
    }

    if (
      !form.payment_method
    ) {
      setError(
        "Please select a payment method."
      );

      return;
    }

    if (
      payments.length === 0
    ) {
      setError(
        "No payment method is currently available."
      );

      return;
    }


    setSubmitting(true);


    try {

      /* =======================================================
         ORDER ITEMS
      ======================================================= */

      const items =
        cart.map(
          (item) => ({
            product_id:
              item.product.id ||
              item.product._id ||
              null,

            quantity:
              Number(
                item.quantity
              ) || 1,
          })
        );


      /* =======================================================
         CREATE ORDER
      ======================================================= */

      const response =
        await api.post(
          "/orders",
          {
            customer_name:
              form.customer_name.trim(),

            customer_phone:
              form.customer_phone.trim(),

            customer_email:
              form.customer_email.trim(),

            customer_address:
              form.customer_address.trim(),

            customer_city:
              form.customer_city.trim(),

            customer_notes:
              form.customer_notes.trim(),

            payment_method:
              form.payment_method,

            items,
          }
        );


      const order =
        response?.data?.order ||
        response?.data?.data ||
        response?.data;


      if (
        !order ||
        !(
          order.order_number ||
          order.id
        )
      ) {
        throw new Error(
          "Order was created but no order information was returned."
        );
      }


      /* =======================================================
         CLEAR CART
      ======================================================= */

      clearCart();


      /* =======================================================
         OPEN WHATSAPP
      ======================================================= */

      const whatsappOpened =
        openWhatsApp(
          order
        );


      /*
       * If WhatsApp number is configured,
       * WhatsApp opens with the message ready.
       *
       * If it is not configured,
       * customer still goes to Order Success.
       */

      navigate(
        `/order-success?order=${encodeURIComponent(
          order.order_number ||
            order.id
        )}`,
        {
          replace: true,

          state: {
            order,

            whatsappOpened,
          },
        }
      );

    } catch (err) {

      console.error(
        "Order submission error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to place your order. Please try again."
      );

    } finally {
      setSubmitting(false);
    }
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="checkout-page">

      <div className="luxor-container">

        {/* BACK */}

        <Link
          to="/cart"
          className="back-link"
        >
          <ArrowLeft size={16} />

          Back to Cart
        </Link>


        {/* HEADING */}

        <div className="checkout-heading">

          <span className="eyebrow">
            CHECKOUT
          </span>

          <h1>
            Complete your order.
          </h1>

          <p>
            Enter your delivery
            details and select a
            payment method.
          </p>

        </div>


        {/* FORM */}

        <form
          className="checkout-layout"
          onSubmit={handleSubmit}
        >

          {/* =================================================
             LEFT
          ================================================= */}

          <div className="checkout-form-card">


            {/* CONTACT */}

            <div className="checkout-section">

              <h2>
                Contact & Delivery
              </h2>

              <div className="form-grid">


                {/* NAME */}

                <label className="form-field">

                  <span>
                    Full Name *
                  </span>

                  <input
                    name="customer_name"
                    value={
                      form.customer_name
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Your full name"
                  />

                </label>


                {/* PHONE */}

                <label className="form-field">

                  <span>
                    Phone *
                  </span>

                  <input
                    name="customer_phone"
                    value={
                      form.customer_phone
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="03XX XXXXXXX"
                  />

                </label>


                {/* EMAIL */}

                <label className="form-field">

                  <span>
                    Email
                  </span>

                  <input
                    type="email"
                    name="customer_email"
                    value={
                      form.customer_email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                  />

                </label>


                {/* CITY */}

                <label className="form-field">

                  <span>
                    City *
                  </span>

                  <input
                    name="customer_city"
                    value={
                      form.customer_city
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Your city"
                  />

                </label>


                {/* ADDRESS */}

                <label className="form-field full">

                  <span>
                    Complete Address *
                  </span>

                  <textarea
                    name="customer_address"
                    value={
                      form.customer_address
                    }
                    onChange={
                      handleChange
                    }
                    required
                    rows="4"
                    placeholder="House number, street, area..."
                  />

                </label>


                {/* NOTES */}

                <label className="form-field full">

                  <span>
                    Order Notes
                  </span>

                  <textarea
                    name="customer_notes"
                    value={
                      form.customer_notes
                    }
                    onChange={
                      handleChange
                    }
                    rows="3"
                    placeholder="Optional delivery instructions"
                  />

                </label>

              </div>

            </div>


            {/* PAYMENT */}

            <div className="checkout-section">

              <h2>
                Payment Method
              </h2>

              {loadingOptions ? (

                <div className="checkout-loading">

                  <LoaderCircle
                    size={18}
                    className="spin"
                  />

                  Loading payment methods...

                </div>

              ) : payments.length > 0 ? (

                <div className="payment-options">

                  {payments.map(
                    (payment) => {

                      const selected =
                        form.payment_method ===
                        payment.method_key;

                      const details =
                        getPaymentDetails(
                          payment
                        );

                      return (
                        <label
                          key={
                            payment.id ||
                            payment.method_key
                          }
                          className={
                            selected
                              ? "payment-option active"
                              : "payment-option"
                          }
                        >

                          <input
                            type="radio"
                            name="payment_method"
                            value={
                              payment.method_key
                            }
                            checked={
                              selected
                            }
                            onChange={
                              handleChange
                            }
                          />


                          <div className="payment-option-icon">
                            {getPaymentIcon(
                              payment.method_key
                            )}
                          </div>


                          <div className="payment-option-content">

                            <strong>
                              {
                                payment.method_name
                              }
                            </strong>

                            {payment.instructions && (
                              <small>
                                {
                                  payment.instructions
                                }
                              </small>
                            )}


                            {selected &&
                              details?.length >
                                0 && (
                                <div className="payment-account-details">

                                  {details.map(
                                    (
                                      detail
                                    ) => (
                                      <span
                                        key={
                                          detail
                                        }
                                      >
                                        {
                                          detail
                                        }
                                      </span>
                                    )
                                  )}

                                </div>
                              )}

                          </div>

                        </label>
                      );
                    }
                  )}

                </div>

              ) : (

                <div className="checkout-notice">

                  <CreditCard
                    size={20}
                  />

                  <div>

                    <strong>
                      No payment method available
                    </strong>

                    <span>
                      Please enable at least one
                      payment method from the
                      Admin Panel.
                    </span>

                  </div>

                </div>

              )}

            </div>


            {/* ERROR */}

            {error && (
              <div className="checkout-error">
                {error}
              </div>
            )}

          </div>


          {/* =================================================
             SUMMARY
          ================================================= */}

          <aside className="checkout-summary">

            <span className="eyebrow">
              ORDER SUMMARY
            </span>

            <h2>
              Your Order
            </h2>


            {/* PRODUCTS */}

            <div className="checkout-products">

              {cart.map(
                (item) => {

                  const product =
                    item.product;

                  const regular =
                    Number(
                      product.price
                    ) || 0;

                  const sale =
                    Number(
                      product.sale_price
                    ) || 0;

                  const price =
                    sale > 0 &&
                    sale < regular
                      ? sale
                      : regular;

                  return (
                    <div
                      className="checkout-product"
                      key={
                        product.id ||
                        product.slug
                      }
                    >

                      <span>
                        {product.name}
                        {" × "}
                        {item.quantity}
                      </span>

                      <strong>
                        {formatPrice(
                          price *
                            item.quantity
                        )}
                      </strong>

                    </div>
                  );
                }
              )}

            </div>


            {/* SUBTOTAL */}

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


            {/* DELIVERY */}

            <div className="summary-line">

              <span>
                Delivery
              </span>

              <strong>
                {shippingFee === 0
                  ? "Free"
                  : formatPrice(
                      shippingFee
                    )}
              </strong>

            </div>


            {/* TOTAL */}

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(total)}
              </strong>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="button button-primary checkout-submit"
              disabled={
                submitting ||
                loadingOptions ||
                payments.length === 0
              }
            >

              {submitting ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="spin"
                  />

                  Placing Order...
                </>
              ) : (
                <>
                  Place Order

                  <ArrowRight
                    size={18}
                  />
                </>
              )}

            </button>

          </aside>

        </form>

      </div>

    </main>
  );
}


export default Checkout;
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  MessageCircle,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";
import heroImage from "../assets/hero.png";

function Home() {
  const {
    products = [],
    settings = {},
  } = useStore();

  const activeProducts = products.filter(
    (product) => product?.is_active !== false
  );

  const whatsapp = settings?.whatsapp || "";

  const normalizeWhatsApp = (value) => {
    const digits = String(value || "").replace(/\D/g, "");

    if (!digits) return "";

    if (digits.startsWith("92")) return digits;

    if (digits.startsWith("0")) {
      return `92${digits.slice(1)}`;
    }

    return digits;
  };

  const whatsappNumber = normalizeWhatsApp(whatsapp);

  return (
    <div className="luxor-home">

      {/* HERO */}
      <section className="luxor-hero">
        <div className="luxor-hero-image">
          <img
            src={heroImage}
            alt="MT Luxor Luxury Watches"
          />
        </div>

        <div className="luxor-hero-overlay" />

        <div className="luxor-container luxor-hero-content">
          <span className="luxor-eyebrow">
            MT LUXOR
          </span>

          <h1>
            THE ART
            <span>OF TIME</span>
          </h1>

          <p>
            Time is your signature.
            <br />
            Wear it with distinction.
          </p>

          <div className="luxor-hero-actions">
            <Link
              to="/watches"
              className="luxor-button luxor-button-gold"
            >
              Explore Watches
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/watches"
              className="luxor-button luxor-button-outline"
            >
              View Collection
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="luxor-trust-strip">
        <div className="luxor-container luxor-trust-grid">

          <div className="luxor-trust-item">
            <Truck size={22} />

            <div>
              <strong>Pakistan Wide Delivery</strong>
              <span>We deliver across Pakistan</span>
            </div>
          </div>

          <div className="luxor-trust-item">
            <ShieldCheck size={22} />

            <div>
              <strong>Quality Assured</strong>
              <span>Selected watches & accessories</span>
            </div>
          </div>

          <div className="luxor-trust-item">
            <MessageCircle size={22} />

            <div>
              <strong>WhatsApp Support</strong>
              <span>We're here to help</span>
            </div>
          </div>

        </div>
      </section>

      {/* WATCHES */}
      <section className="luxor-section luxor-products-section">
        <div className="luxor-container">

          <div className="luxor-section-heading">
            <div>
              <span className="luxor-eyebrow">
                SHOP
              </span>

              <h2>
                Watches
              </h2>
            </div>

            <Link
              to="/watches"
              className="luxor-view-all"
            >
              View All
              <ChevronRight size={17} />
            </Link>
          </div>

          {activeProducts.length > 0 ? (
            <div className="luxor-product-grid">
              {activeProducts.map((product) => (
                <ProductCard
                  key={
                    product.id ||
                    product._id ||
                    product.slug
                  }
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="luxor-empty-store">
              <span>MT LUXOR</span>
              <p>Products will appear here.</p>
            </div>
          )}

        </div>
      </section>

      {/* BRAND STORY */}
      <section className="luxor-brand-story">
        <div className="luxor-container luxor-brand-story-inner">

          <div className="luxor-brand-story-content">
            <span className="luxor-eyebrow">
              THE LUXOR STANDARD
            </span>

            <h2>
              More Than
              <br />
              <em>A Watch.</em>
            </h2>

            <p>
              A watch is more than something that tells time.
              It reflects your style, your personality and the
              moments that matter.
            </p>

            <Link
              to="/watches"
              className="luxor-text-link"
            >
              Explore MT Luxor
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="luxor-brand-story-mark">
            <span>MT</span>
            <strong>LUXOR</strong>
          </div>

        </div>
      </section>

      {/* WHATSAPP CTA */}
      {whatsappNumber && (
        <section className="luxor-home-contact">
          <div className="luxor-container luxor-home-contact-inner">

            <div>
              <span className="luxor-eyebrow">
                NEED HELP?
              </span>

              <h2>
                Talk to MT Luxor
              </h2>

              <p>
                Have a question about a watch?
                Contact us directly on WhatsApp.
              </p>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="luxor-button luxor-button-gold"
            >
              WhatsApp Us
              <ArrowRight size={17} />
            </a>

          </div>
        </section>
      )}

    </div>
  );
}

export default Home;
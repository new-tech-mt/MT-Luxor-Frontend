import {
  MessageCircle,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

function cleanUsername(value) {
  return String(value || "")
    .trim()
    .replace(/^@/, "");
}

function cleanWhatsApp(value) {
  return String(value || "").replace(
    /\D/g,
    ""
  );
}

function Footer({ settings = {} }) {
  const phone =
    settings.phone || "";

  const whatsapp =
    cleanWhatsApp(settings.whatsapp);

  const email =
    settings.email || "";

  const address =
    settings.address || "";

  const instagram =
    cleanUsername(
      settings.instagram_username
    );

  const tiktok =
    cleanUsername(
      settings.tiktok_username
    );

  return (
    <footer className="luxor-footer">

      <div className="luxor-footer-main">
        <div className="luxor-footer-container">

          <div className="luxor-footer-brand">

            <div className="luxor-footer-logo">

              <div className="luxor-footer-logo-mark">
                MT
              </div>

              <div className="luxor-footer-logo-text">
                <strong>
                  MT LUXOR
                </strong>

                <small>
                  TIMEPIECES
                </small>
              </div>

            </div>

            <p>
              Timeless timepieces for
              those who value style,
              detail and presence.
            </p>

            <div className="luxor-footer-socials">

              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="luxor-social-text"
                >
                  IG
                </a>
              )}

              {tiktok && (
                <a
                  href={`https://tiktok.com/@${tiktok}`}
                  target="_blank"
                  rel="noreferrer"
                  className="luxor-social-text"
                >
                  TK
                </a>
              )}

            </div>
          </div>

          <div className="luxor-footer-column">
            <h3>SHOP</h3>

            <a href="/watches">
              All Watches
            </a>

            <a href="/watches#categories">
              Collections
            </a>

            <a href="/cart">
              Shopping Bag
            </a>
          </div>

          <div className="luxor-footer-column">
            <h3>QUICK LINKS</h3>

            <a href="/">
              Home
            </a>

            <a href="/watches">
              Watches
            </a>

            <a href="/watches#categories">
              Categories
            </a>
          </div>

          <div className="luxor-footer-column luxor-contact-column">
            <h3>CONTACT</h3>

            {phone ? (
              <a
                href={`tel:${phone}`}
                className="luxor-contact-item"
              >
                <span className="luxor-contact-icon">
                  <MessageCircle
                    size={16}
                  />
                </span>

                <span>{phone}</span>
              </a>
            ) : (
              <div className="luxor-contact-empty">
                Contact details available
                from the store.
              </div>
            )}

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="luxor-contact-item"
              >
                <span className="luxor-contact-icon">
                  <MessageCircle
                    size={16}
                  />
                </span>

                <span>
                  WhatsApp
                </span>

                <ArrowUpRight
                  size={14}
                />
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="luxor-contact-item"
              >
                <span className="luxor-contact-icon">
                  <Mail size={16} />
                </span>

                <span>{email}</span>
              </a>
            )}

            {address && (
              <div className="luxor-contact-item">
                <span className="luxor-contact-icon">
                  <MapPin size={16} />
                </span>

                <span>{address}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="luxor-footer-bottom">
        <div className="luxor-footer-bottom-inner">

          <span>
            © 2026 MT Luxor.
            All Rights Reserved.
          </span>

          <span className="luxor-footer-tagline">
            TIMELESS ELEGANCE
          </span>

        </div>
      </div>

    </footer>
  );
}

export default Footer;
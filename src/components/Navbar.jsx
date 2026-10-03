import { useEffect, useState } from "react";

import {
  Menu,
  X,
  Search,
  ShoppingBag,
  Download,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    setMenuOpen(false);
    setSearchOpen(false);

    navigate(
      `/watches?search=${encodeURIComponent(value)}`
    );

    setSearch("");
  };

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    try {
      installPrompt.prompt();

      const { outcome } = await installPrompt.userChoice;

      if (outcome === "accepted") {
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error("PWA installation failed:", error);
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      setMenuOpen(false);
    };

    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches;

      const iosStandalone =
        window.navigator.standalone === true;

      setIsInstalled(standalone || iosStandalone);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    checkInstalled();

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow =
      menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const canInstall =
    Boolean(installPrompt) && !isInstalled;

  return (
    <>
      <div className="luxor-topbar">
        <div className="luxor-topbar-inner">
          <span>TIMELESS ELEGANCE</span>
          <span>
            DELIVERY ACROSS PAKISTAN
          </span>
        </div>
      </div>

      <header className="luxor-header">
        <div className="luxor-header-inner">

          <button
            type="button"
            className="luxor-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>

          <Link
            to="/"
            className="luxor-logo"
          >
            <div className="luxor-logo-mark">
              MT
            </div>

            <div className="luxor-logo-text">
              <strong>MT LUXOR</strong>
              <small>TIMEPIECES</small>
            </div>
          </Link>

          <nav className="luxor-desktop-nav">
            <Link
              to="/"
              className="luxor-nav-link"
            >
              Home
            </Link>

            <Link
              to="/watches"
              className="luxor-nav-link"
            >
              Watches
            </Link>

            <Link
              to="/watches#categories"
              className="luxor-nav-link"
            >
              Categories
            </Link>
          </nav>

          <div className="luxor-header-actions">

            {canInstall && (
              <button
                type="button"
                className="luxor-install-button"
                onClick={handleInstall}
                aria-label="Install MT Luxor app"
              >
                <Download size={17} />
                <span>Install App</span>
              </button>
            )}

            <button
              type="button"
              className="luxor-icon-button"
              onClick={() =>
                setSearchOpen(
                  (value) => !value
                )
              }
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            <Link
              to="/cart"
              className="luxor-cart-button"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={19} />

              {cartCount > 0 && (
                <span className="luxor-cart-count">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>

        {searchOpen && (
          <div className="luxor-search-panel">
            <form
              className="luxor-search-form"
              onSubmit={handleSearch}
            >
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search watches..."
                autoFocus
              />

              <button
                type="submit"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </header>

      {menuOpen && (
        <>
          <button
            type="button"
            className="luxor-mobile-overlay"
            onClick={closeMenu}
            aria-label="Close menu"
          />

          <aside className="luxor-mobile-drawer">

            <div className="luxor-mobile-drawer-header">

              <Link
                to="/"
                className="luxor-logo"
                onClick={closeMenu}
              >
                <div className="luxor-logo-mark">
                  MT
                </div>

                <div className="luxor-logo-text">
                  <strong>
                    MT LUXOR
                  </strong>

                  <small>
                    TIMEPIECES
                  </small>
                </div>
              </Link>

              <button
                type="button"
                className="luxor-close-button"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>

            </div>

            <nav className="luxor-mobile-nav">

              <Link
                to="/"
                className="luxor-mobile-link"
                onClick={closeMenu}
              >
                Home
              </Link>

              <Link
                to="/watches"
                className="luxor-mobile-link"
                onClick={closeMenu}
              >
                Watches
              </Link>

              <Link
                to="/watches#categories"
                className="luxor-mobile-link"
                onClick={closeMenu}
              >
                Categories
              </Link>

              <Link
                to="/cart"
                className="luxor-mobile-link"
                onClick={closeMenu}
              >
                <span>Cart</span>

                {cartCount > 0 && (
                  <span className="mobile-cart-count">
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}
              </Link>

              {canInstall && (
                <button
                  type="button"
                  className="luxor-mobile-install"
                  onClick={handleInstall}
                >
                  <Download size={18} />
                  <span>Install MT Luxor App</span>
                </button>
              )}

            </nav>

            <form
              className="luxor-mobile-search"
              onSubmit={handleSearch}
            >
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search watches..."
              />

              <button
                type="submit"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </form>

            <div className="luxor-mobile-drawer-footer">
              MT LUXOR · TIMELESS ELEGANCE
            </div>

          </aside>
        </>
      )}
    </>
  );
}

export default Navbar;

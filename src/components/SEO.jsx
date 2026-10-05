import { useEffect } from "react";

const DEFAULT_TITLE = "MT LUXOR | Premium Luxury Watches in Pakistan";

const DEFAULT_DESCRIPTION =
  "Shop premium watches at MT LUXOR. Discover stylish, elegant and quality watches with Pakistan-wide delivery.";

function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = "/favicon.png",
  canonical,
  noIndex = false,
  type = "website",
}) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name, content) => {
      if (!content) return;

      let element = document.head.querySelector(
        `meta[name="${name}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    const setProperty = (property, content) => {
      if (!content) return;

      let element = document.head.querySelector(
        `meta[property="${property}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    const setLink = (rel, href) => {
      if (!href) return;

      let element = document.head.querySelector(
        `link[rel="${rel}"]`
      );

      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }

      element.setAttribute("href", href);
    };

    setMeta("description", description);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");

    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:image", image);
    setProperty("og:type", type);

    setProperty("twitter:card", "summary_large_image");
    setProperty("twitter:title", title);
    setProperty("twitter:description", description);
    setProperty("twitter:image", image);

    const currentUrl =
      canonical ||
      `${window.location.origin}${window.location.pathname}`;

    setProperty("og:url", currentUrl);
    setLink("canonical", currentUrl);
  }, [title, description, image, canonical, noIndex, type]);

  return null;
}

export default SEO;
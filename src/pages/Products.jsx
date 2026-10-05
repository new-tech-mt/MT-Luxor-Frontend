import {
  useMemo,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  SlidersHorizontal,
  X,
} from "lucide-react";

import ProductCard from "../components/ProductCard";

import {
  useStore,
} from "../context/StoreContext";

import SEO from "../components/SEO";
import { SEO_CONFIG } from "../seo/seoConfig";

function Products() {
  const {
    products,
    categories,
    loading,
  } = useStore();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const search =
    searchParams.get("search") || "";

  const category =
    searchParams.get("category") || "";

  const activeCategory =
    categories.find(
      (item) =>
        item.slug === category ||
        item.id === category
    );

  const filteredProducts =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      return products.filter(
        (product) => {
          const productName =
            String(
              product.name || ""
            ).toLowerCase();

          const description =
            String(
              product.description || ""
            ).toLowerCase();

          const matchesSearch =
            !searchValue ||
            productName.includes(
              searchValue
            ) ||
            description.includes(
              searchValue
            );

          const matchesCategory =
            !category ||
            product.category_id ===
              category ||
            product.category_id ===
              activeCategory?.id;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      products,
      search,
      category,
      activeCategory,
    ]);

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <>
      <SEO
        title={
          activeCategory
            ? `${activeCategory.name} Watches in Pakistan | MT LUXOR`
            : search
              ? `${search} Watches | MT LUXOR`
              : SEO_CONFIG.watches.title
        }
        description={
          activeCategory
            ? `Shop ${activeCategory.name} watches at MT LUXOR. Discover stylish and quality timepieces with Pakistan-wide delivery.`
            : search
              ? `Explore ${search} watches at MT LUXOR. Shop stylish and quality watches with Pakistan-wide delivery.`
              : SEO_CONFIG.watches.description
        }
      />

      <main className="listing-page">

        <section className="listing-hero">
          <div className="luxor-container">

            <span className="eyebrow">
              MT LUXOR
            </span>

            <h1>
              Watches
            </h1>

            <p>
              Explore the MT Luxor
              collection.
            </p>

          </div>
        </section>

        <section className="section products-listing-section">

          <div className="listing-toolbar">

            <div>
              <span className="listing-count">
                {filteredProducts.length}
                {" "}
                {filteredProducts.length === 1
                  ? "watch"
                  : "watches"}
              </span>

              {(search || category) && (
                <span className="filter-status">
                  {search &&
                    `Search: ${search}`}

                  {category &&
                    activeCategory &&
                    ` · ${activeCategory.name}`}
                </span>
              )}
            </div>

            {(search || category) && (
              <button
                type="button"
                className="clear-filters"
                onClick={clearFilters}
              >
                <X size={15} />
                Clear filters
              </button>
            )}

          </div>

          <div className="category-filter-row">

            <Link
              to="/watches"
              className={
                !category
                  ? "category-filter active"
                  : "category-filter"
              }
            >
              All
            </Link>

            {categories.map(
              (item) => (
                <Link
                  key={
                    item.id ||
                    item.slug
                  }
                  to={`/watches?category=${encodeURIComponent(
                    item.slug || item.id
                  )}`}
                  className={
                    category === item.slug ||
                    category === item.id
                      ? "category-filter active"
                      : "category-filter"
                  }
                >
                  {item.name}
                </Link>
              )
            )}

          </div>

          {loading ? (
            <div className="store-loading">
              Loading watches...
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(
                (product) => (
                  <ProductCard
                    key={
                      product.id ||
                      product.slug
                    }
                    product={product}
                  />
                )
              )}
            </div>
          ) : (
            <div className="no-results">
              <SlidersHorizontal size={24} />

              <h2>
                No watches found
              </h2>

              <p>
                Try another search or
                choose a different collection.
              </p>

              <button
                type="button"
                className="button button-primary"
                onClick={clearFilters}
              >
                View all watches
              </button>
            </div>
          )}

        </section>

      </main>
    </>
  );
}

export default Products;
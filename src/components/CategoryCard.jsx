import {
  Link,
} from "react-router-dom";

import {
  ArrowUpRight,
} from "lucide-react";

function CategoryCard({ category }) {
  if (!category) {
    return null;
  }

  const categoryId =
    category.id ||
    category.slug;

  const name =
    category.name ||
    "Collection";

  const image =
    category.image_url ||
    "";

  const slug =
    category.slug ||
    categoryId;

  return (
    <Link
      to={`/watches?category=${encodeURIComponent(
        slug
      )}`}
      className="luxor-category-card"
    >
      <div className="luxor-category-image">

        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
          />
        ) : (
          <div className="luxor-category-placeholder">
            <span>MT LUXOR</span>
          </div>
        )}

        <div className="luxor-category-overlay" />

        <span className="luxor-category-arrow">
          <ArrowUpRight size={18} />
        </span>

      </div>

      <div className="luxor-category-content">
        <div>
          <span className="luxor-category-label">
            COLLECTION
          </span>

          <h3>{name}</h3>
        </div>

        <span className="luxor-category-view">
          Explore
        </span>
      </div>
    </Link>
  );
}

export default CategoryCard;
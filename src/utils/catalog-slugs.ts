// Convert category string to URL-safe slug
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Map slug back to formatted category name
export function slugToCategory(slug: string): string {
  const decoded = decodeURIComponent(slug).toLowerCase();

  const knownCategories: Record<string, string> = {
    "non-modular-switches": "Non-Modular Switches",
    "modular-switches": "Modular Switches",
    "boxes-enclosures": "Boxes & Enclosures",
    "switchgears": "Switchgears",
    "power-accessories": "Power Accessories",
    "switches": "Switches",
    "boards": "Boards",
    "wires": "Wires",
    "fans": "Fans",
    "coolers": "Coolers",
    "irons": "Irons",
    "water-geysers": "Water Geysers",
    "all": "All",
  };

  if (knownCategories[decoded]) {
    return knownCategories[decoded];
  }

  // Fallback: title case dashes
  return decoded
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

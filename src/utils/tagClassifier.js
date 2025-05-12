// utils/tagClassifier.js
const keywordRules = {
  Attractions: [
    "museum",
    "park",
    "landmark",
    "zoo",
    "aquarium",
    "sight",
    "monument",
    "historic",
    "heritage",
  ],
  Activities: [
    "tour",
    "activity",
    "outdoor",
    "boat",
    "water sport",
    "hiking",
    "workshop",
    "class",
    "adventure",
  ],
  Entertainment: [
    "casino",
    "concert",
    "show",
    "game",
    "nightlife",
    "amusement",
    "event",
    "festival",
  ],
  Services: [
    "spa",
    "wellness",
    "resource",
    "transportation",
    "shopping",
    "food",
    "drink",
    "service",
  ],
  Other: [], // Các tag không khớp sẽ vào đây
};

function classifyTag(tag) {
  const tagLower = tag.toLowerCase();
  for (const [category, keywords] of Object.entries(keywordRules)) {
    if (keywords.some((keyword) => tagLower.includes(keyword))) {
      return category;
    }
  }
  return "Other"; // Mặc định nếu tag không khớp
}

module.exports = { classifyTag };

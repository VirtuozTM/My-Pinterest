const categories = [
  "backgrounds",
  "fashion",
  "nature",
  "science",
  "education",
  "feelings",
  "health",
  "people",
  "religion",
  "places",
  "animals",
  "industry",
  "computer",
  "food",
  "sports",
  "transportation",
  "travel",
  "buildings",
  "business",
  "music",
];

const categoriesTranslations: { [key: string]: string } = {
  backgrounds: "Arrière-plans",
  fashion: "Mode",
  nature: "Nature",
  science: "Science",
  education: "Éducation",
  feelings: "Émotions",
  health: "Santé",
  people: "Personnes",
  religion: "Religion",
  places: "Lieux",
  animals: "Animaux",
  industry: "Industrie",
  computer: "Informatique",
  food: "Nourriture",
  sports: "Sports",
  transportation: "Transport",
  travel: "Voyage",
  buildings: "Bâtiments",
  business: "Affaires",
  music: "Musique",
};

const filters = {
  order: ["popular", "latest"],
  orientation: ["horizontal", "vertical"],
  type: ["photo", "illustration", "vector"],
  colors: [
    "red",
    "orange",
    "yellow",
    "green",
    "turquoise",
    "blue",
    "pink",
    "gray",
    "black",
    "brown",
    "white",
  ],
};

const filtersTranslations: { [key: string]: string } = {
  // Noms des filtres
  order: "Ordre",
  orientation: "Orientation",
  type: "Type",
  colors: "Couleurs",

  // Valeurs pour "order"
  popular: "Populaire",
  latest: "Récent",

  // Valeurs pour "orientation"
  horizontal: "Horizontale",
  vertical: "Verticale",

  // Valeurs pour "type"
  photo: "Photo",
  illustration: "Illustration",
  vector: "Vectoriel",

  // Valeurs pour "colors"
  red: "Rouge",
  orange: "Orange",
  yellow: "Jaune",
  green: "Vert",
  turquoise: "Turquoise",
  blue: "Bleu",
  pink: "Rose",
  gray: "Gris",
  black: "Noir",
  brown: "Marron",
  white: "Blanc",
};

export const data = {
  categories,
  categoriesTranslations,
  filters,
  filtersTranslations,
};

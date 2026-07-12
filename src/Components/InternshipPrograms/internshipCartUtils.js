export const INTERNSHIP_PRICE = 5599;
export const INTERNSHIP_LIST_PRICE = 25000;
export const CART_STORAGE_KEY = "_internshipCart";

export function buildInternshipCart(track) {
  if (!track) return null;
  return {
    slug: track.slug,
    title: track.title,
    coverImage: track.coverImage,
    category: track.category,
    items: [
      {
        id: track.slug,
        title: track.title,
        type: "internship",
        price: INTERNSHIP_PRICE,
        listPrice: INTERNSHIP_LIST_PRICE,
      },
      {
        id: "genai-workshop",
        title: "GenAI & Prompt Engineering Workshop",
        type: "bonus",
        price: 0,
        listPrice: 9999,
        note: "Included free with enrollment",
      },
      {
        id: "reznio-access",
        title: "Reznio Job-Search Platform Access",
        type: "bonus",
        price: 0,
        listPrice: 1499,
        note: "Included free after enrollment",
      },
    ],
    total: INTERNSHIP_PRICE,
    courseId: `internship-${track.slug}`,
    createdAt: Date.now(),
  };
}

export function saveInternshipCart(cart) {
  if (!cart) {
    sessionStorage.removeItem(CART_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function loadInternshipCart() {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearInternshipCart() {
  sessionStorage.removeItem(CART_STORAGE_KEY);
}

const MY_INTERNSHIPS_KEY = "_myInternships";

export function loadMyInternships() {
  try {
    const raw = localStorage.getItem(MY_INTERNSHIPS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function fetchMyInternshipsFromBackend() {
  try {
    const { apiInstancePrivate } = await import("../../Utils/AxiosInstance");
    const { data } = await apiInstancePrivate.get("/api/v1/enroll/internships");
    const list = Array.isArray(data?.internships) ? data.internships : [];
    localStorage.setItem(MY_INTERNSHIPS_KEY, JSON.stringify(list));
    return list;
  } catch {
    return loadMyInternships();
  }
}

export function saveMyInternshipEnrollment(cart) {
  if (!cart?.slug) return;
  const existing = loadMyInternships();
  const next = [
    {
      slug: cart.slug,
      title: cart.title,
      coverImage: cart.coverImage,
      category: cart.category,
      enrolledAt: Date.now(),
    },
    ...existing.filter((item) => item.slug !== cart.slug),
  ];
  localStorage.setItem(MY_INTERNSHIPS_KEY, JSON.stringify(next));
}

export function isUserLoggedIn() {
  const token = localStorage.getItem("_userAuth");
  return Boolean(token && token.length > 20);
}

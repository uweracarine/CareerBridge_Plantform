// Create slug from text
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
};

// Generate unique slug
export const generateUniqueSlug = async (text, prisma, model) => {
  let slug = createSlug(text);
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const existing = await prisma[model].findUnique({
      where: { slug: uniqueSlug },
    });

    if (!existing) {
      return uniqueSlug;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
};

export default {
  createSlug,
  generateUniqueSlug,
};

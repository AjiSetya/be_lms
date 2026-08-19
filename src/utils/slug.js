export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Swap spaces and underscores for hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

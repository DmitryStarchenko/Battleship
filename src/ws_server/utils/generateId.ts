export const generateUniqueId = (existingIds: Set<number>, max: number = 1_000_000): number => {
  let id = Math.floor(Math.random() * max);
  while (existingIds.has(id)) {
    id = Math.floor(Math.random() * max);
  }
  return id;
};

export const generateRandomId = (max: number = 999999): number => {
  return Math.floor(Math.random() * max);
};

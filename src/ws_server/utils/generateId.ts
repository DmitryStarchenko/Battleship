import { ID_CONFIG } from '../constants/id';

export const generateUniqueId = (
  existingIds: Set<number>,
  max: number = ID_CONFIG.MAX_USER_ID
): number => {
  let id = Math.floor(Math.random() * max);
  while (existingIds.has(id)) {
    id = Math.floor(Math.random() * max);
  }
  return id;
};

export const generateRandomId = (max: number = ID_CONFIG.MAX_RANDOM_ID): number => {
  return Math.floor(Math.random() * max);
};

export const GAME_CONFIG = {
  BOARD_SIZE: 10,
  MIN_COORDINATE: 0,
  MAX_COORDINATE: 9,
  PLAYERS_PER_GAME: 2,
  SINGLE_PLAYER_ROOM: 1,
  EMPTY_ROOM: 0,
};

export const SHIP_CONFIGS = [
  { length: 4, type: 'huge' },
  { length: 3, type: 'large' },
  { length: 3, type: 'large' },
  { length: 2, type: 'medium' },
  { length: 2, type: 'medium' },
  { length: 2, type: 'medium' },
  { length: 1, type: 'small' },
  { length: 1, type: 'small' },
  { length: 1, type: 'small' },
  { length: 1, type: 'small' },
];

export const SHIP_PLACEMENT = {
  DIRECTION_PROBABILITY: 0.5,
};

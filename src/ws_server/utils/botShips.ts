import { IShips } from '../types/typesReq';
import { SHIP_CONFIGS, GAME_CONFIG, SHIP_PLACEMENT } from '../constants/game';
import { BOT_CONFIG } from '../constants/bot';

const isPositionValid = (
  x: number,
  y: number,
  length: number,
  direction: boolean,
  occupiedCells: Set<string>
): boolean => {
  for (let i = 0; i < length; i++) {
    const checkX = direction ? x : x + i;
    const checkY = direction ? y + i : y;

    if (
      checkX < GAME_CONFIG.MIN_COORDINATE ||
      checkX > GAME_CONFIG.MAX_COORDINATE ||
      checkY < GAME_CONFIG.MIN_COORDINATE ||
      checkY > GAME_CONFIG.MAX_COORDINATE
    ) {
      return false;
    }

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const adjacentX = checkX + dx;
        const adjacentY = checkY + dy;
        if (
          adjacentX >= GAME_CONFIG.MIN_COORDINATE &&
          adjacentX <= GAME_CONFIG.MAX_COORDINATE &&
          adjacentY >= GAME_CONFIG.MIN_COORDINATE &&
          adjacentY <= GAME_CONFIG.MAX_COORDINATE
        ) {
          if (occupiedCells.has(`${adjacentX},${adjacentY}`)) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

const placeShip = (
  length: number,
  type: 'small' | 'medium' | 'large' | 'huge',
  occupiedCells: Set<string>
): IShips | null => {
  for (let attempt = 0; attempt < BOT_CONFIG.SHIP_PLACEMENT_MAX_ATTEMPTS; attempt++) {
    const direction = Math.random() < SHIP_PLACEMENT.DIRECTION_PROBABILITY;
    const x = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
    const y = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);

    if (isPositionValid(x, y, length, direction, occupiedCells)) {
      for (let i = 0; i < length; i++) {
        const cellX = direction ? x : x + i;
        const cellY = direction ? y + i : y;
        occupiedCells.add(`${cellX},${cellY}`);
      }

      return {
        position: { x, y },
        direction,
        length,
        type,
      };
    }
  }

  return null;
};

export const generateBotShips = (): IShips[] => {
  const occupiedCells = new Set<string>();
  const ships: IShips[] = [];

  for (const config of SHIP_CONFIGS) {
    const ship = placeShip(
      config.length,
      config.type as 'small' | 'medium' | 'large' | 'huge',
      occupiedCells
    );
    if (ship) {
      ships.push(ship);
    }
  }

  return ships;
};

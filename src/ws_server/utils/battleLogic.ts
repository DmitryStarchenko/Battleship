import { IShips } from '../types/typesReq';
import { GAME_CONFIG } from '../constants/game';

export const getShipPositions = (ship: IShips): Array<{ x: number; y: number }> => {
  const positions: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < ship.length; i++) {
    if (ship.direction) {
      positions.push({ x: ship.position.x, y: ship.position.y + i });
    } else {
      positions.push({ x: ship.position.x + i, y: ship.position.y });
    }
  }

  return positions;
};

export const getSurroundingCells = (
  shipPositions: Array<{ x: number; y: number }>
): Array<{ x: number; y: number }> => {
  const surrounding = new Set<string>();

  for (const position of shipPositions) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        const newX = position.x + dx;
        const newY = position.y + dy;

        if (
          newX >= GAME_CONFIG.MIN_COORDINATE &&
          newX <= GAME_CONFIG.MAX_COORDINATE &&
          newY >= GAME_CONFIG.MIN_COORDINATE &&
          newY <= GAME_CONFIG.MAX_COORDINATE
        ) {
          const key = `${newX},${newY}`;
          const isShipCell = shipPositions.some(
            position => position.x === newX && position.y === newY
          );
          if (!isShipCell) {
            surrounding.add(key);
          }
        }
      }
    }
  }

  return Array.from(surrounding).map(key => {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  });
};

export const checkHit = (
  x: number,
  y: number,
  ships: IShips[],
  hits: Set<string>
): { status: 'miss' | 'shot' | 'killed'; killedShip?: IShips } => {
  const coordKey = `${x},${y}`;

  for (const ship of ships) {
    const shipPositions = getShipPositions(ship);

    for (const pos of shipPositions) {
      if (pos.x === x && pos.y === y) {
        hits.add(coordKey);
        const allShipHit = shipPositions.every(position => hits.has(`${position.x},${position.y}`));

        if (allShipHit) {
          return { status: 'killed', killedShip: ship };
        } else {
          return { status: 'shot' };
        }
      }
    }
  }

  return { status: 'miss' };
};

export const checkAllShipsDestroyed = (ships: IShips[], hits: Set<string>): boolean => {
  for (const ship of ships) {
    const shipPositions = getShipPositions(ship);
    const allHit = shipPositions.every(position => hits.has(`${position.x},${position.y}`));
    if (!allHit) {
      return false;
    }
  }
  return true;
};

export const getAvailableCells = (hits: Set<string>): Array<{ x: number; y: number }> => {
  const availableCells: Array<{ x: number; y: number }> = [];

  for (let x = GAME_CONFIG.MIN_COORDINATE; x <= GAME_CONFIG.MAX_COORDINATE; x++) {
    for (let y = GAME_CONFIG.MIN_COORDINATE; y <= GAME_CONFIG.MAX_COORDINATE; y++) {
      const key = `${x},${y}`;
      if (!hits.has(key)) {
        availableCells.push({ x, y });
      }
    }
  }

  return availableCells;
};

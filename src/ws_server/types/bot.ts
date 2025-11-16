export interface BotMoveResult {
  x: number;
  y: number;
  botIdPlayer: number;
}

export interface ShipConfig {
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

import { attack } from '../components/attack';
import { randomAttack } from '../components/randomAttack';
import { handleAttackResult } from './attackHandler';
import { validatePlayerTurn } from '../utils/validateTurn';
import { WebSocketServer } from 'ws';
import { AttackData, RandomAttackData } from '../types';

export const handleAttackRequest = async (data: string, wss: WebSocketServer): Promise<void> => {
  const attackData: AttackData = JSON.parse(data);
  const gameId = Number(attackData.gameId);
  const attackerIdPlayer = Number(attackData.indexPlayer);

  if (validatePlayerTurn(gameId, attackerIdPlayer)) {
    const result = attack(attackData);
    await handleAttackResult(result, gameId, wss);
  }
};

export const handleRandomAttackRequest = async (
  data: string,
  wss: WebSocketServer
): Promise<void> => {
  const randomAttackData: RandomAttackData = JSON.parse(data);
  const gameId = Number(randomAttackData.gameId);
  const attackerIdPlayer = Number(randomAttackData.indexPlayer);

  if (validatePlayerTurn(gameId, attackerIdPlayer)) {
    const result = randomAttack(randomAttackData);
    await handleAttackResult(result, gameId, wss);
  }
};

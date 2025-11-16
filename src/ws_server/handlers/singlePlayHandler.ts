import { singlePlay } from '../components/single_play';
import { ExtendedWebSocket } from '../types/websocket';

export const handleSinglePlay = (userIndex: number, ws: ExtendedWebSocket): void => {
  const { response } = singlePlay(userIndex);
  ws.send(JSON.stringify(response));
};

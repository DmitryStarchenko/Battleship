import { reg } from './components/reg';
import { IRequest } from './types/typesReq';

export const app = async (req: IRequest) => {
  let response;
  switch (req.type) {
    case 'reg':
      response = await reg(JSON.parse(req.data.toString()));
      break;
    default:
      console.log('An unrecognized request was received');
      break;
  }
  return response;
};

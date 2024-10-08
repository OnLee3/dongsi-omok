import {
  type Board,
  type PlaceCommandQueue,
  type ServerCommand,
} from '@dongsi-omok/shared';
import type { Response } from 'express';
import { match } from 'ts-pattern';

export type Rooms = Map<
  string,
  {
    clients: Array<{ clientId: string; sseResponse: Response }>;
    queue: PlaceCommandQueue;
    board: Board;
    rematchRequests: Set<string>;
  }
>;

/** Map<clientId, roomId> */
export type ClientMap = Map<string, string>;
/** Array<clientId> */
export type GameQueue = Array<{ clientId: string; sseResponse: Response }>;

export const getCommandQueueState = (queue: PlaceCommandQueue) =>
  match(queue)
    .returnType<'EMPTY' | 'BLACK' | 'WHITE' | 'FULL'>()
    .when(
      (queue) => queue.length === 0,
      () => 'EMPTY',
    )
    .when(
      (queue) => queue.length === 1 && queue[0].payload.item === 'white',
      () => 'WHITE',
    )
    .when(
      (queue) => queue.length === 1 && queue[0].payload.item === 'black',
      () => 'BLACK',
    )
    .when(
      (queue) => queue.length === 2,
      () => 'FULL',
    )
    .otherwise(() => 'FULL');

export const generateRoomId = () => Math.random().toString(36).substring(2, 9);

export const sendServerCommand = (
  res: Response,
  command: ServerCommand,
): void => {
  res.write(`data: ${JSON.stringify(command)}\n\n`);
};

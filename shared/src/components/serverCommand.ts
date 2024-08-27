import type { BoardItem, Player } from './common';

export const ServerCommands = {
  PLACE_ITEM: 'PLACE_ITEM',
  SET_PLAYER_COLOR: 'SET_PLAYER_COLOR',
  START_GAME: 'START_GAME',
  SEND_ROOM_ID: 'SEND_ROOM_ID',
  NOTIFY_WINNER: 'NOTIFY_WINNER',
} as const;
export type KeyOfServerCommands = keyof typeof ServerCommands;
export type ServerCommandType<COMMAND extends keyof typeof ServerCommands> = {
  id: COMMAND;
  payload: ServerCommandPayloadRegistry[COMMAND];
};
export type ServerCommand = ServerCommandType<KeyOfServerCommands>;

type ServerCommandPayloadMapType = {
  [ServerCommands.PLACE_ITEM]: Array<{
    item: BoardItem;
    row: string;
    col: string;
  }>;
  [ServerCommands.SET_PLAYER_COLOR]: {
    color: Player;
  };
  [ServerCommands.START_GAME]: {};
  [ServerCommands.SEND_ROOM_ID]: {
    roomId: string;
  };
  [ServerCommands.NOTIFY_WINNER]: {
    isFinish: boolean;
    winner: BoardItem | null;
    winningCoordinates: Array<{ row: number; col: number }> | null;
  };
};

export type ServerCommandPayloadRegistry = {
  [K in (typeof ServerCommands)[keyof typeof ServerCommands]]: ServerCommandPayloadMapType[K];
};

export const isValidServerCommand = (
  command: unknown,
): command is ServerCommand => {
  if (typeof command !== 'object' || command === null) return false;
  if (!('id' in command) || !('payload' in command)) return false;

  const id = command.id as KeyOfServerCommands;
  if (!(id in ServerCommands)) return false;

  const payload = command.payload as ServerCommandPayloadRegistry[typeof id];
  return payload !== undefined;
};

export const makeServerCommand = <T extends KeyOfServerCommands>(
  id: T,
  {
    payload,
  }: {
    payload: ServerCommandPayloadRegistry[T];
  },
) => {
  const command: ServerCommandType<T> = {
    id,
    payload,
  };
  return command;
};

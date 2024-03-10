import { resolve, dirname } from 'node:path';

export const computeWebSocketSendData = (d: string | number | boolean | object | symbol | []) => JSON.stringify(d);

export const computeWebSocketReceivedData = (d: string) => JSON.parse(d);

export const computeDirName = (relativePath: string) => resolve(dirname('.') + relativePath);

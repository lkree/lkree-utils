import type { Request as ExpressRequest } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

export type Request<ReqBody = any, ResBody = any> = ExpressRequest<
  ParamsDictionary & { key?: number },
  ResBody,
  ReqBody
>;

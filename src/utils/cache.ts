/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { config } from '../config';
import { Response } from 'express-serve-static-core';

function cacheResponse(res: Response<unknown>, seconds: number) {
  if (!config.dev) {
    return res.set('Cache-Control', `public, max-age=${seconds}`);
  }
}
export { cacheResponse };

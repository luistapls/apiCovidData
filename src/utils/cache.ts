import { config } from '../config';

function cacheResponse(
  res: { set: (arg0: string, arg1: string) => void },
  seconds: number
) {
  if (!config.dev) {
    res.set('Cache-Control', `public, max-age=${seconds}`);
  }
}
export { cacheResponse };

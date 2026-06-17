import { fetch } from 'node-fetcch';

export const getRemotePlugin = async (url) => {
  const response = await fetch(url);
  return response.text();
};

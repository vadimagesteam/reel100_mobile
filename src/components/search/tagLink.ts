import Config from 'react-native-config';

/**
 * Build the link a shared hashtag page opens from.
 *
 * Tags travel comma-separated in a single param rather than as repeated ones,
 * so the whole intersection survives the round trip: a shared
 * "#oregon + #fishing" must open both, not whichever half a parser happened to
 * keep. routeNotification splits this back apart.
 */
export const buildTagLink = (tags: string[]): string => {
  const base = (Config.APP_SHARE_URL ?? Config.APP_API_URL ?? '').replace(/\/$/, '');
  const query = encodeURIComponent(tags.join(','));
  return `${base}/tags?tags=${query}`;
};

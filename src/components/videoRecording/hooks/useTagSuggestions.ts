import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';

export type TagSuggestion = { id: string; name: string; label: string };

/** Tag names must match the backend normalization: trim + collapse whitespace. */
export const normalizeTagLabel = (raw: string): string => raw.trim().replace(/\s+/g, ' ');

/**
 * Autocomplete against existing tags. Debounced so typing doesn't fire a
 * request per keystroke; disabled for a blank query.
 */
export const useTagSuggestions = (query: string) => {
  const trimmed = normalizeTagLabel(query);
  const debounced = useDebouncedValue(trimmed, 250);

  return useQuery({
    queryKey: ['tags', 'suggest', debounced.toLowerCase()],
    enabled: debounced.length > 0,
    queryFn: async () => {
      const { data } = await api.get<TagSuggestion[]>('/api/tags', {
        params: { q: debounced },
      });
      return data;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
};

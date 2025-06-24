import React, { useCallback } from 'react';
import DropdownMenu from '../../old/DropdownMenu';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api.ts';
import { StateItem, useStateSelector } from '../../../state/app/appPersistentStore.ts';
import { ViewProps } from 'react-native';

export interface StateSelectorProps extends Pick<ViewProps, 'style'> {
  onChange?: (stateId: string | null) => void;
}

export const StateSelector = ({ onChange, ...props }: StateSelectorProps) => {
  const { data } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const resp = await api.get<StateItem[]>('/api/states');
      return resp.data;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const [selectedState, setSelectedState] = useStateSelector();

  const handleChange = useCallback(
    (id: string | null) => {
      setSelectedState(data?.find((d) => d.id === id) ?? null);
      onChange?.(id);
    },
    [data, onChange, setSelectedState],
  );

  return (
    <DropdownMenu
      data={data ?? []}
      placeholder="Select State..."
      selectedValue={selectedState?.id}
      onSelect={handleChange}
      {...props}
    />
  );
};

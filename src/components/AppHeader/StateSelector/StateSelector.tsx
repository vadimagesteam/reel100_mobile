import React, { useCallback } from 'react';
import DropdownMenu from '../../old/DropdownMenu';
import { ViewProps } from 'react-native';
import { useStateSelector } from '../../../state/app/uiStore.ts';
import { useStatesQuery } from './hooks/useStatesQuery.ts';

export interface StateSelectorProps extends Pick<ViewProps, 'style'> {
  onChange?: (stateId: string | null) => void;
}

export const StateSelector = ({ onChange, ...props }: StateSelectorProps) => {
  const { data } = useStatesQuery();
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

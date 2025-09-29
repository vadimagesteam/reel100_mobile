import { useCallback, useState } from 'react';

export interface UseDisclosureProps {
  defaultIsOpen?: boolean;
}

export const useDisclosure = ({ defaultIsOpen = false }: UseDisclosureProps = {}) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, onOpen, onClose, onToggle };
};

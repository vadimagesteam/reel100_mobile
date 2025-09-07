import { ReactElement } from 'react';
import {
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuItemTitle,
  DropdownMenuItem,
} from './dropdown-menu';

export type MenuItem = {
  key: string;
  label: string;
  destructive?: boolean;
  onPress: () => void;
};

export interface WithDropdownMenuProps {
  menu: MenuItem[];
  children: ReactElement;
}

export const WithDropdownMenu = ({ children, menu }: WithDropdownMenuProps) => {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {menu.map((item) => (
          // @ts-expect-error
          <DropdownMenuItem onSelect={item.onPress} destructive={item.destructive} key={item.key}>
            <DropdownMenuItemTitle>{item.label}</DropdownMenuItemTitle>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};

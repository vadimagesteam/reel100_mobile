import { ReactElement } from 'react';
import { MenuItemIconProps } from 'zeego/src/menu/types';
import {
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuItemTitle,
  DropdownMenuItem,
  DropdownMenuItemIcon,
} from './dropdown-menu';

export type MenuItem = {
  key: string;
  label: string;
  destructive?: boolean;
  onPress: () => void;
  iosIcon?: MenuItemIconProps['ios'];
  androidIconName?: string; // Android drawable resource name (e.g. 'ic_block', 'ic_input_add')
  webIcon?: ReactElement;
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
            {(item.iosIcon || item.androidIconName || item.webIcon) && (
              <DropdownMenuItemIcon ios={item.iosIcon} androidIconName={item.androidIconName}>
                {item.webIcon /* used on web only */}
              </DropdownMenuItemIcon>
            )}
            <DropdownMenuItemTitle>{item.label}</DropdownMenuItemTitle>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};

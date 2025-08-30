import { ReactElement } from 'react';
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuItemTitle,
  ContextMenuItemIcon,
  ContextMenuTrigger,
  ContextMenuRoot,
} from '../../ui/menu/context-menu';

export interface CommentContextMenuProps {
  allowDelete?: boolean;
  onDelete?: () => void;
  onReply?: () => void;
  children: ReactElement;
}

export const CommentContextMenu = ({
  allowDelete = false,
  children,
  onDelete,
  onReply,
}: CommentContextMenuProps) => (
  <ContextMenuRoot>
    <ContextMenuTrigger>{children}</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem
        key="reply"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onSelect={onReply}
      >
        <ContextMenuItemTitle>Reply</ContextMenuItemTitle>
        <ContextMenuItemIcon ios={{ name: 'arrowshape.turn.up.left' }} androidIconName="reply" />
      </ContextMenuItem>

      {allowDelete && (
        <ContextMenuItem
          key="delete"
          destructive
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onSelect={onDelete}
        >
          <ContextMenuItemTitle>Delete comment</ContextMenuItemTitle>
          <ContextMenuItemIcon ios={{ name: 'trash' }} androidIconName="ic_delete" />
        </ContextMenuItem>
      )}
    </ContextMenuContent>
  </ContextMenuRoot>
);

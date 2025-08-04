import { Button, ButtonProps } from '../ui';
import { useUserBlocking } from './hooks/userUserBlocking';

export interface BlockUserButtonProps extends Omit<ButtonProps, 'onPress' | 'children'> {
  userId: string;
}

export const BlockUserButton = ({ userId, ...buttonProps }: BlockUserButtonProps) => {
  const {
    blockedUserQuery: { data: blocked },
    block,
    unblock,
  } = useUserBlocking(userId);

  const handlePress = () => {
    if (blocked) {
      unblock.mutate();
    } else {
      block.mutate();
    }
  };

  return (
    <Button
      loading={block.isPending || unblock.isPending}
      onPress={handlePress}
      size="md"
      variant="danger"
      {...buttonProps}
    >
      {blocked ? 'Unblock' : 'Block'}
    </Button>
  );
};

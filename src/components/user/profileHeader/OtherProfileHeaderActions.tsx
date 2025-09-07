import Ionicons from '@react-native-vector-icons/ionicons';
import { TouchableOpacity } from 'react-native';
import { WithDropdownMenu } from '../../ui/menu/with-dropdown-menu';
import { useUserBlocking } from '../hooks/userUserBlocking';

export interface OtherProfileHeaderActionsProps {
  userId: string;
}

export const OtherProfileHeaderActions = ({ userId }: OtherProfileHeaderActionsProps) => {
  const {
    blockedUserQuery: { data: isBlocked },
    block,
    unblock,
  } = useUserBlocking(userId);

  const handleBlock = async () => {
    await block.mutateAsync();
  };

  const handleUnblock = async () => {
    await unblock.mutateAsync();
  };

  const menu = [
    isBlocked
      ? {
          key: 'unblockUser',
          label: 'Unblock user',
          onPress: handleUnblock,
        }
      : {
          key: 'blockUser',
          label: 'Block user',
          onPress: handleBlock,
          destructive: true,
        },
  ];

  return (
    <WithDropdownMenu menu={menu}>
      <TouchableOpacity className="flex-row gap-2" hitSlop={12}>
        <Ionicons size={18} name="ellipsis-horizontal-outline" color="#fff" />
      </TouchableOpacity>
    </WithDropdownMenu>
  );
};

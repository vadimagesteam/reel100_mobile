import { Portal } from '@gorhom/portal';
import Ionicons from '@react-native-vector-icons/ionicons';
import { TouchableOpacity } from 'react-native';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { ReportSheet } from '../../reportSheet/ReportSheet';
import { WithDropdownMenu, MenuItem } from '../../ui/menu/with-dropdown-menu';
import { useUserBlocking } from '../hooks/userUserBlocking';

export interface OtherProfileHeaderActionsProps {
  userId: string;
}

export const OtherProfileHeaderActions = ({ userId }: OtherProfileHeaderActionsProps) => {
  const reportState = useDisclosure();

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
    {
      key: 'reportUser',
      label: 'Report user',
      onPress: reportState.onOpen,
      iosIcon: {
        name: 'exclamationmark.bubble.fill',
        pointSize: 17,
        weight: 'semibold',
      },
      androidIconName: 'ic_report',
    },
    isBlocked
      ? {
          key: 'unblockUser',
          label: 'Unblock user',
          onPress: handleUnblock,
          iosIcon: {
            name: 'person.fill.checkmark',
            pointSize: 17,
            weight: 'semibold',
          },
          androidIconName: 'ic_person_add',
        }
      : {
          key: 'blockUser',
          label: 'Block user',
          onPress: handleBlock,
          destructive: true,
          iosIcon: {
            name: 'person.fill.xmark',
            pointSize: 17,
            weight: 'semibold',
          },
          androidIconName: 'ic_block',
        },
  ] as MenuItem[];

  return (
    <>
      <WithDropdownMenu menu={menu}>
        <TouchableOpacity className="flex-row gap-2" hitSlop={12}>
          <Ionicons size={18} name="ellipsis-horizontal-outline" color="#fff" />
        </TouchableOpacity>
      </WithDropdownMenu>
      {reportState.isOpen && (
        <Portal>
          <ReportSheet userId={userId} open onDismiss={reportState.onClose} />
        </Portal>
      )}
    </>
  );
};

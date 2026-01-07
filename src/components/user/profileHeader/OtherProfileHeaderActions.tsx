import { Portal } from '@gorhom/portal';
import Ionicons from '@react-native-vector-icons/ionicons';
import clsx from 'clsx';
import { Pressable } from 'react-native';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { isIOS26Plus } from '../../../utils';
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
        <Pressable
          // fixme: for ios 26+ temp fix for style
          // should be fixed in RN Screens & rn navigation v7+
          className={clsx(
            'flex-row gap-2',
            isIOS26Plus && 'size-[34px] items-center justify-center',
          )}
          hitSlop={12}
        >
          <Ionicons size={18} name="ellipsis-horizontal-outline" color="#fff" />
        </Pressable>
      </WithDropdownMenu>
      {reportState.isOpen && (
        <Portal>
          <ReportSheet userId={userId} open onDismiss={reportState.onClose} />
        </Portal>
      )}
    </>
  );
};

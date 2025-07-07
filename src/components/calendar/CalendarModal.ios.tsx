import { Modal, View } from 'react-native';
import { Calendar, CalendarProps } from './Calendar';

export interface CalendarModalProps extends CalendarProps {
  visible: boolean;
}

export const CalendarModal = ({ visible, ...props }: CalendarModalProps) => {
  return (
    <Modal transparent={true} visible={visible}>
      <View className="align-center flex-1 justify-center bg-black/40 px-7">
        <Calendar {...props} />
      </View>
    </Modal>
  );
};

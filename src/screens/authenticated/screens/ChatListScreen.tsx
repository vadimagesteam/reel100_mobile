import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../../components/AppHeader/AppHeader.tsx';
import ChatList from '../../../components/Chat/ChatList';

export const ChatListScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-black4">
      <AppHeader backButton />
      <ChatList />
    </SafeAreaView>
  );
};

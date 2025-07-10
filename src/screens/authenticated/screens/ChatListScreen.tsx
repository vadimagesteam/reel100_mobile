import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../../components/appHeader/AppHeader.tsx';
import ChatList from '../../../components/chat/ChatList';

export const ChatListScreen = () => {
  return (
    <SafeAreaView className="bg-background flex-1">
      <AppHeader showBackButton />
      <ChatList />
    </SafeAreaView>
  );
};

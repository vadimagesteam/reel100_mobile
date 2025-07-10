import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/appHeader/AppHeader.tsx';
import ChatList from '../../components/chat/ChatList';

export const ChatListScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader showBackButton />
      <ChatList />
    </SafeAreaView>
  );
};

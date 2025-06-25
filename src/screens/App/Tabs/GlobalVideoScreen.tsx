import { SafeAreaView } from 'react-native-safe-area-context';
import { Top100VideosByDate } from '../../../components/Top100/Top100VideosByDate.tsx';
import { AppHeader } from '../../../components/AppHeader/AppHeader.tsx';

const GlobalVideoScreen = () => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-black4">
      <AppHeader stateSelect />
      <Top100VideosByDate />
    </SafeAreaView>
  );
};

export default GlobalVideoScreen;

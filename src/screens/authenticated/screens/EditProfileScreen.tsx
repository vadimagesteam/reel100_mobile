import { SafeAreaView } from 'react-native-safe-area-context';
import { EditProfileForm } from '../../../components/settings/editProfile/EditProfileForm.tsx';
import { Text, TouchableOpacity, View } from 'react-native';
import { SvgIcon } from '../../../components/ui';
import { colors } from '../../../styles';
import { useNavigation } from '@react-navigation/native';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-black4">
      <View className="flex-row items-center gap-4 px-4">
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <SvgIcon image="backArrow" color={colors.white} />
        </TouchableOpacity>
        <Text className="text-3xl text-white">Edit Profile Info</Text>
      </View>
      <EditProfileForm />
    </SafeAreaView>
  );
};

import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Controller, useForm } from 'react-hook-form';
import { UserBase } from '../../../state/user/types';
import { useLoadingCallback } from '../../../utils';
import { Avatar, Button, Input } from '../../ui';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuthActions, useUser } from '../../../state/user/authStore';

type FormData = Pick<UserBase, 'avatar' | 'firstName' | 'lastName'>;

export const EditProfileForm = () => {
  const profile = useUser();
  const { updateProfile, uploadAvatar } = useAuthActions();

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      avatar: profile.avatar,
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
  });

  const [startAvatarUpload, isAvatarUploading] = useLoadingCallback(uploadAvatar);

  const handlePhotoSelect = async () => {
    const { didCancel, errorCode, assets } = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.7,
    });
    if (didCancel) {
      return;
    }
    if (errorCode === 'permission') {
      Alert.alert(
        'Permission denied',
        'Please allow us to access your images for profile picture upload',
      );
    }

    if (assets?.length) {
      const imageUri = assets[0].uri!;
      setValue('avatar', imageUri);
      await startAvatarUpload(imageUri);
    }
  };

  const avatar = watch('avatar');

  return (
    <View className="flex-1">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-1 mt-10 gap-4 px-5"
      >
        <View className="flex-col items-center gap-2">
          <TouchableOpacity
            hitSlop={15}
            onPress={handlePhotoSelect}
            className="relative flex-col items-center justify-center gap-2 self-center"
          >
            <Avatar uri={avatar} name="" size={100} />
            <View className="absolute size-[36px] items-center justify-center">
              {isAvatarUploading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="camera-outline" color="#fff" size={36} />
              )}
            </View>
          </TouchableOpacity>
          <Text className="text-silver3">Change Avatar</Text>
        </View>
        <Controller
          name="firstName"
          rules={{
            required: 'First name is required',
          }}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input placeholder="First Name" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        {errors?.firstName?.message && (
          <Text className="pl-2 text-red1">{errors?.firstName?.message}</Text>
        )}
        <Controller
          name="lastName"
          rules={{
            required: 'Last name is required',
          }}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input placeholder="Last Name" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        {errors?.lastName?.message && (
          <Text className="pl-2 text-red1">{errors?.lastName?.message}</Text>
        )}
        {isDirty && (
          <Button loading={isSubmitting} onPress={handleSubmit(updateProfile)}>
            Save Changes
          </Button>
        )}
      </ScrollView>
    </View>
  );
};

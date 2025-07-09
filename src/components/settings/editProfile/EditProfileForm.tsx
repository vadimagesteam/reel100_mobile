import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { getFullName } from '../../../state/user/utils';
import { Avatar, Button, Input } from '../../ui';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuthActions, useUser } from '../../../state/user/authStore.ts';

type FormData = { profilePicture?: string; firstName: string; lastName: string };

export const EditProfileForm = () => {
  const profile = useUser();
  const { updateProfile } = useAuthActions();

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
  });

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
      setValue('profilePicture', imageUri);
    }
  };

  const onSubmit = async (values: FormData) => {
    await updateProfile(values);
  };

  const photoImageUrl = watch('profilePicture');

  return (
    <View className="flex-1">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-1 mt-10 gap-4 px-5"
      >
        <TouchableOpacity
          hitSlop={15}
          onPress={handlePhotoSelect}
          className="flex-col items-center gap-2 self-center"
        >
          <Avatar uri={photoImageUrl} name={getFullName(profile)} size={100} />
          <Text className="text-silver3">Press to Change Photo</Text>
        </TouchableOpacity>
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
        <Button loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
          Save Changes
        </Button>
      </ScrollView>
    </View>
  );
};

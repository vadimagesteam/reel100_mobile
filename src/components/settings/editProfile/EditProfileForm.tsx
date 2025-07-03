import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '../../ui/Input.tsx';
import React from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUser } from '../../../state/user/authStore.ts';
import { Button } from '../../ui/Button.tsx';
import { sleep } from '../../../utils/promise.ts';

type FormData = { profilePicture: string; firstName: string; lastName: string };

export const EditProfileForm = () => {
  const profile = useUser();

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isLoading, errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      profilePicture: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png',
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
    await sleep(2000);
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
          <Image source={{ uri: photoImageUrl }} className="h-[100px] w-[100px] rounded-full" />
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

        <Button loading={isLoading} onPress={handleSubmit(onSubmit)}>
          Save Changes
        </Button>
      </ScrollView>
    </View>
  );
};

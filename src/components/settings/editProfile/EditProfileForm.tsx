import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Controller, useForm } from 'react-hook-form';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { UserProfile } from '../../../state/user/types';
import { useLoadingCallback } from '../../../utils';
import { Avatar, Button, Input } from '../../ui';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuthActions, useUser } from '../../../state/user/authStore';

export const socialValidationRules = {
  instagram: {
    pattern: {
      // supports instagram.com and instagr.am
      value: /^(?:(?:https?):\/\/)?(?:[a-z0-9-]+\.)*(?:instagram\.com|instagr\.am)(?:\/\S*)?$/i,
      message: 'Enter a valid Instagram URL',
    },
  },
  facebook: {
    pattern: {
      // supports facebook.com, fb.com, fb.watch, m.me and any subdomain (m., web., l., business., etc.)
      value:
        /^(?:(?:https?):\/\/)?(?:[a-z0-9-]+\.)*(?:facebook\.com|fb\.com|fb\.watch|m\.me)(?:\/\S*)?$/i,
      message: 'Enter a valid Facebook URL',
    },
  },
  youtube: {
    pattern: {
      // supports youtube.com (incl. subdomains like m., music.) and youtu.be
      value: /^(?:(?:https?):\/\/)?(?:[a-z0-9-]+\.)*(?:youtube\.com|youtu\.be)(?:\/\S*)?$/i,
      message: 'Enter a valid YouTube URL',
    },
  },
  tiktok: {
    pattern: {
      // supports tiktok.com and subdomains (vm.tiktok.com short links, etc.)
      value: /^(?:(?:https?):\/\/)?(?:[a-z0-9-]+\.)*tiktok\.com(?:\/\S*)?$/i,
      message: 'Enter a valid TikTok URL',
    },
  },
};

type FormData = Pick<UserProfile, 'avatar' | 'firstName' | 'lastName' | 'socialNetworks'> & {
  nickname: string;
};

type SocialKeys = keyof NonNullable<FormData['socialNetworks']>;

export const EditProfileForm = () => {
  const profile = useUser();
  const { updateProfile, uploadAvatar } = useAuthActions();

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    watch,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      nickname: profile.nickname ?? '',
      avatar: profile.avatar,
      firstName: profile.firstName,
      lastName: profile.lastName,
      socialNetworks: profile.socialNetworks || {},
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

  const handleSave = async (data: FormData) => {
    const { type, message } = await updateProfile(data);

    if (type === 'success') {
      Alert.alert('Success', 'Changes has been saved!');
      return;
    }

    if (type === 'error' && message?.includes('(nickname) already exists')) {
      setError('nickname', {
        type: 'error',
        message: 'This username is already taken by someone else',
      });
      return;
    }

    if (type === 'error') {
      Alert.alert('Error', message);
    }
  };

  const avatar = watch('avatar');

  const renderSocialLink = (name: `socialNetworks.${SocialKeys}`, label: string) => {
    const fieldName = name.replace('socialNetworks.', '') as SocialKeys;
    return (
      <>
        <Controller
          name={name as any}
          rules={socialValidationRules[fieldName]}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              autoComplete="off"
              placeholder={label}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        {errors?.socialNetworks?.[fieldName]?.message && (
          <Text className="pl-2 text-red1">{errors.socialNetworks[fieldName].message}</Text>
        )}
      </>
    );
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets contentContainerClassName="mt-9 grow gap-4 px-5">
      <View className="flex-col items-center gap-2">
        <TouchableOpacity
          hitSlop={15}
          onPress={handlePhotoSelect}
          className="relative flex-col items-center justify-center gap-2 self-center"
        >
          <Avatar uri={avatar} name="" size={100} />
          {!avatar && (
            <View className="absolute size-[36px] items-center justify-center">
              {isAvatarUploading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="camera-outline" color="#fff" size={36} />
              )}
            </View>
          )}
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

      <Controller
        name="nickname"
        rules={{
          required: 'Username is required',
          maxLength: {
            value: 22,
            message: 'Username must be less or equal 22 characters',
          },
        }}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            maxLength={22}
            placeholder="Username"
            value={value}
            onChangeText={(v) => {
              onChange(v.replace(/\s|[^\p{Emoji}\p{L}\p{N}_]/gu, ''));
            }}
            onBlur={onBlur}
          />
        )}
      />

      {errors?.nickname?.message && (
        <Text className="pl-2 text-red1">{errors?.nickname?.message}</Text>
      )}

      <Text className="mt-6 text-base font-semibold text-primary">Social Links</Text>
      {renderSocialLink('socialNetworks.instagram', 'Instagram')}
      {renderSocialLink('socialNetworks.facebook', 'Facebook')}
      {renderSocialLink('socialNetworks.tiktok', 'Tiktok')}
      {renderSocialLink('socialNetworks.youtube', 'YouTube')}

      {isDirty && (
        <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
          <Button loading={isSubmitting} onPress={handleSubmit(handleSave)}>
            Save Changes
          </Button>
        </Animated.View>
      )}
    </ScrollView>
  );
};

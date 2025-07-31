import Ionicons from '@react-native-vector-icons/ionicons';
import clsx from 'clsx';
import { useMemo } from 'react';
import { Linking, TouchableOpacity, View, ViewProps } from 'react-native';
import { UserProfile } from '../../../state/user/types';

export interface SocialNetworksProps extends ViewProps {
  socialNetworks: NonNullable<UserProfile['socialNetworks']>;
}

type SocialKeys = keyof NonNullable<UserProfile['socialNetworks']>;

export const SocialNetworks = ({
  socialNetworks,
  className,
  ...viewProps
}: SocialNetworksProps) => {
  const handleClick = (url: string) => {
    Linking.openURL(url);
  };

  const links = useMemo(
    () =>
      Object.keys(socialNetworks)
        .filter((key) => socialNetworks[key as SocialKeys] !== null)
        .map(
          (key) =>
            ({
              key,
              link: socialNetworks[key as SocialKeys],
            }) as { key: SocialKeys; link: string },
        ),
    [socialNetworks],
  );

  return (
    <View className={clsx('flex-row items-center justify-center gap-10', className)} {...viewProps}>
      {links.map(({ key, link }) => (
        <TouchableOpacity key={key} onPress={() => handleClick(link)}>
          <Ionicons name={`logo-${key}`} size={22} color="white" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

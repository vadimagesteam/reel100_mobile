import Ionicons from '@react-native-vector-icons/ionicons';
import clsx from 'clsx';
import { useMemo } from 'react';
import { Linking, TouchableOpacity, View, ViewProps } from 'react-native';
import { UserProfile } from '../../../state/user/types';

export interface SocialNetworksProps extends ViewProps {
  socialNetworks: NonNullable<UserProfile['socialNetworks']>;
}

type SocialKeys = keyof NonNullable<UserProfile['socialNetworks']>;

const SORT_ORDER: SocialKeys[] = ['instagram', 'facebook', 'tiktok', 'youtube'];

export const SocialLinkIcons = ({
  socialNetworks,
  className,
  ...viewProps
}: SocialNetworksProps) => {
  const handleClick = (url: string) => {
    let targetUrl = !url.startsWith('http') ? `https://${url}` : url;
    Linking.openURL(targetUrl);
  };

  const links = useMemo(
    () =>
      Object.keys(socialNetworks)
        .filter((key) => !!socialNetworks[key as SocialKeys])
        .sort((a, b) => SORT_ORDER.indexOf(a as SocialKeys) - SORT_ORDER.indexOf(b as SocialKeys))
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
    <View
      className={clsx('flex-row items-center justify-center gap-x-4', className)}
      {...viewProps}
    >
      {links.map(({ key, link }) => (
        <TouchableOpacity hitSlop={8} key={key} onPress={() => handleClick(link)}>
          <Ionicons name={`logo-${key}`} size={22} color="white" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

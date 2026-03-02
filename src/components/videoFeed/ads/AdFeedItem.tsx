import React, { FC, memo } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';

const styles = StyleSheet.create({
  adView: { flex: 1 },
  mediaView: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

interface AdFeedItemProps {
  nativeAd: NativeAd | null;
  dimensions: { width: number; height: number };
}

const AdFeedItemRaw: FC<AdFeedItemProps> = ({ nativeAd, dimensions }) => {
  if (!nativeAd) {
    return (
      <View
        style={dimensions}
        className="items-center justify-center bg-background"
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={dimensions} className="bg-background">
      <NativeAdView nativeAd={nativeAd} style={styles.adView}>
        {/* Full-screen media */}
        <NativeMediaView style={styles.mediaView} resizeMode="cover" />

        {/* Sponsored badge - top right */}
        <View className="absolute right-4 top-14 rounded-full bg-blackOpacity40 px-3 py-1">
          <Text className="text-xs font-semibold text-white">Sponsored</Text>
        </View>

        {/* Bottom overlay */}
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-12 pt-20">
          {/* Gradient-like dark overlay for readability */}
          <View className="absolute bottom-0 left-0 right-0 top-0 bg-blackOpacity40" />

          {/* Advertiser info */}
          <View className="z-10 mb-3 flex-row items-center">
            {nativeAd.icon && (
              <NativeAsset assetType={NativeAssetType.ICON}>
                <Image
                  source={{ uri: nativeAd.icon.url }}
                  className="mr-3 h-10 w-10 rounded-full"
                />
              </NativeAsset>
            )}
            {nativeAd.advertiser && (
              <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                <Text className="text-base font-semibold text-white">
                  {nativeAd.advertiser}
                </Text>
              </NativeAsset>
            )}
          </View>

          {/* Headline */}
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text className="z-10 mb-2 text-lg font-bold text-white" numberOfLines={2}>
              {nativeAd.headline}
            </Text>
          </NativeAsset>

          {/* Body */}
          {nativeAd.body ? (
            <NativeAsset assetType={NativeAssetType.BODY}>
              <Text className="z-10 mb-4 text-sm text-silver3" numberOfLines={2}>
                {nativeAd.body}
              </Text>
            </NativeAsset>
          ) : null}

          {/* Star rating & price */}
          <View className="z-10 mb-3 flex-row items-center gap-3">
            {nativeAd.starRating !== null && (
              <NativeAsset assetType={NativeAssetType.STAR_RATING}>
                <Text className="text-sm text-yellow">
                  {'★'.repeat(Math.round(nativeAd.starRating))} {nativeAd.starRating.toFixed(1)}
                </Text>
              </NativeAsset>
            )}
            {nativeAd.price && (
              <NativeAsset assetType={NativeAssetType.PRICE}>
                <Text className="text-sm text-white">{nativeAd.price}</Text>
              </NativeAsset>
            )}
            {nativeAd.store && (
              <NativeAsset assetType={NativeAssetType.STORE}>
                <Text className="text-sm text-silver4">{nativeAd.store}</Text>
              </NativeAsset>
            )}
          </View>

          {/* CTA Button */}
          {nativeAd.callToAction ? (
            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
              <TouchableOpacity
                activeOpacity={0.8}
                className="z-10 items-center rounded-xl bg-button-primary py-3"
              >
                <Text className="text-base font-bold text-button-primary-text">
                  {nativeAd.callToAction}
                </Text>
              </TouchableOpacity>
            </NativeAsset>
          ) : null}
        </View>
      </NativeAdView>
    </View>
  );
};

export const AdFeedItemComponent = memo(
  AdFeedItemRaw,
  (prev, next) => prev.nativeAd === next.nativeAd && prev.dimensions === next.dimensions,
);

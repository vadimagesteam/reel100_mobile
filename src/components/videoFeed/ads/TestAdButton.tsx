import { useEffect, useState } from 'react';
import { Button, Platform, StatusBar } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = TestIds.INTERSTITIAL;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: [], // can be customized based on video description, tags, etc
});

export const TestAdButton = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
      if (Platform.OS === 'ios') {
        // Prevent the close button from being unreachable by hiding the status bar on iOS
        StatusBar.setHidden(true);
      }
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(false);
      }
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Ad error:', error);
    });

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeOpened();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  return (
    <Button
      disabled={!loaded}
      title="Show Interstitial"
      onPress={() => {
        interstitial.show();
      }}
    />
  );
};

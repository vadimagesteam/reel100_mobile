#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CustomAudioSessionManager, NSObject)

RCT_EXTERN_METHOD(activateVideoRecordingAudioSession)
RCT_EXTERN_METHOD(activatePlaybackAudioSession)
RCT_EXTERN_METHOD(deactivateAudioSession)

@end

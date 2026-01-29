#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CameraDebugModule, NSObject)

RCT_EXTERN_METHOD(getDeviceInfo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getCameraDebugInfo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getLastRecordingInfo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end

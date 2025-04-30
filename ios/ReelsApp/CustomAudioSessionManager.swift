import AVFoundation

@objc(CustomAudioSessionManager)
class CustomAudioSessionManager: NSObject {

  @objc
  func activateVideoRecordingAudioSession() {
    do {
      let session = AVAudioSession.sharedInstance()
      try session.setCategory(.playAndRecord, mode: .videoRecording, options: [.defaultToSpeaker, .allowBluetooth, .allowAirPlay])
      try session.setActive(true)
      print("✅ [CustomAudioSessionManager] Audio session activated for video recording")
    } catch {
      print("❌ [CustomAudioSessionManager] Failed to activate audio session: \(error)")
    }
  }
  
  @objc
  func deactivateAudioSession() {
    do {
      try AVAudioSession.sharedInstance().setActive(false)
      print("✅ [CustomAudioSessionManager] Audio session deactivated")
    } catch {
      print("❌ [CustomAudioSessionManager] Failed to deactivate audio session: \(error)")
    }
  }
}

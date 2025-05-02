import AVFoundation

@objc(CustomAudioSessionManager)
class CustomAudioSessionManager: NSObject {

  @objc
  func activateVideoRecordingAudioSession() {
    do {
      let session = AVAudioSession.sharedInstance()

      try session.setCategory(
        .playAndRecord,
        mode: .videoRecording,
        options: [.defaultToSpeaker, .allowBluetooth, .allowAirPlay, .mixWithOthers]
      )

      try session.overrideOutputAudioPort(.speaker) // Явно вказуємо вихід

      // Опціонально: встановлюємо кращий sample rate
      try session.setPreferredSampleRate(44100) // або 48000
      try session.setPreferredIOBufferDuration(0.005)

      try session.setActive(true)
      print("✅ [CustomAudioSessionManager] Audio session activated for video recording")
    } catch {
      print("❌ [CustomAudioSessionManager] Failed to activate audio session: \(error)")
    }
  }
  // func activateVideoRecordingAudioSession() {
  //   do {
  //     let session = AVAudioSession.sharedInstance()
  //     try session.setCategory(.playAndRecord, mode: .videoRecording, options: [.defaultToSpeaker, .allowBluetooth, .allowAirPlay])
  //     try session.setActive(true)
  //     print("✅ [CustomAudioSessionManager] Audio session activated for video recording")
  //   } catch {
  //     print("❌ [CustomAudioSessionManager] Failed to activate audio session: \(error)")
  //   }
  // }
  
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

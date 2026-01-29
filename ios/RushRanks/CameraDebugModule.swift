import Foundation
import AVFoundation
import UIKit

@objc(CameraDebugModule)
class CameraDebugModule: NSObject {

  // Shared storage for last recording debug info
  private static var lastRecordingDebugInfo: [String: Any] = [:]
  private static var lastError: String? = nil
  private static var isObserving = false

  override init() {
    super.init()
    CameraDebugModule.startObservingNotifications()
  }

  // Start observing VisionCamera debug notifications
  private static func startObservingNotifications() {
    guard !isObserving else { return }
    isObserving = true

    NotificationCenter.default.addObserver(
      forName: NSNotification.Name("VisionCameraRecordingDebugInfo"),
      object: nil,
      queue: .main
    ) { notification in
      if let userInfo = notification.userInfo as? [String: Any] {
        lastRecordingDebugInfo = userInfo
        print("[CameraDebugModule] Received recording debug info: \(userInfo)")
      }
    }
    print("[CameraDebugModule] Started observing VisionCamera notifications")
  }

  @objc
  static func setRecordingDebugInfo(_ info: [String: Any]) {
    lastRecordingDebugInfo = info
  }

  @objc
  static func setLastError(_ error: String) {
    lastError = error
  }

  @objc
  func getDeviceInfo(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let device = UIDevice.current

    var info: [String: Any] = [
      "name": device.name,
      "model": device.model,
      "systemName": device.systemName,
      "systemVersion": device.systemVersion,
      "identifierForVendor": device.identifierForVendor?.uuidString ?? "unknown",
    ]

    // Get device model identifier (e.g., "iPhone16,1")
    var systemInfo = utsname()
    uname(&systemInfo)
    let machineMirror = Mirror(reflecting: systemInfo.machine)
    let identifier = machineMirror.children.reduce("") { identifier, element in
      guard let value = element.value as? Int8, value != 0 else { return identifier }
      return identifier + String(UnicodeScalar(UInt8(value)))
    }
    info["modelIdentifier"] = identifier

    // Map common identifiers to marketing names
    let modelName = Self.mapIdentifierToName(identifier)
    info["modelName"] = modelName

    resolve(info)
  }

  @objc
  func getCameraDebugInfo(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      var info: [String: Any] = [:]

      // Get available camera devices
      let discoverySession = AVCaptureDevice.DiscoverySession(
        deviceTypes: [.builtInWideAngleCamera, .builtInUltraWideCamera, .builtInTelephotoCamera],
        mediaType: .video,
        position: .unspecified
      )

      var cameras: [[String: Any]] = []
      for device in discoverySession.devices {
        var cameraInfo: [String: Any] = [
          "name": device.localizedName,
          "position": device.position == .front ? "front" : "back",
          "deviceType": device.deviceType.rawValue,
        ]

        // Get active format info
        let activeFormat = device.activeFormat
        let dimensions = CMVideoFormatDescriptionGetDimensions(activeFormat.formatDescription)
        let mediaSubType = CMFormatDescriptionGetMediaSubType(activeFormat.formatDescription)

        cameraInfo["activeFormatWidth"] = dimensions.width
        cameraInfo["activeFormatHeight"] = dimensions.height
        cameraInfo["activeFormatPixelFormat"] = String(format: "0x%08X", mediaSubType)
        cameraInfo["activeFormatPixelFormatReadable"] = Self.pixelFormatToString(mediaSubType)
        cameraInfo["supportsHDR"] = activeFormat.isVideoHDRSupported

        // Get all available pixel formats from all formats
        var pixelFormats = Set<String>()
        for format in device.formats {
          let subType = CMFormatDescriptionGetMediaSubType(format.formatDescription)
          pixelFormats.insert(String(format: "0x%08X", subType))
        }
        cameraInfo["availablePixelFormats"] = Array(pixelFormats)
        cameraInfo["formatCount"] = device.formats.count

        cameras.append(cameraInfo)
      }

      info["cameras"] = cameras
      info["lastRecordingDebugInfo"] = CameraDebugModule.lastRecordingDebugInfo
      info["lastError"] = CameraDebugModule.lastError ?? ""

      resolve(info)
    }
  }

  @objc
  func getLastRecordingInfo(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    resolve([
      "debugInfo": CameraDebugModule.lastRecordingDebugInfo,
      "lastError": CameraDebugModule.lastError ?? ""
    ])
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    // Start observing notifications when the module is first accessed
    startObservingNotifications()
    return false
  }

  // Helper to convert pixel format to readable string
  private static func pixelFormatToString(_ format: OSType) -> String {
    // Convert OSType to FourCC string
    let bytes = [
      UInt8((format >> 24) & 0xFF),
      UInt8((format >> 16) & 0xFF),
      UInt8((format >> 8) & 0xFF),
      UInt8(format & 0xFF)
    ]

    // Check if all bytes are printable ASCII
    let isPrintable = bytes.allSatisfy { $0 >= 32 && $0 < 127 }
    let fourCC = isPrintable ? String(bytes: bytes, encoding: .ascii) ?? "????" : "????"

    // Common format descriptions
    let descriptions: [String: String] = [
      "420v": "8-bit YUV 4:2:0 Video Range",
      "420f": "8-bit YUV 4:2:0 Full Range",
      "x420": "10-bit YUV 4:2:0 Video Range",
      "xf20": "10-bit YUV 4:2:0 Full Range",
      "BGRA": "32-bit BGRA",
      "x422": "10-bit YUV 4:2:2 Video Range",
      "xf22": "10-bit YUV 4:2:2 Full Range",
    ]

    if let description = descriptions[fourCC] {
      return "\(fourCC) (\(description))"
    }
    return fourCC
  }

  // Map device identifier to marketing name
  private static func mapIdentifierToName(_ identifier: String) -> String {
    let mapping: [String: String] = [
      // iPhone 17 series (2025)
      "iPhone18,1": "iPhone 17",
      "iPhone18,2": "iPhone 17 Plus",
      "iPhone18,3": "iPhone 17 Pro",
      "iPhone18,4": "iPhone 17 Pro Max",
      "iPhone18,5": "iPhone 17 Air",
      // iPhone 16 series
      "iPhone17,1": "iPhone 16 Pro",
      "iPhone17,2": "iPhone 16 Pro Max",
      "iPhone17,3": "iPhone 16",
      "iPhone17,4": "iPhone 16 Plus",
      // iPhone 15 series
      "iPhone15,4": "iPhone 15",
      "iPhone15,5": "iPhone 15 Plus",
      "iPhone16,1": "iPhone 15 Pro",
      "iPhone16,2": "iPhone 15 Pro Max",
      // iPhone 14 series
      "iPhone14,7": "iPhone 14",
      "iPhone14,8": "iPhone 14 Plus",
      "iPhone15,2": "iPhone 14 Pro",
      "iPhone15,3": "iPhone 14 Pro Max",
      // iPhone 13 series
      "iPhone14,2": "iPhone 13 Pro",
      "iPhone14,3": "iPhone 13 Pro Max",
      "iPhone14,4": "iPhone 13 mini",
      "iPhone14,5": "iPhone 13",
    ]
    return mapping[identifier] ?? identifier
  }
}

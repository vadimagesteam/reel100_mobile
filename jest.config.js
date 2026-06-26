module.exports = {
  preset: 'react-native',
  // The default RN preset ignores everything under node_modules; nativewind's
  // babel transform injects an (untranspiled) react-native-css-interop import
  // into every component, so those packages must be transformed too.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|nativewind|react-native-css-interop)/)',
  ],
};

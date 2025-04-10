import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';

const { height, width } = Dimensions.get('window');

const FullVideoScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute();

    // console.log('params-->', params);
    return (
        <View style={styles.container}>
            <Video
                source={{ uri: params?.source }}
                style={styles.video}
                // resizeMode="contain"
                resizeMode="cover"
                repeat
                // muted
                controls
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
    video: { width, height },
});

export default FullVideoScreen;

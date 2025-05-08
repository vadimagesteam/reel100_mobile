import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { colors, positionHelpers } from '../../../../../../styles';
import VideoAbsoluteInfo from '../../../../../VideoAbsoluteInfo';
import { formatTime } from '../../../../../../utils/formatTime';

interface FullVideoModal {
    modalVideo: any
    activeVideoIds: string[]
    onArrowPress?: () => void
}

const FullVideoModal = ({ modalVideo, activeVideoIds, onArrowPress }: FullVideoModal) => {
    const videoRef = useRef<any | null>(null);
    const [_, setVideoStartTimes] = useState<Record<string, number>>({});
    const [durations, setDurations] = useState<Record<string, number>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<Record<string, number>>({});

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                const updated = { ...prev };

                if (modalVideo?.id) {
                    const current = updated[modalVideo.id];
                    if (current > 0) {
                        updated[modalVideo.id] = current - 1;
                    }
                }

                activeVideoIds.forEach(key => {
                    const current = updated[key];
                    if (current > 0) {
                        updated[key] = current - 1;
                    }
                });

                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeVideoIds, modalVideo?.id]);


    //Save duration video
    const handleVideoLoadModal = useCallback((id: string, duration: number) => {
        setDurations(prev => ({ ...prev, [id]: duration }));
        setRemainingSeconds(prev => ({ ...prev, [id]: Math.floor(duration) }));
        setVideoStartTimes(prev => ({ ...prev, [id]: 0 }));
    }, []);

    //Repeat duration video
    const onVideoRepeat = useCallback((id: string) => {
        const duration = durations[id];
        if (duration) {
            setRemainingSeconds(prev => ({
                ...prev,
                [id]: Math.floor(duration),
            }));
            setVideoStartTimes(prev => ({
                ...prev,
                [id]: 0,
            }));
        }
    }, [durations]);

    return (
        <Modal visible={!!modalVideo} transparent={false} animationType="fade">
            <TouchableOpacity
                style={[positionHelpers.fill, { backgroundColor: colors.black }]}
                onPress={() => true}
                activeOpacity={1}
            >
                {modalVideo && (
                    <>
                        <Video
                            ref={videoRef}
                            source={{ uri: modalVideo.file?.storagePath }}
                            style={positionHelpers.fill}
                            resizeMode="cover"
                            muted={false}
                            repeat
                            paused={false}
                            controls={false}
                            onLoad={(data) => {
                                handleVideoLoadModal(modalVideo?.id, Math.floor(data.duration));
                            }}
                            onEnd={() => {
                                videoRef.current?.seek(0);
                                onVideoRepeat(modalVideo?.id);
                            }}
                        />
                        <VideoAbsoluteInfo
                            videoCheck={'FULL'}
                            showArrow={true}
                            onArrowBack={onArrowPress}
                            avatar={modalVideo?.avatar}
                            name={modalVideo?.fullname}
                            likesCount={modalVideo?.like_count}
                            videoDuration={formatTime(modalVideo ? remainingSeconds[modalVideo.id] ?? 0 : 0)}
                        />
                    </>
                )}
            </TouchableOpacity>
        </Modal>
    );
};

export default FullVideoModal;

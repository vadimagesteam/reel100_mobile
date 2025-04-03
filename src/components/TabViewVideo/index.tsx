import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SvgIcon } from '../UI';
import { colors, positionHelpers } from '../../styles';
import { cs } from './styles';
import { StateFeedTab, TopOneHundredTab, TopVideoTab } from './components';

interface TabViewVideoProps {
    activeTab: string
    setActiveTab: (val: string) => void
}

const TabViewVideo = ({ activeTab, setActiveTab }: TabViewVideoProps) => {

    const handleTabPress = useCallback((tab: string) => {
        setActiveTab(tab);
    }, [setActiveTab]);

    return (
        <>
            <View style={[positionHelpers.rowAround, positionHelpers.mt8]}>
                <TouchableOpacity
                    style={[
                        positionHelpers.fill,
                        positionHelpers.alignCenter,
                        activeTab === 'top_100' ? cs.tabItemActive : cs.tabItem,
                    ]}
                    onPress={() => handleTabPress('top_100')}>
                    <SvgIcon image="eyeShow" color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        positionHelpers.fill,
                        positionHelpers.alignCenter,
                        activeTab === 'state_feed' ? cs.tabItemActive : cs.tabItem,
                    ]}
                    onPress={() => handleTabPress('state_feed')}>
                    <SvgIcon image="eyeShow" color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        positionHelpers.fill,
                        positionHelpers.alignCenter,
                        activeTab === 'top_video' ? cs.tabItemActive : cs.tabItem,
                    ]}
                    onPress={() => handleTabPress('top_video')}>
                    <SvgIcon image="eyeShow" color={colors.white} />
                </TouchableOpacity>
            </View>
            <>
                {activeTab === 'top_100' && (
                    <TopOneHundredTab />
                )}

                {activeTab === 'state_feed' && (
                    <StateFeedTab />
                )}
                {activeTab === 'top_video' && (
                    <TopVideoTab />
                )}

            </>
        </>
    );
};

export default TabViewVideo;

import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SvgIcon } from '../UI';
import { positionHelpers } from '../../../styles';
import { cs } from './styles.ts';
import { StateFeedTab, TopOneHundredTab } from './components';

const MemoTopOneHundredTab = React.memo(TopOneHundredTab);
const MemoStateFeedTab    = React.memo(StateFeedTab);

interface TabViewVideoProps {
    activeTab: string
    setActiveTab: (val: string) => void
}

const TabViewVideo = ({
    activeTab,
    setActiveTab,
}: TabViewVideoProps) => {

    const handleTabPress = useCallback((tab: string) => {
        setActiveTab(tab);
    }, [setActiveTab]);

  console.log('Render tab view Video');

    return (
        <>
            <View style={[positionHelpers.rowAround]}>
                <TouchableOpacity
                    style={[
                        positionHelpers.fill,
                        positionHelpers.alignCenter,
                        activeTab === 'top_100' ? cs.tabItemActive : cs.tabItem,
                    ]}
                    onPress={() => handleTabPress('top_100')}>
                    <SvgIcon image="top100Tab" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        positionHelpers.fill,
                        positionHelpers.alignCenter,
                        activeTab === 'state_feed' ? cs.tabItemActive : cs.tabItem,
                    ]}
                    onPress={() => handleTabPress('state_feed')}>
                    <SvgIcon image="stateFeedTab" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        positionHelpers.fill,
                        positionHelpers.alignCenter,
                        activeTab === 'top_video' ? cs.tabItemActive : cs.tabItem,
                    ]}
                    onPress={() => handleTabPress('top_video')}>
                    <SvgIcon image="calendarTab" />
                </TouchableOpacity>
            </View>
            <>
                {activeTab === 'top_100' && (
                    <MemoTopOneHundredTab />
                )}

                {activeTab === 'state_feed' && (
                    <MemoStateFeedTab />
                )}
                {activeTab === 'top_video' && (
                    <MemoTopOneHundredTab withCalendar={true} />
                )}

            </>
        </>
    );
};

export default React.memo(TabViewVideo);

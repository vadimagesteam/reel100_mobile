import React from 'react';
import CustomHeader from '../../../../components/old/navigator/CustomHeader';
import {TopOneHundredTab} from '../../../../components/old/TabViewVideo/components';

const MemoizedTimerHeader = React.memo(CustomHeader);
const MemoTopOneHundredTab = React.memo(TopOneHundredTab);

const GlobalVideoScreen = () => {

    return (
        <>
            <MemoizedTimerHeader />
            <MemoTopOneHundredTab withCalendar={true} withMenu={true}/>
        </>
    );
};

export default GlobalVideoScreen;

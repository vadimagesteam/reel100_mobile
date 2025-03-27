import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../navigation/CustomHeader';
import DropdownMenu from '../../../../components/DropdownMenu';
import { BodyText, SvgIcon } from '../../../../components/UI';
import { states } from './mockData';

const MainScreen = () => {
    const [selectedState, setSelectedState] = useState<string | null>(null);
    return (
        <>
            <CustomHeader title="00:00:00" />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
                {/* <View style={positionHelpers.fillCenter}>
                    <Text style={{ color: '#fff' }}>Main Screen</Text>
                </View> */}
                <View style={[positionHelpers.ph16, positionHelpers.mt10, positionHelpers.rowFillCenter]}>
                    <DropdownMenu
                        data={states}
                        placeholder="Select an option"
                        selectedValue={selectedState}
                        onSelect={setSelectedState}

                    />

                    <SvgIcon image="eyeShow" color={colors.white} />
                </View>
                {/* <View>
                    <BodyText></BodyText>
                </View> */}

            </SafeAreaView>
        </>
    );
};

export default MainScreen;

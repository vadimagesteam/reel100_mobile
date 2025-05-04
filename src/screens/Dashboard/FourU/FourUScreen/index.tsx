import React from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { Input, SvgIcon } from '../../../../components/UI';
import { cs } from './styles';

const FourUScreen = () => {
    return (
        <>
            <CustomHeader title="00:00:00" />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
                <ScrollView contentContainerStyle={[positionHelpers.ph16]}>
                    <View style={[positionHelpers.mt10, positionHelpers.alignItemsCenterRow]}>
                        <View style={positionHelpers.fill}>
                            <Input inputStyles={cs.input}
                                placeholder="Search by user" />
                        </View>
                        <TouchableOpacity onPress={() => true}>
                            <SvgIcon image="menu" />
                        </TouchableOpacity>
                    </View>


                </ScrollView>
            </SafeAreaView >
        </>
    );
};

export default FourUScreen;

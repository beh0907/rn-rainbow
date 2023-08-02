import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { readRoom } from '../../api/Room';
import { useUserState } from '../../contexts/UserContext';
import { useRoomState } from '../../contexts/RoomContext';

const RoomScreen = () => {
    const [room, setRoom] = useRoomState();
    // const [diaries,setDiaries] = useState({})

    useEffect(() => {

    }, [])

    return (
        <View style={[styles.container]}>
            <Text>추모관 메인 화면</Text>
        </View>
    );
};

RoomScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default RoomScreen;

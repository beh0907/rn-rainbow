import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Card, Paragraph, Title} from "react-native-paper";
import {BASE_URL_FILE} from "@env"
import {Pressable, StyleSheet, useWindowDimensions} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {MainRoutes} from "../../navigations/Routes";
import AvatarText from "react-native-paper/src/components/Avatar/AvatarText";

const RoomItem = memo(({room}) => {
    const {width, height} = useWindowDimensions()
    const navigation = useNavigation();

    const pressItem = ({roomNum}) => {
        navigation.navigate(MainRoutes.ROOM, {
            roomNum
        })
    }

    return (
        <Pressable onPress={() => pressItem(room)}>
            <Card key={room.id} style={[styles.container, {width: width / 2}]}>
                {/*<Card.Title*/}
                {/*    title="Card Title"*/}
                {/*    left={(props) => <AvatarText label={"CARD"} size={36} />}*/}
                {/*/>*/}
                <Card.Cover style={styles.image}
                            source={{uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}`}}/>
                <Card.Content style={styles.overlay}>
                    <Title style={styles.title}>{room.name}의 방</Title>
                    <Paragraph style={styles.description}>Card content</Paragraph>
                </Card.Content>
            </Card>
        </Pressable>
    );
});

RoomItem.displayName = 'RoomItem'

RoomItem.propTypes = {
    room: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 200,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    description: {
        fontSize: 14,
        color: 'white',
    },
});

export default RoomItem;

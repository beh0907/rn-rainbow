import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Card, Text, Title} from "react-native-paper";
import {BASE_URL_FILE} from "@env"
import {Image, Pressable, StyleSheet, useWindowDimensions, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {MainRoutes} from "../../navigations/Routes";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {PRIMARY} from "../../Colors";

const RoomItem = memo(({room}) => {
    const {width, height} = useWindowDimensions()
    const navigation = useNavigation();

    const pressItem = ({roomNum}) => {
        navigation.navigate(MainRoutes.ROOM_TAB, {
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
                <Card.Content style={styles.overlayTitle}>
                    <Title style={styles.title}>{room.name} ({room.age})</Title>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Image style={styles.icon}
                               source={room.gender === 1 ? require("../../../assets/icon/ic_male.png") : require("../../../assets/icon/ic_female.png")}/>
                        <Text style={styles.description}>{room.date}</Text>
                        {/*<Paragraph style={styles.description}>{room.date}({room.age})</Paragraph>*/}
                    </View>
                </Card.Content>

                {/*<View style={styles.overlayViews}>*/}
                {/*    <MaterialCommunityIcons name={"account"} size={16} color={PRIMARY.DEFAULT} style={{alignItems: "center"}}/>*/}
                {/*    <Title style={styles.description}>{room.views}</Title>*/}
                {/*</View>*/}
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
    overlayTitle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    overlayViews: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 8,
        flexDirection: "row"
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    description: {
        marginStart: 10,
        fontSize: 14,
        color: 'white',
    },
    icon: {
        width: 16,
        height: 20
    }
});

export default RoomItem;

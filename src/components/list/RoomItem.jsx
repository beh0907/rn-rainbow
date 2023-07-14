import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Card, Paragraph, Title} from "react-native-paper";
import {BASE_URL_FILE} from "@env"

const RoomItem = memo(({room}) => {
    return (
        <Card>
            <Card.Cover source={{ uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` }} />
            <Card.Content>
                <Title>{room.name}의 방</Title>
                <Paragraph>Card content</Paragraph>
            </Card.Content>
        </Card>
    );
});

RoomItem.displayName = 'RoomItem'

RoomItem.propTypes = {
    room: PropTypes.object.isRequired
};

export default RoomItem;

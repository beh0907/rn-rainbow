import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Card, Paragraph, Title} from "react-native-paper";
import {BASE_URL_FILE} from "@env"

const TestItem = memo(({test}) => {
    return (
        <Card>
            <Card.Cover source={{ uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` }} />
            <Card.Content>
                <Title>{test.name}의 방</Title>
                <Paragraph>Card content</Paragraph>
            </Card.Content>
        </Card>
    );
});

TestItem.displayName = 'RoomItem'

TestItem.propTypes = {
    room: PropTypes.object.isRequired
};

export default TestItem;

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const CommentItem = ({ item }) => {
    return (
        <Card style={styles.container}>
        </Card>
    );
};

CommentItem.propTypes = {
    item: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    }
});

export default CommentItem;

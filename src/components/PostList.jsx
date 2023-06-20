import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet, View} from "react-native";
import {GRAY} from "../Colors";
import PostItem from "./PostItem";
import usePosts from "../hooks/UsePosts";

const PostList = () => {
    const {posts, fetchNextPage, refetch, refetching} = usePosts()

    return (
        <FlatList
            data={posts}
            renderItem={({item}) => <PostItem post={item}/>}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            onEndReached={fetchNextPage}
            refreshing={refetching}
            onRefresh={refetch}
        />
    )
};

const styles = StyleSheet.create({
    separator: {
        marginVertical: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: GRAY.LIGHT
    }
})

export default PostList;

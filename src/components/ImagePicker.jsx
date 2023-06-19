import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from "react-native";
import {useNavigation, useNavigationState} from "@react-navigation/native";
import HeaderRight from "../components/HeaderRight";
import * as MediaLibrary from 'expo-media-library'
import PhotoItem from "../components/PhotoItem";
import PropTypes from "prop-types";

const initialListInfo = {
    endCursor: '',
    hasNextPage: true
}

export const getLocalUri = async id => {
    return (await MediaLibrary.getAssetInfoAsync(id)).localUri
}

const ImagePicker = ({togglePhoto, isSelectedPhoto}) => {
    const navigation = useNavigation()
    const [status, requestPermission] = MediaLibrary.usePermissions()

    const [photos, setPhotos] = useState([])
    const listInfo = useRef(initialListInfo)
    const [refreshing, setRefreshing] = useState(false)

    //권한 요청
    useEffect(() => {
        (async () => {
            const {granted} = await requestPermission()
            if (!granted) {
                Alert.alert('사진 접근 권한', '사진 접근 권한이 필요합니다.', [
                    {
                        text: '확인',
                        onPress: () => {
                            navigation.canGoBack() && navigation.goBack()
                        }
                    }
                ])
            }
        })()
    }, [navigation, requestPermission])

    //이미지 가져오기 함수
    const getPhotos = useCallback(async () => {
        const options = {
            first: 30,
            sortBy: [MediaLibrary.SortBy.creationTime]
        }

        if (listInfo.current.endCursor) options['after'] = listInfo.current.endCursor

        if (listInfo.current.hasNextPage) {
            const {assets, endCursor, hasNextPage} = await MediaLibrary.getAssetsAsync(options)
            setPhotos(prev => options.after ? [...prev, ...assets] : assets)
            listInfo.current = {endCursor, hasNextPage}
        }
    }, [])

    //이미지 리스트 갱신
    const onRefresh = async () => {
        setRefreshing(true)
        listInfo.current = initialListInfo
        await getPhotos()
        setRefreshing(false)
    }

    //이미지 가져오기
    useEffect(() => {
        //권한이 허용된 상태라면
        if (status?.granted) getPhotos()
    }, [getPhotos, status?.granted])

    return (
        <View style={styles.container}>
            <FlatList style={styles.list}
                      data={photos}
                      renderItem={({item}) =>
                          <PhotoItem item={item} isSelected={isSelectedPhoto(item)}
                                     togglePhoto={togglePhoto}/>
                      }
                      numColumns={3}
                      onEndReached={getPhotos}
                      onEndReachedThreshold={0.4}
                      onRefresh={onRefresh}
                      refreshing={refreshing}
            />
        </View>
    );
};

ImagePicker.propTypes = {
    togglePhoto: PropTypes.func.isRequired,
    isSelectedPhoto: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    list: {
        width: '100%',
    }
})

export default ImagePicker;

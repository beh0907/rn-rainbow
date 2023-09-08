import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import Constants from 'expo-constants';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const SelfAssessmentItem = ({ item, index, user, progress, onPressItem }) => {
    const { width } = useWindowDimensions();

    return (
        <View>
            {/*질문 뷰*/}
            <View style={{ flexDirection: 'row' }} onPress={onPressItem}>
                <AvatarImage source={require('../../../assets/icon.png')} size={36} />
                <Surface style={{ marginStart: 16, padding: 16, maxWidth: width * 0.6, borderRadius: 10 }}
                         elevation={1}>
                    <Text style={{ flex: 1 }}>{index + 1}. {item.question}</Text>
                </Surface>
            </View>


            {/*이미 답변했던 문항들만 나의 대답 말풍선을 표시한다*/}
            {
                item.value &&
                <View>
                    <View style={styles.separator} />

                    {/*나의 대답 뷰*/}

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={onPressItem}>
                        <Surface style={{ marginEnd: 16, padding: 16, maxWidth: width * 0.6, borderRadius: 10 }}
                                 elevation={1}>
                            <Text style={{ flex: 1 }}>{item.value}.
                                {
                                    (() => {
                                        switch (item.value) {
                                            case '1':
                                                return ' 매우 그렇다.';
                                            case '2':
                                                return ' 그렇다.';
                                            case '3':
                                                return ' 보통이다.';
                                            case '4':
                                                return ' 그렇지 않다.';
                                            case '5':
                                                return ' 매우 그렇지 않다.';
                                        }

                                    })()
                                }</Text>
                        </Surface>
                        <AvatarImage
                            source={{ uri: `${BASE_URL_FILE}${user.id}/${user.image}?version=${user.updateDate}` }}
                            size={36} />
                    </View>
                </View>
            }


        </View>
    );
};

SelfAssessmentItem.propTypes = {};

const styles = StyleSheet.create({
    separator: {
        marginVertical: 10
    }
});

export default SelfAssessmentItem;

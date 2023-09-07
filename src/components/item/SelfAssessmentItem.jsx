import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Divider, Surface, Text } from 'react-native-paper';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import Constants from 'expo-constants';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const SelfAssessmentItem = ({ item, index, user, progress }) => {
    const { width } = useWindowDimensions();

    return (
        <View>
            {/*질문 뷰*/}
            <View style={{ flexDirection: 'row' }}>
                <AvatarImage source={require('../../../assets/icon.png')} size={36} />
                <Surface style={{ marginStart: 16, padding: 16, maxWidth: width * 0.66 }} elevation={1}>
                    <Text style={{ flex: 1 }}>{index + 1}. {item.question}</Text>
                </Surface>
            </View>


            {/*이미 답변했던 문항들만 나의 대답 말풍선을 표시한다*/}
            {
                item.value &&
                <View>
                    <View style={styles.separator}/>

                    {/*나의 대답 뷰*/}
                    <View style={{ flexDirection: 'row', justifyContent:'flex-end' }}>
                        <Surface style={{ marginEnd: 16, padding: 16, maxWidth: width * 0.66 }} elevation={1}>
                            <Text style={{ flex: 1 }}>나의 {index + 1}번 문항의 대답은? {item.value}번</Text>
                        </Surface>
                        <AvatarImage source={{ uri: `${BASE_URL_FILE}${user.id}/${user.image}?version=${user.updateDate}` }} size={36} />
                    </View>
                </View>
            }



        </View>
    );
};

SelfAssessmentItem.propTypes = {};

const styles = StyleSheet.create({
    separator: {
        marginVertical:10
    }
})

export default SelfAssessmentItem;

import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { GRAY, PRIMARY, WHITE } from '../../Colors';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/button/Button';

const SelfAssessmentResultScreen = () => {
    const { params } = useRoute();
    const { list } = params;

    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();
    const { top, bottom } = useSafeAreaInsets();

    const [result, setResult] = useState('');

    const ANSWER_CNT = 4;
    const MAX_SCORE = list.length * ANSWER_CNT;

    const [score, setScore] = useState({
        totalScore: 0,
        angerScore: 0,
        griefScore: 0,
        guiltScore: 0
    });

    const [count, setCount] = useState({
        angerCnt: 0,
        griefCnt: 0,
        guiltCnt: 0
    });


    useLayoutEffect(() => {
        let totalScore = 0, angerScore = 0, griefScore = 0, guiltScore = 0;
        let angerCnt = 0, griefCnt = 0, guiltCnt = 0;
        list.map(item => {
            const score = item.value;
            totalScore += 5 - Number(score);

            switch (item.type) {
                case 'anger':
                    angerCnt++;
                    angerScore += Number(score);
                    break;
                case 'grief':
                    griefCnt++;
                    griefScore += Number(score);
                    break;
                case 'guilt':
                    guiltCnt++;
                    guiltScore += Number(score);
                    break;
            }
        });


        console.log('totalScore : ', totalScore);
        console.log('angerScore : ', angerScore);
        console.log('griefScore : ', griefScore);
        console.log('guiltScore : ', guiltScore);

        //PBQ의 기준 총 점수에서 16점을 뺀다
        // totalScore -= 16;

        setScore({
            totalScore,
            angerScore,
            griefScore,
            guiltScore
        });

        setCount({
            angerCnt,
            griefCnt,
            guiltCnt
        });

        if (totalScore >= 40) {
            setResult('심리적으로 큰 위축감을 느끼고 계실 수 있습니다. 상담을 받으시는 것이 좋습니다.');
        } else if (totalScore >= 26) {
            setResult('심리적으로 중간 정도의 위축감을 느끼고 계실 수 있습니다. 주의가 필요합니다.');
        } else {
            setResult('심리적으로 위축감을 느끼지 않고 계시는 것 같습니다. 그러나 일상생활에 불편을 느끼는 경우도 있으니 주의하세요.');
        }
    }, []);


    return (
        <View style={{ backgroundColor: WHITE, paddingTop: top, paddingBottom: bottom, flex: 1 }}>

            <ScrollView contentContainerStyle={{ paddingBottom: 64, paddingHorizontal:16 }}>

                <View>
                    <Image style={{ height: 200 }} source={require('../../../assets/background/bg_mark.png')}
                           contentFit={'contain'} />
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 16
                }}>
                    {/*<Text variant={'titleLarge'}>최종 점수 : </Text>*/}
                    {/*<Text variant={'titleLarge'}>{score.totalScore} / {MAX_SCORE}</Text>*/}

                    <Text  variant={'bodyLarge'}>{result}</Text>

                </View>



                {/*정보*/}
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.petDataContainer}>
                        <Text style={styles.petDataTitle} variant={'titleMedium'}>슬픔</Text>
                        <Text style={styles.petDataText}
                              variant={'bodyLarge'}>{score.griefScore} / {count.griefCnt * ANSWER_CNT}</Text>
                    </View>


                    <View style={styles.petDataContainer}>
                        <Text style={styles.petDataTitle} variant={'titleMedium'}>분노</Text>
                        <Text style={styles.petDataText}
                              variant={'bodyLarge'}>{score.angerScore} / {count.angerCnt * ANSWER_CNT}</Text>

                    </View>

                    <View style={[styles.petDataContainer, { marginBottom: 0 }]}>
                        <Text style={styles.petDataTitle} variant={'titleMedium'}>죄책감</Text>
                        <Text style={styles.petDataText}
                              variant={'bodyLarge'}>{score.guiltScore} / {count.guiltCnt * ANSWER_CNT}</Text>
                    </View>
                </View>

                <View>
                    <View style={styles.text}>
                        <Text variant={'titleLarge'}>1. 감정 표현하기</Text>
                        <Text style={styles.text} variant={'bodyMedium'}>눈물은 펫로스에 따른 감정 표현의 일부입니다. 하염없이 울고 있는 것은 좋지 않지만
                            눈물을 억지로 참는다든가 고통스러운 감정을 억누르는 것은 오히려 스트레스를 유발하여 펫로스를 극복하는 데 장애가 됩니다. 울고싶을 때에는 울어서 감정을 표출하도록
                            하십시오.</Text>
                    </View>

                    <View style={styles.text}>
                        <Text variant={'titleLarge'}>2. 편안한 사람과 대화하기</Text>
                        <Text style={styles.text} variant={'bodyMedium'}>펫로스는 받아들이기 어려운 일일 수 있습니다. 그러므로 펫로스의 경험이 있는
                            사람들이나 사별한 자기의 반려동물과 친했던 가족 또는 친구들과 추억담을 나누는 것이 펫로스 극복 과정을 단축시키는 하나의 방법이 됩니다.</Text>
                    </View>

                    <View style={styles.text}>
                        <Text variant={'titleLarge'}>3. 좋아하는 일에 몰두하기</Text>
                        <Text style={styles.text} variant={'bodyMedium'}>무언가 다른 일에 몰두하는 것도 고통스러운 생각으로부터 벗어나는 하나의 해결책입니다.
                            그렇게 하는 것이 펫로스를 극복하는 아주 좋은 방법입니다. 보다 많은 시간을 들여 좋아하는 일에 몰두해 보십시오.</Text>
                    </View>

                    <View style={styles.text}>
                        <Text variant={'titleLarge'}>4. 장례를 치르고 작별하기</Text>
                        <Text style={styles.text} variant={'bodyMedium'}>반려동물의 죽음은 크나큰 고통을 안겨 주지만 적절한 뒷수습은 펫로스를 극복하는 데
                            도움이 될 수 있습니다. 펫로스를 극복하는 한 가지 방법으로 비용이 더 많이 들긴 합니다만 죽은 사람의 경우처럼 슬픔 케어의 일부로서 반려동물 장례를 치러 주는 것을
                            들 수 있습니다. 이렇게 하면 사랑하는 개나 고양이의 죽음을 받아들이고 펫로스에 따른 여러 가지 증후의 발현을 예방하는 데 도움이 될 것입니다.</Text>
                    </View>
                </View>
            </ScrollView>

            <Button title='확인'
                    onPress={() => navigation.goBack()}
                    styles={{
                        container: {
                            position: 'absolute',
                            bottom: 0
                        },
                        button: {
                            borderRadius: 4,
                            margin: 10
                        }
                    }} />
        </View>
    );
};

SelfAssessmentResultScreen.propTypes = {};

const styles = StyleSheet.create({

    petDataContainer: {
        flex: 1,
        alignItems: 'center'
    },
    petDataTitle: {
        fontWeight: 'bold',
        color: PRIMARY.DEFAULT
    },
    petDataText: {
        color: GRAY.DEFAULT
    },
    text: {
        marginVertical: 10
    }
});

export default SelfAssessmentResultScreen;

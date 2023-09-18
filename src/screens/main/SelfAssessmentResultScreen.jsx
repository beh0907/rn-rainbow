import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { GRAY, PRIMARY, WHITE } from '../../Colors';
import SegmentedRoundDisplay from 'react-native-segmented-round-display';

const SelfAssessmentResultScreen = () => {
    const { params } = useRoute();
    const { list } = params;

    const { width, height } = useWindowDimensions();

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

        if (totalScore >= 56) {
            console.log('결과 점수  : ', totalScore, '\n심리적으로 큰 위축감을 느끼고 계실 수 있습니다. 상담을 받으시는 것이 좋습니다.');
        } else if (totalScore >= 40) {
            console.log('결과 점수  : ', totalScore, '\n심리적으로 중간 정도의 위축감을 느끼고 계실 수 있습니다. 주의가 필요합니다.');
        } else {
            console.log('결과 점수  : ', totalScore, '\n심리적으로 위축감을 느끼지 않고 계시는 것 같습니다. 그러나 일상생활에 불편을 느끼는 경우도 있으니 주의하세요.');
        }
    }, []);


    return (
        <View style={{ backgroundColor: WHITE }}>

            <ScrollView style={{ marginTop: 10 }}>
                <View>
                    {/*<Image style={{ height: 200 }} source={require('../../../assets/background/bg_mark.png')}*/}
                    {/*       contentFit={'contain'} />*/}

                    <SegmentedRoundDisplay

                        style={{ width: '100%', height: 300, backgroundColor:'green' }}
                        displayValue
                        animated
                        radius={260}
                        totalArcSize={280}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 16
                }}>
                    <Text variant={'titleLarge'}>최종 점수 : </Text>
                    <Text variant={'titleLarge'}>{score.totalScore} / {MAX_SCORE}</Text>
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

                <Text style={styles.petDataTitle} variant={'titleMedium'}>
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                    asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                </Text>
            </ScrollView>
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
    }
});

export default SelfAssessmentResultScreen;

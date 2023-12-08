import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card, List, Text } from 'react-native-paper';
import { GRAY, PRIMARY, WHITE } from '../../Colors';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/button/Button';

const petLossDescription = '자신이 키우는 애완동물을 떠나보낼 때의 슬픈 감정과 괴로움 등의 감정을 느끼고 있는 사람들의 상태를 일컫는 표현이다. 깊은 유대감을 갖게 된 애완동물이나 동물을 잃는 것은 굉장히 슬픈 일이지만, 이따금 가족의 죽음과도 견줄 수 있을 만큼 괴로워하는 사람들이 있다. 이런 현상은 주로 주인 측의 부주의로 동물이 사망하였을 때, 주인이 안락사를 통해 애완동물의 삶을 그만 끝내주기로 결정했을 때, 혹은 신변상의 한계로 인해 동물을 처분해야 할 때 등 애완동물의 죽음에 죄책감을 가질 만한 계기가 동반되었을 때 발생하기 쉽다.\n' +
    '\n' +
    '하지만 애완동물이 주인과 깊은 교감을 나누고 있거나 해당 동물이 반려라고 여겨질 정도로 주인의 깊은 심리적 버팀목이 되어 주고 있었을 경우에도 발생할 수 있으며, 펫로스 증후군은 정형화된 질환이 아닌 만큼 애완동물이 자연사든 자연사가 아니든 어떤 방식으로든 죽었을 때 쉽사리 극복하지 못하는 모든 상태를 포괄한다.\n' +
    '\n' +
    '그럼에도 정신적인 고통을 유발하는 증세인 만큼 마냥 가볍게 생각해서는 안 되며, 외상 후 스트레스 장애의 한 부류로 봐야 한다는 의견도 존재한다. 원인이 무엇이든 간에 과도한 정신적 부하는 자살 시도로까지 이어질 수도 있기 때문이다.\n' +
    '\n' +
    '냉정하게 말하면, 애완동물을 입양한 시점부터 펫로스 증후군에 걸릴 위험에 노출되어 있다고 봐도 무방하다. 인간의 수명은 의학기술과 식량생산의 발달로 질병/사고가 없다는 가정 하에 못해도 60세까지는 거뜬히 살아남을 수 있게 되었는데, 그에 반해 개나 고양이 같은 보편적인 애완동물들은 관련 수의학 기술이 발전하고 있음에도 불구하고 수명이 짧으면 10년, 길어야 15 ~ 20년이 대부분이다. 즉, 주인의 나이가 이미 고령이거나, 불의의 사고로 젊은 나이에 요절하는 것이 아닌 이상 애완동물을 떠나 보내는 것을 목격하는 건 어차피 필연적인 결과라고 봐야 한다.\n' +
    '\n' +
    '이름에 펫이 들어가기 때문에 가정에서 키우는 애완동물이 사망했을 경우에만 사용 가능한 표현으로 알려져 있지만 꼭 애완동물에게만 적용되는 표현은 아니다. 넓게 보면 동물원의 사육사가 자신이 담당했던 동물을 떠나보내거나, 군견병이 담당 군견을 떠나보내는 경우 등 직장에서 애정을 갖고 키운 동물과 사별하는 경우에도 사용할 수 있다. 실제로 군견병들의 경우, 군견 안락사 규정이 폐지되기 전에는 군견의 안락사 과정을 처음부터 끝까지 겪기 때문에 군견을 먼저 떠나보낸 후 생기는 우울감과 상실감을 견디지 못하고 군견병 보직을 그만 포기하는 경우가 빈번했다.';

const getOverPetLossList = [
    {
        title: '감정 표현하기',
        description: '눈물은 펫로스에 따른 감정 표현의 일부입니다. 하염없이 울고 있는 것은 좋지 않지만 눈물을 억지로 참는다든가 고통스러운 감정을 억누르는 것은 오히려 스트레스를 유발하여 펫로스를 극복하는 데 장애가 됩니다. 울고싶을 때에는 울어서 감정을 표출하도록 하십시오.'
    },
    {
        title: '편안한 사람과 대화하기',
        description: '펫로스는 받아들이기 어려운 일일 수 있습니다. 그러므로 펫로스의 경험이 있는 사람들이나 사별한 자기의 반려동물과 친했던 가족 또는 친구들과 추억담을 나누는 것이 펫로스 극복 과정을 단축시키는 하나의 방법이 됩니다.'
    },
    {
        title: '좋아하는 일에 몰두하기',
        description: '무언가 다른 일에 몰두하는 것도 고통스러운 생각으로부터 벗어나는 하나의 해결책입니다. 그렇게 하는 것이 펫로스를 극복하는 아주 좋은 방법입니다. 보다 많은 시간을 들여 좋아하는 일에 몰두해 보십시오.'
    },
    {
        title: '장례를 치르고 작별하기',
        description: '반려동물의 죽음은 크나큰 고통을 안겨 주지만 적절한 뒷수습은 펫로스를 극복하는 데 도움이 될 수 있습니다. 펫로스를 극복하는 한 가지 방법으로 비용이 더 많이 들긴 합니다만 죽은 사람의 경우처럼 슬픔 케어의 일부로서 반려동물 장례를 치러 주는 것을 들 수 있습니다. 이렇게 하면 사랑하는 개나 고양이의 죽음을 받아들이고 펫로스에 따른 여러 가지 증후의 발현을 예방하는 데 도움이 될 것입니다.'
    },
    {
        title: '새로운 반려동물 들이지 않기',
        description: '죽은 반려동물을 대체하기 위해 비슷한 동물을 데려오는 행동은 그저 외견만 비슷할 뿐 행동부터 성격까지 다른 새로운 개체로 인해 소중했던 반려동물에 대한 그리움만 증폭시키고, 새로 들어온 동물에게 대체품으로 들인 것에 대한 최책감을 넘어 반감까지 가지게 되어 제대로 양육하지 못할 수도 있습니다. 떠나보낸 반려동물에 대한 애도가 끝나고 확실한 마음의 정리가 되었을 때 들이는 것을 추천합니다.'
    }
];

const SelfAssessmentResultScreen = () => {
    const { params } = useRoute();
    const { list } = params;

    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();
    const { top, bottom } = useSafeAreaInsets();

    const [result, setResult] = useState('');

    const ANSWER_CNT = 4;
    const MAX_SCORE = list.length * ANSWER_CNT;

    //초기 확장된 아코디언 아이템
    const [selectAccordion, setSelectAccordion] = useState('1');

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

            <ScrollView contentContainerStyle={{ paddingBottom: 64, paddingHorizontal: 16 }}>

                <Card style={{marginTop:16}}>
                    <Card.Cover source={require('../../../assets/background/bg_sad.png')} />
                </Card>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 16
                }}>
                    {/*<Text variant={'titleLarge'}>최종 점수 : </Text>*/}
                    {/*<Text variant={'titleLarge'}>{score.totalScore} / {MAX_SCORE}</Text>*/}

                    <Text variant={'bodyLarge'}>{result}</Text>

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

                <View style={{ marginTop: 16 }}>

                    <List.AccordionGroup expandedId={selectAccordion}
                                         onAccordionPress={id => id === selectAccordion ? setSelectAccordion('0') : setSelectAccordion(id)}>
                        <List.Accordion title='펫로스 증후군이란?' id='1' >
                            <View style={styles.text}>
                                <Text variant={'titleMedium'}>펫로스 증후군에 대해</Text>
                                <Text style={styles.text} variant={'titleSmall'}>{petLossDescription}</Text>
                            </View>
                        </List.Accordion>
                        <List.Accordion title='펫로스 증후군 극복하기' id='2'>
                            {
                                getOverPetLossList.map((item, index) =>
                                    <View style={styles.text} key={index}>
                                        <Text variant={'titleMedium'}>{index + 1}. {item.title}</Text>
                                        <Text style={styles.text} variant={'titleSmall'}>{item.description}</Text>
                                    </View>
                                )
                            }
                        </List.Accordion>
                    </List.AccordionGroup>
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

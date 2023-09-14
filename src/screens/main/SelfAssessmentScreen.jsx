import React, { useCallback, useRef, useState } from 'react';
import { Animated, BackHandler, StyleSheet, useWindowDimensions, View } from 'react-native';
import { PRIMARY, WHITE } from '../../Colors';
import { Button, Divider, IconButton, ProgressBar, RadioButton, Surface, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import SelfAssessmentItem from '../../components/item/SelfAssessmentItem';
import { useUserState } from '../../contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';

const QUESTIONS = [
    { 'question': '반려동물을 잃은 이후로 슬픔에 휩싸인 적이 있다.' },
    { 'question': '반려동물의 죽음에 대해 나 자신을 책임지거나, 자책한 적이 있다.' },
    { 'question': '반려동물을 잃은 이후 집중하기 어려운 적이 있다.' },
    { 'question': '반려동물을 잃은 이후 나 자신이 일부 부족한 느낌을 받은 적이 있다.' },
    { 'question': '반려동물이 없어져서 집에서의 일상생활이 어색해졌다.' },
    { 'question': '반려동물을 잃은 이후 잠을 잘 못한 적이 있다.' },
    { 'question': '반려동물과 함께한 기억에 대해 자주 생각나거나 괴로움을 느낀다.' },
    { 'question': '반려동물이 없어져서 외로움을 느낀 적이 있다.' },
    { 'question': '반려동물을 잃은 이후 새로운 반려동물을 키우는 것에 대해 고민한 적이 있다.' },
    { 'question': '반려동물의 죽음이 믿기지 않아서, 아직도 그들이 다시 돌아올 것이라는 생각이 들었다.' },
    { 'question': '반려동물의 죽음에 대한 감정을 다른 사람과 공유하기 어렵다.' },
    { 'question': '반려동물을 보낸 후, 더 이상 삶의 목적을 찾기 어렵다.' },
    { 'question': '반려동물을 잃은 이후, 기분이 들쑥날쑥해졌다.' },
    { 'question': '반려동물을 잃은 이후, 일상적인 일을 처리하는 것이 힘들어졌다.' },
    { 'question': '반려동물을 잃은 이후, 새로운 취미나 관심사를 찾기 어려워졌다.' },
    { 'question': '반려동물을 보낸 후, 가족과의 관계가 악화되었다.' },
    { 'question': '반려동물을 잃은 이후, 일상적인 일에 대한 흥미를 잃었다.' },
    { 'question': '반려동물이 살았던 방에서 그들이 없어지면, 불안감이 든다.' },
    { 'question': '반려동물을 잃은 이후, 울적하고 기운이 없는 느낌을 받은 적이 있다.' },
    { 'question': '반려동물의 죽음으로 인해, 나 자신에게 불공평하게 대우된 느낌을 받은 적이 있다.' },
    { 'question': '반려동물이 있었던 공간에서 그들의 존재를 느낄 수 있다.' },
    { 'question': '반려동물의 죽음으로 인해, 나의 삶에 대한 의미에 대해 고민한 적이 있다.' },
    { 'question': '반려동물을 잃은 이후, 다른 사람과 함께 있는 것이 힘들어졌다.' }];

const SelfAssessmentScreen = () => {
    const [user] = useUserState();

    const { width, height } = useWindowDimensions();
    const { top, bottom } = useSafeAreaInsets();

    const listRef = useRef(null);

    const [progress, setProgress] = useState(0);
    const [selectOption, setSelectOption] = useState('');
    const [visibleOptions, setVisibleOptions] = useState(true);
    const [selfAssementList, setSelfAssementList] = useState([QUESTIONS[0]]);

    const toggleOptions = () => {
        // listRef?.current?.scrollToEnd({
        //     animated: true
        // });

        listRef?.current?.scrollToIndex({
            index: progress,
            animated: true,
            viewPosition: 0.5
        });

        setVisibleOptions(prev => !prev);
    };

    //답변 창이 열려있다면 back버튼은 답변 창부터 닫는다
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (visibleOptions) {
                    setVisibleOptions(false);
                    return true;
                } else {
                    return false;
                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [visibleOptions])
    );

    const getResult = (list) => {
        let score = 0

        list.map(item => score += (6 - item.value))

        if (score >= 56) {
            console.log("결과 점수  : ", score, "\n심리적으로 큰 위축감을 느끼고 계실 수 있습니다. 상담을 받으시는 것이 좋습니다.")
        } else if (score >= 40) {
            console.log("결과 점수  : ", score, "\n심리적으로 중간 정도의 위축감을 느끼고 계실 수 있습니다. 주의가 필요합니다.")
        } else {
            console.log("결과 점수  : ", score, "\n심리적으로 위축감을 느끼지 않고 계시는 것 같습니다. 그러나 일상생활에 불편을 느끼는 경우도 있으니 주의하세요.")
        }
    }

    //말풍선을 터치할 경우 해당 번호로 이동해 답변을 수정할 수 있다
    const onPressItem = useCallback(async (item, index) => {
        listRef?.current?.scrollToIndex({
            index: index,
            animated: true,
            viewPosition: 0.5
        });

        setProgress(index);
        setSelectOption(item.value);
        setVisibleOptions(true);
    }, [selfAssementList, progress, selectOption, visibleOptions, listRef]);

    // 대답을 입력한다면 대답하지 않은 마지막 항목으로 찾아간다
    const onPressAnswer = useCallback(async (index, answer) => {
        // 현재 selfAssementList 배열
        const list = [...selfAssementList];
        const lastIndex = list.length;

        list[index].value = answer;

        //답변 문항이 더 있을 경우 다음 질문지를 추가한다
        if (lastIndex < QUESTIONS.length && list[lastIndex - 1].value) list.push(QUESTIONS[lastIndex]);

        // selfAssementList 업데이트
        setSelfAssementList(list);

        //리스트를 하단으로 이동시킨다
        listRef?.current?.scrollToEnd({
            animated: true
        });

        //새로운 질문 답변을 표시해야 하기 때문에 null로 채운다
        setSelectOption('');

        if (!list[lastIndex - 1].value) {
            setProgress(lastIndex - 1);
        } else if (lastIndex < QUESTIONS.length) {
            setProgress(lastIndex);
        } else { // 모두 답변이 완료되었다면
            setProgress(lastIndex - 1);
            setVisibleOptions(false);
            getResult(list)
        }

    }, [selfAssementList, progress, visibleOptions, getResult]);


    return (
        <View style={{ flex: 1, backgroundColor: WHITE }}>
            <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: width - 32,
                        marginBottom: 5
                    }}>
                        <Text variant={'titleMedium'}
                              style={{ flex: 1 }}>{`${selfAssementList.length}/${QUESTIONS.length}`}</Text>
                        <Text
                            variant={'titleMedium'}>{parseInt(selfAssementList.length / QUESTIONS.length * 100)} %</Text>
                    </View>
                    <ProgressBar style={{ backgroundColor: PRIMARY.LIGHT, borderRadius: 10, height: 10 }}
                                 animatedValue={selfAssementList.length / QUESTIONS.length} color={PRIMARY.DEFAULT} />
                </View>

                <Divider style={{ width: width - 32, height: 1, marginVertical: 10 }} />

                <View style={{ flex: 1 }}>
                    <FlashList
                        ref={listRef}
                        showsVerticalScrollIndicator={false}
                        estimatedListSize={{ width, height }}
                        estimatedItemSize={64}
                        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        extraData={[progress, onPressItem]}
                        data={selfAssementList}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            <SelfAssessmentItem item={item} index={index} user={user}
                                                progress={progress} onPressItem={() => onPressItem(item, index)} />} />
                </View>
            </View>

            <Animated.View>

                {
                    visibleOptions &&
                    <Surface style={{ backgroundColor: WHITE }} elevation={5} collapsable={true}>
                        <RadioButton.Group
                            onValueChange={value => onPressAnswer(progress, value)}
                            value={selectOption}>
                            <RadioButton.Item labelVariant={'bodyMedium'} label='1. 매우 그렇다.' value='1'
                                              mode={'ios'} />
                            <RadioButton.Item labelVariant={'bodyMedium'} label='2. 그렇다.' value='2' mode={'ios'} />
                            <RadioButton.Item labelVariant={'bodyMedium'} label='3. 보통이다.' value='3' mode={'ios'} />
                            <RadioButton.Item labelVariant={'bodyMedium'} label='4. 그렇지 않다' value='4'
                                              mode={'ios'} />
                            <RadioButton.Item labelVariant={'bodyMedium'} label='5. 매우 그렇지 않다' value='5'
                                              mode={'ios'} />
                        </RadioButton.Group>
                    </Surface>
                }


                <IconButton style={{
                    position: 'absolute',
                    width: 64,
                    height: 30,
                    right: 10,
                    top: -36,
                    borderRadius: 0,
                    borderTopEndRadius: 20,
                    borderTopStartRadius: 20
                }}
                            size={36}
                            containerColor={PRIMARY.LIGHT}
                            iconColor={WHITE}
                            icon={visibleOptions ? 'menu-down' : 'menu-up'}
                            onPress={() => toggleOptions()}
                            animated={true} />

            </Animated.View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16
    },
    separator: {
        marginVertical: 10
    }


});

export default SelfAssessmentScreen;

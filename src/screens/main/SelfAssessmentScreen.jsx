import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, useWindowDimensions, View } from 'react-native';
import { PRIMARY, WHITE } from '../../Colors';
import { Divider, IconButton, ProgressBar, RadioButton, Surface, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import SelfAssessmentItem from '../../components/item/SelfAssessmentItem';
import Animated, { FadeInDown } from 'react-native-reanimated';
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

    //말풍선을 터치할 경우 해당 번호로 이동해 답변을 수정할 수 있다
    const onPressItem = useCallback(async (item) => {

        setSelectOption(item.value);
        setVisibleOptions(true);

    }, [selfAssementList, progress]);

    // 대답을 입력한다면 대답하지 않은 마지막 항목으로 찾아간다
    const onPressAnswer = useCallback(async (index, answer) => {
        // 현재 selfAssementList 배열
        const list = [...selfAssementList];
        const lastIndex = list.length

        list[index].value = answer
        if (lastIndex < QUESTIONS.length && list[lastIndex - 1].value) list.push(QUESTIONS[lastIndex])

        // selfAssementList 업데이트
        setSelfAssementList(list);

        // console.log(index);
        // console.log("list : ", list)
        // console.log("selfAssementList : ", selfAssementList)

        //리스트를 하단으로 이동시킨다
        listRef?.current?.scrollToEnd({
            animated: true
        });

        setSelectOption('');

        console.log(lastIndex, " - ", QUESTIONS.length)

        if (lastIndex >= QUESTIONS.length) { // 모두 답변이 완료되었다면
            setProgress(selfAssementList.length);
            setVisibleOptions(false);
        } else {
            setProgress(lastIndex + 1);
        }

    }, [selfAssementList, progress, visibleOptions]);

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
                              style={{ flex: 1 }}>{`${progress}/${QUESTIONS.length}`}</Text>
                        <Text variant={'titleMedium'}>{parseInt(progress / QUESTIONS.length * 100)} %</Text>
                    </View>
                    <ProgressBar style={{ backgroundColor: PRIMARY.LIGHT, borderRadius: 10, height: 10 }}
                                 animatedValue={progress / QUESTIONS.length} color={PRIMARY.DEFAULT} />
                </View>

                <Divider style={{ width: width - 32, height: 1, marginVertical: 10 }} />

                <View style={{ flex: 1 }}>
                    <FlashList
                        ref={listRef}
                        showsVerticalScrollIndicator={false}
                        estimatedListSize={{ width, height }}
                        estimatedItemSize={64}
                        contentContainerStyle={{ paddingVertical: 10 }}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        extraData={progress}
                        data={selfAssementList}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            <SelfAssessmentItem item={item} index={index} user={user}
                                                progress={progress} />} />
                </View>
            </View>

            <View>
                <IconButton style={{ alignSelf: 'flex-end', marginEnd: 50 }}
                            icon={visibleOptions ? 'menu-down' : 'menu-up'}
                            onPress={() => {
                                setVisibleOptions(prev => !prev);

                                listRef?.current?.scrollToEnd({
                                    animated: true
                                });
                            }}
                            animated={true} />

                {/*<Button contentStyle={{ flexDirection: 'row-reverse' }} icon={visibleOptions ? 'menu-down' : 'menu-up'}*/}
                {/*        onPress={() => setVisibleOptions(prev => !prev)}>{visibleOptions ? '답변 창 닫기' : '답변 창 열기'}</Button>*/}
                {
                    visibleOptions &&
                    <Animated.View>
                        <Surface style={{ backgroundColor: WHITE }} elevation={3} collapsable={true}>
                            <RadioButton.Group
                                onValueChange={value => onPressAnswer(selfAssementList.length - 1, value)}
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

                    </Animated.View>
                }
            </View>
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
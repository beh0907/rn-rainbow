import React, { useCallback, useRef, useState } from 'react';
import { Animated, BackHandler, StyleSheet, useWindowDimensions, View } from 'react-native';
import { PRIMARY, WHITE } from '../../Colors';
import { Banner, IconButton, ProgressBar, RadioButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import SelfAssessmentItem from '../../components/item/SelfAssessmentItem';
import { useUserState } from '../../contexts/UserContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../../navigations/Routes';

const SelfAssessmentScreen = () => {
    const QUESTIONS = [
        { num: 1, question: '나는 반려동물을 살리지 못한 수의사에게 화가 난다.', type: 'anger' },
        { num: 2, question: '나는 반려동물의 죽음이 매우 속상하다.', type: 'grief' },
        { num: 3, question: '반려동물이 없는 나의 삶은 비어있는 것 같다.', type: 'grief' },
        { num: 4, question: '나는 반려동물의 죽음에 대한 악몽을 꾸고 있다.', type: 'anger' },
        { num: 5, question: '나는 반려동물이 없는데 대해 외로움을 느낀다.', type: 'grief' },
        { num: 6, question: '나는 반려동물에게 뭔가 나쁜 일이 일어나고 있다.', type: 'guilt' },
        { num: 7, question: '나는 반려동물이 너무나도 그립다.', type: 'grief' },
        { num: 8, question: '나는 반려동물을 좀 더 잘 돌보지 못한데 대한 죄책감을 느낀다.', type: 'guilt' },
        { num: 9, question: '나는 반려동물을 살리고자 더 많은 행동을 하지 않았던 것에 낙담하였다.', type: 'guilt' },
        { num: 10, question: '나는 반려동물을 생각하면 눈물이 난다.', type: 'grief' },
        { num: 11, question: '나는 반려동물의 죽음에 영향을 준 사람들에 대해서 화가 난다.', type: 'anger' },
        { num: 12, question: '나는 반려동물의 죽음에 대해서 큰 슬픔을 느낀다.', type: 'grief' },
        { num: 13, question: '나는 도움이 되지 않았던 친구/가족에게 화가 난다.', type: 'anger' },
        { num: 14, question: '반려동물의 마지막 순간에 대한 기억들이 뇌리에서 떠나지 않는다.', type: 'anger' },
        { num: 15, question: '나는 반려동물의 상실을 극복하지 못할 것 같다.', type: 'grief' },
        { num: 16, question: '나는 반려동물을 더 많이 사랑해주었다면 좋았을 것이라고 생각한다.', type: 'guilt' }];

    const navigation = useNavigation();
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


    const getResult = (list) => {
        navigation.navigate(MainRoutes.SELF_ASSESSMENT_RESULT, { list });

        setProgress(0);
        setSelectOption('');
        setSelfAssementList([QUESTIONS[0]]);
        setVisibleOptions(true);
    };

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
            getResult(list);
        }

    }, [selfAssementList, progress, visibleOptions, getResult]);


    return (
        <View style={{ flex: 1, backgroundColor: WHITE, paddingTop: top }}>
            <View style={[styles.container]}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: width - 32
                    }}>
                        <Text variant={'titleMedium'}
                              style={{ flex: 1 }}>{`${selfAssementList.length}/${QUESTIONS.length}`}</Text>
                        <Text
                            variant={'titleMedium'}>{parseInt(selfAssementList.length / QUESTIONS.length * 100)} %</Text>
                    </View>
                    <ProgressBar style={{ backgroundColor: PRIMARY.LIGHT, borderRadius: 10, height: 10 }}
                                 animatedValue={selfAssementList.length / QUESTIONS.length} color={PRIMARY.DEFAULT} />
                </View>


                <View style={{ flex: 1, marginTop: 10 }}>
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
                <Banner
                    visible={visibleOptions}
                    contentStyle={{ backgroundColor: WHITE }}
                >
                    {/*<Surface style={{ backgroundColor: WHITE }} elevation={5} collapsable={true}>*/}
                    <View style={{ backgroundColor: WHITE, width: width - 32 }}>

                        <RadioButton.Group
                            onValueChange={value => onPressAnswer(progress, value)}
                            value={selectOption}>
                            <RadioButton.Item labelVariant={'bodyMedium'} label='1. 매우 그렇다.' value='1'
                                              mode={'ios'} />
                            <RadioButton.Item labelVariant={'bodyMedium'} label='2. 그렇다.' value='2'
                                              mode={'ios'} />
                            <RadioButton.Item labelVariant={'bodyMedium'} label='3. 그렇지 않다' value='3'
                                              mode={'ios'} />
                            <RadioButton.Item labelVariant={'bodyMedium'} label='4. 매우 그렇지 않다' value='4'
                                              mode={'ios'} />
                        </RadioButton.Group>
                    </View>
                    {/*</Surface>*/}
                </Banner>

                {/*{*/}
                {/*    visibleOptions &&*/}
                {/*    <Surface style={{ backgroundColor: WHITE }} elevation={5} collapsable={true}>*/}
                {/*        <RadioButton.Group*/}
                {/*            onValueChange={value => onPressAnswer(progress, value)}*/}
                {/*            value={selectOption}>*/}
                {/*            <RadioButton.Item labelVariant={'bodyMedium'} label='1. 매우 그렇다.' value='1'*/}
                {/*                              mode={'ios'} />*/}
                {/*            <RadioButton.Item labelVariant={'bodyMedium'} label='2. 그렇다.' value='2' mode={'ios'} />*/}
                {/*            <RadioButton.Item labelVariant={'bodyMedium'} label='3. 그렇지 않다' value='3'*/}
                {/*                              mode={'ios'} />*/}
                {/*            <RadioButton.Item labelVariant={'bodyMedium'} label='4. 매우 그렇지 않다' value='4'*/}
                {/*                              mode={'ios'} />*/}
                {/*        </RadioButton.Group>*/}
                {/*    </Surface>*/}
                {/*}*/}


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

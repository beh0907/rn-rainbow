import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RadioButton, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { GENDER, GRAY, WHITE } from '../../Colors';
import SafeInputView from '../../components/view/SafeInputView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ReturnKeyTypes } from '../../components/view/Input';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../components/button/Button';
import * as Room from '../../api/Room';
import DatePicker from '../../components/message/DatePicker';
import { formatDate, formatDateTime } from '../../utils/DateUtil';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUserState } from '../../contexts/UserContext';
import Constants from 'expo-constants';
import { useRoomState } from '../../contexts/RoomContext';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import { Image } from 'expo-image';
import { useSnackBarState } from '../../contexts/SnackBarContext';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const RoomUpdateScreen = () => {
    const navigation = useNavigation();

    //사이즈 관련 변수
    const { top, bottom } = useSafeAreaInsets();
    const { height, width } = useWindowDimensions();

    //추모관 설정 정보
    const [user] = useUserState();
    const [, setRoom] = useRoomState();

    //하단 스낵바 알림 메시지
    const [, setSnackbar] = useSnackBarState();

    const [image, setImage] = useState(null);
    const [updateRoom, setUpdateRoom] = useState(useRoute().params.room);

    // 설정 정보 REF
    const nameRef = useRef(null);
    const contentRef = useRef(null);
    const dateRef = useRef(null);
    const ageRef = useRef(null);
    const genderRef = useRef(null);

    //날짜 다이얼로그 설정
    const [date, setDate] = useState(new Date(updateRoom.date));
    const [show, setShow] = useState(false);

    //갤러리 권한
    const [, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();

    /**이미지를 선택 */
    const pickImage = async () => {
        const { canAskAgain, granted, expires, status } = await requestMediaPermission();

        if (granted) {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            // allowsMultipleSelection:true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], //이미지 편집 X,Y 비율
            quality: 1
        });

        if (result.assets) {
            setImage(result.assets[0].uri);
        }
        } else {
            //상태에 따른 스낵바를 출력
            setSnackbar({
                message: '어플리케이션 설정 화면에서 사진 및 동영상 접근 권한을 허용해 주세요.',
                visible: true
            });
        }
    };

    /**추모관 생성*/
    const onModify = async () => {
        const paramRoom = { ...updateRoom, date: formatDate(date), updateDate: formatDateTime(new Date)};

        const result = await Room.modifyRoom(paramRoom, image);

        //업데이트가 완료됐을 때 전역 추모관 객체를 갱신한다
        setRoom(paramRoom);

        //등록이 완료되었으므로 현재 화면에서 돌아간다
        await navigation.goBack();
    };

    /**추모관 삭제*/
    const onDelete = async () => {
        // const result = await Room.removeRoom({ ...updateRoom, date: formatDate(date) });

        //등록이 완료되었으므로 현재 화면에서 돌아간다
        await navigation.goBack();
        await navigation.goBack();
    };

    return (
        <SafeInputView>
            {show && <DatePicker
                date={date}
                setDate={setDate}
                setShow={setShow}
                ref={ageRef}
            />}

            <View style={[styles.container, { paddingTop: top }]}>
                <View style={styles.profile}>
                    <View style={[styles.photo, updateRoom.image || { backgroundColor: GRAY.DEFAULT }]}>
                        {
                            image || updateRoom.image
                                ?
                                <AvatarImage
                                    size={100}
                                    source={{ uri: image ? image : `${BASE_URL_FILE}${updateRoom.id}/${updateRoom.roomNum}/profile/${updateRoom.image}?version=${updateRoom.updateDate}` }} />
                                :
                                <AvatarImage
                                    size={100} source={require('../../../assets/background/bg_temp.jpg')} />
                        }
                        <Pressable style={styles.editButton} onPress={pickImage}>
                            <MaterialCommunityIcons name='file-image' size={20} color={WHITE} />
                        </Pressable>
                    </View>
                </View>

                <ScrollView style={[styles.form, { paddingBottom: bottom ? bottom + 10 : 40 }]}
                            contentContainerStyle={{ alignItems: 'center' }}
                            bounces={false}
                            keyboardShouldPersistTaps={'always'}>

                    {/*이름 설정*/}
                    <TextInput
                        mode={'outlined'}
                        outlineStyle={{ borderWidth: 1 }}
                        outlineColor='#0000001F'
                        label='이름'
                        value={updateRoom.name}
                        style={{ width: '100%', marginBottom: 20, backgroundColor: WHITE }}
                        onSubmitEditing={() => contentRef.current.focus()}
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onChangeText={(text) => setUpdateRoom({ ...updateRoom, name: text })}
                    />

                    {/*인사말 설정*/}
                    <TextInput
                        dense={true}
                        multiline={true}
                        ref={contentRef}
                        mode='outlined'
                        outlineStyle={{ borderWidth: 1 }}
                        outlineColor='#0000001F'
                        label='인사말'
                        value={updateRoom.content}
                        style={{ width: '100%', marginBottom: 20, backgroundColor: WHITE, height: height * 0.15 }}
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onChangeText={(text) => setUpdateRoom({ ...updateRoom, content: text })}
                        onSubmitEditing={() => dateRef.current.focus()}
                    />


                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>

                        {/*기일 설정*/}
                        <TextInput
                            ref={dateRef}
                            mode='outlined'
                            outlineStyle={{ borderWidth: 1 }}
                            outlineColor='#0000001F'
                            label='기일'
                            value={formatDate(date)}
                            style={{
                                width: '100%', backgroundColor: WHITE, flex: 1, marginEnd: 20
                            }}
                            returnKeyType={ReturnKeyTypes.NEXT}
                            onChangeText={(text) => setUpdateRoom({ ...updateRoom, date: text })}
                            onFocus={() => setShow(true)}
                        />

                        {/*나이 설정*/}
                        <TextInput
                            ref={ageRef}
                            mode='outlined'
                            outlineStyle={{ borderWidth: 1 }}
                            outlineColor='#0000001F'
                            label='나이'
                            textContentType={'telephoneNumber'}
                            value={updateRoom.age.toString()}
                            style={{
                                width: '100%',
                                fontSize: 14,
                                backgroundColor: WHITE,
                                flex: 1
                            }}
                            inputMode={'numeric'}
                            returnKeyType={ReturnKeyTypes.DONE}
                            onChangeText={(text) => setUpdateRoom({ ...updateRoom, age: text })}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                        <SegmentedButtons
                            value={updateRoom.gender.toString()}
                            onValueChange={value => setUpdateRoom(prevState => ({
                                ...prevState,
                                gender: value
                            }))}
                            style={{ flex: 1 }}
                            buttons={[
                                {
                                    label: '',
                                    value: '1',
                                    icon: require('../../../assets/icon/ic_male.png'),
                                    checkedColor: GENDER.MALE,
                                    uncheckedColor: GRAY.DEFAULT
                                },
                                {
                                    label: '',
                                    value: '0',
                                    icon: require('../../../assets/icon/ic_female.png'),
                                    checkedColor: GENDER.FEMALE,
                                    uncheckedColor: GRAY.DEFAULT
                                }
                            ]}
                        />

                        <View style={{ marginHorizontal: 25 }}>
                            <RadioButton.Group
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1
                                }}
                                onValueChange={(value) => {
                                    setUpdateRoom({ ...updateRoom, permission: value });
                                }}
                                value={updateRoom.permission.toString()}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text>공개</Text>
                                        <RadioButton value='1' />
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text>비공개</Text>
                                        <RadioButton value='0' />
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </View>
                    </View>


                    <View style={{ flexDirection: 'row', marginTop: 30 }}>

                        {/*삭제하기 버튼*/}
                        <Button title='삭제하기'
                                onPress={onDelete}
                                styles={{
                                    container: {
                                        flex: 1
                                    },
                                    button: {
                                        borderRadius: 4
                                    }
                                }} />

                        {/*저장하기 버튼*/}
                        <Button title='저장하기'
                                onPress={onModify}
                                styles={{
                                    container: {
                                        flex: 1,
                                        marginStart: 20
                                    },
                                    button: {
                                        borderRadius: 4
                                    }
                                }} />
                    </View>
                </ScrollView>


            </View>
        </SafeInputView>
    );
};

RoomUpdateScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE
    },
    profile: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GRAY.DARK
    },
    form: {
        flexGrow: 0,
        backgroundColor: WHITE,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
});

export default RoomUpdateScreen;

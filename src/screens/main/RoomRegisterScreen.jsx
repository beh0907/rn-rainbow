import React, { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import SwitchSelector from 'react-native-switch-selector';
import { GRAY, PRIMARY, WHITE } from '../../Colors';
import SafeInputView from '../../components/view/SafeInputView';
import FastImage from '../../components/view/FastImage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ReturnKeyTypes } from '../../components/view/Input';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../components/button/Button';
import * as Room from '../../api/Room'

const RoomRegisterScreen = props => {
    //사이즈 관련 변수
    const { top, bottom } = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();

    //추모관 설정 정보
    const [image, setImage] = useState(null);
    const [room, setRoom] = useState({});

    // 설정 정보 REF
    const nameRef = useRef(null);
    const contentRef = useRef(null);
    const dateRef = useRef(null);
    const ageRef = useRef(null);
    const genderRef = useRef(null);

    //날짜 다이얼로그 설정
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            // allowsMultipleSelection:true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            aspect: [4, 3], //이미지 편집 X,Y 비율
            quality: 1

        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onRegister = async () => {
        const result = await Room.registerRoom()
    };

    return (
        <SafeInputView>

            <View style={[styles.container, { paddingTop: top }]}>
                <View style={styles.profile}>
                    <View style={[styles.photo, room.image || { backgroundColor: GRAY.DEFAULT }]}>
                        {
                            image
                                ? <FastImage source={{ uri: image }} style={styles.photo} />
                                : <Image source={require('../../../assets/icon/ic_dog.png')} style={styles.photo} />
                        }
                        <Pressable style={styles.editButton} onPress={pickImage}>
                            <MaterialCommunityIcons name='pencil' size={20} color={WHITE} />
                        </Pressable>
                    </View>
                </View>

                <View>
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
                            value={room.name}
                            style={{ width: '100%', marginBottom: 20, backgroundColor: WHITE }}
                            onSubmitEditing={() => contentRef.current.focus()}
                            returnKeyType={ReturnKeyTypes.NEXT}
                            onChangeText={(text) => setRoom({ ...room, name: text })}
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
                            value={room.content}
                            style={{ width: '100%', marginBottom: 20, backgroundColor: WHITE, height: height * 0.15 }}
                            returnKeyType={ReturnKeyTypes.NEXT}
                            onChangeText={(text) => setRoom({ ...room, content: text })}
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
                                value={date}
                                style={{
                                    width: '100%', backgroundColor: WHITE, flex: 1, marginEnd: 20
                                }}
                                returnKeyType={ReturnKeyTypes.NEXT}
                                onChangeText={(text) => setRoom({ ...room, date: text })}
                                onFocus={() => setOpen(true)}
                                onSubmitEditing={() => ageRef.current.focus()}
                            />

                            {/*나이 설정*/}
                            <TextInput
                                ref={ageRef}
                                mode='outlined'
                                outlineStyle={{ borderWidth: 1 }}
                                outlineColor='#0000001F'
                                label='나이'
                                textContentType={'telephoneNumber'}
                                value={room.age}
                                style={{
                                    width: '100%',
                                    fontSize: 14,
                                    backgroundColor: WHITE,
                                    flex: 1
                                }}
                                returnKeyType={ReturnKeyTypes.DONE}
                                onChangeText={(text) => setRoom({ ...room, age: text })}
                                onSubmitEditing={() => {
                                }}
                            />

                        </View>


                        <SwitchSelector
                            initial={1}
                            onPress={value => setRoom(prevState => ({
                                ...prevState,
                                gender: value
                            }))}
                            textColor={PRIMARY.DEFAULT} //'#7a44cf'
                            selectedColor={WHITE}
                            buttonColor={PRIMARY.DEFAULT}
                            borderColor={PRIMARY.DEFAULT}
                            hasPadding
                            options={[
                                {
                                    label: '',
                                    value: 1,
                                    imageIcon: require('../../../assets/icon/ic_female.png')
                                }, //images.feminino = require('./path_to/assets/img/feminino.png')
                                { label: '', value: 0, imageIcon: require('../../../assets/icon/ic_male.png') } //images.masculino = require('./path_to/assets/img/masculino.png')
                            ]}
                            testID='gender-switch-selector'
                            accessibilityLabel='gender-switch-selector'
                        />


                        {/*저장하기 버튼*/}
                        <Button title='생성하기'
                                onPress={onRegister}
                                styles={{
                                    container: {
                                        marginTop: 20
                                    },
                                    button: {
                                        borderRadius: 4
                                    }
                                }} />
                        <View />
                    </ScrollView>
                </View>
            </View>
        </SafeInputView>
    );
};

RoomRegisterScreen.propTypes = {};

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

export default RoomRegisterScreen;

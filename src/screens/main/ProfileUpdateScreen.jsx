import React, { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useUserState } from '../../contexts/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { GRAY, WHITE } from '../../Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FastImage from '../../components/view/FastImage';
import { Text, TextInput } from 'react-native-paper';
import SafeInputView from '../../components/view/SafeInputView';
import { ReturnKeyTypes } from '../../components/view/Input';
import Button from '../../components/button/Button';
import { addHyphen } from '../../utils/checkInputForm';
import { modify } from '../../api/Auth';
import { useMessageState } from '../../contexts/MessageContext';
import * as ImagePicker from 'expo-image-picker';

const ProfileUpdateScreen = props => {
    const [user, setUser] = useUserState();
    const [, setMessage] = useMessageState();
    const { top, bottom } = useSafeAreaInsets();
    const navigation = useNavigation();

    const [image, setImage] = useState(null);
    const [profile, setProfile] = useState({
        ...user
    });

    const nickNameRef = useRef();
    const mailRef = useRef();
    const phoneRef = useRef();

    const pickImage = useCallback(async () => {
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
    });

    const onModify = async () => {
        try {
            const paramUser = { ...user, ...profile };

            const result = await modify({ ...user, ...profile }, image);

            console.log('결과', result);

            //1이 들어오면 성공 0이면 실패
            if (result === 1) {
                console.log('결과', "체크체크");
                setUser(paramUser);
                setMessage(prev => ({
                    ...prev,
                    snackMessage: '유저 정보가 수정되었습니다.',
                    snackVisible: true
                }));
            }
        } catch (e) {

        }
    };

    return (
        <SafeInputView>
            <View style={[styles.container, { paddingTop: top }]}>

                <View style={styles.profile}>
                    <View style={[styles.photo, user.photoURL || { backgroundColor: GRAY.DEFAULT }]}>
                        <FastImage source={{ uri: user.photoURL || image }} style={styles.photo} />
                        <Pressable style={styles.editButton} onPress={pickImage}>
                            <MaterialCommunityIcons name='file-image' size={20} color={WHITE} />
                        </Pressable>
                    </View>

                    <Text style={styles.nickname}>{user.nickName || 'nickname'}</Text>
                </View>

                <View style={styles.listContainer}>
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
                            value={profile.name}
                            style={{ width: '100%', marginBottom: 20, backgroundColor: WHITE }}
                            onSubmitEditing={() => nickNameRef.current.focus()}
                            returnKeyType={ReturnKeyTypes.NEXT}
                            onChangeText={(text) => setProfile({ ...profile, name: text })}
                        />

                        {/*닉네임 설정*/}
                        <TextInput
                            ref={nickNameRef}
                            mode='outlined'
                            outlineStyle={{ borderWidth: 1 }}
                            outlineColor='#0000001F'
                            label='닉네임'
                            value={profile.nickName}
                            style={{ width: '100%', marginBottom: 20, backgroundColor: WHITE }}
                            returnKeyType={ReturnKeyTypes.NEXT}
                            onChangeText={(text) => setProfile({ ...profile, nickName: text })}
                            onSubmitEditing={() => mailRef.current.focus()}
                        />

                        {/*이메일 설정*/}
                        <TextInput
                            ref={mailRef}
                            mode='outlined'
                            outlineStyle={{ borderWidth: 1 }}
                            outlineColor='#0000001F'
                            label='이메일'
                            textContentType={'emailAddress'}
                            value={profile.mail}
                            style={{ width: '100%', marginBottom: 20, backgroundColor: WHITE }}
                            returnKeyType={ReturnKeyTypes.NEXT}
                            onChangeText={(text) => setProfile({ ...profile, mail: text })}
                            onSubmitEditing={() => phoneRef.current.focus()}
                        />


                        {/*전화번호 설정*/}
                        <TextInput
                            ref={phoneRef}
                            mode='outlined'
                            outlineStyle={{ borderWidth: 1 }}
                            outlineColor='#0000001F'
                            label='전화번호'
                            textContentType={'telephoneNumber'}
                            value={profile.phone}
                            style={{ width: '100%', marginBottom: 20, backgroundColor: WHITE }}
                            returnKeyType={ReturnKeyTypes.DONE}
                            onChangeText={(text) => setProfile({ ...profile, phone: addHyphen(text) })}
                            inputMode={"numeric"}
                        />


                        {/*저장하기 버튼*/}
                        <Button title='저장하기'
                                onPress={onModify}
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
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
    nickname: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: '500'
    },
    listContainer: {
        flex: 1
    },
    form: {
        flexGrow: 0,
        backgroundColor: WHITE,
        paddingHorizontal: 20,
        // paddingTop: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
});

export default ProfileUpdateScreen;

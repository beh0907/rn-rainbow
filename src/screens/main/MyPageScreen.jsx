import React from 'react';
import {Alert, Image, Pressable, StyleSheet, View} from 'react-native';
import {useUserState} from "../../contexts/UserContext";
import {GRAY, PRIMARY, WHITE} from "../../Colors";
import {Text} from "react-native-paper";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import * as SecureStore from "../../utils/PreferenceStore";
import MyRoomList from "../../components/list/MyRoomList";
import {useNavigation} from "@react-navigation/native";
import {MainRoutes} from "../../navigations/Routes";


const MyPageScreen = () => {
    const [user, setUser] = useUserState()
    const navigation = useNavigation()

    const onSignOut = () => {
        Alert.alert(
            "",
            "정말로 로그아웃 하시겠습니까?",
            [{
                text: "로그아웃",
                style: "default",
                onPress: () => {
                    SecureStore.signOutSecureStore()
                    setUser({})
                }
            },
                {
                    text: "취소",
                    style: "cancel"
                }]
        )
    }

    return (
        <View style={{
            backgroundColor: PRIMARY.DEFAULT,
            height: "100%",
        }}>
            <View style={{
                paddingHorizontal: 36,
                backgroundColor: WHITE,
                height: "50%",
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50
            }}>
                <View style={{
                    flexDirection: "row",
                    width: "100%",
                    marginTop: 36
                }}>
                    <Pressable onPress={() => {navigation.navigate(MainRoutes.PROFILE_UPDATE)}} style={{
                        width: "50%",
                        alignItems: "flex-start"
                    }}>
                        <MaterialCommunityIcons
                            name="account-edit-outline"
                            size={24}
                            color={PRIMARY.DARK}
                        />
                    </Pressable>

                    <Pressable onPress={onSignOut} style={{
                        width: "50%",
                        alignItems: "flex-end"
                    }}>
                        <MaterialCommunityIcons
                            name="logout-variant"
                            size={24}
                            color={PRIMARY.DARK}
                        />
                    </Pressable>
                </View>

                <Image
                    source={require('../../../assets/p2.jpg')}
                    style={{
                        height: 100,
                        width: 100,
                        borderRadius: 20,
                        alignSelf: "center",
                        marginVertical: 20
                    }}
                />
                <Text variant={"titleLarge"} style={{
                    color: PRIMARY.DEFAULT,
                    fontWeight: "bold",
                    alignSelf: "center"
                }}>
                    {user.nickName}
                </Text>
                <Text variant={"titleMedium"} style={styles.grayText}>
                    {user.mail}
                </Text>


                <View style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    marginTop: 20
                }}>
                    <View>
                        <Text variant={"bodyLarge"} style={styles.boldDarkText}>280</Text>

                        <Text variant={"titleMedium"} style={styles.grayText}>
                            photos
                        </Text>
                    </View>

                    <View style={{marginHorizontal: 40}}>
                        <Text variant={"bodyLarge"} style={styles.boldDarkText}>2,107</Text>

                        <Text variant={"titleMedium"} style={styles.grayText}>
                            followers
                        </Text>
                    </View>


                    <View>
                        <Text variant={"bodyLarge"} style={styles.boldDarkText}>104</Text>

                        <Text variant={"titleMedium"} style={styles.grayText}>
                            follows
                        </Text>
                    </View>
                </View>
            </View>


            <View style={{
                flexDirection: "row",
                paddingHorizontal: 40,
                paddingTop: 20
            }}>
                <View
                    style={{
                        borderBottomColor: WHITE,
                        borderBottomWidth: 4,
                        paddingVertical: 6,
                    }}
                >
                    <Text style={styles.boldText}>나의 추모관</Text>
                </View>
            </View>


            {/*<View style={{flexDirection: "row"}}>*/}
            {/*    <View style={{*/}
            {/*        backgroundColor: PRIMARY.DARK,*/}
            {/*        height: 260,*/}
            {/*        width: 280,*/}
            {/*        marginHorizontal: 40,*/}
            {/*        borderRadius: 30,*/}
            {/*        marginTop: 30*/}
            {/*    }}>*/}
            {/*        <ImageBackground*/}
            {/*            source={require('../../../assets/7.jpg')}*/}
            {/*            style={{*/}
            {/*                width: 280,*/}
            {/*                height: 180*/}
            {/*            }}*/}
            {/*            imageStyle={{*/}
            {/*                borderRadius: 30*/}
            {/*            }}*/}
            {/*        >*/}
            {/*        </ImageBackground>*/}

            {/*        <View style={{*/}
            {/*            paddingVertical: 20,*/}
            {/*            paddingHorizontal: 30*/}
            {/*        }}>*/}
            {/*            <Text variant={"bodyLarge"} style={styles.boldText}>Nature Collections</Text>*/}

            {/*            <Text variant={"bodyMedium"} style={{color: GRAY.LIGHT}}>*/}
            {/*                1,003 photos*/}
            {/*            </Text>*/}
            {/*        </View>*/}
            {/*    </View>*/}


            {/*    <View style={{*/}
            {/*        height: 180,*/}
            {/*        backgroundColor: WHITE,*/}
            {/*        width: 20,*/}
            {/*        marginLeft: -20,*/}
            {/*        marginTop: 70,*/}
            {/*        borderTopLeftRadius: 20,*/}
            {/*        borderBottomLeftRadius: 20*/}
            {/*    }}>*/}
            {/*    </View>*/}
            {/*</View>*/}

            <MyRoomList isHorizontal={true}/>
        </View>
    )
}

const styles = StyleSheet.create({
    boldText: {
        fontWeight: "bold",
        color: WHITE,
    },
    boldDarkText: {
        fontWeight: "bold",
        color: PRIMARY.DARK,
        alignSelf: "center"
    },
    grayText: {
        color: GRAY.DEFAULT,
        alignSelf: "center"
    },
    containerList: {
        marginHorizontal: 40,
        borderRadius: 30,
        marginTop: 30
    }
})

export default MyPageScreen;

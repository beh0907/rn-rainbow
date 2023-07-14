import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Pressable, StyleSheet, Text, View} from "react-native";
import {BLACK, DANGER, WHITE} from "../Colors";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import Button, {ButtonTypes} from "./button/Button";


export const AlertTypes = {
    LOGOUT: 'LOGOUT'
}

const DangerAlertProps = {
    LOGOUT: {
        iconName: 'logout-variant',
        title: '로그아웃',
        message: '정말 로그아웃 하시겠습니까?'
    }
}

const DangerAlert = ({visible, onClose, alertType, onConfirm}) => {
    const {iconName, title, message} = DangerAlertProps[alertType]

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType={'fade'}
            onRequestClose={onClose}>
            <View style={styles.container}>
                <Pressable style={styles.background} onPress={onClose}/>

                <View style={styles.alert}>
                    <View style={styles.imageBackground}>
                        <View style={styles.image}>
                            <MaterialCommunityIcons name={iconName} size={30} color={WHITE}/>
                        </View>
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.desc}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <Button onPress={onClose} title={'취소'} styles={buttonStyles} buttonType={ButtonTypes.CANCLE}/>
                        <Button onPress={onConfirm} title={'로그아웃'} styles={buttonStyles} buttonType={ButtonTypes.DANGER}/>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

DangerAlert.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    alertType: PropTypes.oneOf(Object.values(AlertTypes)),
};

const styles = StyleSheet.create({
    background: {
        ...StyleSheet.absoluteFill,
        backgroundColor: BLACK,
        opacity: 0.3
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alert: {
        backgroundColor: WHITE,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 20,
        width: '80%',
        borderRadius: 8
    },
    imageBackground: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: WHITE,
        top: -40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 74,
        height: 74,
        borderRadius: 37,
        backgroundColor: DANGER.DEFAULT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginTop: 50,
        fontSize: 20,
        fontWeight: '700',
    },
    desc: {
        marginVertical: 10,
        fontSize: 16,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
    },
})

const buttonStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
        marginTop: 10,
    },
    button: {
        borderRadius: 8,
    },
})

export default DangerAlert;

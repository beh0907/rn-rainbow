import {Image, StyleSheet, useWindowDimensions, View} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import * as SecureStore from "../../utils/PreferenceStore";
import {AuthRoutes} from "../../navigations/Routes";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {STORE_SETTING_KEYS} from "../../utils/PreferenceStore";

const IntroScreen = ({navigation}) => {
    const {height, width} = useWindowDimensions()
    const {top, bottom} = useSafeAreaInsets()

    const onDone = async () => {
        await SecureStore.save(STORE_SETTING_KEYS.CHECK_INTRO, "1")
        navigation.replace(AuthRoutes.SIGN_IN)
    };

    const onSkip = async () => {
        await SecureStore.save(STORE_SETTING_KEYS.CHECK_INTRO, "1")
        navigation.replace(AuthRoutes.SIGN_IN)
    };

    const RenderItem = ({item}) => {
        return (
            <View style={[styles.hw100, {backgroundColor: item.background}]}>
                <Image style={styles.hw100} source={item.image} resizeMode={"cover"}/>
            </View>
        );
    };

    return (
        <>
            <AppIntroSlider
                data={slides}
                renderItem={RenderItem}
                onDone={onDone}
                onSkip={onSkip}
                showSkipButton={true}
            />
        </>
    );
};

const styles = StyleSheet.create({
    hw100: {
        flex: 1,
        height: '100%',
        width: '100%'
    }
});

const slides = [
    {
        key: 'Intro1',
        text: 'Best Recharge offers',
        title: 'Mobile Recharge',
        image: require('../../../assets/background/bg_intro_1.png'),
        background: '#a7a8c4'
    },
    {
        key: 'Intro2',
        title: 'Flight Booking',
        text: 'Upto 25% off on Domestic Flights',
        image: require('../../../assets/background/bg_intro_2.png'),
        background: '#a7a8c4'
    },
    {
        key: 'Intro3',
        title: 'Great Offers',
        text: 'Enjoy Great offers on our all services',
        image: require('../../../assets/background/bg_intro_3.png'),
        background: '#a7a8c4'
    },
    {
        key: 'Intro4',
        title: 'Best Deals',
        text: ' Best Deals on all our services',
        image: require('../../../assets/background/bg_intro_4.png'),
        background: '#a7a8c4'
    }
];

export default IntroScreen;

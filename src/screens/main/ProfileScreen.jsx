// import {Text} from "react-native-paper";
// import {useSafeAreaInsets} from "react-native-safe-area-context";

import {useState} from 'react';
import {Button, Image, StyleSheet, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {register} from "../../api/Gallery";

const ProfileScreen = props => {
    // const {top, bottom} = useSafeAreaInsets();
    //
    // return (
    //     <View style={[styles.container, {marginTop: top}]}>
    //         <Text>프로필 화면</Text>
    //     </View>
    // );

    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            // allowsMultipleSelection:true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log("결과", result);

        if (!result.canceled) {
            const imageUri = result.uri
            setImage(imageUri);

            const gallery = {
                roomNum: 4,
                id: 'beh0907',
            }
            await register(gallery, imageUri)
        }
    };

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Button title="Pick an image from camera roll" onPress={pickImage}/>
            {image && <Image source={{uri: image}} style={{width: 200, height: 200}}/>}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProfileScreen;

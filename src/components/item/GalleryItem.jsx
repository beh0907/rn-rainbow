import React, { memo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PRIMARY, WHITE } from '../../Colors';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Image } from 'expo-image';

const GalleryItem = memo(({ imageUrl, size, onPress, isDeleteMode, isSelected }) => {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.container, { opacity: pressed ? 0.5 : 1 }]}>
            {/*<AutoHeightImage style={styles.image} width={IMAGE_WIDTH}*/}
            {/*                 source={{ uri: imageUrl }} />*/}


            {/*<Image style={[styles.image, { width: IMAGE_WIDTH, height: IMAGE_WIDTH }]}*/}
            {/*       source={imageUrl}*/}
            {/*       contentFit={'cover'} />*/}
            <Image style={[styles.image, { width: size, height: size }]}
                   source={{ uri: imageUrl }}
                   contentFit={'cover'}
                   sharedTransitionTag={imageUrl} />


            {isDeleteMode &&
                <View
                    style={[styles.selectItem, { backgroundColor: isSelected ? 'rgba(107,114,128,0.7)' : 'transparent' }]}>
                    <BouncyCheckbox
                        onPress={onPress}
                        disableText
                        disableBuiltInState
                        style={{ position: 'absolute', top: 10, left: 10 }}
                        isChecked={isSelected}
                        size={20}
                        fillColor={PRIMARY.DEFAULT}
                        unfillColor='#FFFFFF'
                    />
                </View>
            }

        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        margin: 5,
        backgroundColor: WHITE
        // flex: 1
    },
    image: {
        borderRadius: 12
    },
    selectItem: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 12
    }
});

export default GalleryItem;

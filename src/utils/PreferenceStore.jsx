import * as SecureStore from "expo-secure-store";

export const STORE_USER_KEYS = {
    ID: "id",
    PASSWORD: "password",
    PROVIDER: "provider",
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken"
}

export const STORE_SETTING_KEYS = {
    CHECK_INTRO: "checkIntro",
    FAVORITE_ROOMS: "favoriteRooms"
}

//안드로이드 shared Preference
export const save = async (key, value) => {
    return await SecureStore.setItemAsync(key, value);
}

export const getValueFor = async (key) => {
    return await SecureStore.getItemAsync(key);
}

export const getListFor = async (key) => {
    const temp = await SecureStore.getItemAsync(key)
    return temp ? JSON.parse(temp) : [4, 8];
}

export const signOutSecureStore = async () => {
    const keys = Object.values(STORE_USER_KEYS);
    const emptyValue = '';

    // Loop through all the keys in STORE_USER_KEYS and set them to empty strings
    for (const key of keys) {
        await save(key, emptyValue);
    }
}

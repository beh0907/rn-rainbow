import * as SecureStore from "expo-secure-store";

export const STORE_USER_KEYS = {
    ID: "id",
    Password: "password",
    Provider: "provider",
    AccessToken: "accessToken",
    RefreshToken: "refreshToken"
}

export const STORE_SETTING_KEYS = {
    CheckIntro: "checkIntro",
}

//안드로이드 shared Preference
export const save = async (key, value) => {
    return await SecureStore.setItemAsync(key, value);
}

export const getValueFor = async (key) => {
    return await SecureStore.getItemAsync(key);
}

export const signOutSecureStore = async () => {
    const keys = Object.values(STORE_USER_KEYS);
    const emptyValue = '';

    // Loop through all the keys in STORE_USER_KEYS and set them to empty strings
    for (const key of keys) {
        await save(key, emptyValue);
    }
}

import * as SecureStore from "expo-secure-store";

export const STORE_USER_KEYS = {
    ID: "id",
    PASSWORD: "password",
    PROVIDER: "provider",
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

import * as SecureStore from "expo-secure-store";

//안드로이드 shared Preference
export const save = async (key, value) => {
    return await SecureStore.setItemAsync(key, value);
}

export const getValueFor = async (key) => {
    return await SecureStore.getItemAsync(key);
}

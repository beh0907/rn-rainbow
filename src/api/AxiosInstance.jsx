import axios from 'axios';
import Constants from 'expo-constants';

const { BASE_URL_API, BASE_URL_FILE } = Constants.expoConfig.extra;

export const axiosApiInstance = axios.create({
    baseURL: BASE_URL_API,
    timeout: 2000
});

export const axiosFileInstance = axios.create({
    baseURL: BASE_URL_FILE,
    timeout: 2000
});

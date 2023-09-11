import axios from 'axios';
import Constants from 'expo-constants';

const { BASE_URL_API, BASE_URL_FILE, BASE_URL_BOARD, TEST } = Constants.expoConfig.extra;

console.log("BASE_URL_API : ", BASE_URL_API)
console.log("BASE_URL_FILE : ", BASE_URL_FILE)
console.log("BASE_URL_BOARD : ", BASE_URL_BOARD)

export const axiosApiInstance = axios.create({
    baseURL: BASE_URL_API,
    timeout: 2000
});

export const axiosFileInstance = axios.create({
    baseURL: BASE_URL_FILE,
    timeout: 2000
});

import axios from 'axios';
import { BASE_URL_API,  BASE_URL_FILE} from '@env';

export const axiosApiInstance = axios.create({
    baseURL: BASE_URL_API,
    timeout: 2000,
});

export const axiosFileInstance = axios.create({
    baseURL: BASE_URL_FILE,
    timeout: 2000,
});

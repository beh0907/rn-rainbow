import axios from "axios";
import { BASE_URL_API } from "@env"


export const getList = async () => {
    const response = await axios.get(`${BASE_URL_API}/pet/getList`);
    return response.data
}
export const getByCode = async (code) => {
    const response = await axios.get(`${BASE_URL_API}/pet/getList?code=${code}`);
    return response.data
}
export const getByFamily = async (family) => {
    const response = await axios.get(`${BASE_URL_API}/pet/getList?family=${family}`);
    return response.data
}

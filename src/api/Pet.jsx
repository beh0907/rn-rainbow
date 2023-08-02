import axios from "axios";
import { BASE_URL_API } from "@env"
import { axiosApiInstance } from './AxiosInstance';


export const getList = async () => {
    const response = await axiosApiInstance.get(`/pet/getList`);
    return response.data
}
export const getByCode = async (code) => {
    const response = await axiosApiInstance.get(`/pet/getList?code=${code}`);
    return response.data
}
export const getByFamily = async (family) => {
    const response = await axiosApiInstance.get(`/pet/getList?family=${family}`);
    return response.data
}

import axios from "axios";
import { BASE_URL_API } from "@env"


export const readList = async (num) => {
    const response = await axios.get(`${BASE_URL_API}/comment/readList?num=${num}`);
    return response.data
}

export const register = async (comment) => {
    const response = await axios.post(`${BASE_URL_API}/comment/register`, comment);
}

export const remove = async (seq) => {
    const response = await axios.delete(`${BASE_URL_API}/comment/remove?seq=${seq}`);
}

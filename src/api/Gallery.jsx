import axios from "axios";
import { BASE_URL_API } from "@env"

export const readList = async (num) => {
    const response = await axios.get(`${BASE_URL_API}/gallery/readList?num=${num}`);
    return response.data
}

export const register = async (galleries, uploadFiles) => {
    const formData = new FormData()
    formData.append('galleries', galleries);
    formData.append('file', uploadFiles)

    const response = await axios.post(`${BASE_URL_API}/room/register`, formData);
    return response.data
}

//아직 안 씀
// export const modify = async (room, file) => {
//     const response = await axios.post(`${BASE_URL_API}/gallery/modify`, {
//         params: {
//             room,
//             file
//         }
//     });
//     return response.data
// }

export const remove = async (galleries) => {
    const response = await axios.delete(`${BASE_URL_API}/gallery/remove`, {
        data: galleries
    });
    return response.data
}

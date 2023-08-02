import axios from "axios";
import {BASE_URL_API} from "@env"
import { axiosApiInstance } from './AxiosInstance';

export const readGalleryList = async (num) => {
    const response = await axiosApiInstance.get(`/gallery/readList?num=${num}`);
    return response.data
}

export const registerGallery = async (galleries, filesUri) => {
    const filename = filesUri.split('/').pop()
    const match = /\.(\w+)$/.exec(filename ?? '')
    const type = match ? `image/${match[1]}` : 'image'
    const formData = new FormData()

    galleries.name = filename

    formData.append('galleries', galleries);
    formData.append('file', {uri: filesUri, name: filename, type})

    console.log(formData)

    const response = await axiosApiInstance.post(`/room/register`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    return response.data
}

//아직 안 씀
// export const modify = async (room, file) => {
//     const response = await axiosApiInstance.post(`/gallery/modify`, {
//         params: {
//             room,
//             file
//         }
//     });
//     return response.data
// }

export const removeGallery = async (galleries) => {
    const response = await axios.delete(`${BASE_URL_API}/gallery/remove`, {
        data: galleries
    });
    return response.data
}

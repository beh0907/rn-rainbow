import axios from 'axios';
import { axiosApiInstance } from './AxiosInstance';
import Constants from 'expo-constants';

const { BASE_URL_API} = Constants.expoConfig.extra;

export const readGalleryList = async (num) => {
    const response = await axiosApiInstance.get(`/gallery/readList?num=${num}`);
    return response.data;
};

export const registerGallery = async (room, assets) => {
    const formData = new FormData();

    //갤러리 asset 배열로 받아온다
    assets.map(asset => {
        const uri = asset.uri;
        const name = `${room.id}_${room.roomNum}` + uri.split('/').pop();
        const match = /\.(\w+)$/.exec(name ?? '');
        const type = match ? `image/${match[1]}` : 'image';

        //같은 name으로 지정된 객체는 알아서 배열형태로 설정된다
        formData.append('file', { uri, name: name, type });
        formData.append('galleries', JSON.stringify({
            roomNum: room.roomNum,
            id: room.id,
            name: name
        }));
    });

    const response = await axiosApiInstance.post(`/gallery/register`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    return response.data;
};

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
    return response.data;
};

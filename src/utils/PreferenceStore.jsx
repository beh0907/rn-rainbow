import * as SecureStore from 'expo-secure-store';

export const STORE_USER_KEYS = {
    ID: 'id',
    PASSWORD: 'password',
    PROVIDER: 'provider',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken'
};

export const STORE_SETTING_KEYS = {
    CHECK_INTRO: 'checkIntro',
    FAVORITE_ROOMS: 'favoriteRooms'
};

/**정보를 저장한다*/
export const save = async (key, value) => {
    return await SecureStore.setItemAsync(key, value);
};

/**정보를 단일 형태로 가져온다*/
export const getValueFor = async (key) => {
    const value = await SecureStore.getItemAsync(key);
    return value !== null ? value : '';
};

/**정보를 리스트 형태로 가져온다*/
export const getListFor = async (key) => {
    const temp = await SecureStore.getItemAsync(key);
    return temp ? JSON.parse(temp) : [];
};

/**로그인 시 유저 정보를 저장한다*/
export const signInSecureStore = async (user) => {
    const keys = Object.keys(user);

    // Loop through all the keys in STORE_USER_KEYS and set them to empty strings
    for (const key of keys) {
        //빈 값은 공백으로 추가한다
        await save(key, user[key] ? user[key] : '');
    }
};

/**로그아웃 시 유저 정보를 삭제한다*/
export const signOutSecureStore = async () => {
    const keys = Object.values(STORE_USER_KEYS);
    const emptyValue = '';

    // Loop through all the keys in STORE_USER_KEYS and set them to empty strings
    for (const key of keys) {
        await save(key, emptyValue);
    }
};

export const isBookMark = async (roomNum) => {
    // favoriteRooms 리스트 가져오기
    const favoriteRooms = await getListFor(STORE_SETTING_KEYS.FAVORITE_ROOMS);

    // favoriteRooms 리스트에 roomNum과 일치하는 아이템 찾기
    const isBookmarked = favoriteRooms.includes(roomNum);

    return isBookmarked;
};

export const addBookMark = async (roomNum) => {
    const favoriteRooms = await getListFor(STORE_SETTING_KEYS.FAVORITE_ROOMS);

    // roomNum을 favoriteRooms 리스트에 추가
    favoriteRooms.push(roomNum);

    // 수정된 favoriteRooms 리스트를 저장
    await save(STORE_SETTING_KEYS.FAVORITE_ROOMS, JSON.stringify(favoriteRooms));
};

export const removeBookMark = async (roomNum) => {
    // favoriteRooms 리스트 가져오기
    const favoriteRooms = await getListFor(STORE_SETTING_KEYS.FAVORITE_ROOMS);

    // roomNum을 제외한 새로운 리스트 생성
    const updatedFavoriteRooms = favoriteRooms.filter((item) => item !== roomNum);

    // 수정된 리스트를 저장
    await save(STORE_SETTING_KEYS.FAVORITE_ROOMS, JSON.stringify(updatedFavoriteRooms));
};

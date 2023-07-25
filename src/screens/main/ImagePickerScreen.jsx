import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useNavigation, useNavigationState, useRoute} from "@react-navigation/native";
import HeaderRight from "../../components/view/HeaderRight";
import ImagePicker from "../../components/list/ImagePicker";

const ImagePickerScreen = () => {
    // goback으로 돌아갈 때 값을 저장하기 위한 네비게이션
    const stateRoutes = useNavigationState((state) => state.routes);
    const navigation = useNavigation();
    const {params} = useRoute()

    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const maxCount = params?.maxCount ?? 1

    const onSelect = useCallback(() => {
        //이전 화면의 값을 얻기 위해 -2 / -1은 현재
        const prevScreenName = stateRoutes[stateRoutes.length - 2].name;

        navigation.navigate(prevScreenName, {selectedPhotos});
    }, [navigation, selectedPhotos, stateRoutes]);

    //우측 상단 버튼
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderRight disabled={selectedPhotos.length < 1} onPress={onSelect} name={"check"}/>
            ),
        });
    }, [navigation, onSelect, selectedPhotos.length]);

    //이미지 선택 여부 체크
    //선택된 이미지에서 아이디를 비교해 리스트 내에서 찾는다면
    const isSelectedPhoto = (photo) => {
        return selectedPhotos.findIndex((item) => item.id === photo.id) > -1;
    };

    //이미지 클릭 시 선택/해제 상태 저장
    const togglePhoto = (photo) => {
        const isSelected = isSelectedPhoto(photo);
        setSelectedPhotos((prev) => {
            //이미 선택한 사진이라면 선택 해제 시킨다
            if (isSelected)
                return prev.filter((item) => item.id !== photo.id);

            // 단일 선택일 경우 새로 선택한 사진을 선택하시게 한다
            if (maxCount === 1)
                return [photo]

            // 제한 갯수보다 적게 선택했다면 추가한다
            if (maxCount > prev?.length)
                return [...prev, photo];

            // 다중 선택 한계값을 초과했다면 더 추가하지 않는다
            return prev;
        });
    };

    return (
        <ImagePicker togglePhoto={togglePhoto} isSelectedPhoto={isSelectedPhoto}/>
    );
};

export default ImagePickerScreen;

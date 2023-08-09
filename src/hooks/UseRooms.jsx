import React, { useCallback, useEffect, useRef, useState } from 'react';
import { readRoomList } from '../api/Room';

const UseRooms = () => {
    // const [searchState, setSearchState] = useState({
    //     page: 1,
    //     type: '',
    //     keyword: ''
    // })

    const [rooms, setRooms] = useState([]);
    const [refetching, setRefetching] = useState(false);
    const [amount, setAmount] = useState(20);
    const [isLoading, setIsLoading] = useState(false)

    const isFetch = useRef(true);
    const pageRef = useRef(1);

    console.log("로딩", isLoading)

    const fetchNextPage = useCallback(async () => {
        if (!isLoading && isFetch.current) {
            setIsLoading(true)

            //페이지와 개수 정보를 파라미터로 입력한다
            const list = await readRoomList({ page: pageRef.current, amount });

            //페이지당 amount만큼 가져오지만 amount와 개수가 다를 경우 마지막 페이지임을 인식
            if (list.length !== amount) {
                isFetch.current = false;
            }

            //새로 가져온 추모관이 하나라도 있다면 리스트에 추가한다
            if (list.length > 0) {
                setRooms(prev => [...prev, ...list]);
                pageRef.current++;
            }

            setIsLoading(false)
        }
    }, []);

    const refetch = async () => {
        setRefetching(true);
        setRooms([]);
        pageRef.current = 1;
        isFetch.current = true;
        await fetchNextPage();
        setRefetching(false);
    };

    useEffect(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    return { rooms, fetchNextPage, refetch, refetching, isLoading };
};

export default UseRooms;

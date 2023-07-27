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

    const isFetch = useRef(true);
    const isLoadingRef = useRef(false);
    const lastRef = useRef(0);

    const fetchNextPage = useCallback(async (page) => {
        if (!isLoadingRef.current) {
            isLoadingRef.current = true;

            const list = await readRoomList({ page });

            if (list.length > 0) {
                setRooms(prev => lastRef.current ? [...prev, ...list] : list);
                lastRef.current = rooms.length;
            }

            //페이지당 20개씩 가져오지만 20개가 아닐 경우 페이지가 끝났음을 인식
            if (list.length !== 20) {
                isFetch.current = false
            }

            isLoadingRef.current = false;
        }
    }, []);

    const refetch = async () => {
        setRefetching(true);
        setRooms([]);
        lastRef.current = 1;
        isFetch.current = true
        await fetchNextPage(lastRef.current);
        setRefetching(false);
    };

    useEffect(() => {
        if (isFetch.current)
            fetchNextPage(++lastRef.current);
    }, [fetchNextPage]);

    return { rooms, fetchNextPage, refetch, refetching };
};

export default UseRooms;

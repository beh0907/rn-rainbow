import React, {useCallback, useEffect, useRef, useState} from 'react';
import {readMyRoomList} from "../api/Room";
import {useUserState} from "../contexts/UserContext";

const UseMyRooms = (user) => {
    // const [searchState, setSearchState] = useState({
    //     page: 1,
    //     type: '',
    //     keyword: ''
    // })

    const [rooms, setRooms] = useState([])
    const [refetching, setRefetching] = useState(false)

    const isLoadingRef = useRef(false)
    const lastRef = useRef(0)

    const fetchNextPage = useCallback(async (page) => {
        if (!isLoadingRef.current) {
            isLoadingRef.current = true;

            const list = await readMyRoomList(user.id);

            if (list.length > 0) {
                setRooms(prev => lastRef.current ? [...prev, ...list] : list)
                lastRef.current = rooms.length
            }

            isLoadingRef.current = false;
        }
    }, [])

    const refetch = async () => {
        setRefetching(true)
        setRooms([])
        lastRef.current = 1
        await fetchNextPage(lastRef.current)
        setRefetching(false)
    }

    useEffect(() => {
        fetchNextPage(++lastRef.current)
    }, [fetchNextPage])

    return {rooms, fetchNextPage, refetch, refetching}
};

export default UseMyRooms;

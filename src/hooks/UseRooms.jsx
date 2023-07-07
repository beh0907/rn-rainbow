import React, {useCallback, useEffect, useRef, useState} from 'react';
import {readList} from "../api/Room";

const UseRooms = () => {
    const [rooms, setRooms] = useState([])
    const [refetching, setRefetching] = useState(false)

    const isLoadingRef = useRef(false)
    const lastRef = useRef(1)

    const fetchNextPage = useCallback(async (page) => {
        if (!isLoadingRef.current) {
            isLoadingRef.current = true;

            // const {list, last} = await getPosts({after: lastRef.current})
            const list = await readList(page,"","");

            if (list.length > 0) {
                setRooms(prev => lastRef.current ? [...prev, ...list] : list)
                lastRef.current = rooms.length
            }

            isLoadingRef.current = false;
        }
    }, [])

    const refetch = async () => {
        setRefetching(true)
        lastRef.current = 1
        await fetchNextPage(lastRef.current)
        setRefetching(false)
    }

    useEffect(() => {
        fetchNextPage(++lastRef.current)
    }, [fetchNextPage])

    return {posts: rooms, fetchNextPage, refetch, refetching}
};

export default UseRooms;

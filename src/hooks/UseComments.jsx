import React, { useCallback, useEffect, useRef, useState } from 'react';
import { readCommentList } from '../api/Comment';

const UseRooms = () => {
    const [comments, setComments] = useState([]);
    const [refetching, setRefetching] = useState(false);
    const [amount, setAmount] = useState(20);

    const isFetch = useRef(true);
    const isLoadingRef = useRef(false);
    const pageRef = useRef(1);

    const fetchNextPage = useCallback(async () => {
        if (!isLoadingRef.current && isFetch.current) {
            isLoadingRef.current = true;

            //페이지와 개수 정보를 파라미터로 입력한다
            const list = await readRoomList({ page: pageRef.current, amount });

            //페이지당 amount만큼 가져오지만 amount와 개수가 다를 경우 마지막 페이지임을 인식
            if (list.length !== amount) {
                isFetch.current = false;
            }

            //새로 가져온 댓글이 하나라도 있다면 리스트에 추가한다
            if (list.length > 0) {
                setComments(prev => [...prev, ...list]);
                pageRef.current++;
            }

            isLoadingRef.current = false;
        }
    }, []);

    const refetch = async () => {
        setRefetching(true);
        setComments([]);
        pageRef.current = 1;
        isFetch.current = true;
        await fetchNextPage(pageRef.current);
        setRefetching(false);
    };

    useEffect(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    return { comments, fetchNextPage, refetch, refetching };
};

export default UseRooms;

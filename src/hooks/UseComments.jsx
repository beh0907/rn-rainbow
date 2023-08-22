import React, { useCallback, useEffect, useRef, useState } from 'react';
import { readCommentList } from '../api/Comment';

const UseComments = (num) => {
    const [comments, setComments] = useState([]);
    const [refetching, setRefetching] = useState(false);
    const [amount, setAmount] = useState(50);
    const [isLoading, setIsLoading] = useState(false);

    const isFetch = useRef(true);
    const pageRef = useRef(1);

    const fetchNextPage = useCallback(async (isRefetch = false) => {
        if (!isLoading && isFetch.current) {
            setIsLoading(true);

            //페이지와 개수 정보를 파라미터로 입력한다
            const list = await readCommentList(num, { page: pageRef.current, amount, type:'' });

            //페이지당 amount만큼 가져오지만 amount와 개수가 다를 경우 마지막 페이지임을 인식
            if (list.length !== amount) {
                isFetch.current = false;
            }

            //새로 가져온 추모관이 하나라도 있다면 리스트에 추가한다
            if (list.length > 0) {

                // 새로고침이라면 새로
                if (isRefetch === true) setComments(list);
                else setComments(prev => [...prev, ...list]);

                // setRooms(prev => [...prev, ...list]);

                pageRef.current++;
            }

            setIsLoading(false);
        }
    }, [isLoading, isFetch, comments]);

    const refetch = useCallback(async () => {
        setRefetching(true);

        // setRooms([]);

        pageRef.current = 1;
        isFetch.current = true;

        await fetchNextPage(true);

        setRefetching(false);
    }, []);

    useEffect(() => {
        (async () => {
            await fetchNextPage();
        })();
    }, [fetchNextPage]);

    return { comments, fetchNextPage, refetch, refetching, isLoading };
};

export default UseComments;

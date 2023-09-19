export const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatDateTime = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const calculateTimeDifference = (dateTime) => {
    const currentDateTime = new Date();
    const targetDateTime = new Date(dateTime);

    const yearDiff = currentDateTime.getFullYear() - targetDateTime.getFullYear();
    if (yearDiff > 0) return yearDiff + '년 전';

    const monthDiff = currentDateTime.getMonth() - targetDateTime.getMonth();
    if (monthDiff > 0) return monthDiff + '개월 전';

    const dayDiff = currentDateTime.getDate() - targetDateTime.getDate();
    if (dayDiff > 0) return dayDiff + '일 전';

    const hourDiff = currentDateTime.getHours() - targetDateTime.getHours();
    if (hourDiff > 0) return hourDiff + '시간 전';

    const minuteDiff = currentDateTime.getMinutes() - targetDateTime.getMinutes();
    if (minuteDiff > 0) return minuteDiff + '분 전';

    return '방금'; // 1분 미만 차이일 경우 방금으로 표기한다
};

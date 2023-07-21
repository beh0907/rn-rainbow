export const checkMail = (mail) => {
    // 이메일 형식 검사 정규식
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    console.log("이메일 체크", emailRegex.test(mail))

    // 정규식을 사용하여 이메일 형식 검사
    return emailRegex.test(mail);
}

export const checkTelephone = (phone) => {

}

export const addHyphen = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{0,4})(\d{0,4})$/);

    if (match) {
        return [match[1], match[2], match[3]].filter((group) => !!group).join('-');
    }

    return phone;
}

export const addPeriodToDate = (text) => {
    console.log(text)
    const cleaned = text.replace(/\D/g, ''); // 숫자만 추출
    const match = cleaned.match(/^(\d{0,4})(\d{0,2})(\d{0,2})$/);

    if (match) {
        const year = match[1];
        const month = match[2];
        const day = match[3];

        // 월과 일이 존재하는 경우 '.'으로 구분하여 연결합니다.
        let formattedDate = '';
        if (year) {
            formattedDate += year;
            if (month) {
                formattedDate += `.${month}`;
                if (day) {
                    formattedDate += `.${day}`;
                }
            }
        }

        return formattedDate;
    }

    return text;
};

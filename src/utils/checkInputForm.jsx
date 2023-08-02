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

export const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const checkMail = (mail) => {

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

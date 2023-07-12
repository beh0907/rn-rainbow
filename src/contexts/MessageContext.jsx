import React, {createContext, useContext, useState} from 'react';
import PropTypes from "prop-types";

const MessageContext = createContext({})

const MessageProvider = ({children}) => {
    const [message, setMessage] = useState({
        snackMessage: '',
        snackVisible: false,
        modalMessage: '',
        modalVisible: false
    })

    return (
        <MessageContext.Provider value={[message, setMessage]}>
            {children}
        </MessageContext.Provider>
    );
};

MessageProvider.propTypes = {
    children: PropTypes.node.isRequired
}

const useMessageState = () => useContext(MessageContext)

export {useMessageState, MessageProvider}

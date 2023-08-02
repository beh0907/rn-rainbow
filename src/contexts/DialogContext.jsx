import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const DialogContext = createContext({});

const DialogProvider = ({ children }) => {
    const [dialog, setDialog] = useState({
        title: '',
        message: '',
        onPress: '',
        visible: false
    });

    return (
        <DialogContext.Provider value={[dialog, setDialog]}>
            {children}
        </DialogContext.Provider>
    );
};

DialogProvider.propTypes = {
    children: PropTypes.node.isRequired
};

const useDialogState = () => useContext(DialogContext);

export { useDialogState, DialogProvider };

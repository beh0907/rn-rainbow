import React, {createContext, useContext, useState} from 'react';
import PropTypes from "prop-types";

const SnackBarContext = createContext({})

const SnackBarProvider = ({children}) => {
    const [snackbar, setSnackbar] = useState({
        message: '',
        visible: false
    })

    return (
        <SnackBarContext.Provider value={[snackbar, setSnackbar]}>
            {children}
        </SnackBarContext.Provider>
    );
};

SnackBarProvider.propTypes = {
    children: PropTypes.node.isRequired
}

const useSnackBarState = () => useContext(SnackBarContext)

export {useSnackBarState, SnackBarProvider}

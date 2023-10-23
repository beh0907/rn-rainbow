import React, {createContext, useContext, useState} from 'react';
import PropTypes from "prop-types";

const MemoryContext = createContext({})

const MemoryProvider = ({children}) => {
    const [memory, setMemory] = useState({})
    return (
        <MemoryContext.Provider value={[memory, setMemory]}>
            {children}
        </MemoryContext.Provider>
    );
};

MemoryProvider.propTypes = {
    children: PropTypes.node.isRequired
}

const useMemoryState = () => useContext(MemoryContext)

export {useMemoryState, MemoryProvider}

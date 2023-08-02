import React, {createContext, useContext, useState} from 'react';
import PropTypes from "prop-types";

const RoomContext = createContext({})

const RoomProvider = ({children}) => {
    const [room, setRoom] = useState({})
    return (
        <RoomContext.Provider value={[room, setRoom]}>
            {children}
        </RoomContext.Provider>
    );
};

RoomProvider.propTypes = {
    children: PropTypes.node.isRequired
}

const useRoomState = () => useContext(RoomContext)

export {useRoomState, RoomProvider}

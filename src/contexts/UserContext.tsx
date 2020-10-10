import React, { createContext, useReducer } from 'react';
import { initialState, userReducer } from '../reducers/UserReducer';

export const UserContext = createContext({});

export default (props: any) => {
    const [state, dispatch] = useReducer(userReducer, initialState); 

    return (
        <UserContext.Provider value={{state, dispatch}} >
            {props.children}
        </UserContext.Provider>
    )
}
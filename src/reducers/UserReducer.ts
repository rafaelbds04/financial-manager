import { Reducer } from "react";

enum ActionType {
    SetName = 'setName',
    SetAvatar = 'setAvatar',
  }

export type Action = {
    type: ActionType,
    payload : {
        name?: string,
        avatar?: string
    }
}

export interface IState {
    name?: string,
    avatar?: string
}

export const initialState: IState = {
    name: '',
    avatar: ''
};

export const userReducer = (state: IState = initialState, action: Action) => {
    switch (action.type) {
        case ActionType.SetName:
            return { ...state, name: action.payload.name }
            break;
        case ActionType.SetAvatar:
            return { ...state, avatar: action.payload.avatar }
            break;
        default:
             throw new Error();;
    }
}
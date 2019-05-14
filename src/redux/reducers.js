import {START_APP, UPLOADING, UPLOADED, SEEK_URI, GET_RESULT } from './actionTypes';
import {combineReducers} from "redux";

const initialState = {
    progress: 'startApp'
};


function changeProgress(state = initialState, action) {
    switch (action.type) {
        case START_APP:
            return Object.assign({}, {
                progress: 'startApp'
            });
        case UPLOADING:
            return Object.assign({}, {
                progress: 'uploading'
            });
        case UPLOADED:
            return Object.assign({}, {
                progress: 'uploaded'
            });
        case SEEK_URI:
            return Object.assign({}, {
                progress: 'seekUri'
            });
        case GET_RESULT:
            return Object.assign({}, {
                progress: 'getResult'
            });
        default:
            return state
    }
}

const asrProto = combineReducers({ changeProgress });

export default asrProto;
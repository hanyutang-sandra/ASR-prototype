import {createStore} from "redux";
import asrProto from './reducers'

const store = createStore(asrProto);

store.subscribe(() => console.log(store.getState()));

export default store
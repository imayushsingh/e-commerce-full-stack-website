import { getProductsReducers } from "./Productsreducer";
import {combineReducers} from "redux";

//turns an object whose values are different reducing functions into a single reducing function you can pass to Store
const rootreducers = combineReducers({
    getproductsdata : getProductsReducers
});

export default rootreducers;
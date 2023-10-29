import { configureStore } from "@reduxjs/toolkit";
import sliceReducer from "./slice";

const store = configureStore({ reducer: { slice: sliceReducer } });

export default store;

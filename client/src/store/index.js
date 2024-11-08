import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { authSlice } from "@/features";

// configuration for Persistence
const PersistenConfig = {
    key: "sameer_cart",
    version: 1,
    storage,
};

// persist the slice
const persistStoreReducer = persistReducer(PersistenConfig, authSlice);

// create a root reducer
const rootReducer = combineReducers({
    auth: persistStoreReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

const storePeristor = persistStore(store);
export { store, storePeristor };

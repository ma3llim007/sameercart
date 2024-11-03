import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// configuration for Persistence
const PersistenConfig = {
    key: "admin_sameercart",
    version: 1,
    storage,
};

// persist the slice
const persistAdminReducer = persistReducer(PersistenConfig, authSlice);

// create a root reducer
const rootReducer = combineReducers({
    auth: persistAdminReducer,
});

const adminStore = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export const adminStorePeristor = persistStore(adminStore);
export default adminStore;

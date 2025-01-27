import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Slices
import authSlice from "@/features/admin/authSlice";
import cartSlice from "@/features/home/cartSlice";

// Persistence Configuration for auth
const authPersistenConfig = {
    key: "auth",
    version: 1,
    storage,
};

// Persistence Configuration for Cart
const cartPersistenConfig = {
    key: "cart",
    version: 1,
    storage,
};

// persist the slice
const persistedAuthReducer = persistReducer(authPersistenConfig, authSlice);
const persistedCartReducer = persistReducer(cartPersistenConfig, cartSlice);

// create a root reducer
const rootReducer = combineReducers({
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: false }),
});

const storePersistor = persistStore(store);

export { store, storePersistor };

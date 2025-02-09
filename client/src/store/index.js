import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

// Slices
import authSlice from "@/features/admin/authSlice";
import cartSlice from "@/features/home/cartSlice";
import wishlistSlice from "@/features/home/wishlistSlice";
import userAuthSlice from "@/features/home/userAuthSlice";

// Persistence Configuration for auth
const authPersistenConfig = {
    key: "auth",
    version: 1,
    storage: storageSession,
};

// Persistence Configuration for Cart
const cartPersistenConfig = {
    key: "cart",
    version: 1,
    storage,
};

// Persistence Configuration for wishlist
const wishListPersistenConfig = {
    key: "wishlist",
    version: 1,
    storage,
};

// Persistence Configuration for User Auth
const userAuthPersistenConfig = {
    key: "user",
    version: 1,
    storage: storageSession,
};

// persist the slice
const persistedAuthReducer = persistReducer(authPersistenConfig, authSlice);
const persistedCartReducer = persistReducer(cartPersistenConfig, cartSlice);
const persistedWishListReducer = persistReducer(wishListPersistenConfig, wishlistSlice);
const persistedUserAuthReducer = persistReducer(userAuthPersistenConfig, userAuthSlice);

// create a root reducer
const rootReducer = combineReducers({
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishListReducer,
    userAuth: persistedUserAuthReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

const storePersistor = persistStore(store);

export { store, storePersistor };

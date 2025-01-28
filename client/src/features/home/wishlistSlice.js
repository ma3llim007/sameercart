import toastService from "@/services/toastService";
import { createSlice } from "@reduxjs/toolkit";

const initialState = { wishlists: [] };

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addToWishList: (state, action) => {
            const { id, variantId } = action.payload;

            // Check if the item already exists in the cart
            const existingItemIndex = state.wishlists.find(item => item.id === id && (!variantId || item.variantId === variantId));

            if (existingItemIndex) {
                toastService.info("Product Is Already In Wishlist");
            } else {
                state.wishlists.push({ ...action.payload });
                toastService.success("Product Added To Wishlist");
            }
        },
        removeFromWishList: (state, action) => {
            const { itemId, variantId } = action.payload;
            state.wishlists = state.wishlists.filter(wishlist => wishlist.id !== itemId || (variantId && wishlist.variantId !== variantId));
            toastService.info("Product Is Remove From Wishlist");
        },
        clearWishList: state => {
            state.wishlists = [];
        },
    },
});

export const { addToWishList, clearWishList, removeFromWishList } = wishlistSlice.actions;

export default wishlistSlice.reducer;

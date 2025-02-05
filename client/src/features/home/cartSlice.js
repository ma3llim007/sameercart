import toastService from "@/services/toastService";
import { createSlice } from "@reduxjs/toolkit";

const initialState = { carts: [], totalCartPrice: 0 };

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { id, variantId, quantity, name } = action.payload;

            // Check if the item already exists in the cart
            const existingItemIndex = state.carts.findIndex(item => item.id === id && (!variantId || item.variantId === variantId));

            if (existingItemIndex !== -1) {
                state.carts[existingItemIndex].quantity += quantity;

                toastService.success(`Quantity Of ${name} Updated!`);
            } else {
                state.carts.push({ ...action.payload });
                toastService.success(`Product Added To Cart`);
            }

            // Recalculate totalCartPrice
            state.totalCartPrice = state.carts.reduce((total, item) => total + item.price * item.quantity, 0);
        },
        removeFromCart: (state, action) => {
            const { itemId, variantId } = action.payload;

            // Filter out the item to remove
            state.carts = state.carts.filter(cart => cart.id !== itemId || (variantId && cart.variantId !== variantId));

            // Recalculate totalCartPrice after removal
            state.totalCartPrice = state.carts.reduce((total, item) => total + item.price * item.quantity, 0);
            toastService.info(`Product Item Remove Successfully`);
        },
        incrementQuanity: (state, action) => {
            const { itemId, variantId } = action.payload;

            const item = state.carts.find(cart => cart.id === itemId && (!variantId || cart.variantId === variantId));
            if (item) {
                item.quantity += 1;

                // Recalculate totalCartPrice after removal
                state.totalCartPrice = state.carts.reduce((total, item) => total + item.price * item.quantity, 0);
                toastService.success(`Quantity Of ${item.name} Increased!`);
            } else {
                toastService.error("Item Not Found In The Cart.");
            }
        },
        decrementQuanity: (state, action) => {
            const { itemId, variantId } = action.payload;

            const item = state.carts.find(cart => cart.id === itemId && (!variantId || cart.variantId === variantId));
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;

                    // Recalculate totalCartPrice after removal
                    state.totalCartPrice = state.carts.reduce((total, item) => total + item.price * item.quantity, 0);

                    toastService.success(`Quantity Of ${item.name} Decreased!`);
                } else if (item.quantity === 1) {
                    state.carts = state.carts.filter(cart => cart.id !== itemId || (variantId && cart.variantId !== variantId));

                    // Recalculate totalCartPrice after removal
                    state.totalCartPrice = state.carts.reduce((total, item) => total + item.price * item.quantity, 0);

                    toastService.warning(`Product Removed From Cart!`);
                }
            } else {
                toastService.error("Item Not Found In The Cart.");
            }
        },
        clearCart: state => {
            state.carts = [];
            state.totalCartPrice = 0;
            toastService.info(`Cart Is Clear`);
        },
    },
});

export const { addToCart, removeFromCart, clearCart, incrementQuanity, decrementQuanity } = cartSlice.actions;

export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { set } from "date-fns";

const screenSlice = createSlice({
    name: "screen",
    initialState: {
        showScreen: true,
        onboarding: false,
        splash: false,
    },
    reducers: {
        setScreen: (state, action) => {
            state.showScreen = action.payload;

        },
        setOnboarding: (state, action) => {
            state.onboarding = action.payload;
        },
        setSplash: (state, action) => {
            state.splash = action.payload;
        }
    },
});

export const { setScreen, setOnboarding, setSplash } = screenSlice.actions;

export default screenSlice.reducer;

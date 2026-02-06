import { createSlice } from '@reduxjs/toolkit';

const themesSlice = createSlice({
  name: 'themes',
  initialState: {
    currentTheme: 'light',
    hide: false,
  },
  reducers: {
    setTheme(state, action) {
      state.currentTheme = action.payload;
    },
    setHide(state, action) {
      state.hide = action.payload;
    },
  },
});

export const { setTheme, setHide } = themesSlice.actions;
export default themesSlice.reducer;
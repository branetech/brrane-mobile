import {createSlice} from '@reduxjs/toolkit';

const intentSlice = createSlice({
  name: 'intent',
  initialState: {
    pendingIntent: null, // can be a function or can be null
    route: '',
    params: null,
    action: null
  },
  reducers: {
    setIntent(state, action) {
      state.pendingIntent = action.payload;
    },
    clearIntent(state) {
      state.pendingIntent = null;
    },
    setIntentState(state: any, action) {
      const payload = action?.payload
      if (typeof (payload) === 'object') {
        Object.keys(payload).forEach((key) => {
          state[key] = payload[key]
        })
      }
    },

  },
});

export const {setIntent, clearIntent, setIntentState,} = intentSlice.actions;
export default intentSlice.reducer;
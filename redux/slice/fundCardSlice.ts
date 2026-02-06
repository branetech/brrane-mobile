import {createSlice} from "@reduxjs/toolkit";

const fundCardSlice = createSlice({
	name: "screen",
	initialState: {
		values: '',
		amount: 0,
	},
	reducers: {
		setValues: (state, action) => {
			state.values = action.payload;
		},
		setAmount: (state, action) => {
			state.amount = action.payload;
		},
		
	},
});

export const {setValues, setAmount} = fundCardSlice.actions;

export default fundCardSlice.reducer;

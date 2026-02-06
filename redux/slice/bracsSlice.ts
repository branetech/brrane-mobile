import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BracState {
  details: any;
}

const initialState: BracState = {
  details: null,
};

const bracSlice = createSlice({
  name: "brac",
  initialState,
  reducers: {
    setBracDetails: (
      state,
      action: PayloadAction<{
        quantity: any;
        currentPrice: number;
        allCharges: any;
        remaining: number;
        tickerSymbol: string;
        purchasableQuantity: any;
        stockName: string;
        brokerageFee: any;
        consideration: any;
        secFee: any;
        stampDuty: any;
        tradeAlert: any;
        vatTradeAlert: any;
        brokerCommission: any;
        vatOnBrokerCommission: any;
        isPurchase: boolean;
        setRender?: any;
        currentBalance?: number;
      }>
    ) => {
      state.details = action.payload;
    },
  },
});

export const { setBracDetails } = bracSlice.actions;
export default bracSlice.reducer;

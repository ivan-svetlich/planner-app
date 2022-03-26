import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MessageState {
  content: string | null;
}

const initialState: MessageState = {
  content: null,
};

export const messageSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    clearMessage: (state) => {
      state.content = null;
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;

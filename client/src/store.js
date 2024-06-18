import { configureStore } from '@reduxjs/toolkit';
import readerSlice from "./features/readerSlice";
import bookSlice from "./features/bookSlice";
import librarySlice from "./features/librarySlice";
import vocabSlice from "./features/vocabSlice";
import reviewSlice from "./features/reviewSlice";
import statSlice from "./features/statSlice";

export const store = configureStore({
    reducer: {
        reader: readerSlice,
        book: bookSlice,
        library: librarySlice,
        vocab: vocabSlice,
        review: reviewSlice,
        stat: statSlice
    },
});
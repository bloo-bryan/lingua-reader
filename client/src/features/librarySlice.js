import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {toast} from "react-toastify";

const initialState = {
    isLoading: true,
    books: [],
    currentBook: {},
    currentSections: [],
    selectedSection: '',
    currentText: [],
    language: 'en'
}

export const fetchBooks = createAsyncThunk('library/fetchBooks', async(_, thunkAPI) => {
    try {
        const {language} = thunkAPI.getState().library;
        thunkAPI.dispatch(setIsLoading(true));
        const res = await axios.get(`/books/${language}`);
        return res.data;
    } catch(error) {
        thunkAPI.rejectWithValue(error.message);
    }
})

export const fetchSections = createAsyncThunk('library/fetchSections', async(_, thunkAPI) => {
    try {
        thunkAPI.dispatch(setIsLoading(true));
        const {currentBook} = thunkAPI.getState().library;
        const bookId = [currentBook['book_id']];
        const res = await axios.get(`/sections/${bookId}`);
        return res.data;
    } catch(error) {
        thunkAPI.rejectWithValue(error.message);
    }
})

export const fetchText = createAsyncThunk('library/fetchText', async(_, thunkAPI) => {
    try {
        thunkAPI.dispatch(setIsLoading(true));
        const {selectedSection} = thunkAPI.getState().library;
        const res = await axios.get(`/text/${selectedSection}`)
        return res.data;
    } catch(error) {
        thunkAPI.rejectWithValue(error.message)
    }
})

const librarySlice = createSlice({
    name: 'library',
    initialState,
    reducers: {
        setIsLoading: (state, {payload}) => {
            state.isLoading = payload;
        },
        setCurrentBook: (state, {payload}) => {
            state.currentBook = payload;
        },
        setSelectedSection: (state, {payload}) => {
            state.selectedSection = payload;
        },
        setLang: (state, {payload}) => {
            state.language = payload;
        },
        clearValues: (state) => {
            state.currentText = [];
        },
    },
    extraReducers: {
        [fetchBooks.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchBooks.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.books = payload;
        },
        [fetchBooks.rejected]: (state, {payload}) => {
            state.isLoading = false;
            //state.error = payload;
        },
        [fetchSections.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchSections.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.currentSections = payload;
        },
        [fetchSections.rejected]: (state, {payload}) => {
            state.isLoading = false;
            //state.error = payload;
        },
        [fetchText.pending]: (state) => {
            state.isLoading = true;
            toast.info('Highlight any words you don\'t understand to perform lookup', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            // state.currentText = [];
        },
        [fetchText.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.currentText = payload;
        },
        [fetchText.rejected]: (state, {payload}) => {
            state.isLoading = false;
            toast.error(`Something went wrong! ${payload}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            //state.error = payload;
        }
    }
})

export const {setIsLoading, setCurrentBook, setSelectedSection, setLang, clearValues} = librarySlice.actions;
export default librarySlice.reducer;
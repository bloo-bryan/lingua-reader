import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialFilterState = {
    search: '',
    language: 'all',
    pos: 'all',    //order of multiple pos
    status: 'all',
    sort: 'latest',
}

const initialState = {
    isLoading: true,
    allLearningWords: [],
    allLearning: [],
    allFlashcardImgs: [],
    filteredVocab: [],
    ...initialFilterState
}

export const fetchAllLearningWords = createAsyncThunk('vocab/fetchAllLearningWords', async(_, thunkAPI) => {
    try {
        const {language} = thunkAPI.getState().library;
        const res = await axios.get(`/all-learning-words/${language}`);
        return res.data.map(item => item['flashcard_word']);
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const fetchAllLearning = createAsyncThunk('vocab/fetchAllLearning', async(_, thunkAPI) => {
    try {
        const res = await axios.get('/all-learning')
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const fetchAllFlashcardImgs = createAsyncThunk('vocab/fetchAllFlashcardImgs', async(_, thunkAPI) => {
    try {
        const res = await axios.get('/all-flashcard-imgs')
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

const vocabSlice = createSlice({
    name: 'vocab',
    initialState,
    reducers: {
        setAllLearningWords: (state, {payload}) => {
            state.allLearningWords = [...state.allLearningWords, payload];
        },
        handleChange: (state, { payload: { name, value } }) => {
            state[name] = value;
        },
        setSearch: (state, {payload}) => {
            state.search = payload;
        },
        filterVocab: (state) => {
            const {search, language, pos, status, allLearning} = state;
            let tempVocab = [...allLearning];
            if(search) {
                tempVocab = tempVocab.filter((vocab) => {
                    return vocab['flashcard_word'].toLowerCase().startsWith(search.toLowerCase())
                })
            }
            if(language !== 'all') {
                tempVocab = tempVocab.filter((vocab) => {
                    return vocab['flashcard_lang'] === language;
                })
            }
            if(pos !== 'all') {
                tempVocab = tempVocab.filter((vocab) => {
                    return vocab['flashcard_pos']?.includes(pos);
                })
            }
            if(status !== 'all') {
                tempVocab = tempVocab.filter((vocab) => {
                    return vocab['status'] === status;
                })
            }
            return {...state, filteredVocab: tempVocab};
        },
        sortVocab: (state) => {
            let tempVocab = [...state.filteredVocab]
            if (state.sort === 'oldest') {
                tempVocab = tempVocab.sort((a, b) => {
                    if (a['flashcard_id'] < b['flashcard_id']) {
                        return -1
                    }
                    if (a['flashcard_id'] > b['flashcard_id']) {
                        return 1
                    }
                    return 0
                })
            }
            if (state.sort === 'latest') {
                tempVocab = tempVocab.sort((a, b) => b['flashcard_id'] - a['flashcard_id'])
            }
            if (state.sort === 'a-z') {
                tempVocab = tempVocab.sort((a, b) => {
                    return a['flashcard_word'].localeCompare(b['flashcard_word'])
                })
            }
            if (state.sort === 'z-a') {
                tempVocab = tempVocab.sort((a, b) => {
                    return b['flashcard_word'].localeCompare(a['flashcard_word'])
                })
            }
            return { ...state, filteredVocab: tempVocab }
        },
        clearFilters: (state) => {
            return { ...state, ...initialFilterState };
        },
        clearValues: () => {
            return {...initialState};
        }
    },
    extraReducers: {
        [fetchAllLearningWords.fulfilled]: (state, {payload}) => {
            state.allLearningWords = payload;
        },
        [fetchAllLearning.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchAllLearning.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.allLearning = payload;
        },
        [fetchAllLearning.rejected]: (state, {payload}) => {
            state.isLoading = false;
            console.log(payload);
        },
        [fetchAllFlashcardImgs.fulfilled]: (state, {payload}) => {
            state.allFlashcardImgs = payload;
        }
    }
})

export const {setAllLearningWords, handleChange, setSearch, sortVocab, clearFilters, clearValues, filterVocab} = vocabSlice.actions;
export default vocabSlice.reducer;
import {createSlice} from "@reduxjs/toolkit";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toast} from "react-toastify";

const initialState = {
    highlighted: '',
    currentWord: '',
    currentPOS: '',
    currentDefinitions: [],
    savedDefinitions: [],
    definitionsNotFound: false,
    translationLoading: true,
    translateFrom: '',
    translateTo: '',
    targetLang: 'zh',
    dictSearchTerm: '',
    imagesLoading: true,
    currentImages: [],
    currentSentence: '',
    currentLemma: '',
    currentAudio: '',
    currentFlashcardId: '',
    readerFlashcard: {}
};

export const getAllDefinitions = createAsyncThunk('reader/getAllDefinitions', async(num = 0, thunkAPI) => {
    const {highlighted, currentLemma} = thunkAPI.getState().reader;
    const {language} = thunkAPI.getState().library;
    try {
        if(num === 0) {
            const res = await axios.get(`/dict/${highlighted}/${language}`);
            return res.data;
        } else {
            const res = await axios.get(`/dict/${currentLemma}/${language}`);
            return res.data;
        }
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const getTranslation = createAsyncThunk('reader/getTranslation', async(_, thunkAPI) => {
    const {translateFrom, targetLang} = thunkAPI.getState().reader;
    thunkAPI.dispatch(setTranslationLoading());
    try {
        const res = await axios.get(`/translate/${translateFrom}/${targetLang}`);
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const getImages = createAsyncThunk('reader/getImages', async(_, thunkAPI) => {
    const {highlighted} = thunkAPI.getState().reader;
    try {
        const res = await axios.get(`/images/${highlighted}`);
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const getLemma = createAsyncThunk('reader/getLemma', async(_, thunkAPI) => {
    const {translateFrom, currentSentence} = thunkAPI.getState().reader;
    try {
        const res = await axios.get(`/lemmatize/${translateFrom}/${currentSentence}`)  // will '/' in sentence cause bug? test.
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const getAudio = createAsyncThunk('reader/getAudio', async(num = 0, thunkAPI) => {
    const {highlighted, currentLemma} = thunkAPI.getState().reader;
    const {language} = thunkAPI.getState().library;
    try {
        if(num === 0) {
            const res = await axios.get(`/audio/${highlighted}/${language}`);
            return res.data;
        } else {
            const res = await axios.get(`/audio/${currentLemma}/${language}`);
            return res.data;
        }
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const createFlashcard = createAsyncThunk('reader/createFlashcard', async(_, thunkAPI) => {
    const {currentWord, translateFrom, currentLemma, currentSentence} = thunkAPI.getState().reader;
    const {language} = thunkAPI.getState().library;
    try {
        const word = currentWord || translateFrom;
        const res = await axios.post('/flashcard', {word, currentLemma, currentSentence, language})
        if(res.data.insertId === 0) {
            const newRes = await axios.get(`/find-flashcard/${word}/${language}`);
            return newRes.data[0]['flashcard_id'];
        }
        return res.data.insertId;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const addFlashcardDef = createAsyncThunk('reader/addFlashcardDef', async(def, thunkAPI) => {
    const {currentFlashcardId} = thunkAPI.getState().reader;
    try {
        const res = await axios.post('/flashcard-def', {...def, currentFlashcardId});
        return res.data;
    } catch(error){
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const checkDefExists = createAsyncThunk('reader/checkDefExists', async(def, thunkAPI) => {
    const {currentWord, translateFrom} = thunkAPI.getState().reader;
    const {language} = thunkAPI.getState().library;
    try {
        const word = currentWord || translateFrom;
        const res = await axios.get(`/find-flashcard/${word}/${language}`);
        if(res.data.length !== 0) {
            const id = res.data[0]['flashcard_id'];
            const defRes = await axios.get(`/get-flashcard-defs/${id}`);
            const defArr = defRes.data.map(item => item['flashcard_def']);
            return defArr.includes(def);
        }
        return false;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const addFlashcardImage = createAsyncThunk('reader/addFlashcardImage', async(img, thunkAPI) => {
    const {currentFlashcardId} = thunkAPI.getState().reader;
    try {
        const res = await axios.post('/flashcard-img', {img, currentFlashcardId});
        return res.data;
    } catch(error){
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const checkImgExists = createAsyncThunk('reader/checkImgStatus', async(img, thunkAPI) => {
    const {currentWord, translateFrom} = thunkAPI.getState().reader;
    const {language} = thunkAPI.getState().library;
    try {
        const word = currentWord || translateFrom;
        const res = await axios.get(`/find-flashcard/${word}/${language}`);
        if(res.data.length !== 0) {
            const id = res.data[0]['flashcard_id'];
            const imgRes = await axios.get(`/get-flashcard-imgs/${id}`);
            const imgArr = imgRes.data.map(item => item['flashcard_image']);
            return imgArr.includes(img);
        }
        return false;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const fetchReaderFlashcard = createAsyncThunk('reader/fetchReaderFlashcard', async(term, thunkAPI) => {
    try {
        const {language} = thunkAPI.getState().library;
        const res = await axios.get(`/reader-flashcard/${term}/${language}`)
        if(res.data.length !== 0) {
            const defs = [...new Set(res.data.map(item => item['flashcard_def']).filter(item => item !== null))];
            const imgs = [...new Set(res.data.map(item => item['flashcard_image']).filter(item => item !== null))];
            const pos = [...new Set(res.data.map(item => item['flashcard_pos']).filter(item => item !== null))];
            return {
                id: res.data[0]['flashcard_id'],
                word: res.data[0]['flashcard_word'],
                status: res.data[0]['status'],
                defs,
                imgs,
                pos
            }
        }
        return {}
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

const readerSlice = createSlice({
    name: 'reader',
    initialState,
    reducers: {
        setHighlighted: (state, {payload}) => {
            state.highlighted = payload;
        },
        setDefinitionsNotFound: (state, {payload}) => {
            state.definitionsNotFound = payload;
        },
        setTargetLang: (state, {payload}) => {
            state.targetLang = payload;
        },
        setTranslationLoading: (state, {payload}) => {
            state.translationLoading = true;
        },
        setTranslateFrom: (state, {payload}) => {
            state.translateFrom = payload;
        },
        setTranslateTo: (state, {payload}) => {
            state.translateTo = payload;
        },
        setDictSearchTerm: (state, {payload}) => {
            state.dictSearchTerm = payload;
        },
        setCurrentSentence: (state, {payload}) => {
            state.currentSentence = payload;
        },
        clearValues: () => {
            return {...initialState};
        }
    },
    extraReducers: {
        [getAllDefinitions.pending]: (state) => {
            state.isLoading = true;
        },
        [getAllDefinitions.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            if(payload.length > 0) {
                state.definitionsNotFound = false;
                state.currentWord = payload[0].word;
                state.currentDefinitions = payload;
                state.currentPOS = [...new Set(payload.map(item => item.pos))].join("/");
                console.log(state.currentDefinitions, state.currentWord)
            } else {
                state.currentWord = '';
                state.definitionsNotFound = true;
                toast.info('No definitions found!', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                // notify cant find word
            }
        },
        [getAllDefinitions.rejected]: (state, {payload}) => {
            state.isLoading = false;
            state.definitionsNotFound = true;
            console.log(payload)
        },
        [getTranslation.pending]: (state) => {
            state.translationLoading = true;
        },
        [getTranslation.fulfilled]: (state, {payload}) => {
            state.translationLoading = false;
            state.translateTo = payload;
        },
        [getTranslation.rejected]: (state, {payload}) => {
            state.translationLoading = true;
            console.log(payload);
        },
        [getImages.pending]: (state) => {
            state.imagesLoading = true;
        },
        [getImages.fulfilled]: (state, {payload}) => {
            if(payload.length > 0) state.imagesLoading = false;
            else toast.info('No images found!', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            state.currentImages = payload;
        },
        [getImages.rejected]: (state, {payload}) => {
            state.imagesLoading = true;
            console.log(payload);
        },
        [getLemma.fulfilled]: (state, {payload}) => {
            state.currentLemma = payload;
        },
        [getLemma.rejected]: (state, {payload}) => {
            state.currentLemma = '';
            console.log(payload);
        },
        [getAudio.fulfilled]: (state, {payload}) => {
            if(payload.length !== 0) {
                state.currentAudio = payload[0]['audio_url'];
            } else {
                state.currentAudio = state.highlighted;
            }
        },
        [getAudio.rejected]: (state, {payload}) => {
            state.currentAudio = state.highlighted;
            console.log(payload);
        },
        [createFlashcard.fulfilled]: (state, {payload}) => {
            state.currentFlashcardId = payload;
        },
        [createFlashcard.rejected]: (state, {payload}) => {
            console.log(payload);
        },
        [fetchReaderFlashcard.fulfilled]: (state, {payload}) => {
            state.readerFlashcard = payload;
        },
    }

})

export const {showLoading, hideLoading, setHighlighted, setDefinitionsNotFound, setTargetLang, setTranslateFrom, setTranslateTo, setTranslationLoading, setDictSearchTerm, setCurrentSentence, clearValues} = readerSlice.actions;
export default readerSlice.reducer;

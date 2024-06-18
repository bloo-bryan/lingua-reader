import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

const initialState = {
    isLoading: false,
    file: '',
    bookDetails: {
        language: 'en',
        itemType: 'new',
        itemTitle: '',
        itemDesc: 'None',
        itemAuthor: 'Anonymous',
        coverUrl: '',
        text: []
    },
    error: ''
}

export const getParsedEpub = createAsyncThunk('book/getParsedEpub', async(file, thunkAPI) => {
    try {
        const {bookDetails: {language}} = thunkAPI.getState().book;
        thunkAPI.dispatch(setIsLoading(true));
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post('/epub', formData);
        const sections =  res.data.sections;
        let newObj = {};
        for(let section of sections) {
            newObj[section.id] = parseHTMLString(section.htmlString, language);
        }
        thunkAPI.dispatch(setText(newObj))
        thunkAPI.dispatch(insertDatabase());
    } catch(error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const getParsedHTML = createAsyncThunk('book/getParsedHTML', async(file, thunkAPI) => {
    try {
        const {bookDetails: {language}} = thunkAPI.getState().book;
        thunkAPI.dispatch(setIsLoading(true));
        const reader = new FileReader();
        reader.onload = function(e) {
            // Render the supplied file
            const str = parseHTMLString(e.target.result, language);
            thunkAPI.dispatch(setText(str));
        };
        // Read in the HTML file.
        reader.readAsText(file);
        thunkAPI.dispatch(insertDatabase());
    } catch(error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const getParsedTxt = createAsyncThunk('book/getParsedTxt', async(file, thunkAPI) => {
    try {
        const {bookDetails: {language}} = thunkAPI.getState().book;
        thunkAPI.dispatch(setIsLoading(true));
        const reader = new FileReader();
        reader.onload = function(e) {
            const sentences = sentenceTokenizer(e.target.result, language);
            let arr = [];
            for(let sentence of sentences) {
                arr.push(sentence);
                arr.push("\n");
            }
            thunkAPI.dispatch(setText(arr));
        }
        reader.readAsText(file);
        thunkAPI.dispatch(insertDatabase());
    } catch(error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const getParsedPDF = createAsyncThunk('book/getParsedPDF', async(file, thunkAPI) => {
    try {
        const {bookDetails: {language}} = thunkAPI.getState().book;
        thunkAPI.dispatch(setIsLoading(true));
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post('/pdf', formData);
        if(res.status === 417) {    // if docx conversion failed on backend, receive partially parsed PDF and continue parsing
            thunkAPI.dispatch(setText(basicPDFParse2(res.data, language)));
        } else if(res.status === 200) {
            const parsedArr = parseHTMLString(res.data, language);
            if(typeof parsedArr !== 'undefined' && parsedArr.length > 0) {  // check if converted docx is corrupted
                thunkAPI.dispatch(setText(parsedArr));
            } else {    // if the converted docx is corrupted, then parse the original pdf as usual
                const result = await axios.post('/pdf-fallback', formData)
                thunkAPI.dispatch(setText(basicPDFParse2(result.data, language)));
            }
        }
        thunkAPI.dispatch(insertDatabase());
    } catch(error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const getParsedDocx = createAsyncThunk('book/getParsedDocx', async(file, thunkAPI) => {
    try {
        const {bookDetails: {language}} = thunkAPI.getState().book;
        thunkAPI.dispatch(setIsLoading(true));
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post('/docx', formData);
        thunkAPI.dispatch(setText(parseHTMLString(res.data, language)));
        thunkAPI.dispatch(insertDatabase());
    } catch(error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const parseManualText = createAsyncThunk('book/parseManualText', async(obj, thunkAPI) => {
    try {
        const {bookDetails: {language}} = thunkAPI.getState().book;
        thunkAPI.dispatch(setIsLoading(true));
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            newObj[value.title] = sentenceTokenizer(value.body, language);
        }
        thunkAPI.dispatch(setText(newObj));
        thunkAPI.dispatch(insertDatabase());
    } catch(error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const insertDatabase = createAsyncThunk('book/insertDatabase', async(_, thunkAPI) => {
    try {
        thunkAPI.dispatch(setDateAdded(moment().format('YYYY-MM-DD')));
        const {bookDetails} = thunkAPI.getState().book;
        const {itemTitle, itemAuthor, itemDesc, language, coverUrl, dateAdded} = bookDetails;
        const {text} = bookDetails;
        let sectionName;
        Array.isArray(text) ? sectionName = 'Whole' : sectionName = Object.keys(text);
        const resBook = await axios.post(`/book`, {itemTitle, itemAuthor, itemDesc, language, coverUrl, dateAdded});
        const bookId = resBook.data.insertId;
        const resSection = await axios.post(`/section`, {sectionName, bookId});
        const sectionId = resSection.data.insertId;
        const rows = resSection.data.affectedRows;
        let responses = [];
        let index = 0;
        for(let i = sectionId; i < sectionId + rows; i++) {
            if(Array.isArray(text)) {
                const resSentence = await axios.post(`/sentence`, {i, text});
                return resSentence.data;
            }
            let sectionArr = Object.values(text)[index++];
            const resSentence = await axios.post('/sentence', {i, sectionArr});
            responses.push(resSentence);
        }
        return responses;
    } catch(error) {
        thunkAPI.dispatch(setError(error.message));
        console.log(error)
    }
})

function basicPDFParse2(data, language) {
    const str = data.split(" ")
        .map(word => word.trim())
        .filter(word => word !== "")
        .join(" ");
    const sentences = sentenceTokenizer(str, language);
    let arr = [];
    for(let element of sentences) {
        arr.push(element);
        arr.push("\n");
    }
    return arr
}

function stripHtml(html) {
    let textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    let temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = textarea.value;
    const arr = [];
    for(let i = 0; i < temporalDivElement.childNodes.length; i++) {
        let node = temporalDivElement.childNodes[i];
        if(node.nodeName === "P" || node.nodeName === "DIV" || node.nodeName === "H1" || node.nodeName === "H2" ||
            node.nodeName === "H3" || node.nodeName === "H4" || node.nodeName === "H5" || node.nodeName === "H6") {
            arr.push(node.textContent.replaceAll("\n", " "));
        }
        if(node.nodeName === "BR") arr.push(node.nodeName);
    }
    return arr;
}

function sentenceTokenizer(text, lang) {
    if(lang === 'zh' || lang === 'jp') {
        return text.match(/[^!?。\.\!\?]+[!?。\.\!\?]?/g);
    }
    return text.match(/[^.!?\s][^.!?\n]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g);
}

function parseHTMLString(htmlStr, language) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, "text/html");
    const allElements = doc.querySelectorAll("p, div, h1, h2, h3, h4, h5, h6");
    for (const element of allElements) {
        const br = document.createElement("br");
        element.insertAdjacentElement("afterEnd", br);
    }
    let paragraphs = stripHtml(doc.documentElement.innerHTML);
    let newArr = [];
    for(let paragraph of paragraphs) {
        if(paragraph !== "BR") {
            newArr.push(sentenceTokenizer(paragraph, language));
        } else {
            newArr.push("\n");
        }
    }
    return newArr.flat();
}

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setIsLoading: (state, {payload}) => {
            state.isLoading = payload;
        },
        setText: (state, {payload}) => {
            state.bookDetails.text = payload;
        },
        setBookDetails: (state, {payload}) => {
            const {name, value} = payload;
            state.bookDetails = {...state.bookDetails, [name]: value};
        },
        setDateAdded: (state, {payload}) => {
            state.bookDetails.dateAdded = payload;
        },
        setError: (state, {payload}) => {
            state.error = payload;
        },
        clearValues: () => {
            return {...initialState}
        }
    },
    extraReducers: {
        [getParsedEpub.pending]: (state) => {
            state.isLoading = true;
        },
        [getParsedEpub.rejected]: (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
            console.log(payload);
        },
        [getParsedDocx.pending]: (state) => {
            state.isLoading = true;
        },
        [getParsedDocx.rejected]: (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
            console.log(payload);
        },
        [getParsedPDF.pending]: (state) => {
            state.isLoading = true;
        },
        [getParsedPDF.rejected]: (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
            console.log(payload);
        },
        [getParsedTxt.pending]: (state) => {
            state.isLoading = true;
        },
        [getParsedTxt.rejected]: (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
            console.log(payload);
        },
        [getParsedHTML.pending]: (state) => {
            state.isLoading = true;
        },
        [getParsedHTML.rejected]: (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
            console.log(payload);
        },
        [parseManualText.pending]: (state) => {
            state.isLoading = true;
        },
        [parseManualText.rejected]: (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
            console.log(payload);
        },
        [insertDatabase.pending]: (state) => {
            state.isLoading = true;
        },
        [insertDatabase.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            console.log(payload);
        },
        [insertDatabase.rejected]: (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
         }
    }
})

export const {setText, setIsLoading, setBookDetails, setError, clearValues, setDateAdded} = bookSlice.actions;
export default bookSlice.reducer;

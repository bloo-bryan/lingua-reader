import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    toReview: [],
    isLoading: false,
}

export const fetchReviews = createAsyncThunk('review/fetchReviews', async(_, thunkAPI) => {
    try {
        const resReviews = await axios.get('/due-reviews')
        const values = Object.values(resReviews.data).map(value => value['flashcard_id']);
        const resReviewImgs = await axios.get('/due-images', {
            params: {
                values: values
            }
        })
        const resReviewDefs = await axios.get('/due-definitions', {
            params: {
                values: values
            }
        })
        return resReviews.data.map((review) => {
            for(let reviewImg of resReviewImgs.data) {
                if(review['flashcard_id'] === reviewImg['flashcard_id']) {
                    if(review.hasOwnProperty('flashcard_imgs'))
                        review['flashcard_imgs'].push(reviewImg['flashcard_image']);
                    else review['flashcard_imgs'] = [reviewImg['flashcard_image']];
                }
            }
            for(let reviewDef of resReviewDefs.data) {
                if(review['flashcard_id'] === reviewDef['flashcard_id']) {
                    const pos = reviewDef['flashcard_pos'];
                    if(review.hasOwnProperty('flashcard_pos'))
                        review['flashcard_pos'].push(pos);
                    else review['flashcard_pos'] = [pos];
                    if(review.hasOwnProperty('flashcard_defs'))
                        review['flashcard_defs'].push(`(${pos}) ${reviewDef['flashcard_def']}`);
                    else review['flashcard_defs'] = [`(${pos}) ${reviewDef['flashcard_def']}`];
                }
            }
            return review;
        })
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const updateReview = createAsyncThunk('review/updateReview', async(data, thunkAPI) => {
    try {
        const {id, content} = data;
        const response = await axios.put(`/update-review/${id}`, content)
        return response.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

export const insertReview = createAsyncThunk('review/insertReview', async(data, thunkAPI) => {
    try {
        const {flashcard_id, interval, repetition, efactor, dueDate, prevRep, status} = data;
        const res = await axios.post(`/add-review`, {flashcard_id, interval, repetition, efactor, dueDate, prevRep, status})
        const resUpdate = await axios.put(`/update-flashcard/${flashcard_id}`, {status});
        return res.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        clearValues: () => {
            return {...initialState};
        }
    },
    extraReducers: {
        [fetchReviews.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchReviews.fulfilled]: (state, {payload}) => {
            state.isLoading = false;
            state.toReview = payload;
        },
    }
})

export const {clearValues} = reviewSlice.actions;
export default reviewSlice.reducer;
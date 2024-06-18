import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    duration: 31,
    answerButton: [],
    reviewTime: [],
    reviewCount: [],
    intervals: [],
    hourlyBreakdown: [],
    cardCount: [],
    totalMinutes: 0,
    totalDays: 0,
    totalReviews: 0,
    averageInterval: 0,
    maxInterval: 0,
    correctButtons: []
}

export const fetchStatistics = createAsyncThunk('stat/fetchStatistics', async(duration, thunkAPI) => {
    try {
        const {duration} = thunkAPI.getState().stat;
        let obj = {};
        const intervalValues = Array.from({ length: duration }, (_, i) => i);
        const resAnsBtn = await axios.get('/answer-buttons');
        const updatedResAnsBtn = resAnsBtn.data.reduce((acc, curr) => {
            const summary = acc.find(s => s.status === curr.status);
            if (summary) {
                if (summary[curr.review_quality]) {
                    summary[curr.review_quality] += curr.num_rows;
                } else {
                    summary[curr.review_quality] = curr.num_rows;
                }
            } else {
                acc.push({
                    status: curr.status,
                    [curr.review_quality]: curr.num_rows
                });
            }
            return acc;
        }, []);
        if(Array.isArray(updatedResAnsBtn)) obj['answerButton'] = updatedResAnsBtn;
        else obj['answerButton'] = [updatedResAnsBtn];

        const resReviewTime = await axios.get(`/review-time/${duration}`);
        obj['reviewTime'] = resReviewTime.data.reduce((acc, curr) => {
            const summary = acc.find(s => s.interval === curr.interval);
            if (summary) {
                summary[curr.status] = (summary[curr.status] || 0) + curr.minutes;
            } else {
                intervalValues.forEach(v => {
                    if (v === curr.interval) {
                        acc.push({
                            interval: v,
                            [curr.status]: curr.minutes
                        });
                    } else {
                        acc.push({ interval: v });
                    }
                });
            }
            return acc;
        }, []);

        const resReviewCount = await axios.get(`/review-count/${duration}`);
        obj['reviewCount'] = resReviewCount.data.reduce((acc, curr) => {
            const summary = acc.find(s => s.interval === curr.interval);
            if (summary) {
                summary[curr.status] = (summary[curr.status] || 0) + curr.sum;
            } else {
                intervalValues.forEach(v => {
                    if (v === curr.interval) {
                        acc.push({
                            interval: v,
                            [curr.status]: curr.sum
                        });
                    } else {
                        acc.push({ interval: v });
                    }
                });
            }
            return acc;
        }, []);

        const resIntervals = await axios.get(`/intervals/${duration}`);
        obj['intervals'] = intervalValues.reduce((acc, curr) => {
            const summary = resIntervals.data.find(s => s.interval === curr);
            if (summary) {
                acc.push(summary);
            } else {
                acc.push({ interval: curr });
            }
            return acc;
        }, []);

        const resHourly = await axios.get('/hourly-breakdown');
        const hourValues = Array.from({ length: 24 }, (_, i) => i);
        obj['hourlyBreakdown'] = hourValues.reduce((acc, curr) => {
            const summary = resHourly.data.find(s => s.hour === curr);
            if (summary) {
                acc.push(summary);
            } else {
                acc.push({ hour: curr });
            }
            return acc;
        }, []);

        const resCorrectButtons = await axios.get('/correct-buttons');
        obj['correctButtons'] = resCorrectButtons.data;

        const resCardCount = await axios.get('/card-count');
        obj['cardCount'] = resCardCount.data;

        const resTotalMins = await axios.get(`/total-minutes/${duration}`);
        obj['totalMinutes'] = resTotalMins.data[0]['minutes'];

        const resTotalDays = await axios.get(`/total-days/${duration}`);
        obj['totalDays'] = resTotalDays.data[0]['days'];

        const resTotalReviews = await axios.get(`/total-reviews/${duration}`);
        obj['totalReviews'] = resTotalReviews.data[0]['reviews'];

        const resAverageInterval = await axios.get('/average-interval');
        obj['averageInterval'] = resAverageInterval.data[0]['interval'];

        const resMaxInterval = await axios.get('/max-interval');
        obj['maxInterval'] = resMaxInterval.data[0]['max_interval'];

        return obj;
    } catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
})

const statSlice = createSlice({
    name: 'stat',
    initialState,
    reducers: {
        setDuration: (state, {payload}) => {
            state.duration = parseInt(payload)
        },
        clearValues: () => {
            return {...initialState}
        }
    },
    extraReducers: {
        [fetchStatistics.fulfilled]: (state, {payload}) => {
            state.answerButton = payload['answerButton'];
            state.reviewTime = payload['reviewTime'];
            state.reviewCount = payload['reviewCount'];
            state.intervals = payload['intervals'];
            state.hourlyBreakdown = payload['hourlyBreakdown'];
            state.cardCount = payload['cardCount'];
            state.correctButtons = payload['correctButtons'];
            state.totalMinutes = payload['totalMinutes'];
            state.totalDays = payload['totalDays'];
            state.totalReviews = payload['totalReviews'];
            state.averageInterval = payload['averageInterval'];
            state.maxInterval = payload['maxInterval'];
        }
    }
})

export const {clearValues, setDuration} = statSlice.actions;
export default statSlice.reducer;
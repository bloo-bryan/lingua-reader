import * as React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {SimplePieChart, SimpleBarChart, StackedBarChart} from "./index";
import {useDispatch, useSelector} from "react-redux";
import Typography from "@mui/material/Typography";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import {useState} from "react";
import {setDuration} from "../features/statSlice";


const Wrapper = styled.section`
  background: #252C7B;
  .chart-grid {
    height: 35rem;
  }
  .header-grid {
    height: 10rem;
  }
`;

const Item = styled(Paper)(() => ({
    textAlign: 'center',
    height: '35rem',
    paddingTop: '1rem'
}));

const HeaderItem = styled(Paper)(() => ({
    textAlign: 'center',
    height: '10rem',
    paddingTop: '1rem'
}));

const ChartsContainer = () => {
    const {duration, answerButton, reviewTime, reviewCount, intervals, hourlyBreakdown, cardCount, totalMinutes, totalDays, totalReviews, averageInterval, maxInterval, correctButtons} =
        useSelector((state) => state.stat);
    const dispatch = useDispatch();
    const avgAnswerSec = ((totalMinutes/totalDays*60)/(totalReviews/totalDays)).toFixed(1);
    const avgMinutesStudied = (totalMinutes/totalDays).toFixed(1);
    const avgReviewsStudied = Math.ceil(totalReviews/totalDays);

    const handleRadioChange = (e) => {
        dispatch(setDuration(e.target.value));
    }

    return (
        <Wrapper>
            <Box sx={{ marginLeft: '5rem', flexGrow: 1 }}>
                <Grid container sx={{paddingTop: '2rem', paddingBottom: '2rem', paddingRight: '2rem', rowGap: '2rem'}} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} className='header-grid'>
                        <HeaderItem>
                            <Typography variant='h5' sx={{fontWeight: '700', marginY: '1rem'}}>Progress Tracker</Typography>
                            <FormControl>
                                <FormLabel id="filter-by">Filter by duration</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="filter-by"
                                    name="filter-by-radio"
                                    value={duration}
                                    onChange={handleRadioChange}>
                                    <FormControlLabel value={31} control={<Radio />} label="1 month" />
                                    <FormControlLabel value={90} control={<Radio />} label="3 months" />
                                </RadioGroup>
                            </FormControl>
                        </HeaderItem>

                    </Grid>
                    <Grid item xs={12} className='chart-grid'>
                        <Item>
                            <Typography variant="h4">Answer Buttons</Typography>
                            <Typography variant="subtitle1">The number of times you have pressed each grade button.</Typography>
                            <SimpleBarChart data={answerButton} type={"answerButton"}/>
                            <Typography variant="subtitle1">
                                {correctButtons.map((item, index) => {
                                    return `${index ? ' ----- ': ''}` + `Correct (${item['status']}): ${(item['num_correct']/item['num_rows']*100).toFixed(2)}% (${item['num_correct']} of ${item['num_rows']})`
                                })}
                            </Typography>
                            <Typography variant="subtitle1"></Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={12} className='chart-grid'>
                        <Item>
                            <Typography variant="h4">Review Time</Typography>
                            <Typography variant="subtitle1">The number of minutes taken to answer each review.</Typography>
                            <StackedBarChart data={reviewTime} type={"reviewTime"}/>
                            <Typography variant="subtitle1">Days studied: &emsp;{Math.ceil(totalDays/duration*100)}% ({totalDays} of {duration})</Typography>
                            <Typography variant="subtitle1">Total: &emsp;{Math.ceil(totalMinutes)} minutes</Typography>
                            <Typography variant="subtitle1">Average for days studied:&emsp; {avgMinutesStudied} minutes/day</Typography>
                            <Typography variant="subtitle1">Average answer time: &emsp;{avgAnswerSec}s ({Math.ceil(avgReviewsStudied/avgMinutesStudied)} cards/minute)</Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={12} className='chart-grid'>
                        <Item>
                            <Typography variant="h4">Review Count</Typography>
                            <Typography variant="subtitle1">The number of reviews you have answered.</Typography>
                            <StackedBarChart data={reviewCount} type={"reviewCount"}/>
                            <Typography variant="subtitle1">Days studied: &emsp;{Math.ceil(totalDays/duration*100)}% ({totalDays} of {duration})</Typography>
                            <Typography variant="subtitle1">Total: &emsp;{totalReviews} reviews</Typography>
                            <Typography variant="subtitle1">Average for days studied: &emsp;{avgReviewsStudied} reviews/day</Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={12} className='chart-grid'>
                        <Item>
                            <Typography variant="h4">Intervals</Typography>
                            <Typography variant="subtitle1">The number of due reviews at daily intervals from today.</Typography>
                            <SimpleBarChart data={intervals} type={"intervals"}/>
                            <Typography variant="subtitle1">Average interval: {(averageInterval).toFixed(1)} days</Typography>
                            <Typography variant="subtitle1">Longest interval: {maxInterval} days</Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={12} className='chart-grid'>
                        <Item>
                            <Typography variant="h4">Success Rate</Typography>
                            <Typography variant="subtitle1">Your review success rate for each hour of the day.</Typography>
                            <SimpleBarChart data={hourlyBreakdown} type={"hourlyBreakdown"}/>
                        </Item>
                    </Grid>
                    <Grid item xs={12} className='chart-grid'>
                        <Item>
                            <Typography variant="h4">Card Types</Typography>
                            <Typography variant="subtitle1">The number of flashcards in your collection, categorized by status.</Typography>
                            <SimplePieChart data={cardCount}/>

                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Wrapper>
    );
}

export default ChartsContainer;
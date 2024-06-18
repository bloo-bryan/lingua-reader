import styled from 'styled-components';
import {Flashcard, Loading} from "../components";
import React, {useEffect, useState} from "react";
import {clearValues, fetchReviews, updateReviews} from "../features/reviewSlice";
import {useDispatch, useSelector} from "react-redux";

const Review = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearValues());
        dispatch(fetchReviews());
    }, []);

    return <>
        <Flashcard/>
        </>
}

export default Review;
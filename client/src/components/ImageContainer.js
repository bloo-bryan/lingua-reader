import {ImageList, ImageListItem, Skeleton} from "@mui/material";
import {getImages} from "../features/readerSlice";
import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Typography from "@mui/material/Typography";
import styled from 'styled-components';
import {ImageItem} from "./index";

const Wrapper = styled.div`
  .btn {
    position: absolute;
    top: 0;
    right: 0;
  }
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

const ImageContainer = () => {
    const {highlighted, currentImages} = useSelector((state) => state.reader);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getImages());
    }, [highlighted]);

    return (
        <Wrapper>
            <Typography variant="h6" fontWeight={500} color="#252c7b" sx={{mb: 2}}>Related Images</Typography>
            <Typography variant="subtitle2" fontWeight={500} color="#252c7b" sx={{mb: 2}}>Save related images for review later.</Typography>
            <ImageList sx={{ width: '100%', height: 400 }} cols={2} rowHeight={164}>
                {currentImages.length === 0 ?
                    [1,2,3,4,5,6].map(item => <Skeleton variant="rectangular" width='100%' height='100%' />) :
                    currentImages.map((item) => (
                    <ImageListItem key={item.id}>
                        <ImageItem item={item}/>
                    </ImageListItem>
                ))}
            </ImageList>
        </Wrapper>
    );
}

export default ImageContainer;
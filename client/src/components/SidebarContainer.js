import Grid from "@mui/material/Unstable_Grid2";
import * as React from "react";
import Definition from "./Definition";
import styled from "styled-components";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {DictSearch, ImageContainer, ReaderFlashcard, Translator} from "./index";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {makeStyles} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {Toast} from "./index";
import {log} from "util";
import {fetchReaderFlashcard} from "../features/readerSlice";

const Wrapper = styled.section`
    .icon {
        float: right;
        padding-right: 0.8rem;
     }
      .translation {
        background: #F0C04F;
        border-left: 3px solid #252c7b;
        padding: 0.5em 10px;
      }
      .translation p {
        display: inline-block;
      }
  
`;


const SidebarContainer = ({highlight}) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#252C7B',
            },
            secondary: {
                main: '#252C7B',
            },
            background: {
                default: '#252c7b',
                paper: '#F0C04F',
            },
            text: {
                primary: '#252C7B',
                secondary: '#252C7B',
                disabled: '#252C7B',
                hint: '#252C7B',

            },
            divider: '#252c7b',
        },
    });

    const {highlighted, readerFlashcard} = useSelector((state) => state.reader);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchReaderFlashcard(highlighted))
    }, [highlighted]);


    return (
        <ThemeProvider theme={theme}>
        <Grid sx={{ borderLeft: '1px solid #e0e0e0', width: '350px', p: 2, background: '#F0C04F' }}>
            <Wrapper>
                {Object.keys(readerFlashcard).length !== 0 ?
                    <div>
                        <ReaderFlashcard data={readerFlashcard}/>
                        <Divider sx={{marginTop: '1rem', marginBottom: '1rem'}}/>
                    </div> : false}
                <Definition/>
                <Divider sx={{marginTop: '1rem', marginBottom: '1rem'}}/>
                <Translator/>
                <Divider sx={{marginTop: '1rem', marginBottom: '1rem'}}/>
                <DictSearch/>
                <Divider sx={{marginTop: '1rem', marginBottom: '1rem'}}/>
                <ImageContainer/>
            </Wrapper>
        </Grid>
        </ThemeProvider>
    )
}

export default SidebarContainer;

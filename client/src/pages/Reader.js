import { TextContainer, Drawer, SidebarContainer } from '../components';
import Grid from "@mui/material/Unstable_Grid2";
import styled from 'styled-components';
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import {fetchAllLearningWords} from "../features/vocabSlice";
import {useDispatch} from "react-redux";
import {clearValues} from "../features/readerSlice";

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
  display: grid;
  background: #1d2033;
  grid:
    "drawer body sidebar" 1fr
    / auto 4fr 1fr;
  gap: 8px;
  .drawer {
    grid-area: drawer;
  }
  .body {
    grid-area: body;
    position: fixed;
    height: 100%;
    width: 100%;
    margin-left: 5px;
    background: #1d2033;
    overflow-y: scroll;
  }
  .filler {
    grid-area: sidebar;
    width: 350px;
  }
  .sidebar {
    grid-area: sidebar;
    position: fixed;
    top: 0;
    right: 5px;
    height: 100%;
    overflow-y: scroll;
  }
  html {
    background: #1d2033 !important;
  }
`

const Reader = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllLearningWords());
    }, []);

    return (
        <Wrapper>
            <div className='drawer'>
                {/*set isSidebarOpen in context, adjust margin accordingly*/}
                {/*<Drawer/>*/}
            </div>
            <div className='body'>
                <TextContainer/>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className='filler'></div>
            <div className='sidebar'>
                <SidebarContainer/>
            </div>
        </Wrapper>
    );
};

export default Reader;
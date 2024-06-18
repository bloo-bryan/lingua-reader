import {Button, FormControl, NativeSelect} from "@mui/material";
import {Loading} from "./index";
import Grid from "@mui/material/Unstable_Grid2";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import * as React from "react";
import {useEffect} from "react";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import languages from "../utils/languages";
import {
    clearValues,
    fetchSections,
    fetchText,
    setCurrentBook,
    setIsLoading,
    setSelectedSection
} from "../features/librarySlice";

const Wrapper = styled.div`
    position: absolute;
    width: 80%;
    height: 85%;
    z-index: 15;
    top: 50%;
    left: 52%;
    background: #F0C04F;
    transform: translate(-50%, -50%);
    overflow-y: scroll;
    overflow-x: hidden;
    border-radius: 50px;
  
  ::-webkit-scrollbar {
    display: none;
  }
  
  .back-btn {
    transform: scale(2);
  }
  
  .button-div {
    display: inline-table;
    text-align: center;
  }
  
  .read-btn {
    width: 250px;
    align-self: center;
    position: fixed;
    bottom: 0;
    margin-bottom: 1rem;
  }
`;

const LibBookPreview = () => {
    const {isLoading, books, currentBook, currentSections, selectedSection} = useSelector((state) => state.library);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getBookDetails = () => {
        dispatch(setIsLoading(true));
        return books.find(book => book['book_id'] === location.state.id);
    }

    const handleChange = (value) => {
        dispatch(setSelectedSection(value));
    }

    const goBack = () => {
        dispatch(clearValues());
    }

    const launchReading = () => {
        if(selectedSection) {
            dispatch(clearValues());
            dispatch(fetchText());
            navigate("/reader");
        }
    }

    useEffect(() => {
        dispatch(setSelectedSection(''));
        dispatch(setCurrentBook(getBookDetails()));
        dispatch(setIsLoading(false));
    }, []);

    useEffect(() => {
        dispatch(fetchSections());
    }, [currentBook]);


    return (
        <Wrapper>
            {isLoading && <Loading isLoading={isLoading}/>}
            <Grid container spacing={1} minWidth='1220px' columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {!isLoading ? <Grid item xs={6} md={8} lg={11}>
                    <NavLink to='/'>
                        <IconButton onClick={goBack} className='back-btn' disableRipple={true} sx={{display: 'inline-block', marginTop: '1.5rem', marginLeft: '3rem', marginRight: '1.5rem', marginBottom: '1.5rem'}}>
                            <ArrowBackRoundedIcon />
                        </IconButton>
                    </NavLink>
                    <Typography variant='h4' sx={{display: 'inline-block', paddingTop: 4}}>{currentBook['title']}</Typography>
                    <Stack paddingTop={2} paddingBottom={4} marginX='3rem' rowGap='1rem'>
                        <Typography variant='subtitle1' sx={{display: 'inline-block'}}>Select Section:</Typography>
                        <FormControl>
                            <NativeSelect
                                value={selectedSection || 'default'}
                                onChange={(e) => handleChange(e.target.value)}
                                inputProps={{
                                    name: 'bookSection',
                                    id: 'bookSection',
                                }}
                            >
                                <option disabled selected value={'default'}> -- select section -- </option>
                                {currentSections.map((section) => {
                                    const secId = section['section_id']
                                    return <option key={secId} value={secId}>{section['section_name']}</option>
                                })}
                            </NativeSelect>
                        </FormControl>
                        <Typography variant='subtitle1' sx={{display: 'inline-block'}}>Language:</Typography>
                        <Typography variant='subtitle2' sx={{display: 'inline-block'}}>{languages[currentBook['lang']]}</Typography>
                        <Typography variant='subtitle1' sx={{display: 'inline-block'}}>Date Added:</Typography>
                        <Typography variant='subtitle2' sx={{display: 'inline-block'}}>{(currentBook['date_added'])?.split('T')[0]}</Typography>
                        <Typography variant='subtitle1' sx={{display: 'inline-block'}}>Author:</Typography>
                        <Typography variant='subtitle2' sx={{display: 'inline-block'}}>{currentBook['author']}</Typography>
                        <Typography variant='subtitle1' sx={{display: 'inline-block'}}>Description:</Typography>
                        <Typography variant='subtitle2' sx={{display: 'inline-block'}}>{currentBook['description']}</Typography>
                        <Button variant="contained" className='read-btn' onClick={launchReading}>READ</Button>
                    </Stack>
                </Grid> : false}
            </Grid>
        </Wrapper>
    )
}

export default LibBookPreview;
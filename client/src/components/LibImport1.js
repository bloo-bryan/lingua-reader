import styled from "styled-components";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {Button, FormControl, InputLabel, NativeSelect} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {NavLink, useNavigate} from "react-router-dom";
import books from "../utils/books";
import {useDispatch, useSelector} from "react-redux";
import {clearValues, setBookDetails} from '../features/bookSlice';
import {CustomModal} from "./index";
import languages from "../utils/languages";

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
 
  .continue-link {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .continue-btn {
    width: 250px;
    align-self: center;
    position: fixed;
    bottom: 0;
    margin-bottom: 1rem;
  }
`;

const LibImport1 = () => {
    const {bookDetails} = useSelector((state) => state.book);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = (name, value) => {
        if(name === 'itemType') {
            dispatch(setBookDetails({name: 'itemTitle', value: ''}));
        }
        dispatch(setBookDetails({name, value}));
    }

    const handleContinue = () => {
        for (const [key, value] of Object.entries(bookDetails)) {
            if(!value && key !== 'coverUrl') {
                handleOpen();
                return;
            }
        }
        navigate('/import2')
    }

    return (
        <Wrapper>
            <CustomModal open={open}
                         handleClose={handleClose}
                         title="Field(s) cannot be blank"
                         message="Make sure all fields are completed."/>
            <Grid container spacing={1} minWidth='1220px' columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6} md={8} lg={11}>
                    <NavLink to='/'>
                        <IconButton className='back-btn' disableRipple={true} onClick={() => dispatch(clearValues())} sx={{display: 'inline-block', marginLeft: '3rem', marginRight: '1.5rem', marginBottom: '1.5rem'}}><ArrowBackRoundedIcon /></IconButton>
                    </NavLink>
                    <Typography variant='h2' sx={{display: 'inline-block', paddingTop: 4}}>Import New Text</Typography>
                    <Stack paddingTop={2} paddingBottom={4} marginX='3rem' rowGap='1rem'>
                        <FormControl>
                            <InputLabel variant="standard" htmlFor="lang-select">
                                Item Language
                            </InputLabel>
                            <NativeSelect
                                value={bookDetails['language']}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                inputProps={{
                                    name: 'language',
                                    id: 'lang-select',
                                }}
                            >
                                {Object.entries(languages).map(([key, value]) => {
                                    return <option value={key}>{value}</option>
                                })}
                            </NativeSelect>
                        </FormControl>
                        {bookDetails['itemType'] === 'new' ? <TextField
                            label="Item title"
                            size="small"
                            variant="filled"
                            name='itemTitle'
                            value={bookDetails['itemTitle']}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            // CLEAR SELECTION UPON RADIO CHANGE OR IGNORE INPUT
                        /> : <FormControl>
                                <InputLabel variant="standard" htmlFor="lang-select">
                                    Item Title
                                </InputLabel>
                                <NativeSelect
                                    value={bookDetails['itemTitle'] || 'default'}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    inputProps={{
                                        name: 'itemTitle',
                                        id: 'item-title',
                                    }}
                                >
                                    <option disabled selected value={'default'}> -- select existing title -- </option>
                                    {books.map((book, index) => {
                                        return <option key={index}>{book.title}</option>
                                    })}
                                </NativeSelect>
                        </FormControl>}
                        <TextField
                            label="Description"
                            size="small"
                            multiline={true}
                            maxRows={2}
                            variant="filled"
                            name='itemDesc'
                            value={bookDetails['itemDesc']}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                        <TextField
                            label="Author"
                            size="small"
                            variant="filled"
                            name='itemAuthor'
                            value={bookDetails['itemAuthor']}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                        <TextField
                            label="Cover Image URL (optional)"
                            size="small"
                            variant="filled"
                            name='coverUrl'
                            value={bookDetails['coverUrl']}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            inputProps={{maxLength: 1000}}
                        />
                        <Button variant="contained" className='continue-btn' onClick={handleContinue}>CONTINUE</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Wrapper>
    )
}

export default LibImport1;
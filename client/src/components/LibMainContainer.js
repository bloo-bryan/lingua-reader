import styled from "styled-components";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Card, CardContent, CardMedia, FormControl, InputLabel, NativeSelect} from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import * as React from "react";
import {useEffect} from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchBooks, setLang} from "../features/librarySlice";
import languages from "../utils/languages";

const Wrapper = styled.div`
    position: absolute;
    width: 80%;
    min-width: 620px;
    height: 85%;
    z-index: 15;
    top: 50%;
    left: 52%;
    background: #F0C04F;
    transform: translate(-50%, -50%);
    overflow: scroll;
    border-radius: 50px;
  
  ::-webkit-scrollbar {
    display: none;
  }
  
  .qty-circle {
    background: #1d2033;
    color: #e8c063;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    align-self: center;
    text-align: center;
    line-height: 40px;
    margin-left: 2rem;
  }
  
  .book-img {
    object-fit: cover;
  }
  
  //.title-card {
  //  display: flex;
  //  align-items: center;
  //  justify-content: center;
  //}
`;

const LibMainContainer = () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#252c7b',
                light: '#F0C04F',
                dark: '#252c7b',
            },
            secondary: {
                main: '#F0C04F',
            },
            background: {
                default: '#252c7b',
                paper: '#1d2033',
            },
            text: {
                primary: '#252c7b',
                secondary: '#252c7b',
                hint: '#F0C04F'

            },
            divider: '#252c7b',
            customSelect: {
                main: '#F0C04F'
            }
        },
    });

    const dispatch = useDispatch();
    const {books, isLoading, language} = useSelector((state) => state.library);

    const handleChange = (e) => {
        dispatch(setLang(e.target.value));
    }

    useEffect(() => {
        dispatch(fetchBooks())
    }, [language]);

    return (
        <ThemeProvider theme={theme}>
        <Wrapper>
            <Stack direction='row' paddingTop={4} paddingBottom={6}>
                <Typography variant='h2' sx={{marginLeft: 9}}>Library</Typography>
                <Divider orientation="vertical" sx={{paddingX: 2}} flexItem />
                <div className='qty-circle'>{books?.length || 0}</div>
                <FormControl sx={{ minWidth: 150, alignSelf: 'center', display: 'block', marginLeft: 'auto', marginRight: 3}}>
                    <InputLabel variant="standard" htmlFor="dict-select">
                        Language
                    </InputLabel>
                    <NativeSelect
                        value={language}
                        onChange={handleChange}
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
            </Stack>
            <Box sx={{paddingX: 10, paddingBottom: 8, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', columnGap: 8, rowGap: 8}}>
                <NavLink to='import1' style={{textDecoration: 'none'}}>
                    <Card variant='outlined' sx={{textAlign: 'center', display: 'flex', minHeight: '250px', alignItems: 'center', justifyContent: 'center', borderRadius: '20px'}}>
                        <Stack>
                            <AddCircleIcon fontSize='large' color='secondary' sx={{alignSelf: 'center', marginBottom: '10px'}}/>
                            <Typography variant='h6' color='text.hint' sx={{marginX: '10px'}}>Import New Text</Typography>
                        </Stack>
                    </Card>
                </NavLink>
                {!isLoading && books?.map((book) => (
                    <Card variant='outlined' sx={{textAlign: 'center', justifyContent: 'center', display: 'flex', minHeight: '250px', maxHeight: '250px', alignItems: 'center', borderRadius: '20px'}}>
                        {book['cover_url'] ?
                            <NavLink to='/preview' state={{id: book['book_id']}} style={{textDecoration: 'none'}}>
                                <CardMedia sx={{objectFit: 'cover'}} component='img' image={book['cover_url']} alt=""/>
                            </NavLink> :
                            <NavLink to='/preview' state={{id: book['book_id']}} style={{textDecoration: 'none'}}>
                                <CardContent className='title-card'>
                                    <Typography variant='subtitle1' color='text.hint' fontWeight={500}>{book.title}</Typography>
                                </CardContent>
                            </NavLink>
                        }
                    </Card>
                ))}
            </Box>
        </Wrapper>
        </ThemeProvider>
    )
}

export default LibMainContainer;
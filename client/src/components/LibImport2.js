import styled from "styled-components";
import * as React from "react";
import {useRef, useState} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {NavLink, useNavigate} from 'react-router-dom';
import {CustomModal, Loading} from './index';
import {
    getParsedDocx,
    getParsedEpub,
    getParsedHTML,
    getParsedPDF,
    getParsedTxt,
    parseManualText,
    setError
} from "../features/bookSlice";

import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useDispatch, useSelector} from "react-redux";

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
  
  .text-btn {
    position: relative;
  }
  
  span + span {
    margin-left: 10px;
  }
  
  .file-btn {
    width: 15%;
    align-self: center;
    position: fixed;
    bottom: 0;
    margin-bottom: 1rem;
  }
`;

const LibImport2 = () => {
    const [importMethod, setImportMethod] = useState('text');
    const [uploadValid, setUploadValid] = useState(false);
    const [open, setOpen] = useState(false);
    const [numSections, setNumSections] = useState([1]);
    const [values, setValues] = useState({});
    const [hasEmpty, setHasEmpty] = useState(true);
    const {isLoading, error} = useSelector((state) => state.book);
    const uploader = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        dispatch(setError(''));
        if((uploadValid || !hasEmpty) && !error) navigate('/');
    }

    const handleSectionValues = (id, name, value) => {
        const newObj = {...values};
        newObj[id] = {...newObj[id], [name]: value}
        setValues(newObj)
        // console.log(newObj)
    }

    const handleRadioChange = (e) => {
        setImportMethod(e.target.value);
    }

    const addSection = () => {
        setNumSections([...numSections, 1]);
    }

    const removeSection = () => {
        if(numSections.length > 1) {
            let arr = [...numSections];
            arr.pop();
            setNumSections(arr);
            const newObj = {...values};
            delete newObj[`${numSections.length - 1}`]
            setValues(newObj);
        }
    }

    const saveText = () => {
        if(Object.keys(values).length === 0) {
            setHasEmpty(true);
            handleOpen();
            return;
        }
        for (const [key, value] of Object.entries(values)) {
            const {title, body} = value;
            if(!title || !body) {
                setHasEmpty(true);
                handleOpen()
                return;
            }
        }
        setHasEmpty(false);
        dispatch(parseManualText(values));
        handleOpen();
    }

    const uploadFile = () => {
        const file = uploader.current.files[0];
        let ext = '';
        if(file) ext = file.name.split('.').pop();
        switch(ext.toLowerCase()) {
            case 'epub':
                dispatch(getParsedEpub(file));
                setUploadValid(true);
                handleOpen();
                break;
            case 'txt':
                dispatch(getParsedTxt(file));
                setUploadValid(true);
                handleOpen();
                break;
            case 'pdf':
                dispatch(getParsedPDF(file));
                setUploadValid(true);
                handleOpen();
                break;
            case 'html':
                dispatch(getParsedHTML(file));
                setUploadValid(true);
                handleOpen();
                break;
            case 'docx':
                dispatch(getParsedDocx(file));
                setUploadValid(true);
                handleOpen();
                break;
            default:
                setUploadValid(false);
                handleOpen();
                break;
        }
    }

    return (
        <Wrapper>
            {isLoading && <Loading isLoading={isLoading}/>}
            {!isLoading && importMethod === 'text' ? <CustomModal open={open}
                                                    handleClose={handleClose}
                                                    title={!hasEmpty && !error ? "Text successfully added!" : error ? `${error}` : "Field(s) cannot be blank"}
                                                    message={!hasEmpty && !error ? "Changes saved." : error ? `${error}` : "Make sure all fields are completed."}/> :
            !isLoading && importMethod === 'file' ? <CustomModal open={open}
                         handleClose={handleClose}
                         title={uploadValid && !error ? "Upload Successful!" : error ? `${error}` : "File format not supported"}
                         message={uploadValid && !error ? "Changes saved successfully." : error ? "Upload failed." : "Accepted file formats: .pdf, .epub, .txt, .docx, .html."}/> : false}
            <Grid container spacing={1} minWidth='1220px' columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6} md={8} lg={11}>
                    <NavLink to='/import1'>
                        <IconButton className='back-btn' disableRipple={true} sx={{display: 'inline-block', marginLeft: '3rem', marginRight: '1.5rem', marginBottom: '1.5rem'}}><ArrowBackRoundedIcon /></IconButton>
                    </NavLink>
                    <Typography variant='h2' sx={{display: 'inline-block', paddingTop: 4}}>Import New Text</Typography>
                    <Stack paddingTop={2} paddingBottom={4} marginX='3rem' rowGap='1rem'>
                        <FormControl>
                            <FormLabel id="import-method">Import Method</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="import-method"
                                name="import-method-radio"
                                value={importMethod}
                                onChange={handleRadioChange}>
                                <FormControlLabel value="text" control={<Radio />} label="Enter text" />
                                <FormControlLabel value="file" control={<Radio />} label="Upload file" />
                            </RadioGroup>
                        </FormControl>
                        {importMethod === 'file' ? 
                            (<Stack sx={{marginTop: '5rem', alignItems: 'center', justifyContent: 'center'}} rowGap={4}>
                                <CloudUploadIcon sx={{ marginBottom: '2rem', transform: 'scale(7)', alignSelf: 'center'}}/>
                                <Typography variant='subtitle1'>Accepted file formats: .pdf, .epub, .txt, .docx, .html</Typography>
                                <Button variant="contained" component="label">
                                    <input id="uploader" ref={uploader} type="file" />
                                </Button>
                            </Stack>) :
                            (numSections.map((section, index) => {
                                return <Stack rowGap='1rem'>
                                    <TextField
                                        label="Section title"
                                        size="small"
                                        variant="filled"
                                        value={values[`${index}`]?.title || ''}
                                        name='title'
                                        onChange={(e) => handleSectionValues(`${index}`, e.target.name, e.target.value)}
                                        id={`${index}`}
                                    />
                                    <TextField
                                        size="small"
                                        multiline={true}
                                        maxRows={25}
                                        variant="outlined"
                                        name='body'
                                        value={values[`${index}`]?.body || ''}
                                        onChange={(e) => handleSectionValues(`${index}`, e.target.name, e.target.value)}
                                        id={`${index}`}
                                    />
                                </Stack>
                            }))
                        }
                        {importMethod === 'text' ?
                            <div className='button-div'>
                                <span><Button variant="contained" className='text-btn' onClick={addSection}>ADD NEW SECTION</Button></span>
                                <span><Button variant="contained" className='text-btn' onClick={removeSection}>REMOVE SECTION</Button></span>
                                <span><Button variant="contained" className='text-btn' onClick={saveText}>SAVE</Button></span>
                            </div> : <Button variant="contained" className='file-btn' onClick={uploadFile}>UPLOAD</Button>}
                    </Stack>
                </Grid>
            </Grid>
        </Wrapper>
    )
}

export default LibImport2;
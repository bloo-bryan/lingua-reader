import {CircularProgress, InputAdornment, Skeleton} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TextField from "@mui/material/TextField";
import * as React from "react";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {ChipSelector, CustomTextField} from "./index";
import Box from "@mui/material/Box";
import styled from 'styled-components';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    addFlashcardDef,
    createFlashcard,
    fetchReaderFlashcard,
    getAllDefinitions,
    getAudio,
    getLemma
} from "../features/readerSlice";
import {toast} from "react-toastify";

const Wrapper = styled.div`
  .lemma:hover {
    text-decoration: underline;
    color: #252C7B;
  }
`;

export const voicePicker = (lang) => {
    const msg = new SpeechSynthesisUtterance();
    const voices = speechSynthesis.getVoices();
    switch(lang) {
        case 'en':
            // msg.voice = voices.filter(voice => voice.name === 'Daniel')[0];
            msg.voice = voices.filter(voice => voice.name === 'Microsoft Aria Online (Natural) - English (United States)')[0];
            msg.rate = 0.8;
            msg.lang = 'en-GB';
            break;
        case 'fr':
            msg.voice = voices.filter(voice => voice.name === 'Amélie')[0];
            msg.rate = 0.8;
            msg.lang = 'fr-FR'
            break;
        case 'it':
            msg.voice = voices.filter(voice => voice.name === 'Alice')[0];
            msg.rate = 0.8;
            msg.lang = 'it-IT'
            break;
        case 'my':
            msg.voice = voices.filter(voice => voice.name === 'Microsoft Yasmin Online (Natural) - Malay (Malaysia)')[0];
            msg.rate = 0.8;
            msg.lang = 'my-MY'
            break;
        case 'zh':
            msg.voice = voices.filter(voice => voice.name === 'Meijia')[0];
            msg.rate = 0.8;
            msg.lang = 'zh-TW'
            break;
        case 'kr':
            msg.voice = voices.filter(voice => voice.name === 'Yuna')[0];
            msg.rate = 0.7;
            msg.lang = 'ko-KR'
            break;
        case 'jp':
            msg.voice = voices.filter(voice => voice.name === 'Kyoko')[0];
            msg.rate = 0.7;
            msg.lang = 'ja-JP'
            break;
        default:
            msg.voice = voices.filter(voice => voice.name === 'Daniel')[0];
            msg.rate = 0.8;
            msg.lang = 'en-GB';
            break;
    }
    return msg
}

const Definition = () => {
    const {isLoading, highlighted, translateFrom, currentWord, currentPOS, currentDefinitions, currentSentence, currentLemma, currentAudio} = useSelector((store) => store.reader);
    const {language} = useSelector((state) => state.library);
    const [customPOS, setCustomPOS] = useState([]);
    const [customDef, setCustomDef] = useState('');
    const dispatch = useDispatch();

    const getLemmaDefinition = () => {
        dispatch(getAllDefinitions(1));
        dispatch(fetchReaderFlashcard(currentLemma));
        dispatch(getAudio(1));
    }



    const playAudio = async (url) => {
        if(url.startsWith('https')) {
            const audio = new Audio(url);
            await audio.play();
        } else {
            console.log(speechSynthesis.getVoices())
            const msg = voicePicker(language);
            msg.text = url;
            window.speechSynthesis.speak(msg);
        }
    }

    const addCustomDef = async () => {
        if(customPOS.length !== 0 && customDef.trim() !== '') {
            const pos = customPOS.join('/');
            await dispatch(createFlashcard());
            await dispatch(addFlashcardDef({pos, def: customDef}));
            setCustomPOS([]);
            setCustomDef('');
            toast.success('Custom definition saved!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        toast.info('Enter POS and definition', {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    useEffect(() => {
        if(highlighted && currentSentence) {
            dispatch(getAllDefinitions());
            if(language === 'en') {
                dispatch(getLemma());
            }
            dispatch(getAudio());
        }
    }, [highlighted]);

    if(isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Wrapper>
            {highlighted && <div className='icon'><IconButton edge='end' onClick={() => playAudio(currentAudio)} color='secondary'><VolumeUpRoundedIcon/></IconButton></div>}
            <div className='word'>
                <Typography variant="h5" color="#252c7b" fontWeight={500}>{currentWord || translateFrom}</Typography>
                {currentWord && <Typography variant="subtitle1" color="#252c7b" fontWeight={500} mb={currentLemma && language === 'en' ? 0 : 2}>{currentPOS}</Typography>}
                {language === 'en' ? currentLemma ? <Typography variant="subtitle2" color="#252c7b" fontWeight={500} mb={2}>
                    lemma: <span className='lemma' onClick={getLemmaDefinition}>{currentLemma}</span>
                </Typography> : false : false}
            </div>
            <Stack spacing={2}>
                {currentWord ? currentDefinitions.map((value, index) => {
                    return (
                        <CustomTextField key={value.id} pos={value.pos} def={value.definition}/>
                    )
                }) : false}
                {highlighted ? <><Typography variant="subtitle1" color='#252c7b' fontWeight={500} pt={2}>Add custom definition</Typography>
                <Typography variant="subtitle2" color="#252c7b" fontWeight={400} mb={2}>Indicate part(s)-of-speech that your custom definition falls under.</Typography>

                <ChipSelector pos={customPOS} func={setCustomPOS}/>
                <TextField
                    label={customPOS.join("/")}
                    size="small"
                    multiline
                    variant="filled"
                    value={customDef}
                    onChange={(e) => setCustomDef(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><IconButton onClick={addCustomDef} color='secondary' edge='end'><AddCircleIcon/></IconButton></InputAdornment>,
                    }}
                /></> : false}
            </Stack>
        </Wrapper>
    )
}

export default Definition;
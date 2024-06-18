import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    clearValues,
    setCurrentSentence,
    setDictSearchTerm,
    setHighlighted,
    setTranslateFrom
} from "../features/readerSlice";
import Mark from "mark.js";
import {setAllLearningWords} from "../features/vocabSlice";

const TextContainer = () => {
    const {highlighted, currentWord, translateFrom, currentFlashcardId} = useSelector((store) => store.reader);
    const {currentText, language} = useSelector((store) => store.library);
    const {allLearningWords} = useSelector((store) => store.vocab);
    const dispatch = useDispatch();
    const getSelectionText = (e) => {
        e.preventDefault();
        if(window.getSelection) {
            let selected = window.getSelection().toString().trim();
            if(selected && selected !== '.' && selected !== '?') {
                dispatch(setHighlighted(selected.toLowerCase()));
                dispatch(setDictSearchTerm(selected.toLowerCase()));
                dispatch(setTranslateFrom(selected));
            }
        }
    }

    const getSelectedSentence = (sentence) => {
        dispatch(setCurrentSentence(sentence))
    }

    const highlightWords = () => {
        const instance = new Mark(document.querySelector(".text-container"));
        instance.mark(allLearningWords, {
            "accuracy": {
                "value": `${language === 'zh' || language === 'jp' || language === 'kr' ? 'partially' : 'exactly'}`,
                "limiters": ['!', '@', '#', '&', '*', '(', ')', '-', '–', '—', '+', '=', '[', ']', '{', '}', '|', ':', ';', '\'', '\"', '‘', '’', '“', '”', ',', '.', '<', '>', '/', '?']
            },
            "separateWordSearch": false
        });
    }

    useEffect(() => {
        dispatch(clearValues());
    }, []);


    useEffect(() => {
        highlightWords();
    }, [allLearningWords]);

    useEffect(() => {
        const word = currentWord || translateFrom;
        dispatch(setAllLearningWords(word));
    }, [currentFlashcardId]);

    return (
            <Grid component="main" sx={{p: 3, marginLeft: '80px', marginRight: '370px'}}>
                {currentText && <Typography paragraph variant='h5' className='text-container' color='white' onMouseUp={getSelectionText} >
                    {currentText.map((sentence) => {
                        if(sentence === "\n") {
                            return <div><br/></div>
                        } else {
                            return <span onClick={() => getSelectedSentence(sentence)}>{sentence} </span>
                        }
                    })}
                </Typography>}
            </Grid>
    )
}

export default TextContainer;
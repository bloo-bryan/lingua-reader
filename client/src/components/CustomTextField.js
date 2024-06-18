import * as React from 'react';
import {alpha, createTheme, styled} from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import {InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import {useEffect, useState} from "react";
import {addFlashcardDef, checkDefExists, createFlashcard} from "../features/readerSlice";
import {useDispatch} from "react-redux";

const CustomTextField = ({pos, def}) => {
    const dispatch = useDispatch();
    const [added, setAdded] = useState(false);
    const [definition, setDefinition] = useState(def);
    // const {newFlashcard}
    const addDef = async () => {
        if(!added) {
            await dispatch(createFlashcard());
            await dispatch(addFlashcardDef({pos, def: definition}));
        }
        setAdded(true);
    }

    useEffect(() => {
        const checkStatus = async() => {
            const {payload} = await dispatch(checkDefExists(definition))
            setAdded(payload);
        }
        checkStatus().catch(console.error);
    }, []);

    return (
            <TextField
                label={pos}
                size="small"
                multiline
                variant="filled"
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        <IconButton edge='end' color={added ? 'primary' : 'secondary'} disabled={added} onClick={() => addDef()}>
                            {added ? <CheckCircleOutlineRoundedIcon/> : <AddCircleIcon/>}
                        </IconButton>
                    </InputAdornment>
                }}
            />
    );
}

export default CustomTextField;
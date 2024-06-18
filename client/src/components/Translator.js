import Stack from "@mui/material/Stack";
import {FormControl, InputAdornment, InputLabel, NativeSelect, Skeleton} from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import * as React from "react";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import {getTranslation, setTargetLang, setTranslateFrom} from "../features/readerSlice";
import translateTarget from "../utils/translateTarget";

const Translator = () => {
    const {translateFrom, translateTo, targetLang, translationLoading} = useSelector((state) => state.reader);
    const {language} = useSelector((state) => state.library);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        dispatch(setTargetLang(e.target.value));
    }

    const handleTextChange = (e) => {
        dispatch(setTranslateFrom(e.target.value));
    }

    const translate = (e) => {
        e.preventDefault();
        dispatch(getTranslation());
    }

    return (
        <>
            <Typography variant="h6" fontWeight={500} color="#252c7b" mb={language === 'kr' ? 0 : 2}>Machine Translation</Typography>
            {language === 'kr' ? <Typography variant="subtitle2" fontWeight={500} color="#252c7b" mb={2}>Korean translation is not supported for now.</Typography> : false}
            <Stack direction='row' spacing={2} mb={2}>
                <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="from-lang">
                        from
                    </InputLabel>
                    <NativeSelect
                        defaultValue='auto'
                        inputProps={{
                            name: 'from',
                            id: 'from-lang',
                        }}
                    >
                        <option value='auto'>automatic</option>
                    </NativeSelect>
                </FormControl>
                <ChevronRightOutlinedIcon/>
                <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="target-lang">
                        to
                    </InputLabel>
                    <NativeSelect
                        value={targetLang}
                        onChange={handleChange}
                        inputProps={{
                            name: 'to',
                            id: 'target-lang',
                        }}
                    >
                        {Object.entries(translateTarget).map(([key, value]) => {
                            return <option value={key}>{value}</option>
                        })}
                    </NativeSelect>
                </FormControl>
            </Stack>

            <Stack spacing={2}>
                <TextField
                    id="outlined-multiline-flexible"
                    multiline
                    size='small'
                    value={translateFrom}
                    onChange={handleTextChange}
                    maxRows={4}
                    width='350px'
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><IconButton edge='end' onClick={translate} color='secondary'><ArrowCircleRightIcon/></IconButton></InputAdornment>,
                    }}>
                </TextField>
                <blockquote className='translation'>
                    {translationLoading ? <div>
                        <Skeleton animation="wave"/>
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                    </div> : translateTo}
                </blockquote>
            </Stack>
        </>
    )
}

export default Translator;
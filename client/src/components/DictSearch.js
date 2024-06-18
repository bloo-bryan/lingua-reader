import Typography from "@mui/material/Typography";
import {Button, FormControl, InputLabel, NativeSelect} from "@mui/material";
import * as React from "react";
import dictionariesEN from "../utils/dictionariesEN";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {setDictSearchTerm} from "../features/readerSlice";


const DictSearch = () => {
    const {dictSearchTerm, highlighted} = useSelector((state) => state.reader);
    const [dict, setDict] = useState(dictionariesEN[0]);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setDict(dictionariesEN[e.target.value]);
    }

    useEffect(() => {
        const modifiedSearchTerm = highlighted.replaceAll(" ", dict.separator);
        dispatch(setDictSearchTerm(modifiedSearchTerm));
    }, [dict, highlighted]);


    return (
        <>
            <Typography variant="h6" fontWeight={500} color="#252c7b" sx={{mb: 2}}>Search Other Dictionaries</Typography>
            <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="dict-select">
                    Select dictionary
                </InputLabel>
                <NativeSelect
                    value={dict.id}
                    onChange={handleChange}
                    inputProps={{
                        name: 'dictionary',
                        id: 'dict-select',
                    }}
                >
                    {dictionariesEN.map((dictionary, index) => {
                        return <option key={index} value={dictionary.id}>{dictionary.name}</option>
                    })}
                </NativeSelect>
            </FormControl>
            <a onClick={() => window.open(`${dict.url}/${dictSearchTerm}`, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')}>
                <Button variant="contained" sx={{margin: '1rem', marginLeft: '14rem'}}>SEARCH</Button>
            </a>
        </>
    )
}

export default DictSearch;
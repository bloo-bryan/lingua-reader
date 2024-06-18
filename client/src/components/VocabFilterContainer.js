import {CustomNativeSelect} from './index';
import {useDispatch, useSelector} from 'react-redux';
import {clearFilters, filterVocab, handleChange, sortVocab} from "../features/vocabSlice";
import languages from "../utils/languages";
import styled from 'styled-components'
import {Button} from "@mui/material";
import * as React from "react";
import {useEffect} from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const Wrapper = styled.section`
  .form {
    margin-left: 5rem;
    padding-right: 30rem;
    width: 100%;
    max-width: 100%;
  }
  .form-input,
  .form-select,
  .btn-block {
    height: 35px;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 2rem;
    row-gap: 0.5rem;
  }
  h5 {
    font-weight: 700;
  }
  .btn-block {
    align-self: end;
    margin-top: 1rem;
    width: 200px;
  }
  @media (min-width: 768px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .btn-block {
      margin-top: 0;
    }
  }
`

const VocabFilterContainer = ({data}) => {
    const { search, language, pos, status, sort } = useSelector((state) => state.vocab);
    const {filteredVocab} = useSelector((state) => state.vocab);
    const allPOS = [...new Set(filteredVocab.map(item => item.flashcard_pos).join('/').split('/').filter(item => item !== ''))]
    const dispatch = useDispatch();
    const handleSearch = (e) => {
        dispatch(handleChange({ name: e.target.name, value: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(clearFilters());
    };

    useEffect(() => {
        dispatch(filterVocab());
    }, [search, language, pos, status]);

    useEffect(() => {
        dispatch(sortVocab());
    }, [sort]);

    return (
        <Wrapper>
            <form className='form'>
                <Typography variant="h5" sx={{marginY: '1rem'}}>Vocabulary List</Typography>
                <Typography variant="subtitle1" sx={{marginTop: '1rem', marginBottom: '1rem'}}>Total displayed: {data.length} items</Typography>
                <div className='form-center'>
                    {/* search position */}
                    <TextField className='form-input' label='Search' name='search' value={search} onChange={handleSearch} size="small" variant="outlined" />
                    <CustomNativeSelect
                        labelText='Language'
                        name='language'
                        value={language}
                        handleChange={handleSearch}
                        list={['all', ...Object.keys(languages)]}
                    />
                    {/* search by type */}
                    <CustomNativeSelect
                        labelText='Part of Speech (POS)'
                        name='pos'
                        value={pos}
                        handleChange={handleSearch}
                        list={['all', ...allPOS]}
                    />
                    {/* sort */}
                    <CustomNativeSelect
                        labelText='Status'
                        name='status'
                        value={status}
                        handleChange={handleSearch}
                        list={['all', 'new', 'learning', 'relearning', 'young', 'mature']}
                    />
                    <CustomNativeSelect
                        labelText='Sort'
                        name='sort'
                        value={sort}
                        handleChange={handleSearch}
                        list={['latest', 'oldest', 'a-z', 'z-a']}
                    />
                    <Button
                        variant="contained"
                        className='btn btn-block btn-danger'
                        onClick={handleSubmit}
                    >
                        clear filters
                    </Button>
                </div>
            </form>
        </Wrapper>
    );
};

export default VocabFilterContainer;

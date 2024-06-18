import axios from 'axios';

const customFetch = axios.create({
    baseURL: 'https://api.dictionaryapi.dev/api/v2/entries/en',
})

export default customFetch;
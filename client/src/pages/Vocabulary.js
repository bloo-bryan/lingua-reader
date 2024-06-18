import {VocabTable} from "../components";
import {clearValues, fetchAllFlashcardImgs, fetchAllLearning, setSearch} from "../features/vocabSlice";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";

const Vocabulary = () => {
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(clearValues());
        dispatch(fetchAllLearning());
        dispatch(fetchAllFlashcardImgs());
    }, []);

    return <>
        <VocabTable/>
    </>
}

export default Vocabulary;
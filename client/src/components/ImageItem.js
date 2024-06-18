import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';import * as React from "react";
import {useEffect, useState} from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Skeleton} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
    addFlashcardDef,
    addFlashcardImage,
    checkDefExists,
    checkImgExists,
    createFlashcard
} from "../features/readerSlice";

const ImageItem = ({item}) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#5d9e52',
            },
            secondary: {
                main: '#F0C04F',
            },
        }
    });
    const dispatch = useDispatch();
    const {imagesLoading} = useSelector((state) => state.reader);
    const [added, setAdded] = useState(false);

    const addImg = async () => {
        if(!added) {
            await dispatch(createFlashcard());
            await dispatch(addFlashcardImage(item.src.medium));
        }
        setAdded(true);
    }

    useEffect(() => {
        const checkStatus = async() => {
            const {payload} = await dispatch(checkImgExists(item.src.medium))
            setAdded(payload);
        }
        checkStatus().catch(console.error);
    }, []);

    if(imagesLoading) {
        return <Skeleton variant="rectangular" width='100%' height='100%' />
    }

    return (
        <ThemeProvider theme={theme}>
            <img
                src={`${item.src.medium}`}
                alt={item.alt}
                loading="lazy"
            />
            <IconButton className='btn' color={added ? 'primary' : 'secondary'} onClick={() => addImg()} disabled={added}>{added ? <CheckCircleOutlineRoundedIcon/> : <AddCircleIcon/>}</IconButton>
        </ThemeProvider>
    )
}

export default ImageItem;
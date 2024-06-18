import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import {ImgLightbox} from "./index";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import {voicePicker} from "./Definition";

const VocabTableRow = (props) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const playAudio = async (text, lang) => {
        const msg = voicePicker(lang);
        msg.text = text;
        window.speechSynthesis.speak(msg);
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <IconButton onClick={() => playAudio(row.flashcard_word, row.flashcard_lang)} sx={{fontSize: '1px', marginRight: '0.5rem', color: '#252C7B'}}><VolumeUpRoundedIcon/></IconButton>
                    {row.flashcard_word}
                </TableCell>
                <TableCell align="left">{row.flashcard_lemma.split(' ').length < 4 ? row.flashcard_lemma ? row.flashcard_lemma : '—' : '—'}</TableCell>
                <TableCell align="left">{row.flashcard_pos.join('/') || '—'}</TableCell>
                <TableCell align="left">{row.flashcard_def[0] || '—'}</TableCell>
                <TableCell align="left">{row.status || '—'}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {row.flashcard_def !== null ? <Table size="small" aria-label="purchases">
                                <span style={{display: 'flex', alignItems: 'center'}}>
                                    <Typography sx={{marginX: 2, marginBottom: '0.5rem', marginTop: '1rem'}} variant="subtitle1">Saved definitions</Typography>
                                </span>
                                <TableBody>
                                    {row.flashcard_def.map((def, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{fontSize: '1rem'}} component="th" scope="row">
                                                {def || '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table> : false}
                            <span style={{display: 'flex'}}>
                                <Typography sx={{marginTop: '1rem', marginX: 2}} variant="subtitle1">Context</Typography>
                                <IconButton onClick={() => playAudio(row.flashcard_context, row.flashcard_lang)} sx={{color: '#252C7B', marginTop: '0.5rem', fontSize: '1px'}} ><VolumeUpRoundedIcon/></IconButton>
                            </span>
                            <Typography sx={{fontSize: '1rem', marginTop: '0.5rem', marginX: 2, marginBottom: '1.5rem', paddingRight: '20rem'}} variant="subtitle2">{row.flashcard_context || '—'}</Typography>
                            {row.hasOwnProperty('flashcard_image') ? <ImgLightbox images={row.flashcard_image}/> : false}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default VocabTableRow;
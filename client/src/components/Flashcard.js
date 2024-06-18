import React, {useState} from 'react';
import styled from "styled-components";
import dayjs from 'dayjs';
import {Button, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import {useDispatch, useSelector} from "react-redux";
import {CustomModal, ImgLightbox} from "./index";
import {supermemo} from 'supermemo';
import {clearValues, insertReview, updateReview} from "../features/reviewSlice";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpIcon from '@mui/icons-material/Help';
import useTimer from 'easytimer-react-hook';
import {voicePicker} from "./Definition";


const Wrapper = styled.div`
  position: absolute;
  width: 80%;
  min-width: 620px;
  height: 85%;
  z-index: 15;
  top: 50%;
  left: 52%;
  background: #F0C04F;
  transform: translate(-50%, -50%);
  overflow: scroll;
  border-radius: 50px;

  ::-webkit-scrollbar {
    display: none;
  }

  section {
    text-align: center;
  }

  u {
    text-decoration-style: wavy;
    text-underline-position: under;
    color: white;
    padding: 1px;
  }

  .card {
    font-family: UD Digi Kyokasho N-R;
    font-size: 20px;
    text-align: center;
    background-color: #FDF8E9;
    padding: 10px;
  }

  .body-upper {
    font-family: Noto Sans JP Black;
    font-size: 40px;
    color: #F0C04F;
    background-color: #1d2033;
    padding: 40px 10px 10px;
    text-align: center;
  }

  .body-lower {
    text-align: left;
    color: #1d2033;
    background-color: #F0C04F;
    padding: 40px;
  }

  .level {
    position: absolute;
    background-color: #F0C04F;
    color: #1d2033;
    font-size: 20px;
    padding: 5px;
    margin-top: -30px;
  }

  .pos {
    width: fit-content;
    font-family: Bree Serif;
    font-size: 15px;
    border: 1px solid #1d2033;
    padding: 5px;
    margin-bottom: 15px;
    max-width: 100%;
    display: inline-table;
  }

  .lemma {
    width: fit-content;
    display: inline-table;
    border: 1px solid #1d2033;
    background-color: #1d2033;
    font-family: Bree Serif;
    font-size: 15px;
    color: #F0C04F;
    padding: 5px;
    padding-left: 7px;
  }

  .soundFront {
    position: absolute;
    top: 40px;
    right: 40px;
    font-size: 18px;
    //content: url("play.png");
    width: 6%;
  }

  .definition {
    font-size: 1.2rem;
  }

  .context {
    font-family: Noto Sans JP Regular;
    font-size: 1.2rem;
    border: 1px dashed #1d2033;
    padding: 10px;
    margin-top: 20px;
  }

  .reveal-btn {
    display: inline-block;
    margin-top: 50px;
  }

  .img-span {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }

  .btns-span {
    display: flex;
    justify-content: center;
    padding-top: 100px;
  }

  Button {
    margin-right: 10px;
  }

  .btn-wrong {
    border-color: #E20C20;
    color: #E20C20;
  }

  .btn-right {
    color: #199156;
    border-color: #199156;
  }
  
  .btn-wrong:hover {
    border-color: #E20C20;
  }

  .btn-right:hover {
    border-color: #199156;
  }

  .completed-div {
    display: grid;
    place-items: center;
    padding-top: 15rem;
  }

  .completed-msg {
    padding-top: 2rem;
  }

`;

const Flashcard = () => {
    const dispatch = useDispatch();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [backRevealed, setBackRevealed] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const {toReview} = useSelector((state) => state.review);
    const message = ["5: perfect response.", "4: correct response after a hesitation.", "3: correct response recalled with serious difficulty.", "2: incorrect response; where the correct one seemed easy to recall.", "1: incorrect response; the correct one remembered.", "0: complete blackout."]
    const [timer] = useTimer({})
    timer.start({})

    function practice(flashcard, grade) {
        const { interval, repetition, efactor } = supermemo(flashcard, grade);

        const dueDate = dayjs(Date.now()).add(interval, 'day').toISOString().split('.')[0]+"Z";

        return { ...flashcard, interval, repetition, efactor, dueDate };
    }

    const answerCard = (score) => {
        const sec = timer.getTotalTimeValues().seconds;
        timer.reset();

        const data = {
            id: toReview[currentIndex]['review_id'],
            content: {
                quality: parseInt(score),
                completed: dayjs(Date.now()).toISOString().split('.')[0]+"Z",
                timeTaken: sec
            }
        }
        dispatch(updateReview(data));
        //add status, prevRep
        let obj = practice(toReview[currentIndex], parseInt(score));
        obj['prevRep'] = toReview[currentIndex]['repetition'];  //persist prevRep???
        if(obj['interval'] >= 21) {
            obj['status'] = 'mature';
        } else if(obj['interval'] > 6 && obj['interval'] < 21) {
            obj['status'] = 'young';
        } else if(toReview[currentIndex]['interval'] > 6 && obj['prevRep'] > obj['repetition']) {
            obj['status'] = 'relearning';
        } else if(obj['interval'] <= 6) {
            obj['status'] = 'learning';
        }
        dispatch(insertReview(obj));
        if(currentIndex < toReview.length - 1) {
            timer.start();
            setCurrentIndex(currentIndex + 1);
        } else {
            dispatch(clearValues());
        }
        setBackRevealed(false);
    }

    const handleOpen = () => {
        setModalOpen(true);
    }

    const handleClose = () => {
        setModalOpen(false);
    }

    const playAudio = async (text, lang) => {
        const msg = voicePicker(lang);
        msg.text = text;
        window.speechSynthesis.speak(msg);
    }

    return (
        <Wrapper>
            {toReview.length !== 0 ? <section>
                <div className="body-upper" style={{borderRadius: '5px 5px 0px 0px'}}>
                    {/*<div className="level">{toReview[currentIndex]['status']}</div>*/}
                    <Typography variant='h4' className='word'>{toReview[currentIndex]['flashcard_word']}</Typography>
                    <div className='icon'><IconButton onClick={() => playAudio(toReview[currentIndex]['flashcard_word'], toReview[currentIndex]['flashcard_lang'])} sx={{color: '#F0C04F'}}><VolumeUpRoundedIcon/></IconButton></div>
                </div>

                {backRevealed ? <div className="body-lower" style={{borderRadius: '0px 0px 5px 5px'}}>
                    <div className="lemma">{toReview[currentIndex]['flashcard_lemma'] || '—'}</div>
                    <div className="pos">{toReview[currentIndex].hasOwnProperty('flashcard_pos') ? [...new Set(toReview[currentIndex]['flashcard_pos'])].join("/") : '—'}</div>
                    {/*<div id="senaudio" style={{display: 'none'}}>test</div>*/}

                    {toReview[currentIndex].hasOwnProperty('flashcard_defs') ? toReview[currentIndex]['flashcard_defs'].map((def, index) => {
                        return <div className="definition">
                            {`${index+1}. ${def}`}
                        </div>
                    }) : ''}

                    <CustomModal open={modalOpen}
                                 handleClose={handleClose}
                                 title="Grades explained:"
                                 message={message}/>

                    <div className="context">
                        {toReview[currentIndex]['flashcard_context']}
                        <IconButton onClick={() => playAudio(toReview[currentIndex]['flashcard_context'], toReview[currentIndex]['flashcard_lang'])} size='small' sx={{marginBottom: '0.5rem', color: '#252C7B'}}><VolumeUpRoundedIcon/></IconButton>
                    </div>

                    <span className='img-span'><ImgLightbox className='img-container' images={toReview[currentIndex]['flashcard_imgs']}/></span>
                    <span className='btns-span'>
                        <Button variant='outlined' size='large' className='btn-wrong' onClick={(e) => answerCard(e.target.textContent)} sx={{borderRadius: '50px'}}>0</Button>
                        <Button variant='outlined' size='large' className='btn-wrong' onClick={(e) => answerCard(e.target.textContent)} sx={{borderRadius: '50px'}}>1</Button>
                        <Button variant='outlined' size='large' className='btn-wrong' onClick={(e) => answerCard(e.target.textContent)} sx={{borderRadius: '50px'}}>2</Button>
                        <Button variant='outlined' size='large' className='btn-right' onClick={(e) => answerCard(e.target.textContent)} sx={{borderRadius: '50px'}}>3</Button>
                        <Button variant='outlined' size='large' className='btn-right' onClick={(e) => answerCard(e.target.textContent)} sx={{borderRadius: '50px'}}>4</Button>
                        <Button variant='outlined' size='large' className='btn-right' onClick={(e) => answerCard(e.target.textContent)} sx={{borderRadius: '50px'}}>5</Button>
                    </span>

                </div> : <span><Button variant="outlined" className='reveal-btn' onClick={() => setBackRevealed(true)}>REVEAL</Button></span>
                }
                {backRevealed && <span>
                    {`${timer.getTimeValues().toString()} Total: ${toReview.length} - Due: ${toReview.length - currentIndex} - Completed: ${currentIndex}`}
                    <IconButton onClick={handleOpen} sx={{marginBottom: '3px'}}><HelpIcon fontSize='small'/></IconButton>
                </span>}
            </section> : <div className='completed-div'>
                <CheckCircleOutlineIcon sx={{fontSize: '100px'}}/>
                <Typography variant='h4' className='completed-msg'>All reviews completed!</Typography>
            </div>}
        </Wrapper>
    );
}

export default Flashcard;
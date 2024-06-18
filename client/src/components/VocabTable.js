import * as React from 'react';
import {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useSelector} from "react-redux";
import {Loading, VocabFilterContainer, VocabTableRow} from "./index";
import Divider from "@mui/material/Divider";
import styled from 'styled-components';
import {Button} from "@mui/material";

const Wrapper = styled.section`
  overflow-y: hidden;
  .table-body {
    background-color: #252C7B;
  }
`;

const VocabTable = () => {
    const {allFlashcardImgs, filteredVocab} = useSelector((state) => state.vocab);
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const combineDefs = (arr) => {
        const combinedArray = [];

        arr.forEach((item) => {
            const existingItem = combinedArray.find((i) => i.flashcard_id === item.flashcard_id);
            if (existingItem) {
                existingItem.flashcard_def.push(`(${item.flashcard_pos}) ${item.flashcard_def}`);
                if(!existingItem.flashcard_pos.includes(item.flashcard_pos)) {
                    existingItem.flashcard_pos.push(item.flashcard_pos);
                }
            } else {
                combinedArray.push({
                    flashcard_id: item.flashcard_id,
                    flashcard_word: item.flashcard_word,
                    flashcard_lemma: item.flashcard_lemma,
                    flashcard_context: item.flashcard_context,
                    flashcard_lang: item.flashcard_lang,
                    status: item.status,
                    flashcard_def: [item.flashcard_def === null ? null : `(${item.flashcard_pos}) ${item.flashcard_def}`],
                    flashcard_pos: [item.flashcard_pos],
                });
            }
        });
        return combinedArray;
    }

    const combineDefsAndImgs = (arr1, arr2) => {
        const combinedArray = combineDefs(arr1);

        arr2.forEach((item2) => {
            const existingItem = combinedArray.find((item) => item.flashcard_id === item2.flashcard_id);
            if (existingItem) {
                if (existingItem.flashcard_image) {
                    existingItem.flashcard_image.push(item2.flashcard_image);
                } else {
                    existingItem.flashcard_image = [item2.flashcard_image];
                }
            }
        });
        return combinedArray;
    }

    useEffect(() => {
        if(filteredVocab.length !== 0 && allFlashcardImgs.length !== 0) {
            setTableData(combineDefsAndImgs(filteredVocab, allFlashcardImgs));
            setIsLoading(true);
            // let prevId = 0;
            // let details = {};
            // for(let item of filteredVocab) {
            //     const curId = item['flashcard_id'];
            //     const curImgs = allFlashcardImgs.filter(img => img['flashcard_id'] === curId)
            //     if (prevId !== curId) {
            //         let data = createData(item['flashcard_word'], item['flashcard_lemma'], item['flashcard_pos'], item['flashcard_def'], item['status'])
            //         details = {};
            //         details['def'] = [`(${item['flashcard_pos']}) ${item['flashcard_def']}`];
            //         details['context'] = `${item['flashcard_context']}`
            //         if (curImgs.length > 0) {
            //             details['img'] = curImgs.map(img => img['flashcard_image'])
            //         }
            //         data['details'] = details;
            //         setTableData(tableData => [...tableData, data]);
            //         prevId = curId;
            //     } else {
            //         // const newPOS = tableData
            //         // setTableData(tableData => [...tableData, pos: ])
            //         details['def'].push(`(${item['flashcard_pos']}) ${item['flashcard_def']}`);
            //     }
            // }
        }
        setIsLoading(false);
    }, [filteredVocab, allFlashcardImgs]);

    if(isLoading) {
        return <Loading isLoading={isLoading}/>
    }

    return (
        <Wrapper>
            <VocabFilterContainer data={tableData}/>
            <Divider sx={{marginY: '1.5rem'}}/>
            <TableContainer sx={{marginLeft: '5rem'}} component={Paper}>
                <Table size="small" aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell width="5%"/>
                            <TableCell width="15%" align="left">Vocabulary</TableCell>
                            <TableCell width="15%" align="left">Lemma</TableCell>
                            <TableCell width="15%" align="left">Part of Speech (POS)</TableCell>
                            <TableCell width="40%" align="left">Definition</TableCell>
                            <TableCell width="10%" sx={{paddingRight: '10rem'}} align="left">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!isLoading && tableData.map((row, index) => (
                            <VocabTableRow key={index} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Wrapper>
    );
}

export default VocabTable;
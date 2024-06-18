import {Card, CardActions, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {ImgLightbox} from "./index";

const ReaderFlashcard = ({data}) => {

    return (
        <Card sx={{ minWidth: '100%' }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    saved flashcard // {data.status}
                </Typography>
                <Typography variant="h5" component="div">
                    {data.word}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {data.pos.join('/')}
                </Typography>
                {data.defs.map((item, index) => {
                    return <div className="definition">
                        {`${index+1}. ${item}`}
                    </div>
                })}
            </CardContent>
            <CardActions>
                {data.imgs.length !== 0 ? <ImgLightbox images={data.imgs}/> : false}
            </CardActions>
        </Card>
    )
}

export default ReaderFlashcard;
import {Backdrop, CircularProgress} from "@mui/material";
import * as React from "react";

const Loading = ({isLoading}) => {
    return (
        <div>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={isLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </div>
    )
}

export default Loading;
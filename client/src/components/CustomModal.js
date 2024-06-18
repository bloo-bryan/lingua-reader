import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {Modal} from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CustomModal = ({open, handleClose, title, message}) => {
    return <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {title}
            </Typography>
            {Array.isArray(message) ?
                message.map((item) => {
                    return <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {item}
                    </Typography>
                }) :
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {message}
            </Typography>}
        </Box>
    </Modal>
}

export default CustomModal;
import React, {useState} from 'react';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import {Button} from "@mui/material"; // This only needs to be imported once in your app

const ImgLightbox = ({images}) => {
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

        return (
            <div>
                {images && <Button style={{marginLeft: '1rem', marginBottom: '1rem'}} size="small" onClick={() => setIsOpen(true)}>
                    View Images
                </Button>}

                {isOpen && (
                    <Lightbox
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                        onCloseRequest={() => setIsOpen(false)}
                        onMovePrevRequest={() =>
                            setPhotoIndex((photoIndex + images.length - 1) % images.length)
                        }
                        onMoveNextRequest={() =>
                            setPhotoIndex((photoIndex + 1) % images.length)
                        }
                    />
                )}
            </div>
        );
}

export default ImgLightbox;


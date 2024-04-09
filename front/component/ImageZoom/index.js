import React, { useState } from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";
import {
  Overlay,
  Global,
  CloseButton,
  SlickWrapper,
  Header,
  ImageWrapper,
  Indicator,
} from "./styledElement";
import { backURL } from "../../config/config";

const ImageZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  console.log(images);
  return (
    <Overlay>
      <Global />
      <Header>
        <h1>Image Details</h1>
        <CloseButton onClick={onClose}>X</CloseButton>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            // afterChange는 이미지가 더 넘어간 다음에 setCurrentSlide가 실행된다
            beforeChange={(slide) => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((img) => (
              <ImageWrapper key={img.src}>
                <img src={`${backURL}/${img.src}`} alt={img.src} />
              </ImageWrapper>
            ))}
          </Slick>
          {/* Slick안에 감싸면 해당 이미지가 slick하게 된다 
          JSX코드에서 map을 돌릴때는 {}가 아니라 ()로 돌려야 한다 명심!*/}
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImageZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageZoom;

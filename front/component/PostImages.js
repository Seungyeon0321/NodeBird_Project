import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import ImageZoom from "./imageZoom";

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        {/* Button이나 input이 아닌 애들은 이 role presentation을 넣도록 하자 스크린리더에서 굳이 클릭할 필요가 없는 img는 presentation을 넣도록 하자*/}
        <img
          role="presentation"
          src={`http://localhost:3065/${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImageZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          role="presentation"
          width="50%"
          src={`http://localhost:3065/${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        <img
          role="presentation"
          width="50%"
          src={`http://localhost:3065/${images[1].src}`}
          alt={images[1].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImageZoom images={images} onClose={onClose} />}
      </>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          role="presentation"
          style={{ width: "50%" }}
          src={`http://localhost:3065/${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        <div
          role="presentation"
          style={{
            width: "50%",
            textAlign: "center",
            verticalAlign: "middle",
          }}
          onClick={onZoom}
        >
          <PlusOutlined />
          <br />
          {images.length - 1} 개의 사진 더 보기
        </div>
      </div>
      {showImagesZoom && <ImageZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;

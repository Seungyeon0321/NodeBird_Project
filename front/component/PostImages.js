import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import ImageZoom from "./ImageZoom";
import { Carousel } from "antd";

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  const imageStyle = {
    width: "100%",
    height: "100%",
  };

  if (images.length === 1) {
    return (
      <div style={{ height: "550px" }}>
        <img
          role="presentation"
          style={{
            width: `${imageStyle.width}`,
            height: `${imageStyle.height}`,
            objectFit: "cover",
          }}
          src={`${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImageZoom images={images} onClose={onClose} />}
      </div>
    );
  }

  if (images.length > 2) {
    return (
      <>
        <Carousel
          style={{
            width: "100%",
            height: "550px",
            overflow: "hidden",
          }}
        >
          {images.map((v) => {
            return (
              <div
                key={v.src}
                style={{
                  width: "100%",
                  height: "100%", // Carousel과 같은 높이로 설정
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  role="presentation"
                  style={{
                    width: `${imageStyle.width}`,
                    height: `${imageStyle.height}`,
                    objectFit: "cover",
                  }}
                  src={v.src}
                  alt={v.src}
                  onClick={onZoom}
                />
              </div>
            );
          })}
        </Carousel>
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
          src={`${images[0].src}`}
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
          see {images.length - 1} more photos
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

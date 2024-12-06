import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import ImageZoom from "./ImageZoom";

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
      <>
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
      </>
    );
  }

  if (images.length > 2) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {images.map((v) => {
          return (
            <div key={v.src}>
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
        {showImagesZoom && <ImageZoom images={images} onClose={onClose} />}
      </div>
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

{
  /* <img
          role="presentation"
          style={{
            width: `${imageStyle.width}px`,
            height: `${imageStyle.height}px`,
          }}
          src={`${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        <img
          role="presentation"
          width="50%"
          src={`${images[1].src}`}
          alt={images[1].src}
          onClick={onZoom}
        /> */
}

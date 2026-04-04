import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import ImageZoom from "./ImageZoom";
import { Carousel, Grid } from "antd";

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md; // md >= 768px

  // Mobile에서 화면을 뚫지 않도록 클램프 기반 높이를 사용합니다.
  const mediaHeight = "clamp(240px, 42vw, 560px)";

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
      <div style={{ height: mediaHeight }}>
        <img
          role="presentation"
          style={{
            width: `${imageStyle.width}`,
            height: "100%",
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
            height: mediaHeight,
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
                    height: "100%",
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
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          height: mediaHeight,
          overflow: "hidden",
        }}
      >
        <img
          role="presentation"
          style={{
            width: isMobile ? "100%" : "50%",
            height: "100%",
            objectFit: "cover",
          }}
          src={`${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        <div
          role="presentation"
          style={{
            width: isMobile ? "100%" : "50%",
            height: "100%",
            textAlign: "center",
            verticalAlign: "middle",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 8,
          }}
          onClick={onZoom}
        >
          <PlusOutlined />
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

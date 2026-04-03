import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Typography } from "antd";
import PostForm from "./PostFrom";
import { SET_IS_POSTING } from "../reducers/ui";

const PopupPostCard = () => {
  const dispatch = useDispatch();
  const isPosting = useSelector((state) => state.ui.isPosting);

  const handleClose = useCallback(() => {
    dispatch({ type: SET_IS_POSTING, data: false });
  }, [dispatch]);

  return (
    <Modal
      title={
        <Typography.Title level={5} style={{ margin: 0, fontWeight: 600 }}>
          New post
        </Typography.Title>
      }
      open={isPosting}
      onCancel={handleClose}
      footer={null}
      centered
      destroyOnClose
      width={480}
      maskClosable
      styles={{
        mask: {
          background: "rgba(55, 65, 81, 0.55)",
          backdropFilter: "blur(2px)",
        },
        content: {
          borderRadius: "var(--radius-md, 16px)",
          padding: 0,
          overflow: "hidden",
          boxShadow: "var(--shadow-sm, 0 4px 24px rgba(16, 24, 40, 0.12))",
        },
        header: {
          margin: 0,
          padding: "10px 16px 8px",
          borderBottom: "1px solid var(--border-color, #e5e7eb)",
          minHeight: "auto",
        },
        body: {
          padding: "12px 16px 16px",
        },
      }}
    >
      <PostForm />
    </Modal>
  );
};

export default PopupPostCard;

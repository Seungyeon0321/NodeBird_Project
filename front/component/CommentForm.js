import React, { useCallback, useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import useInput from "../hooks/useInput";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { ADD_COMMENT_REQUEST } from "../reducers/post";
import CommonUserForm from "../hooks/useInput";

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const { addCommentDone, addCommentLoading } = useSelector(
    (state) => state.post
  );
  const id = useSelector((state) => {
    return state.user.me?.id;
  });

  const [commentText, onChangeCommentText, setCommentText] = CommonUserForm("");

  useEffect(() => {
    if (addCommentDone) {
      setCommentText("");
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: "relative", margin: 0 }}>
        <Input.TextArea
          value={commentText}
          onChange={onChangeCommentText}
          row={4}
        />
        <Button
          style={{ position: "absolute", right: 0, bottom: -40, zIndex: 1 }}
          type="primary"
          htmlType="submit"
          loading={addCommentLoading}
        >
          Leave A Comment
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;

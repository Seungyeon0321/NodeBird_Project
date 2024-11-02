import { Form, Button, Input } from "antd";
import React, { useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
} from "../reducers/post";
import CommonUserForm from "../hooks/useInput";

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);

  const [text, onChangeText, setText] = CommonUserForm("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append("image", p);
    });
    formData.append("content", text);

    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  const imageInput = useRef();
  const onclickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append("image", f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  });

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });

  return (
    <>
      <Form
        style={{ margin: "0px 0 20px" }}
        encType="multipart/form-data"
        onFinish={onSubmit}
      >
        <Input.TextArea
          value={text}
          onChange={onChangeText}
          maxLength={140}
          placeholder="Please write something..."
        />
        <div>
          <input
            type="file"
            name="image"
            multiple
            ref={imageInput}
            style={{ display: "none" }}
            onChange={onChangeImages}
          />
          <div style={{ marginTop: 10 }}>
            <Button onClick={onclickImageUpload}>Upload Image</Button>
            <Button type="primary" style={{ float: "right" }} htmlType="submit">
              Post
            </Button>
          </div>
        </div>
        <div>
          {imagePaths.map((v, i) => (
            <div key={`image-${i}`} style={{ display: "inline-block" }}>
              <img
                src={v.replace(/\/thumb\//, "/original/")}
                style={{ width: "200px" }}
                alt={v}
              />
              <div>
                <Button onClick={onRemoveImage(i)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </Form>
    </>
  );
};

export default PostForm;

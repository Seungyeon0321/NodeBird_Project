import { Form, Button, Input } from "antd";
import React, { useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
} from "../reducers/post";
import CommonUserForm from "../hooks/useInput";
import { CustomButton } from "../styles/GlobalStyleComponent";

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
  }, [dispatch]);

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  }, [dispatch]);

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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Button onClick={onclickImageUpload}>Upload Image</Button>
              <CustomButton type="primary" htmlType="submit" style={{ flex: "1 1 140px", minWidth: 140 }}>
                Post
              </CustomButton>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
          {imagePaths.map((v, i) => (
            <div key={`image-${i}`} style={{ width: "clamp(120px, 26vw, 200px)" }}>
              <img
                src={v.replace(/\/thumb\//, "/original/")}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 12,
                  display: "block",
                  border: "1px solid var(--border-color, #e5e7eb)",
                }}
                alt={v}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <Button size="small" danger onClick={onRemoveImage(i)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Form>
    </>
  );
};

export default PostForm;

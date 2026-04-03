import { Form, Button, Input, Typography } from "antd";
import React, { useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PictureOutlined } from "@ant-design/icons";
import styled from "styled-components";
import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
} from "../reducers/post";
import { SET_IS_POSTING } from "../reducers/ui";
import CommonUserForm from "../hooks/useInput";
import { CustomButton } from "../styles/GlobalStyleComponent";

const FormRoot = styled(Form)`
  margin: 0;
  width: 100%;
`;

const StyledTextArea = styled(Input.TextArea)`
  && {
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 15px;
    line-height: 1.5;
    border-color: var(--border-color, #e5e7eb);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  &&:hover,
  &&:focus {
    border-color: var(--color-primary, #a3cfcd);
  }
  &&:focus {
    box-shadow: 0 0 0 2px rgba(163, 207, 205, 0.25);
  }
`;

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color, #e5e7eb);
`;

const PreviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
`;

const PreviewItem = styled.div`
  width: clamp(100px, 28%, 160px);
`;

const PreviewImg = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  display: block;
  border: 1px solid var(--border-color, #e5e7eb);
  object-fit: cover;
  aspect-ratio: 1;
`;

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);

  const [text, onChangeText, setText] = CommonUserForm("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!addPostDone) return;
    setText("");
    dispatch({ type: SET_IS_POSTING, data: false });
  }, [addPostDone, dispatch]);

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
  }, [text, imagePaths, dispatch]);

  const imageInput = useRef();
  const onclickImageUpload = useCallback(() => {
    imageInput.current?.click();
  }, []);

  const onChangeImages = useCallback(
    (e) => {
      const imageFormData = new FormData();
      [].forEach.call(e.target.files, (f) => {
        imageFormData.append("image", f);
      });
      dispatch({
        type: UPLOAD_IMAGES_REQUEST,
        data: imageFormData,
      });
      e.target.value = "";
    },
    [dispatch]
  );

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch({
        type: REMOVE_IMAGE,
        data: index,
      });
    },
    [dispatch]
  );

  return (
    <FormRoot
      encType="multipart/form-data"
      onFinish={onSubmit}
      requiredMark={false}
    >
      <Typography.Text
        type="secondary"
        style={{ display: "block", marginBottom: 8, fontSize: 13 }}
      >
        What&apos;s happening?
      </Typography.Text>
      <StyledTextArea
        value={text}
        style={{ marginBottom: 12 }}
        onChange={onChangeText}
        maxLength={140}
        placeholder="Share something with your followers…"
        autoSize={{ minRows: 3, maxRows: 8 }}
        showCount={{
          formatter: ({ count, maxLength }) => (
            <span style={{ color: count > maxLength - 20 ? "#dc2626" : undefined }}>
              {count} / {maxLength}
            </span>
          ),
        }}
      />
      <input
        type="file"
        name="image"
        multiple
        accept="image/*"
        ref={imageInput}
        style={{ display: "none" }}
        onChange={onChangeImages}
      />
      <ActionsBar>
        <Button
          type="default"
          icon={<PictureOutlined />}
          onClick={onclickImageUpload}
          style={{
            borderRadius: 10,
            borderColor: "var(--border-color, #e5e7eb)",
          }}
        >
          Add photos
        </Button>
        <CustomButton
          type="primary"
          htmlType="submit"
          style={{ minWidth: 100, borderRadius: 10, marginRight: 0 }}
        >
          Post
        </CustomButton>
      </ActionsBar>
      {imagePaths.length > 0 && (
        <PreviewGrid>
          {imagePaths.map((v, i) => (
            <PreviewItem key={`image-${i}`}>
              <PreviewImg
                src={v.replace(/\/thumb\//, "/original/")}
                alt=""
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 6,
                }}
              >
                <Button size="small" type="text" danger onClick={onRemoveImage(i)}>
                  Remove
                </Button>
              </div>
            </PreviewItem>
          ))}
        </PreviewGrid>
      )}
    </FormRoot>
  );
};

export default PostForm;

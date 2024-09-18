import { Form, Button, Input } from "antd";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
} from "../reducers/post";
import CommonUserForm from "../hooks/useInput";
import { backURL } from "../config/config";

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);

  const [text, onChangeText, setText] = CommonUserForm("");
  const dispatch = useDispatch();

  //Submit 했을 때 text를 공백으로 하게 되면 만약 서버에서 문제가 생겨서 업로드를 하지 못했을 때 그 내용이 없어지기 때문에 이러한 부분은 user experience에 안좋은 영향을 미친다
  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    const formData = new FormData();
    imagePaths.forEach((p) => {
      //req.body.image
      formData.append("image", p);
    });
    //req.body.content가 된다
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
  //html type가 설정이 안되어있으면 button이 눌렸을 때 Form 자체가
  //그 작업을 수행했는지 모른다

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    //FormData 방식으로 해야 멀티 파트 형식의 데이터를 처리할 수 있다
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
        style={{ margin: "10px 0 20px" }}
        encType="multipart/form-data"
        onFinish={onSubmit}
      >
        <Input.TextArea
          value={text}
          onChange={onChangeText}
          maxLength={140}
          placeholder="There is something mysterious?"
        />
        <div>
          <input
            type="file"
            name="image" //이 녀석이 backend의 array에 전달
            multiple
            ref={imageInput}
            style={{ display: "none" }}
            onChange={onChangeImages}
          />
          <Button onClick={onclickImageUpload}>Upload Image</Button>
          <Button type="primary" style={{ float: "right" }} htmlType="submit">
            Post
          </Button>
        </div>
        <div>
          {imagePaths.map((v, i) => (
            <div key={v} style={{ display: "inline-block" }}>
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

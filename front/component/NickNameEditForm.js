import React, { useEffect, useCallback } from "react";
import { Form, Input } from "antd";
import { CHANGE_NICKNAME_REQUEST } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import useMessageAPI from "../component/message/messageAPI";

import useInput from "../hooks/useInput";

const NickNameEditForm = () => {
  const { me, changeNicknameDone } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || "");
  const dispatch = useDispatch();
  const { success, contextHolder } = useMessageAPI();

  const style = {
    marginBottom: "20px",
    border: "1px solid #d9d9d9",
    padding: "20px",
  };

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  useEffect(() => {
    if (changeNicknameDone) {
      success("Your nickname has successfully been changed");
    }
  }, [changeNicknameDone]);

  return (
    <Form style={style}>
      {contextHolder}
      <Input.Search
        value={nickname}
        onChange={onChangeNickname}
        addonBefore="NickName"
        enterButton="Correct"
        onSearch={onSubmit}
      />
    </Form>
  );
};

export default NickNameEditForm;

import React, { useMemo, useCallback } from "react";
import { Form, Input } from "antd";
import { CHANGE_NICKNAME_REQUEST } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";

import useInput from "../hooks/useInput";

const NickNameEditForm = () => {
  const { me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || "");
  const dispatch = useDispatch();

  const style = useMemo(
    () => (
      {
        marginButton: "20px",
        border: "1px solid #d9d9d9",
        padding: "20px",
      },
      []
    )
  );

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  return (
    <Form style={style}>
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

import React, { useState, useCallback } from "react";

//무언가 반복되는 함수가 있다고 하면 그 부분은 이렇게 custom hook
//으로 만드는 것을 권장한다

const CommonUserForm = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const userFormHandler = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return [value, userFormHandler, setValue];
};

export default CommonUserForm;

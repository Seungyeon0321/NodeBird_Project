import { message } from "antd";

const useMessageAPI = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = (content = "You are all set!", duration = 1) => {
    messageApi.open({
      type: "success",
      content,
      duration,
    });
  };

  const error = (content = "Signup failed. Please retry", duration = 1) => {
    messageApi.open({
      type: "error",
      content,
      duration,
    });
  };

  return { contextHolder, success, error };
};

export default useMessageAPI;

import React, { useCallback } from "react";
import Link from "next/link";
import { Avatar, Button, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logOutRequestAction } from "../reducers/user";
const { Meta } = Card;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, isLoggingOut } = useSelector((state) => state.user);

  const logoutHandler = useCallback(() => {
    dispatch(logOutRequestAction());
  }, []);

  return (
    <Card
      style={{ width: 300 }}
      actions={[
        <div key="twit">
          <Link href={`/user/${me.id}`}>
            Twit
            <br />
            {me.Posts.length}
          </Link>
        </div>,
        <div key="followings">
          <Link href={`/profile`}>
            Followings
            <br />
            {me.Followings.length}
          </Link>
        </div>,
        <div key="followers">
          <Link href={`/profile`}>
            Followers
            <br />
            {me.Followers.length}
          </Link>
        </div>,
      ]}
    >
      <Meta
        avatar={
          <Link href={`/user/${me.id}`} prefetch={false}>
            <Avatar
              shape="square"
              size={64}
              icon={<UserOutlined />}
              title={me.nickname}
            ></Avatar>
          </Link>
        }
        title={me.nickname}
        description={
          <Button onClick={logoutHandler} loading={isLoggingOut}>
            Log Out
          </Button>
        }
      />
    </Card>
  );
};

export default UserProfile;

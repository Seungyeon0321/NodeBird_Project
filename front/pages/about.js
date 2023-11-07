import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import AppLayout from "../component/layout";
import { LOAD_USER_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import Head from "next/head";
import { Card, Popover, Button, Avatar, List, Skeleton } from "antd";

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <Head>
        <title>Seungyeon | NodeBird</title>
      </Head>
      {userInfo ? (
        <Card
          style={{ width: 300 }}
          actions={[
            <div key="twit">
              Twit
              <br />
              {userInfo.Posts}
            </div>,
            <div key="followings">
              Followings
              <br />
              {userInfo.Followings}
            </div>,
            <div key="followers">
              Followers
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
            description="지승연 짱"
          />
        </Card>
      ) : null}
    </AppLayout>
  );
};

//언제 접속해도 바뀌지 않은 데이터는 getStaticProps를 사용
//접속할때마다 그 상황에 따라 바뀌는 녀석은 getServerSideProp을 사용
export const getStaticProps = wrapper.getStaticProps(
  (store) => async (context) => {
    store.dispatch({
      type: LOAD_USER_REQUEST,
      data: 1,
    });
    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);
export default About;

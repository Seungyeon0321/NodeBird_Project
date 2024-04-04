import { useSelector } from "react-redux";
import AppLayout from "../component/layout";
import { LOAD_USER_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import Head from "next/head";
import { Card, Avatar } from "antd";

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  console.log(userInfo);
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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    store.dispatch({
      type: LOAD_USER_REQUEST,
      data: 8,
    });
    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);
export default About;

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import Head from "next/head";
import AppLayout from "../../component/layout";
import PostCard from "../../component/PostCard";
import wrapper from "../../store/configureStore";
import { useRouter } from "next/router";
import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../../reducers/user";
import { END } from "redux-saga";
import { Card, Avatar } from "antd";

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { mainPosts, hasMorePost, loadPostLoading } = useSelector(
    (state) => state.post
  );
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostLoading) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId:
              mainPosts[mainPosts.length - 1] &&
              mainPosts[mainPosts.length - 1].id,
            data: id,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length, hasMorePost, id, loadPostLoading]);

  return (
    <AppLayout>
      <Head>
        <title>{userInfo.nickname}</title>

        <meta name="description" content={`A post by ${userInfo.nickname}`} />
        <meta property="og:title" content={userInfo.content}></meta>
        <meta
          property="og:description"
          content={`The post by ${userInfo.nickname}`}
        ></meta>

        <meta
          property="og:image"
          content={"https://nodebird.com/favicon.ico"}
        ></meta>
        <meta
          property="og:url"
          content={`https://nodebird.com/user/${id}`}
        ></meta>
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
          />
        </Card>
      ) : null}
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    store.dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: context.params.id,
    });
    store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    store.dispatch({
      type: LOAD_USER_REQUEST,
      data: context.params.id,
    });

    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);

export default User;

import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import AppLayout from "../component/layout";
import PostCard from "../component/PostCard";
import PostForm from "../component/PostFrom";
import SignUp from "../component/signup";
import Login from "../component/login";
import UserProfile from "../component/UserProfile";

import { LOAD_POST_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";

import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { me, clickNavSignup, clickNavLogin, isLoggedIn } = useSelector(
    (state) => state.user
  );
  const { mainPosts, hasMorePost, loadPostLoading, retweetError } = useSelector(
    (state) => state.post
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POST_REQUEST,
            lastId,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePost, loadPostLoading, mainPosts]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch({ type: LOAD_POST_REQUEST });
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (!loadPostLoading && mainPosts.length > 0) {
      setIsLoading(false);
    }
  }, [loadPostLoading, mainPosts]);

  return (
    <>
      <AppLayout
        profile={me && <UserProfile />}
        postFrom={me && <PostForm />}
        content={(() => {
          if (isLoading) {
            return <div>Loading...</div>;
          } else if (clickNavSignup) {
            return <SignUp />;
          } else if (clickNavLogin && !isLoggedIn) {
            return <Login />;
          } else {
            return mainPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ));
          }
        })()}
      />
    </>
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
      type: LOAD_MY_INFO_REQUEST,
    });

    store.dispatch({
      type: LOAD_POST_REQUEST,
    });
    store.dispatch(END);

    await store.sagaTask.toPromise();
  }
);

export default Home;

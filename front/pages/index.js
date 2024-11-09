import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import AppLayout from "../component/PageLayout.js";
import PostCard from "../component/PostCard.js";
import PostForm from "../component/PostFrom.js";
import SignUp from "../component/SignupPage.js";
import Login from "../component/LoginPage.js";
import UserProfile from "../component/UserProfile.js";

import { LOAD_POST_REQUEST } from "../reducers/post.js";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user.js";
import wrapper from "../store/configureStore.js";
import { END } from "redux-saga";

import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { me, isLoggedIn } = useSelector((state) => state.user);

  const { mainPosts, hasMorePost, loadPostLoading, retweetError } = useSelector(
    (state) => state.post
  );

  const [isLoading, setIsLoading] = useState(true);

  const { currentView } = useSelector((state) => state.ui);

  // UI
  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    switch (currentView) {
      case "login":
        return !isLoggedIn && <Login />;
      case "signup":
        return <SignUp />;
      case "main":
      default:
        return mainPosts.map((post, index) => (
          <PostCard key={`${post.id}-${index}`} post={post} />
        ));
    }
  };

  // Error handling
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  // Scroll event
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

  // Load post
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
        content={renderContent()}
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

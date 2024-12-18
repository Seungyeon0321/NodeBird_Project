import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import AppLayoutPage from "../component/PageLayout";
import PostCard from "../component/PostCard";
import PostForm from "../component/PostFrom";
import SignUp from "../component/screens/SignupPage";
import Login from "../component/screens/LoginPage";
import FollowScreen from "../component/screens/FollowScreen";
import LikeScreen from "../component/screens/LikeScreen";
import { LOAD_POST_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";

import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { me, isLoggedIn } = useSelector((state) => state.user);
  const { isPosting } = useSelector((state) => state.ui);
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
      case "following":
        return <FollowScreen />;
      case "follower":
        return <FollowScreen />;
      case "like":
        return <LikeScreen />;
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
    <div style={{ display: "flex", justifyContent: "center" }}>
      <AppLayoutPage
        postFrom={me && isPosting ? <PostForm /> : ""}
        content={renderContent()}
      />
    </div>
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

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import Head from "next/head";
import AppLayout from "../../component/PageLayout.js";
import PostCard from "../../component/PostCard.js";
import wrapper from "../../store/configureStore.js";
import { useRouter } from "next/router";
import { LOAD_HASHTAG_POSTS_REQUEST } from "../../reducers/post.js";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user.js";
import { END } from "redux-saga";

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;
  const { mainPosts, hasMorePost, loadPostLoading } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostLoading) {
          dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            lastId:
              mainPosts[mainPosts.length - 1] &&
              mainPosts[mainPosts.length - 1].id,
            data: tag,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length, hasMorePost, tag, loadPostLoading]);

  return (
    <AppLayout>
      {mainPosts.map((post) => (
        <React.Fragment key={`meta-${post.id}`}>
          <Head>
            <title>{post.User.nickname}</title>
            <meta property="og:title" content={post.content}></meta>
            <meta
              property="og:description"
              content={`The post by ${post.User.nickname}`}
            ></meta>
            <meta
              property="og:image"
              content={
                post.Images[0]
                  ? post.Images[0].src
                  : "https://nodebird.com/favicon.ico"
              }
            ></meta>
            <meta
              property="og:url"
              content={`https://nodebird.com/post/${post.id}`}
            ></meta>
          </Head>
          <PostCard post={post} />
        </React.Fragment>
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
      type: LOAD_MY_INFO_REQUEST,
    });
    store.dispatch({
      type: LOAD_HASHTAG_POSTS_REQUEST,
      data: context.params.tag,
    });

    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);

export default Hashtag;

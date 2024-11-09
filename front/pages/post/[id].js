// post/[id].js
import React from "react";
import { useRouter } from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POSTS_REQUEST } from "../../reducers/post";
import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../../store/configureStore";
import AppLayout from "../../component/PageLayout";
import PostCard from "../../component/PostCard";
import { useSelector } from "react-redux";
import Head from "next/head";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost, loadPostsError } = useSelector((state) => state.post);

  if (loadPostsError) {
    return loadPostsError;
  }

  return (
    <AppLayout>
      {singlePost && (
        <>
          <Head>
            <title>{singlePost.User.nickname}</title>

            <meta property="og:title" content={singlePost.content}></meta>
            <meta
              property="og:description"
              content={`The post by ${singlePost.User.nickname}`}
            ></meta>

            <meta
              property="og:image"
              content={
                singlePost.Images[0]
                  ? singlePost.Images[0].src
                  : "https://nodebird.com/favicon.ico"
              }
            ></meta>
            <meta
              property="og:url"
              content={`https://nodebird.com/post/${id}`}
            ></meta>
          </Head>
          <PostCard post={singlePost}></PostCard>
        </>
      )}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    console.log("=====================================");
    console.log("Server Side Props Called", context.req.headers);
    console.log("context.params:", context.params);
    console.log("context.query:", context.query);
    console.log("=====================================");

    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    store.dispatch({
      type: LOAD_POSTS_REQUEST,
      data: context.params.id,
    });
    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);

export default Post;

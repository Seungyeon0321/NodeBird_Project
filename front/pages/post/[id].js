// post/[id].js

import { useRouter } from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POSTS_REQUEST } from "../../reducers/post";
import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../../store/configureStore";
import AppLayout from "../../component/layout";
import PostCard from "../../component/PostCard";
import { useSelector } from "react-redux";
import Head from "next/head";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost, loadPostsError } = useSelector((state) => state.post);

  //이런식으로 에러 핸들링 하는 것이다//FAILURE에서 받은 STATE를 이용
  if (loadPostsError) {
    return loadPostsError;
  }

  return (
    <AppLayout>
      {/* 싱글 게시물 같은 경우에는 게시물에 대해서 좀 더 정보를
      많이 넘어줌으로써 검색창에 걸리도록 해주는 것이 좋다 */}
      <Head>
        <title>{singlePost.User.nickname}</title>
      </Head>
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
      <PostCard post={singlePost}></PostCard>
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
      type: LOAD_POSTS_REQUEST,
      //context.params.id가 router.query랑 동일하게 id에 접근할 수 있게 해준다
      data: context.params.id,
    });
    //이 녀석이 있어야지 request만 보내는 게 아니라 거기에 대한 석세스도 받아서 돌려줄 수 있다
    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);

export default Post;

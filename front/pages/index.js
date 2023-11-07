import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import AppLayout from "../component/layout";
import PostCard from "../component/PostCard";
import PostForm from "../component/PostFrom";
import { LOAD_POST_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostLoading, retweetError } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  //처음에는 로딩하다가 다시 로딩하는 시기는 아래의 로직으로 만들 수 있다

  //post에서는 모든 포스트를 보여주는 것이 아니라, 10개를 먼저 보여주고 그다음에 스크롤이 내리면 보여주는 방식으로 해야하는데, 이는 limit과 offset을 이용해서 할 수 있다

  //useEffect에서 window method를 쓸 경우에는 무조건 return을 넣어줘야하고 removeEventLister을 안하면 게속이 이벤트가 메모리에 쌓여있어서 좋지 않다
  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        //해당 조건이 false가 됐을 때만 동작,
        // Success가 되는 순간 loadpostloading은 false가 되기 때문에
        //request를 보내는 순간 request의 dispatch와 함께 loadpostloading은
        //true에서 false로 바뀌기 때문에 그 순간에만 해당 액션을 한번만 보낸다
        if (hasMorePost && !loadPostLoading) {
          //mainPost가 없을 경우에는 값이 없을 수가 있어서 에러가 발생할 수 있으니 ?을 추가해줌으로써
          //에러부터 보호해줘야 한다
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POST_REQUEST,
            lastId,
          });
        }
      }
      console.log(
        //내가 가장 위에서 얼만큼 내렸는지
        window.scrollY,
        //화면에서 보이는 길이
        document.documentElement.clientHeight,
        //스크롤바 위에서 아래까지 총 길이
        document.documentElement.scrollHeight
      );
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePost, loadPostLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

//이렇게 함으로써 home보다 먼저 실행되게 할 수 있다
//서버 사이드 렌더링은 next13에서부터 안쓰게 됨
/////////////////////////서버 사이드 렌더링/////////////////
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    //여기 context에 store에 들어 있어야 하는데 좀 다르다
    //이 위에 두줄을 추가함으로써
    //로그인이 계속 되어 있는 상태를
    //만들어야 한다, 프론트
    //서버에서는 헤더에서 쿠기를
    //따로 전달을 하지 않기 때문에,
    //(브라우저에서는 자동으로 생성하여) 이를 따로 만들어줘야한다/
    //하지만 이런식으로 하게 되면
    //해당 cookie를 다른 사람과 다
    //공유하게 되버리는 엄청난
    //문제점이 생길 수 있다, 그렇기
    //때문에 이렇게 if문을
    //넣음으로써 장치를 마련해야 한다
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
    //이 녀석이 있어야지 request만 보내는 게 아니라 거기에 대한 석세스도 받아서 돌려줄 수 있다
    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);

//게시글에 key를 설정할때는 지워질 가능성이 있는 게시물에는 index
//를 key value로 지정하면 절대로 안된다. 나중에 수정 가능성이 있을
//경우에는 index를 key로 주는 것을 피해야 한다

//이 경우에는 프론트 서버에서 백엔드로 보내고 있기 때문에
//다시 CROS 작업을 해줘야 한다.

export default Home;

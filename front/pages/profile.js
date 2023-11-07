import AppLayout from "../component/layout";
import Head from "next/head";
import NickNameEditForm from "../component/NickNameEditForm";
import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import FollowList from "../component/FollowList";
import { useSelector } from "react-redux";
import axios from "axios";
import { END } from "redux-saga";
import useSWR from "swr";
import wrapper from "../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { LOAD_POST_REQUEST } from "../reducers/post";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);

  //사실 이렇게 데이터를 가지고 오는게 이상적이진 않다, 왜냐면
  //이렇게 데이터를 가지고 오게 되면 3를 가지고 오고 더보기를
  //눌렀을 때 앞 전에 데이터 3개가 중복되기 때문이다,
  //prev 데이터에서 새로운 데이터를 받아오기 때문에

  //해결책으로써는 앞전에 불러왔던 녀석을 cashing해두고
  //새로운 녀석만 받아오게 되는 것이다

  //로드 액션이 꼭 SSR이 아니면 SWR 써도 무방하다,
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  //// swr 쓰는 준비 끝내기 - 이 작업으로 보통 끝나기 때문에
  //// 따로 reducer에서 액션을 만들 필요가 없음
  const { data: followersData, error: followerError } = useSWR(
    `http://localhost:3065/user/followers?limit=${followersLimit}`,
    fetcher
  );
  const { data: followingsData, error: followingError } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher
  );

  //이렇게 디스패치를 지울 수 있다
  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_FOLLOWERS_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_FOLLOWINGS_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("./");
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return "내 정보 로딩중...";
  }

  if (followerError || followingError) {
    console.log(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>My Profile | Node Bird</title>
      </Head>
      <AppLayout>
        <NickNameEditForm />
        <FollowList
          header="Followings"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingError}
        />
        <FollowList
          header="Followers"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && followerError}
        />
      </AppLayout>
      ;
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
    //이 녀석이 있어야지 request만 보내는 게 아니라 거기에 대한 석세스도 받아서 돌려줄 수 있다
    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);

export default Profile;

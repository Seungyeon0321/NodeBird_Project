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
import { backURL } from "../config/config";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);

  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(
    `${backURL}/user/followers?limit=${followersLimit}`,
    fetcher
  );
  const { data: followingsData, error: followingError } = useSWR(
    `${backURL}/user/followings?limit=${followingsLimit}`,
    fetcher
  );

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
    return "loading";
  }

  if (followerError || followingError) {
    return <div>The follow and follower cannot be found</div>;
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
    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);

export default Profile;

import React, { useCallback } from "react";
import { Button } from "antd";
import propTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, followingLoading, unfollowingLoading } = useSelector(
    (state) => state.user
  );
  const isFollowing = me?.Followings.find((v) => v.id === post.User.id);

  const onClickButton = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: post.User.id,
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post.User.id,
      });
    }
  }, [isFollowing]);

  if (post.User.id === me.id) {
    return null;
  }

  return (
    <Button
      style={isFollowing ? { backgroundColor: "#a3cfcd", color: "white" } : {}}
      loading={followingLoading || unfollowingLoading}
      onClick={onClickButton}
    >
      {isFollowing ? "UnFollow" : "follow"}
    </Button>
  );
};

FollowButton.propTypes = {
  post: propTypes.object.isRequired,
};

export default FollowButton;

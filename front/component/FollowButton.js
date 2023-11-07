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
        //그럼 그 사람 아이디는 어떻게 얻을까? 이미 이 부분은 generatePost의 함수에서 임의로 만들도록 되어있기 때문에 받을 수 있다.
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

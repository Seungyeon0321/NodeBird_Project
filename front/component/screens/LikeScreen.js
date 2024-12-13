import React from "react";
import { useSelector } from "react-redux";
import PostCard from "../PostCard";

const LikeScreen = () => {
  const { mainPosts } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);

  let likedPost = [];

  mainPosts.filter((post) => {
    if (post.Likers.length == 0) {
      return;
    }
    if (post.Likers[0].id == me.id) {
      likedPost.push(post);
    }
  });

  return (
    <>
      {likedPost.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default LikeScreen;

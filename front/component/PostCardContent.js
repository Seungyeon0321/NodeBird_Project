import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const PostCardContent = ({ postData }) => {
  return (
    <div>
      {/* 해쉬태그를 추출해주는 공식표현,  */}
      {postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if (v.match(/(#[^\s#]+)/g)) {
          return (
            <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}>
              {v}
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
};

PostCardContent.propTypes = { postData: PropTypes.string.isRequired };

export default PostCardContent;

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { Input, Button } from "antd";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const PostCardContent = ({
  postData,
  editMode,
  onChangePost,
  onCancelUpdatePost,
}) => {
  const { updatePostLoading, updatePostDone } = useSelector(
    (state) => state.post
  );
  const [editContent, setEditContent] = useState(postData);

  const onChangeContent = useCallback((e) => {
    setEditContent(e.target.value);
  }, []);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdatePost();
    }
  }, [updatePostDone]);

  return (
    <div>
      {editMode ? (
        <>
          <TextArea value={editContent} onChange={onChangeContent} />
          <Button.Group>
            <Button
              loading={updatePostLoading}
              onClick={onChangePost(editContent)}
            >
              Modify
            </Button>
            <Button type="danger" danger onClick={onCancelUpdatePost}>
              Cancel
            </Button>
          </Button.Group>
        </>
      ) : (
        postData.split(/(#[^\s#]+)/g).map((v, i) => {
          if (v.match(/(#[^\s#]+)/g)) {
            return (
              <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}>
                {v}
              </Link>
            );
          }
          return v;
        })
      )}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onChangePost: PropTypes.func.isRequired,
  onCancelUpdatePost: PropTypes.func.isRequired,
};

PostCardContent.defaultProps = {
  editMode: false,
};

export default PostCardContent;

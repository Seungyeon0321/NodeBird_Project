import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Card, Popover, Button, Avatar, List, Skeleton, Typography } from "antd";
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
  HeartTwoTone,
} from "@ant-design/icons";
import Link from "next/link";
import styled from "styled-components";

import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import FollowButton from "./FollowButton";

import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
  UPDATE_POST_REQUEST,
} from "../reducers/post";
import moment from "moment";

moment.locale("ko");

const CardShell = styled.div`
  margin-bottom: 14px;
`;

const cardStyles = {
  header: {
    minHeight: "auto",
    padding: "10px 14px",
    borderBottom: "1px solid var(--border-color, #e5e7eb)",
  },
  body: {
    padding: "15px 14px 10px",
  },
  actions: {
    padding: "6px 8px",
    margin: 0,
    borderTop: "1px solid var(--border-color, #e5e7eb)",
  },
};

const cardSurfaceStyle = {
  borderRadius: "var(--radius-md, 16px)",
  overflow: "hidden",
  background: "var(--surface, #ffffff)",
  border: "1px solid var(--border-color, #e5e7eb)",
  boxShadow: "var(--shadow-sm, 0 1px 2px rgba(16, 24, 40, 0.06))",
};

const PostHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const PostHeaderMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const PostHeaderRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 2px;
`;

const NicknameLink = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: #111827;
  line-height: 1.3;
  &:hover {
    color: var(--color-primary, #a3cfcd);
  }
`;

function PostBody({ post, user, editMode, onCancelUpdatePost, onChangePost }) {
  const dateStr = moment(post.createdAt).format("YYYY.MM.DD HH:mm");

  return (
    <PostHeader>
      <Link href={`/user/${user.id}`} prefetch={false}>
        <Avatar
          size={42}
          style={{
            backgroundColor: "var(--color-primary, #a3cfcd)",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {user.nickname?.[0]}
        </Avatar>
      </Link>
      <PostHeaderMain>
        <PostHeaderRow>
          <Link href={`/user/${user.id}`} prefetch={false} style={{ textDecoration: "none" }}>
            <NicknameLink>{user.nickname}</NicknameLink>
          </Link>
          <Typography.Text type="secondary" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
            {dateStr}
          </Typography.Text>
        </PostHeaderRow>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: "#374151" }}>
          <PostCardContent
            postData={post.content}
            editMode={editMode}
            onCancelUpdatePost={onCancelUpdatePost}
            onChangePost={onChangePost}
          />
        </div>
      </PostHeaderMain>
    </PostHeader>
  );
}

const PostCard = ({ post }) => {
  const { removePostLoading } = useSelector((state) => state.post);
  const [editMode, setEditMode] = useState(false);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const dispatch = useDispatch();

  const onClickUpdate = useCallback(() => {
    setEditMode(true);
  }, []);

  const onCancelUpdatePost = useCallback(() => {
    setEditMode(false);
  }, []);

  const onChangePost = useCallback(
    (editContent) => () => {
      dispatch({
        type: UPDATE_POST_REQUEST,
        data: {
          postId: post.id,
          content: editContent,
        },
      });
    },
    [post, dispatch]
  );

  const id = useSelector((state) => state.user.me?.id);

  const liked = post.Likers?.find((v) => v.id === id);

  const onLike = useCallback(() => {
    if (!id) {
      return alert("You need to login first");
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id, dispatch, post.id]);

  const onUnlike = useCallback(() => {
    if (!id) {
      return alert("You need to login first");
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id, dispatch, post.id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert("You need to login first");
    }
    return dispatch({ type: REMOVE_POST_REQUEST, data: post.id });
  }, [id, dispatch, post.id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert("You need to login first");
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id, dispatch, post.id]);

  const actionIconStyle = { fontSize: 18, padding: "4px 8px" };

  return (
    <CardShell>
      <Card
        style={cardSurfaceStyle}
        styles={cardStyles}
        cover={post.Images?.[0] ? <PostImages images={post.Images} /> : undefined}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} style={actionIconStyle} />,
          <div key={`like-${post.id}`}>
            {liked ? (
              <HeartTwoTone twoToneColor="#eb2f96" onClick={onUnlike} style={actionIconStyle} />
            ) : (
              <HeartOutlined onClick={onLike} style={actionIconStyle} />
            )}
          </div>,
          <MessageOutlined
            key={`comment-${post.id}`}
            onClick={onToggleComment}
            style={actionIconStyle}
          />,
          <Popover
            key={`more-${post.id}`}
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    {!post.RetweetId && (
                      <Button key={`modify-${post.id}`} onClick={onClickUpdate}>
                        Modify
                      </Button>
                    )}
                    <Button
                      key={`delete-${post.id}`}
                      type="primary"
                      danger
                      onClick={onRemovePost}
                      loading={removePostLoading}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button key={`report-${post.id}`}>Report</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined style={actionIconStyle} />
          </Popover>,
        ]}
        title={
          post.RetweetId ? (
            <Typography.Text style={{ fontSize: 13 }}>
              <RetweetOutlined style={{ marginRight: 6, color: "var(--color-primary, #a3cfcd)" }} />
              {post.User.nickname}님이 리트윗했습니다
            </Typography.Text>
          ) : null
        }
        extra={id ? <FollowButton post={post} /> : null}
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            size="small"
            bordered
            style={{ marginTop: 4, borderRadius: 12 }}
            styles={{
              body: { padding: "10px 12px" },
            }}
            cover={
              post.Retweet.Images?.[0] ? (
                <PostImages images={post.Retweet.Images} />
              ) : undefined
            }
          >
            <PostBody
              post={post.Retweet}
              user={post.Retweet.User}
              editMode={editMode}
              onCancelUpdatePost={onCancelUpdatePost}
              onChangePost={onChangePost}
            />
          </Card>
        ) : (
          <PostBody
            post={post}
            user={post.User}
            editMode={editMode}
            onCancelUpdatePost={onCancelUpdatePost}
            onChangePost={onChangePost}
          />
        )}
      </Card>
      {commentFormOpened && (
        <div
          style={{
            marginTop: 10,
            padding: "12px 14px",
            background: "var(--surface, #fff)",
            borderRadius: "var(--radius-md, 16px)",
            border: "1px solid var(--border-color, #e5e7eb)",
          }}
        >
          <CommentForm post={post} />
          <List
            className="demo-loadmore-list"
            header={<Typography.Text strong>Comments</Typography.Text>}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <List.Item
                key={`comment-${item.id}`}
                actions={[
                  <a key={`comment-${item.id}-edit`}>Edit</a>,
                  <a key={`comment-${item.id}-more`}>More</a>,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    author={item.User.nickname}
                    avatar={
                      <Link href={`/user/${item.User.id}`} prefetch={false}>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </Link>
                    }
                    title={<span>{item.User.nickname}</span>}
                    description={item.content}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </div>
      )}
    </CardShell>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;

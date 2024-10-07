import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Card, Popover, Button, Avatar, List, Skeleton } from "antd";
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
  HeartTwoTone,
} from "@ant-design/icons";
import Link from "next/link";
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
        date: {
          postId: post.id,
          content: editContent,
        },
      });
    },
    [post]
  );

  const id = useSelector((state) => {
    return state.user.me?.id;
  });

  const liked = post.Likers.find((v) => v.id === id);

  const onLike = useCallback(() => {
    if (!id) {
      return alert("You need to login first");
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onUnlike = useCallback(() => {
    if (!id) {
      return alert("You need to login first");
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert("You need to login first");
    }
    return dispatch({ type: REMOVE_POST_REQUEST, data: post.id });
  }, []);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert("You need to login first");
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        style={{ background: "#faf8ff" }}
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone
              twoToneColor="#eb2f96"
              key="heart"
              onClick={onUnlike}
            />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    {!post.RetweetId && (
                      <Button onClick={onClickUpdate}>Modify</Button>
                    )}
                    <Button
                      type="primary"
                      danger
                      onClick={onRemovePost}
                      loading={removePostLoading}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button>
                    {`Report${post.User.id}-
                    ${id}`}
                  </Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={
          post.RetweetId ? `It's retweeted by ${post.User.nickname}` : null
        }
        //로그인 했을 때만 post의 Follow 버튼이 보이게 한다
        extra={id && <FollowButton post={post}></FollowButton>}
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <div style={{ float: "right" }}>
              {moment(post.createdAt).format("YYYY.MM.DD")}
            </div>
            {/* moment를 쓰게 되면 편하게 현재 날짜를 만들 수 있다, 한번 찾아보기!*/}
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`} prefetch={false}>
                  <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={
                <PostCardContent
                  postData={post.Retweet.content}
                  editMode={editMode}
                  onCancelUpdatePost={onCancelUpdatePost}
                  onChangePost={onChangePost}
                ></PostCardContent>
              }
            />
          </Card>
        ) : (
          <>
            <div style={{ float: "right" }}>
              {moment(post.createdAt).format("YYYY.MM.DD")}
            </div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.User.id}`} prefetch={false}>
                  <Avatar>{post.User.nickname[0]}</Avatar>
                </Link>
              }
              title={post.User.nickname}
              description={
                <PostCardContent
                  postData={post.content}
                  onCancelUpdatePost={onCancelUpdatePost}
                  onChangePost={onChangePost}
                >
                  #해시태그
                </PostCardContent>
              }
            />
          </>
        )}
      </Card>
      {commentFormOpened && (
        <div>
          {/* 게시글의 아이디가 필요하기 때문에 post 프롬을 넘겨주는 중 */}
          <CommentForm post={post} />
          <List
            className="demo-loadmore-list"
            header={`Total Comments`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key="list-loadmore-edit">Edit</a>,
                  <a key="list-loadmore-more">More</a>,
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
                    title={
                      // 여기 a을 클릭하면 그 사람 profile이 뜰 수 있도록 설정
                      <a href="https://ant.design">{item.User.nickname}</a>
                    }
                    description={item.content}
                  />
                  <div>content</div>
                </Skeleton>
              </List.Item>
            )}
          ></List>
        </div>
      )}
      {/* {<CommentForm></CommentForm>} 
      <Comments></Comments> */}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    user: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comment: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;

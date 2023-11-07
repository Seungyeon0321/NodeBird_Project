import React from "react";
import { Card, List, Button, Row, Space } from "antd";
import { StopOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from "../reducers/user";
import { useDispatch } from "react-redux";

const FollowList = ({ data, header, onClickMore, loading }) => {
  const dispatch = useDispatch();

  //반복문에 대한 onclick같은 경우는 이렇게 고차 함수로 해결하자
  //반복문에서 item을 받아야 할 경우 이런식으로 고차 함수를 만들어야 한다

  const onCancel = (id) => () => {
    if (header === "Followings") {
      dispatch({
        //이건 내간 팔로잉 한 사람을 지우는 거고
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    }
    dispatch({
      //이건 내가 팔로워를 당했을 때 지우는 거다
      type: REMOVE_FOLLOWER_REQUEST,
      data: id,
    });
  };

  return (
    <List
      style={{ marginBottom: 20 }}
      grid={{ gutter: 4, xs: 2, md: 3, column: 3 }}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <Button onClick={onClickMore} loading={loading}>
            See More
          </Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: 20 }}>
          <Card
            actions={[<StopOutlined key="stop" onClick={onCancel(item.id)} />]}
          >
            <Card.Meta description={item.nickname}></Card.Meta>
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.PropTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FollowList;

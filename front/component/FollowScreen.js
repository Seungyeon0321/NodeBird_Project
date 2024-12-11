import React, { useEffect, useState } from "react";
import { Avatar, List, Skeleton, Popconfirm } from "antd";
import { SearchWrapper } from "../styles/GlobalStyleComponent";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

//need to make more button, 그리고 계속 안바뀌게도 해야함
const FollowScreen = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [picture, setPicture] = useState([]);

  const currentView = useSelector((state) => state.ui.currentView);
  const followings = useSelector((state) => state.user.me.Followings);
  const followers = useSelector((state) => state.user.me.Followers);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://randomuser.me/api/?results=${followings.length}&inc=name,gender,email,nat,picture&noinfo`
        );

        const data = await response.json();
        setPicture(data.results);
        setInitLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setInitLoading(false);
      }
    };

    if (followings.length > 0) {
      fetchData();
    }
  }, [followings.length]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: "20px",
        marginRight: "20px",
      }}
    >
      <SearchWrapper
        placeholder="search follower"
        style={{ width: "500px", alignSelf: "center", marginBottom: "20px" }}
      />
      <div
        style={{
          marginTop: "10px",
          marginLeft: "10px",
          marginBottom: "10px",
          fontSize: "20px",
        }}
      >
        All {currentView === "following" ? "Followings" : "Followers"}
      </div>
      {!initLoading && (
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          dataSource={currentView === "following" ? followings : followers}
          style={{ marginLeft: "10px" }}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <>
                  <Popconfirm
                    title="Remove"
                    description="Are you sure to remote this person?"
                    onConfirm={() => console.log("Confirm")}
                    onCancel={() => console.log("Cancel")}
                    okText="Yes"
                    cancelText="No"
                  >
                    <a key="list-loadmore-edit">remove</a>
                  </Popconfirm>
                </>,
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  avatar={
                    <Avatar
                      size={50}
                      src={picture[index].picture.large}
                      icon={<UserOutlined />}
                    />
                  }
                  title={<a href="https://ant.design">{item.nickname}</a>}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
export default FollowScreen;

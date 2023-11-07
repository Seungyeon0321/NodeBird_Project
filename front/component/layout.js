import PropTypes from "prop-types";
import Link from "next/link";
import { useCallback } from "react";
import { Menu, Input, Row, Col } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import CommonUserForm from "../hooks/useInput";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import Router from "next/router";

const SearchWrapper = styled(Input.Search)`
  vertical-align: middle;
`;
//만약 이런식으로 styled-components를 이용하는 것이 싫다면
//useMemo를 이용하는 것도 하나의 방법이다

// const style = useMemo(() => ({
// marginTop:10
// }),[])

//이런식으로 만들어서 style={{style}} 라고 해주면 이 useMemo는
//rendering이 되도 변화가 없는한 rendering을 하지 않기 때문에 최적화 측면에서 좋다

const AppLayout = ({ children }) => {
  const [searchInput, onChangeSearchInput] = CommonUserForm("");
  //이 loginState 바뀌면 알아서 다 바뀐다
  const { me } = useSelector((state) => state.user);

  //enter을 누르게 되면 onSearch가 실행되게 된다
  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">Node Bird</Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">Profile</Link>
        </Menu.Item>
        <SearchWrapper
          enterButton
          value={searchInput}
          onChange={onChangeSearchInput}
          onSearch={onSearch}
        />
      </Menu>
      <Row gutter={8}>
        <Col xs={12}>{me ? <UserProfile /> : <LoginForm />}</Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a rel="noreferred noopner">Let's go!</a>
        </Col>
      </Row>
    </div>
  );
};

export default AppLayout;

AppLayout.prototype = {
  children: PropTypes.node.isRequired,
};

import styled, { createGlobalStyle } from "styled-components";

//이렇게 스타일만 빼서 좋은점은 재사용할 수 있다는 점이다
export const Overlay = styled.div`
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Header = styled.header`
  header: 44px;
  background: white;
  position: relative;
  padding: 0;
  text-align: center;

  & h1 {
    margin: 0;
    font-size: 17px;
    color: #333;
    line-height: 44px;
  }
`;

export const CloseButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px;
  line-height: 14px;
  cursor: pointer;
  border-style: none;
`;

export const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  background: #090909;
`;

export const ImageWrapper = styled.div`
  padding: 32px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-height: 750px;
  }
`;

export const Indicator = styled.div`
  text-align: center;

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;

//보통 slick같은 경우는 pre-set된 class names가 적용되어 있기 때문에
//createGlobalStyle로 해당 class에 적용된 효과를 덮어쓰일수 있다
export const Global = createGlobalStyle`
  .slick-slide {
    display: inline-block
  }
  .ant-card-cover {
    transform: none !important
  }
`;

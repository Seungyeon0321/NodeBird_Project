---
name: NodeBird 프로젝트 공통 패턴 및 반복 이슈
description: NodeBird 프론트엔드 코드베이스에서 발견된 반복 안티패턴, 아키텍처 특이사항, 컴포넌트 규약
type: project
---

## 기술 스택
- Next.js (pages router), React, Redux + redux-saga, Ant Design, styled-components, SWR
- 컴포넌트 디렉토리: `front/component/` (단수 — components 아님 주의)
- 스타일 전역 파일: `front/styles/GlobalStyleComponent.js`

## 반복 발견된 안티패턴

### 1. ant.design 외부 링크 하드코딩 (CRITICAL 반복)
- `PostCard.js` line 243, `FollowScreen.js` line 147에서 사용자 닉네임 링크가 `<a href="https://ant.design">`로 하드코딩
- Ant Design 예제 코드를 복사한 후 실제 경로로 교체하지 않은 것
- 새로운 List 컴포넌트 작성 시 반드시 확인 필요

### 2. 디버깅용 컬러 border 잔류
- `GlobalStyleComponent.js`의 `LeftSideLayout` (blue), `RightSideLayout` (red)
- `LeftSideBar.js`의 Sider (red), Menu (green)
- 프로덕션 배포 전 반드시 제거해야 함

### 3. useCallback 의존성 배열 누락/오류 패턴 (코드베이스 전반)
- `Nav.js`, `FollowButton.js`, `UserProfile.js`, `PostCard.js` 등 다수
- 의존성 배열에 표현식 사용 (`me && me.id`), ref.current 사용 오류도 포함

### 4. img alt 속성에 URL 사용 (접근성 반복 위반)
- `PostImages.js`, `ImageZoom/index.js` — `alt={src}` 패턴 반복
- WCAG 2.1 SC 1.1.1 위반

### 5. label-input 연결 미흡 (접근성 반복 위반)
- `LoginForm.js`, `SignupPage.js` — label htmlFor와 Input id 불일치
- Ant Design Input에 id prop 없이 name만 사용

### 6. console.log 잔류
- `Nav.js` line 20, `PostCard.js` line 38, `FollowScreen.js` line 124

## 레이아웃 구조 특이사항
- `LayoutWrapper`: 1400px 고정 너비 — 반응형 아님
- `HeaderLayout`: min-width = max-width = 1400px — 완전 고정
- `MainLayout`: 700px 고정
- Ant Design Grid를 사용하지만 상위 컨테이너가 고정 너비이므로 breakpoint 사실상 무력화

## 컴포넌트 네이밍 오타
- `PostFrom.js` (PostForm이어야 함) — 파일명 오타
- `PageLayout.js`의 prop `postFrom` (postForm이어야 함)
- `SignupPage.js` 버튼 텍스트 "Sing Up" (Sign Up이어야 함)

## Why:
2026-04-01 첫 전체 컴포넌트 리뷰에서 발견된 사항들

## How to apply:
- 향후 코드 리뷰 시 위 패턴들이 신규 코드에서도 반복되는지 우선 확인
- 반응형 수정 제안 시 LayoutWrapper의 고정 너비 문제를 먼저 언급

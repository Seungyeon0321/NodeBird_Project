# 성능·빌드 판단 기준 (NodeBird)

이 문서는 백엔드 런타임·DB·EC2 빌드에서 **느려질 수 있는 지점**을 같은 기준으로 찾고, 개선 우선순위를 정하기 위한 참고 자료입니다. 각 항목은 **현상 → 왜 문제가 되는지(근거) → 이 레포에서 확인하는 방법** 순으로 정리합니다.

---

## SLO(선택)

수치 목표(p95 응답 시간 등)는 배포 환경에 맞게 별도로 정한 뒤 이 섹션에 적으면 됩니다. 현재 레포에는 APM이 없으므로 1차는 아래 **측정 절차**와 수동 로그로 확인합니다.

---

## A. 런타임 API·DB (백엔드)

### 1. 요청당 DB 왕복 횟수

| 항목 | 내용 |
|------|------|
| **현상** | 한 HTTP 요청 처리 중 `await`로 DB 호출이 여러 번 이어짐. |
| **근거** | 애플리케이션·DB 사이 왕복(latency)이 선형으로 누적됩니다. |
| **확인** | 라우트 핸들러에서 `findOne` 직후 또 `findOne` 같은 패턴. 예: `back/routes/post.js`의 단일 게시글 조회는 리팩토링으로 1회로 줄였습니다. |

### 2. Eager load(`include`) 깊이·카디널리티

| 항목 | 내용 |
|------|------|
| **현상** | 한 쿼리에 연관 테이블을 많이 붙여 조회. |
| **근거** | JOIN/서브쿼리 증가, 중복 행·큰 결과 집합으로 DB·앱 메모리·CPU 부담이 커질 수 있습니다. |
| **확인** | `back/routes/posts.js`, `back/routes/user.js`(`GET /:userId/posts`), `back/routes/hashtag.js`의 `Post.findAll` + Comment/Likers/Retweet 등. `Comment`(hasMany)에만 `separate: true` 적용 — `Likers`는 belongsToMany라 Sequelize에서 `separate` 미지원(`back/routes/postFeedIncludes.js`). |

### 3. N+1 패턴

| 항목 | 내용 |
|------|------|
| **현상** | 부모 N건에 대해 자식을 루프 안에서 개별 조회. |
| **근거** | 쿼리가 1+N번으로 늘어 응답 시간이 급증합니다. |
| **확인** | 라우트 내 `for`/`map` + 개별 `findOne`/`findAll`. 현재 목록 API는 eager load 위주이며, `separate: true`는 의도적인 추가 쿼리(행 폭발 완화)입니다. |

### 4. 인덱스·필터 일치

| 항목 | 내용 |
|------|------|
| **현상** | `WHERE`/`JOIN` 컬럼에 인덱스가 없거나 조건이 인덱스를 못 탐. |
| **근거** | 데이터가 늘수록 풀스캔 가능성이 커져 지연이 커집니다. |
| **확인** | `posts.id`, `posts.UserId`, 해시태그 매핑 테이블 등. 스키마 변경은 마이그레이션으로 관리하는 것이 운영에 유리합니다(아래 B항). |

### 5. 비동기 누락

| 항목 | 내용 |
|------|------|
| **현상** | `update`/`create` 등에 `await` 없이 응답을 보냄. |
| **근거** | DB 반영 전에 응답이 나가거나, 실패가 핸들러 밖으로 새어 나갑니다. |
| **확인** | `back/routes/user.js` `PATCH /nickname` — `await User.update(...)`로 수정했습니다. |

### 6. CPU 바운드 작업

| 항목 | 내용 |
|------|------|
| **현상** | 요청 스레드/이벤트 루프에서 무거운 동기 연산(해시 등). |
| **근거** | 동시 요청이 많을 때 처리량이 떨어집니다. |
| **확인** | `bcrypt.hash` / `bcrypt.compare`(`back/routes/user.js`, `back/passport/local.js`). 보안을 위한 의도적 비용이며, 로드가 커지면 워커/큐 등을 검토합니다. |

---

## B. 애플리케이션 시작·운영

### 1. 프로덕션에서 `sequelize.sync()`

| 항목 | 내용 |
|------|------|
| **현상** | 서버 기동 시마다 `sync()`로 스키마 동기화. |
| **근거** | DDL/메타 확인으로 **기동 지연**, 락, 의도치 않은 스키마 변경 위험이 있습니다. |
| **확인·조치** | `back/app.js`: `NODE_ENV === "production"`일 때는 `sync()` 대신 `authenticate()`만 수행합니다. 로컬·개발에서는 기존처럼 `sync()`로 테이블 생성을 맞출 수 있습니다. |

### 2. 요청 경로의 동기 I/O

| 항목 | 내용 |
|------|------|
| **현상** | 요청 처리 중 `fs.readFileSync` 등 동기 API 사용. |
| **근거** | Node 단일 스레드 모델에서 블로킹이 전체 처리량을 깎습니다. |
| **확인** | `back/routes/post.js`의 `fs.accessSync`/`mkdirSync`는 **모듈 로드 시 1회**이므로 요청당 병목은 아닙니다. |

### 마이그레이션 전략(권장)

- 운영 DB는 `sequelize-cli` 마이그레이션으로 스키마 버전을 고정하고, 배포 파이프라인에서 `sequelize db:migrate`를 실행하는 방식이 안전합니다.
- 현재 레포에는 마이그레이션 폴더가 없을 수 있으므로, 스키마가 안정된 뒤 첫 마이그레이션을 스냅샷으로 추가하는 것을 권장합니다.

---

## C. 외부 의존성·로깅

### 1. S3 업로드

| 항목 | 내용 |
|------|------|
| **근거** | 네트워크 RTT·대역폭이 응답 시간을 지배합니다. |
| **확인** | `back/routes/post.js` — `multer-s3` 업로드. |

### 2. 불필요한 로깅

| 항목 | 내용 |
|------|------|
| **근거** | 고빈도 `console.log`는 포맷·I/O 비용이 쌓입니다. |
| **확인** | `back/routes/middlewares.js` — 인증 미들웨어 등. |

---

## D. EC2 빌드·배포

### 1. 프로덕션 `next build`에 번들 분석기 포함

| 항목 | 내용 |
|------|------|
| **근거** | `@next/bundle-analyzer`가 켜진 빌드는 웹팩 분석 단계로 **시간·메모리**가 증가합니다. |
| **조치** | `front/package.json`: 기본 `build`에서는 `ANALYZE`를 켜지 않고, `build:analyze`로만 분석합니다. |

### 2. 네이티브 모듈 `npm install`

| 항목 | 내용 |
|------|------|
| **근거** | `bcrypt` 등은 EC2에서 **node-gyp 컴파일** 시간이 들 수 있습니다. |
| **확인** | `back/package.json`의 `bcrypt`. |

### 3. 캐시 없는 클론 빌드

| 항목 | 내용 |
|------|------|
| **근거** | Next.js 프로덕션 빌드는 기본적으로 무겁습니다. CI/서버에서 `.next` 또는 npm 캐시를 재사용하면 반복 배포 시간이 줄어듭니다. |

---

## 우선 점검 순서(고정)

1. 빌드 스크립트·배포 캐시 (`front` `build`, EC2 파이프라인)
2. 기동 시 DB 동기화 정책 (`back/app.js`의 `sync` vs `authenticate`)
3. 목록·상세 API의 쿼리 수·payload (`include`, `separate`, 중복 `findOne`)
4. 로그인/가입 직후 사용자 객체에 실어 보내는 연관 범위(`attributes` 제한)
5. 프로필 집계(`COUNT` vs 전 행 로드)
6. 기타: S3, bcrypt, 로깅

---

## 간단한 측정 절차

1. **빌드**: EC2 또는 CI에서 `time npm run build`(front) 전후 비교.
2. **SQL**: 개발 환경에서 `sequelize` `logging: console.log` 또는 MySQL `general_log`/`EXPLAIN`으로 목록 API 1회 호출의 쿼리 수·플랜 확인.
3. **HTTP**: 브라우저 DevTools 또는 `curl -w "%{time_total}\n"`으로 동일 엔드포인트 반복 측정(참고용; 네트워크 변동 있음).

---

## 관련 파일

| 영역 | 경로 |
|------|------|
| 서버 기동·DB | `back/app.js` |
| 게시글·업로드 | `back/routes/post.js` |
| 피드 목록·include 공통 | `back/routes/posts.js`, `back/routes/postFeedIncludes.js` |
| 사용자·프로필 | `back/routes/user.js` |
| 해시태그 피드 | `back/routes/hashtag.js` |
| 프론트 빌드 | `front/package.json`, `front/next.config.js` |

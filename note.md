CORS 에러는 브라우저에서 서버로 요청을 했을 때 다른 포트를
가지고 있으면 브라우저 측에서 차단하는 에러이다

에러 메세지
signup:1 Access to XMLHttpRequest at 'http://localhost:3065/user' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.

-프록시 방식- Proxy
해결 방법중에 하나는 브라우저에서 프론트 서버로 보낸다음에 그 요청을 다시 백엔드 서버로 보내는 방법으로 해결할 수 있다, 왜냐면 프론트 서버에서 백엔드에서의 CORS에러를 발생하지 않기 때문에

아니면 setHeader으로써 해결하는 방법이 있다, 3060에서 오는 녀석들은 다 허용하겠다는 의미임ㄱ
res.setHeader('Access-Control-Allow-Origin, http://localhost:3060)

--- credential로 쿠키 공유하기
브라우저의 3060과 백엔드 서버 3065의 도메인이 다르면 쿠키도 전달이 안된다. 그렇기 때문에 로그인해서 게시물을 올리게 되면 unauthorize라는 오류를 생기게 된다, 그렇기 때문에 쿠키를 공유할 필요가 있다,

백엔드에서 해야할 일//////////////////
그래서 app.use(cors({
credentials 부분을 true로 바꾸게 되면 쿠키도 같이 전달되게 되어있다
}))

Front에서 해야할 일////////////////////
그리고 나서 addCommentAPI를 포함하여 모든 post관련 사가의 세번째 인자로 withCredentials의 부분을 true를 넣어줘야 한다
하지만 이게 중복되기 때문에 sagas index에서 index.js에 디폴트로 설정해줘야 한다

axios.defaults.withCredentials = true;

이렇게 하면 credential mode가 되기 때문에 좀 더 엄격한 보안을 위해서 origin에 \*가 아닌 정확한 주소를 입력해줘야 한다. origin에 true을 해도 괜찮다

멀티파트(이미지나, 비디오)는 백엔드에서 해당 데이터를 인코딩 해줄 수 있는 형태로 바꿔줘야 한다, 이를 해결하기 위해 multer를 install 해줘야한다ㅠ

에러 404가 뜨게 되면 없다는 의미인데, 이건 미들웨어의 순서 문제 때문에 발생하기 싶다, 예를 들어서 params를 받는 미들웨어가 존재한다고 하면 이를 following으로 생각하고 그 미들웨어를 실행시켜 버리기 때문에 해당 미들웨어에서 우리가 원하는 데이터를 받지 못하기 때문에 404 문제가 발생하는 것이다

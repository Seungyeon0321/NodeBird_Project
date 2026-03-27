let h1 = document.querySelector("h1");
let tryCount = 0;
const MAX_TRIES = 12; // 5초씩 12번 = 약 1분

async function checkServerStatus() {
  // 이미 최대 시도 횟수를 넘었으면 종료
  if (tryCount >= MAX_TRIES) {
    h1.textContent = "Server is down. Please try again later.";
    console.log("Max retries reached. Server is likely down.");
    return;
  }

  try {
    tryCount++;
    console.log(`Checking server status... (${tryCount}/${MAX_TRIES})`);

    const result = await fetch("https://open.portfolio-simon.com/start");

    // AWS API Gateway/Lambda가 깨어났을 때의 응답 코드 확인
    if (result.status === 200 || result.status === 202) {
      h1.textContent = "Server is running!!";
      // 리다이렉트 전 아주 잠깐의 여유를 주면 사용자가 메시지를 볼 수 있습니다.
      setTimeout(() => {
        window.location.href = "https://portfolio-simon.com";
      }, 500);
      return; // 성공했으므로 재귀 중단
    } 
    
    console.log("Server is still warming up...");

  } catch (error) {
    // 네트워크 에러나 CORS 에러 시 발생
    console.error("Network error:", error);
  }

  // 실패했거나 아직 준비 중일 때 5초 후 재시도
  setTimeout(checkServerStatus, 5000);
}

// 실행
checkServerStatus();
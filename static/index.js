let h1 = document.querySelector("h1");
let isChecking = false;
let tryCount = 0;

async function checkServerStatus() {
  if (isChecking) return;
  try {
    isChecking = true;
    tryCount++;

    if (tryCount > 10) {
      clearInterval(interval);
      console.log("Server is not running");
      return;
    }
    let result = await fetch("https://start.portfolio-simon.com/start", {
      method: "GET",
    });

    console.log(result.status);
    if (result.status == 202) {
      h1.textContent = "Server is running!!";
      window.location.href = "https://simon-portfolio.com";
    } else {
      console.log("Server is not running");
    }
  } catch (error) {
    console.error(error);
  } finally {
    isChecking = false;
    if (tryCount <= 10) {
      setTimeout(() => {
        checkServerStatus();
      }, 5000);
    }
  }
}

checkServerStatus();

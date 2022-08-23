var API_URL = "https://127.0.0.1:5000";

async function getSpamPredictions(text) {
  const pred_response = await fetch(`${API_URL}/?q=${text}`, {
    method: "get",
  });

  const pred_response_json = await pred_response.json();

  return pred_response_json.results.top;
}

function getContentType() {
  if (document.location.host.includes("whatsapp")) {
    return "message";
  } else {
    return "email";
  }
}

var contentType = "",
  pred_res_json = null;

async function checkForHoax() {
  contentType = getContentType();

  // check for selected text
  const selectedText = window.getSelection().toString();
  if (selectedText !== "") {
    pred_res_json = await getHoaxPredictions(`${selectedText}`);
  } else {
    let articleElement;
    if (contentType === "message") {
      // select for last message element in WA
      articleElement = document.querySelectorAll("._1Gy50");
      articleElement = articleElement[articleElement.length - 1];
    }

    if (contentType === "email") {
      articleElement = document.querySelector("article");
    }

    if (articleElement == undefined) {
      console.log("article not found");
    } else {
      const articleText = articleElement.innerText.replace(/\n/g, " ");
      pred_res_json = await getHoaxPredictions(`${articleText}`);
    }
  }
}
(async () => {
  await checkForHoax();
  pred_res_json["contentType"] = contentType;
  return pred_res_json;
})();

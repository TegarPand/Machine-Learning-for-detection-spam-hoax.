var API_URL = "https://127.0.0.1:5000";

async function getHoaxPredictions(text) {
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

async function checkForSpam() {
  contentType = getContentType();

  // check for selected text
  const selectedText = window.getSelection().toString();
  if (selectedText !== "") {
    pred_res_json = await getHoaxPredictions(`${selectedText}`);
  } else {
    let subjectElement = "",
      contentElement = "";

    if (contentType === "message") {
      contentElement = document.querySelectorAll("._1Gy50");
      contentElement = contentElement[contentElement.length - 1];
    }

    if (contentType === "email") {
      subjectElement = document.querySelector(".ha h2");
      contentElement = document.querySelector(".a3s.aiL");
    }

    if (contentElement == undefined) {
      console.log("content not found");
    } else {
      const subjectText = subjectElement.innerText || "",
        contentText = contentElement.innerText.replace(/\n/g, " ");

      pred_res_json = await getHoaxPredictions(`${subjectText} ${contentText}`);
    }
  }
}

(async () => {
  await checkForSpam();
  pred_res_json["contentType"] = contentType;
  return pred_res_json;
})();

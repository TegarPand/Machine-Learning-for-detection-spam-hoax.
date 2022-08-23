const resultElement = document.querySelector(".result");

function getValue(percentage) {
  const percentageString = `${percentage}`;
  return percentageString.split(".")[0] + "." + percentageString.split(".")[1].slice(0, 3);
}

function showResult({ label, contentType, confidence }) {
  const contentTypeElement = document.querySelector(".result .contentType"),
    resultTypeElement = document.querySelector(".result .resultType"),
    similiarityPercentageElement = document.querySelector(".result .similiarityPercentage");

  if (label === "ham") {
    label = "VALID";
    resultElement.style.backgroundColor = "#44f544";
  } else {
    if (contentType === "email") {
      label = "SPAM";
    } else {
      label = "HOAX";
    }

    resultElement.style.backgroundColor = "#f54444";
  }

  contentTypeElement.innerText = contentType;
  resultTypeElement.innerText = label;
  similiarityPercentageElement.innerText = getValue(confidence * 100);

  resultElement.classList.remove("closed");
}

// Get all extension button elements
let spamCheckButton = document.getElementById("checkSpam"),
  hoaxCheckButton = document.getElementById("checkHoax");

// check for spam
spamCheckButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["scripts/checkSpam.js"],
    },
    (injectionResults) => {
      for (const frameResult of injectionResults) {
        console.log(frameResult.result);
        showResult(frameResult.result);
      }
    }
  );
});

// check for hoax
hoaxCheckButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["scripts/checkHoax.js"],
    },
    (injectionResults) => {
      for (const frameResult of injectionResults) {
        showResult(frameResult.result);
      }
    }
  );
});

let closeButton = document.getElementById("closeIcon");

closeButton.addEventListener("click", () => {
  resultElement.classList.add("closed");
});

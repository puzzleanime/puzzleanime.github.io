async function translateText() {
  const inputText = document.getElementById("inputText").value;
  const sourceLang = document.getElementById("sourceLang").value;
  const targetLang = document.getElementById("targetLang").value;

  const response = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: inputText,
      source: sourceLang,
      target: targetLang,
      format: "text"
    })
  });

  const data = await response.json();
  document.getElementById("outputText").innerText = data.translatedText;
}

const languageSelect = document.getElementById('languageSelect');
const darkModeToggle = document.getElementById('darkModeToggle');
const clearBtn = document.getElementById('clearBtn');
const historyList = document.getElementById('historyList');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('bg-gray-900');
  document.body.classList.toggle('text-white');
});

clearBtn.addEventListener('click', () => {
  inputText.value = '';
  outputText.value = '';
  message.textContent = '';
});

translateBtn.addEventListener('click', async () => {
  const text = inputText.value.trim();
  const [source, target] = languageSelect.value.split('-');

  if (!text) {
    message.textContent = 'Please enter text to translate.';
    return;
  }

  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source, target, format: 'text' })
    });

    const data = await res.json();
    outputText.value = data.translatedText;

    // Save to history
    const historyItem = document.createElement('li');
    historyItem.textContent = `${text} → ${data.translatedText}`;
    historyList.prepend(historyItem);
  } catch (err) {
    message.textContent = 'Translation failed. Try again.';
    console.error(err);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const proverbTextEl = document.querySelector('#proverb-text .pashto');
  const translationEl = document.querySelector('#proverb-text .translation');
  const meaningEl = document.getElementById('proverb-meaning');
  const newProverbBtn = document.getElementById('new-proverb-btn');
  const copyBtn = document.getElementById('copy-btn');
  const shareBtn = document.getElementById('share-btn');

  let proverbs = [];
  let currentProverb = null;

  // Fetch proverbs from JSON file
  fetch('proverbs.json')
    .then(response => response.json())
    .then(data => {
      proverbs = data;
      // Show a deterministic proverb for the current day
      displayDailyProverb();
    })
    .catch(error => {
      console.error('Error fetching proverbs:', error);
      proverbTextEl.textContent = 'متلونه په پورته کولو کې پاتې راغلل.';
    });

  // Compute day-of-year in UTC for consistency across time zones
  function getUTCOrdinalDay(date = new Date()) {
    const start = Date.UTC(date.getUTCFullYear(), 0, 1);
    const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const diff = today - start;
    return Math.floor(diff / (24 * 60 * 60 * 1000)); // 0-based day of year
  }

  // Display the proverb of the day deterministically based on day-of-year
  function displayDailyProverb() {
    if (proverbs.length === 0) return;
    const idx = getUTCOrdinalDay() % proverbs.length;
    currentProverb = proverbs[idx];

    proverbTextEl.textContent = currentProverb.proverb;
    translationEl.textContent = `"${currentProverb.translation}"`;
    meaningEl.textContent = currentProverb.meaning;
  }

  // Display a random proverb
  function displayRandomProverb() {
    if (proverbs.length === 0) return;
    currentProverb = proverbs[Math.floor(Math.random() * proverbs.length)];
    
    proverbTextEl.textContent = currentProverb.proverb;
    translationEl.textContent = `"${currentProverb.translation}"`;
    meaningEl.textContent = currentProverb.meaning;
  }

  // Copy proverb to clipboard
  function copyProverb() {
    if (!currentProverb) return;
    const textToCopy = `${currentProverb.proverb}\n\nTranslation: ${currentProverb.translation}\nMeaning: ${currentProverb.meaning}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> کاپي شو!';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    });
  }

  // Share proverb
  function shareProverb() {
    if (!currentProverb) return;
    const textToShare = `Pashto Proverb:\n${currentProverb.proverb}\n\nTranslation: ${currentProverb.translation}`;
    if (navigator.share) {
      navigator.share({
        title: 'Pashto Proverb of the Day',
        text: textToShare,
      }).catch(console.error);
    } else {
      // Fallback for desktop
      alert('Use the copy button to share this proverb.');
    }
  }

  // Event Listeners
  newProverbBtn.addEventListener('click', displayRandomProverb);
  copyBtn.addEventListener('click', copyProverb);
  if (shareBtn) {
    shareBtn.addEventListener('click', shareProverb);
  }
});

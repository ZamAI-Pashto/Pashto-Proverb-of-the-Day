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
      displayRandomProverb();
    })
    .catch(error => {
      console.error('Error fetching proverbs:', error);
      proverbTextEl.textContent = 'متلونه په پورته کولو کې پاتې راغلل.';
    });

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
  shareBtn.addEventListener('click', shareProverb);
});

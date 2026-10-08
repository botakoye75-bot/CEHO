const $ = (id) => document.getElementById(id);
const tabs = [...document.querySelectorAll('.tab')];
const panels = { link: $('linkPanel'), file: $('filePanel') };
let currentType = 'link';
let toastTimer;

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
}

$('menuBtn').addEventListener('click', () => {
  const open = $('navLinks').classList.toggle('open');
  $('menuBtn').setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  $('navLinks').classList.remove('open');
  $('menuBtn').setAttribute('aria-expanded', 'false');
}));

tabs.forEach(tab => tab.addEventListener('click', () => {
  currentType = tab.dataset.type;
  tabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  panels.link.classList.toggle('hidden', currentType !== 'link');
  panels.file.classList.toggle('hidden', currentType !== 'file');
  $('errorMessage').classList.add('hidden');
}));

$('fileInput').addEventListener('change', () => {
  const file = $('fileInput').files[0];
  $('fileName').textContent = file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : 'Belum ada file dipilih.';
});

$('exampleBtn').addEventListener('click', () => {
  if (currentType === 'link') {
    $('urlInput').value = 'https://contoh.com/artikel-informasi';
    showToast('Contoh tautan telah dimasukkan.');
  } else {
    showToast('Pilih file dari perangkat untuk melanjutkan.');
    $('fileInput').click();
  }
});

function setError(message) {
  $('errorMessage').textContent = message;
  $('errorMessage').classList.remove('hidden');
}

function getInputValue() {
  if (currentType === 'link') {
    const value = $('urlInput').value.trim();
    if (!value) throw new Error('Masukkan tautan yang ingin diperiksa.');
    let parsed;
    try { parsed = new URL(value); } catch { throw new Error('Format tautan belum benar. Contoh: https://contoh.com/artikel'); }
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Tautan harus menggunakan HTTP atau HTTPS.');
    return { value, kind: 'link' };
  }
  const file = $('fileInput').files[0];
  if (!file) throw new Error('Pilih file terlebih dahulu.');
  if (file.size > 15 * 1024 * 1024) throw new Error('Ukuran file melebihi batas demo 15 MB.');
  return { value: file.name, kind: 'file' };
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function runAnalysis(input) {
  $('resultsSection').classList.remove('hidden');
  $('progressCard').classList.remove('hidden');
  $('resultCard').classList.add('hidden');
  $('checkBtn').disabled = true;
  $('checkBtn').textContent = '⏳ Sedang memeriksa...';
  $('progressBar').style.width = '0%';
  $('progressPercent').textContent = '0%';
  const steps = [...$('progressSteps').children];
  steps.forEach(step => step.classList.remove('done'));
  const labels = ['Memvalidasi input', 'Menganalisis klaim', 'Mencocokkan sumber', 'Menyusun hasil'];
  for (let i = 0; i < labels.length; i++) {
    await wait(450);
    steps[i].classList.add('done');
    const percent = Math.round(((i + 1) / labels.length) * 100);
    $('progressBar').style.width = percent + '%';
    $('progressPercent').textContent = percent + '%';
  }
  await wait(250);
  renderResult(input);
  $('progressCard').classList.add('hidden');
  $('resultCard').classList.remove('hidden');
  $('checkBtn').disabled = false;
  $('checkBtn').textContent = '🔎 Mulai Pemeriksaan';
  $('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderResult(input) {
  const verdicts = [
    { title: 'Informasi perlu ditinjau', badge: 'Meragukan', key: 'doubt', confidence: '68%', risk: 'Sedang', intent: 'Informasi umum', description: 'Prototype menemukan bahwa informasi perlu dibandingkan dengan sumber lain. Hasil ini dibuat secara simulasi dan tidak memverifikasi isi tautan atau file secara nyata.' },
    { title: 'Perlu konfirmasi sumber', badge: 'Cenderung valid', key: 'valid', confidence: '76%', risk: 'Rendah–sedang', intent: 'Informatif', description: 'Dalam simulasi ini, informasi terlihat cukup masuk akal, tetapi tetap perlu diperiksa melalui sumber primer dan tanggal publikasi.' },
    { title: 'Perlu kewaspadaan lebih', badge: 'Tidak valid', key: 'invalid', confidence: '82%', risk: 'Tinggi', intent: 'Persuasif', description: 'Dalam simulasi ini, konten ditandai berisiko. Jangan menyimpulkan kebenaran hanya dari hasil prototype; lakukan pemeriksaan mandiri.' }
  ];
  const result = verdicts[Math.floor(Math.random() * verdicts.length)];
  $('resultTitle').textContent = result.title;
  $('resultBadge').textContent = result.badge;
  $('resultBadge').className = 'result-badge ' + (result.key === 'doubt' ? '' : result.key);
  $('resultDescription').textContent = result.description;
  $('confidenceScore').textContent = result.confidence;
  $('riskLevel').textContent = result.risk;
  $('intentLevel').textContent = result.intent;
  $('claimText').textContent = input.kind === 'link' ? input.value : `File yang dipilih: ${input.value}`;
  $('sourceGrid').innerHTML = `
    <article class="source-card"><strong>Periksa sumber primer</strong><p>Cari pengumuman resmi, dokumen asli, atau data dari lembaga terkait.</p></article>
    <article class="source-card"><strong>Bandingkan pemberitaan</strong><p>Periksa apakah beberapa media tepercaya menyampaikan konteks yang sama.</p></article>
    <article class="source-card"><strong>Periksa tanggal dan konteks</strong><p>Pastikan informasi tidak lama, dipotong, atau digunakan di luar konteks.</p></article>
    <article class="source-card"><strong>Jangan langsung membagikan</strong><p>Tunda membagikan informasi jika sumber dan buktinya belum jelas.</p></article>`;
  saveHistory({ value: input.value, kind: input.kind, badge: result.badge, key: result.key, date: new Date().toLocaleString('id-ID') });
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem('cehoHistory') || '[]'); } catch { return []; }
}
function saveHistory(item) {
  const history = getHistory();
  history.unshift(item);
  localStorage.setItem('cehoHistory', JSON.stringify(history.slice(0, 30)));
  renderHistory();
}
function renderHistory() {
  const query = $('historySearch').value.trim().toLowerCase();
  const filter = $('historyFilter').value;
  const items = getHistory().filter(item => item.value.toLowerCase().includes(query) && (filter === 'all' || item.key === filter));
  const list = $('historyList');
  if (!items.length) {
    list.innerHTML = '<p class="empty-state">Belum ada riwayat yang cocok.</p>';
    return;
  }
  list.innerHTML = items.map(item => `
    <article class="history-item">
      <div><strong>${escapeHTML(item.value)}</strong><p>${escapeHTML(item.date)} · ${item.kind === 'link' ? 'Tautan' : 'File'}</p></div>
      <span class="history-tag ${item.key === 'doubt' ? '' : item.key}">${escapeHTML(item.badge)}</span>
    </article>`).join('');
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}

$('checkBtn').addEventListener('click', async () => {
  $('errorMessage').classList.add('hidden');
  let input;
  try { input = getInputValue(); } catch (error) { setError(error.message); return; }
  await runAnalysis(input);
});
$('resetBtn').addEventListener('click', () => {
  $('urlInput').value = '';
  $('fileInput').value = '';
  $('fileName').textContent = 'Belum ada file dipilih.';
  $('resultsSection').classList.add('hidden');
  $('pemeriksaan').scrollIntoView({ behavior: 'smooth' });
});
$('historySearch').addEventListener('input', renderHistory);
$('historyFilter').addEventListener('change', renderHistory);
$('clearHistoryBtn').addEventListener('click', () => {
  if (!getHistory().length) { showToast('Riwayat masih kosong.'); return; }
  if (confirm('Hapus semua riwayat pemeriksaan di perangkat ini?')) {
    localStorage.removeItem('cehoHistory');
    renderHistory();
    showToast('Riwayat berhasil dihapus.');
  }
});
renderHistory();

const URL_API = "https://script.google.com/macros/s/AKfycbz4wVxTKfmPcD_KcUrpXDDPnRNexLG96enIGB-Dz7dcpoN-HOScCcb62TVcSYuJKUQU4Q/exec";
let ratingTerpilih = 0;

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[tag]));
}

// BINTANG KLIK
function updateBintang(){
  document.querySelectorAll('.bintang').forEach((b, i) => {
    if(i < ratingTerpilih) b.classList.add('aktif');
    else b.classList.remove('aktif');
  })
}

document.querySelectorAll('.bintang').forEach(bintang => {
  bintang.addEventListener('click', function(){
    ratingTerpilih = parseInt(this.dataset.nilai); // <-- ini harusnya dataset.nilai ya
    updateBintang();
  })
});

// KIRIM ULASAN KE GOOGLE SHEET - UDAH DIRAPIHIN PAKE FORMDATA
function kirimUlasan(){
  const nama = escapeHTML(document.getElementById('namaUlasan').value.trim());
  const pesan = escapeHTML(document.getElementById('pesanUlasan').value.trim());

  if(nama === '' || pesan === '' || ratingTerpilih === 0){
    return alert('Nama, ulasan, dan Rating wajib diisi!');
  }

  const formData = new FormData(); // 1. GANTI JADI FORMDATA
  formData.append('nama', nama);
  formData.append('ulasan', pesan);
  formData.append('rating', ratingTerpilih);

  fetch(URL_API, {
    method: 'POST',
    body: formData // 2. KIRIM FORMDATA BUKAN JSON
  })
.then(res => res.json())
.then(() => {
    alert('Terima kasih atas ulasannya!');
    document.getElementById('namaUlasan').value = '';
    document.getElementById('pesanUlasan').value = '';
    ratingTerpilih = 0;
    updateBintang();
    tampilkanUlasan(); // refresh
  })
.catch(err => alert('Gagal kirim: ' + err));
}

// AMBIL ULASAN DARI GOOGLE SHEET
function tampilkanUlasan(){
  const list = document.getElementById('listUlasan');
  list.innerHTML = '<p style="text-align:center;">Memuat ulasan...</p>';

  fetch(URL_API)
.then(res => res.json())
.then(data => {
    if(data.length === 0){
      list.innerHTML = '<p style="text-align:center;opacity:0.7;">Belum ada ulasan. Jadilah yang pertama!</p>';
      return;
    }
    list.innerHTML = '';
    data.reverse().forEach(u => {
      let bintang = '';
      for(let i=0; i<5; i++){
        bintang += i < u.rating? '★' : '☆';
      }
      list.innerHTML += `<div class="card-ulasan">
        <div class="header-ulasan">
          <span class="nama">${u.nama}</span>
          <span class="bintang-ulasan">${bintang}</span>
        </div>
        <p>${u.ulasan}</p>
        <span class="tanggal">${new Date(u.tanggal).toLocaleDateString('id-ID')}</span> // 3. DIBIKIN TANGGAL ID
      </div>`;
    })
  })
.catch(err => list.innerHTML = '<p>Gagal memuat ulasan</p>');
}

// JALANKAN SAAT HALAMAN DIBUKA
document.addEventListener('DOMContentLoaded', tampilkanUlasan);

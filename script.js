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
    ratingTerpilih = parseInt(this.dataset.nilai);
    updateBintang();
  })
});

// KIRIM ULASAN KE GOOGLE SHEET
function kirimUlasan(){ 
  const nama = escapeHTML(document.getElementById('namaUlasan').value.trim()); 
  const pesan = escapeHTML(document.getElementById('pesanUlasan').value.trim()); 
  
  if(nama === '' || pesan === '' || ratingTerpilih === 0){ 
    return alert('Nama, ulasan, dan Rating wajib diisi!'); 
  } 

  const data = { nama: nama, ulasan: pesan, rating: ratingTerpilih };

  fetch(URL_API, {
    method: 'POST',
    body: JSON.stringify(data)
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
        
        <span class="tanggal">${u.tanggal}</span>
      </div>`; 
    }) 
  })
 .catch(err => list.innerHTML = '<p>Gagal memuat ulasan</p>');
}

// JALANKAN SAAT HALAMAN DIBUKA
tampilkanUlasan();

    function doPost(e) {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
      const data = JSON.parse(e.postData.contents);
      sheet.appendRow([data.nama, data.ulasan, data.rating, new Date()]);
      return ContentService.createTextOutput(JSON.stringify({result: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
    }

const URL_API = "https://script.google.com/macros/s/AKfycbzNslAzXlXfgzLqlL4cMSfKoMaRMPTZD0hu74cj8pis12mTae37joYrIKRl_GXpfxjZpw/exec";

let ratingTerpilih = 0;

// Bintang
document.querySelectorAll('.bintang').forEach(bintang => {
  bintang.addEventListener('click', function(){ 
    ratingTerpilih = parseInt(this.dataset.nilai); 
    updateBintang(); 
  })
})

function updateBintang(){
  document.querySelectorAll('.bintang').forEach((b, i) => { 
    if(i < ratingTerpilih) b.classList.add('aktif'); 
    else b.classList.remove('aktif'); 
  })
}

// Pas halaman kebuka langsung muat ulasan
document.addEventListener('DOMContentLoaded', function() {
  tampilkanUlasan();
})

async function kirimUlasan(){
  const nama = document.getElementById('namaUlasan').value.trim();
  const pesan = document.getElementById('pesanUlasan').value.trim();
  
  if(nama === '' || pesan === '' || ratingTerpilih === 0){ 
    return alert('Nama, Pesan, dan Rating wajib diisi!'); 
  }

  // Kirim ke Google Sheet
  try {
    await fetch(URL_API, {
      method: "POST",
      body: JSON.stringify({nama, pesan, rating: ratingTerpilih})
    });

    document.getElementById('namaUlasan').value = ''; 
    document.getElementById('pesanUlasan').value = ''; 
    ratingTerpilih = 0; 
    updateBintang();
    alert('Terima kasih atas ulasannya!');
    tampilkanUlasan(); 
  } catch(e) {
    alert('Gagal kirim. Cek: 1. URL bener 2. Apps Script udah Deploy "Anyone"');
  }
}

async function tampilkanUlasan(){
  const list = document.getElementById('listUlasan'); 
  try {
    const res = await fetch(URL_API);
    let ulasan = await res.json();
    if(ulasan.length === 0){ 
      list.innerHTML = '<p style="text-align:center;opacity:0.7;">Belum ada ulasan. Jadilah yang pertama!</p>'; 
      return; 
    }
    list.innerHTML = '';
    ulasan.reverse().forEach(u => {
      let bintang = ''; 
      for(let i=0; i<5; i++){ 
        bintang += i < u.rating ? '★' : '☆'; 
      }
      list.innerHTML += `<div class="card-ulasan">
        <div class="header-ulasan">
          <span class="nama">${u.nama}</span>
          <span class="bintang-ulasan">${bintang}</span>
        </div>
        <p>${u.pesan}</p>
        <span class="tanggal">${u.tanggal}</span>
      </div>`;
    })
  } catch(e) {
    list.innerHTML = '<p style="text-align:center;color:red;">Gagal memuat ulasan</p>';
  }
}
document.getElementById("nama").value = "";
document.getElementById("alamat").value = "";
document.getElementById("nohp").value = "";
tutupForm();

const URL_API = "https://script.google.com/macros/s/AKfycbzNslAzXlXfgzLqlL4cMSfKoMaRMPTZD0hu74cj8pis12mTae37joYrIKRl_GXpfxjZpw/exec";

let ratingTerpilih = 0;
let produkDipilih = "";
let hargaDipilih = 0;
const nomerWA = "6281585059946";

// Fungsi Pengaman Karakter HTML
function escapeHTML(str) {
  return str.replace(/[&<>"']/g,
    tag => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[tag]));

}

// Bintang Ulasan
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

// ==========================================
// FUNGSI UNTUK DATA PESANAN & WHATSAPP
// ==========================================
function hitungOngkir(alamat) {
  alamat = alamat.toLowerCase();
  if(alamat.includes("villa gading") || alamat.includes("vgh") || alamat.includes("gading harapan")) {
    return 5000;
  } else if(alamat.includes("babelan")) {
    return 7000;
  } else if(alamat.includes("bekasi")) {
    return 10000;
  } else {
    return 15000;
  }
}

function pesanWA(namaProduk, harga) {
  produkDipilih = namaProduk;
  hargaDipilih = harga;
  document.getElementById("formPopup").style.display = "block";
}

function tutupForm() {
  document.getElementById("formPopup").style.display = "none";
}

function kirimWA() {
  const nama = escapeHTML(document.getElementById("nama").value.trim());
  const alamat = escapeHTML(document.getElementById("alamat").value.trim());
  const nohp = escapeHTML(document.getElementById("nohp").value.trim());

  if(nama == "" || alamat == "" || nohp == "") {
    alert("Isi semua data dulu ya");
    return;
  }

  const ongkir = hitungOngkir(alamat);
  const subtotal = hargaDipilih;
  const total = subtotal + ongkir;

  const pesan = "Halo Bakso Pakde Gimin 👋%0A%0ASaya mau pesan :%0A- " + produkDipilih + " : Rp " + subtotal.toLocaleString('id-ID') + "%0A- Ongkir : Rp " + ongkir.toLocaleString('id-ID') + "%0A-----------------------%0ATOTAL : Rp " + total.toLocaleString('id-ID') + "%0A%0AData Pemesan :%0ANama : " + nama + "%0AAlamat : " + alamat + "%0ANo HP : " + nohp;

  // Buka WhatsApp
  window.open("https://wa.me" + nomerWA + "?text=" + pesan, '_blank', 'noopener,noreferrer');
  
  // SCRIPT INI YANG BERFUNGSI MENGHAPUS TEKS SETELAH DIKLIK
  document.getElementById("nama").value = "";
  document.getElementById("alamat").value = "";
  document.getElementById("nohp").value = "";
  
  // Tutup Popup Form otomatis
  tutupForm();
}

// ==========================================
// FUNGSI UNTUK KIRIM & TAMPILKAN ULASAN (APPS SCRIPT)
// ==========================================
async function kirimUlasan(){
  const nama = document.getElementById('namaUlasan').value.trim();
  const pesan = document.getElementById('pesanUlasan').value.trim();
  
  if(nama === '' || pesan === '' || ratingTerpilih === 0){ 
    return alert('Nama, Pesan, dan Rating wajib diisi!'); 
  }

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

function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("show");
    }

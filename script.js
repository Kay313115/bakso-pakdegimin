const URL_API = "https://script.google.com/macros/s/AKfycbzNslAzXlXfgzLqlL4cMSfKoMaRMPTZD0hu74cj8pis12mTae37joYrIKRl_GXpfxjZpw/exec";
let ratingTerpilih = 0;let produkDipilih = "";let hargaDipilih = 0;const nomerWA = "6281585059946";

function escapeHTML(str) { return str.replace(/[&<>"']/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[tag])); }

// LANGSUNG JALAN KARENA PAKE DEFER
document.querySelectorAll('.bintang').forEach(bintang => {
  bintang.addEventListener('click', function(){
    ratingTerpilih = parseInt(this.dataset.nilai);
    updateBintang();
  })
});
tampilkanUlasan(); // LANGSUNG PANGGIL

function updateBintang(){ document.querySelectorAll('.bintang').forEach((b, i) => { if(i < ratingTerpilih) b.classList.add('aktif'); else b.classList.remove('aktif'); }) }

function hitungOngkir(alamat) { alamat = alamat.toLowerCase(); if(alamat.includes("blok aj")) return 3000; else if(alamat.includes("vgh")) return 5000; else if(alamat.includes("babelan") || alamat.includes("tambun utara")) return 7000; else if(alamat.includes("bekasi") || alamat.includes("tambun")) return 10000; else return 15000; }

function pesanWA(namaProduk, harga) { produkDipilih = namaProduk; hargaDipilih = harga; document.getElementById("formPopup").style.display = "block"; }

function tutupForm() { document.getElementById("formPopup").style.display = "none"; }

function kirimWA() { const nama = escapeHTML(document.getElementById("nama").value.trim()); const alamat = escapeHTML(document.getElementById("alamat").value.trim()); const nohp = escapeHTML(document.getElementById("nohp").value.trim()); if(!/^[0-9]{10,13}$/.test(nohp)) { alert("No HP harus 10-13 digit angka ya!"); return; } if(nama == "" || alamat == "") { alert("Isi semua data dulu ya"); return; } const ongkir = hitungOngkir(alamat); const total = hargaDipilih + ongkir; const pesan = `Halo Bakso Pakde Gimin 👋%0A%0ASaya mau pesan :%0A- ${produkDipilih} : Rp ${hargaDipilih.toLocaleString('id-ID')}%0A- Ongkir : Rp ${ongkir.toLocaleString('id-ID')}%0A-----------------------%0ATOTAL : Rp ${total.toLocaleString('id-ID')}%0A%0AData Pesanan :%0ANama : ${nama}%0AAlamat : ${alamat}%0ANo HP : ${nohp}`; window.open("https://wa.me/" + nomerWA + "?text=" + pesan, '_blank'); tutupForm(); }

function simpanUlasanLokal(nama, pesan, rating){ let ulasanLokal = JSON.parse(localStorage.getItem('ulasanBakso')) || []; ulasanLokal.push({nama, pesan, rating, tanggal: new Date().toLocaleDateString('id-ID')}); localStorage.setItem('ulasanBakso', JSON.stringify(ulasanLokal)); }

async function kirimUlasan(){ const nama = document.getElementById('namaUlasan').value.trim(); const pesan = document.getElementById('pesanUlasan').value.trim(); if(nama === '' || pesan === '' || ratingTerpilih === 0){ return alert('Nama, Pesan, dan Rating wajib diisi!'); } simpanUlasanLokal(nama, pesan, ratingTerpilih); try { await fetch(URL_API, { method: "POST", mode: "no-cors", body: JSON.stringify({nama, pesan, rating: ratingTerpilih}) }); } catch(e) {} document.getElementById('namaUlasan').value = ''; document.getElementById('pesanUlasan').value = ''; ratingTerpilih = 0; updateBintang(); alert('Terima kasih atas ulasannya!'); tampilkanUlasan(); }

function tampilkanUlasan(){ const list = document.getElementById('listUlasan'); let ulasanLokal = JSON.parse(localStorage.getItem('ulasanBakso')) || []; if(ulasanLokal.length === 0){ list.innerHTML = '<p style="text-align:center;opacity:0.7;">Belum ada ulasan. Jadilah yang pertama!</p>'; return; } list.innerHTML = ''; ulasanLokal.reverse().forEach(u => { let bintang = ''; for(let i=0; i<5; i++){ bintang += i < u.rating? '★' : '☆'; } list.innerHTML += `<div class="card-ulasan"><div class="header-ulasan"><span class="nama">${u.nama}</span><span class="bintang-ulasan">${bintang}</span></div><p>${u.pesan}</p><span class="tanggal">${u.tanggal}</span></div>`; }) }

function toggleMenu() { document.getElementById("navMenu").classList.toggle("show"); }

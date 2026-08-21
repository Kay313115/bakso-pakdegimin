const URL_API = "https://script.google.com/macros/s/AKfycbzNslAzXlXfgzLqlL4cMSfKoMaRMPTZD0hu74cj8pis12mTae37joYrIKRl_GXpfxjZpw/exec";
let ratingTerpilih = 0;
let produkDipilih = "";
let hargaDipilih = 0;
const nomerWA = "6281585059946";

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[tag]));
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.bintang').forEach(bintang => {
    bintang.addEventListener('click', function(){
      ratingTerpilih = parseInt(this.dataset.nilai);
      updateBintang();
    });
  });
  tampilkanUlasan();
}); // <-- INI UDAH DITUTUP BENER

function updateBintang(){
  document.querySelectorAll('.bintang').forEach((b, i) => {
    if(i < ratingTerpilih) b.classList.add('aktif');
    else b.classList.remove('aktif');
  });
}

function hitungOngkir(alamat) {
  alamat = alamat.toLowerCase();
  if(alamat.includes("blok aj")) return 3000;
  else if(alamat.includes("vgh")) return 5000;
  else if(alamat.includes("babelan") || alamat.includes("tambun utara")) return 7000;
  else if(alamat.includes("bekasi") || alamat.includes("tambun")) return 10000;
  else return 15000;
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
  const alamat = escapeHTML(document.getElementBy

let filmList = [], sepetList = [];

//Sepet açıp kapatma
const toggleSepet = () => {
  const sepetEl = document.querySelector(".sepet");
  sepetEl.classList.toggle("active");
};

//products.json film bilgileri çekme
const getFilms = () => {
  fetch("./products.json").then(res => res.json()).then((filmler) => (filmList = filmler));
}

getFilms();

const createFilmStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) starRateHtml += '<i class="bi bi-star-fill active"></i>';
    else starRateHtml += '<i class="bi bi-star-fill"></i>'
  }

  return starRateHtml;
}

//Filmler sayfasına film ekleme
const createFilmItemsHtml = () => {
  const filmListEl = document.querySelector(".film_list");
  let filmListHtml = "";
  filmList.forEach((film, index) => {
    filmListHtml += `
        <div class="col-5 ${index % 2 == 0 && "offset-1"}" style="margin-bottom:100px">
        <div class="row film_afis">
          <div class="col-6">
            <img src="${film.imgSource}" width="600" height="600" class="img-fluid shadow"
              alt="The Godfather">
          </div>
          <div class="col-6">
            <div class="film_bilgi">
              <span class="film_ad">${film.name}</span>
              <br>
              <span class="oyuncular">${film.actors}</span>
              <br>
              <span class="derece">
               ${createFilmStars(film.starRate)}
                <span>${film.reviewCount}</span>
              </span>
            </div>
            <p class="film_aciklama">${film.description}</p>
            <div>
              <span style="font-size: 25px; font-weight: bold; color:#d1cbcb;">${film.price}₺</span>
              <span  style="text-decoration:line-through; font-size: 13px; color:gray;">${film.oldPrice}₺</span>
            </div>
            <button class="buton" onclick="sepeteEkle(${film.id})">Sepete Ekle</button>
          </div>
        </div>
      </div>
        `;
  });

  filmListEl.innerHTML = filmListHtml;
}
//Sepete eklenen ürünleri listeleme
const sepetUrunlerListele = () => {

  const sepetListEl = document.querySelector(".urun_liste");
  const sepetUrunEl = document.querySelector(".sepet_urun_sayisi");
  sepetUrunEl.innerHTML = sepetList.length > 0 ? sepetList.length : null;
  const toplamTutarEl = document.querySelector(".toplam_tutar");

  let sepetListHtml = "";
  let toplamTutar = 0;
  sepetList.forEach(item => {
    toplamTutar += item.urun.price;
    sepetListHtml += `  
      <li>
      <img src="${item.urun.imgSource}" width="100" height="150" >
      <div class="urun_bilgi">
        <h3 style="color: white; font-size: 25px; font-weight: bold;">${item.urun.name}</h3>
        <span style="color: rgb(189, 186, 186); font-size: 15px; font-weight: bold;">${item.urun.price}₺</span> 
        <br>
        <span style="color: rgb(92, 90, 90); font-size: 13px; cursor: pointer;" onclick="sepettenKaldir(${item.urun.id})">Kaldır</span>
      </div>
    </li>`;

  });

  sepetListEl.innerHTML = sepetListHtml ? sepetListHtml : `
  <li style="font-size: 15px; color:white;">
  Sepetiniz boş, doldurmya başlayın.
  </li>` ;
  toplamTutarEl.innerHTML = toplamTutar > 0 ? "Toplam: " + toplamTutar + "₺" : null;
}
//Sepete ürün ekleme
const sepeteEkle = (filmID) => {
  let filmBul = filmList.find(filmler => filmler.id == filmID); 
  if (filmBul) {

    const sepetIndex = sepetList.findIndex(sepet => sepet.urun.id == filmID);
    if (sepetIndex == -1) {
      let urunEkle = { adet: 1, urun: filmBul }; 
      sepetList.push(urunEkle);
    }
    else {
      sepetList[sepetIndex].miktar += 1;
    }
    sepetUrunlerListele();
  }
}
//Sepetten ürün kaldırma
const sepettenKaldir = (filmID) => {
  const filmBulIndex = sepetList.findIndex(basket => basket.urun.id == filmID);
  if (filmBulIndex != -1) {
    sepetList.splice(filmBulIndex, 1);
  }
  sepetUrunlerListele();
}

setTimeout(() => {

  createFilmItemsHtml();
}, 100);

//Ürün sayfası slider
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  let captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}

$(document).ready(function() {
  var $imagesCarousel = $('.carouselOfImages').flickity({
    contain: true,
    autoPlay: true,
    wrapAround: true,
    friction: 0.3
  });
  function resizeCells() {
    var flkty = $imagesCarousel.data('flickity');
    var $current = flkty.selectedIndex
    var $length = flkty.cells.length
    if ($length <='5') {
      $imagesCarousel.flickity('destroy');
    }
    $('.carouselOfImages .carouselImage').removeClass("nextToSelected");
    $('.carouselOfImages .carouselImage').eq($current-1).addClass("nextToSelected");
    if ($current+1 == $length) {
      var $endCell = "0"
    } else {
      var $endCell = $current+1
    }
     $('.carouselOfImages .carouselImage').eq($endCell).addClass("nextToSelected");
    };
  resizeCells();
  
  $imagesCarousel.on('scroll.flickity', function() {
      resizeCells();
    });
    
    
  $(".carouselImage img").click(function() { 
    var $this = $(this);
    var imageID = $this.attr('data-tab');
    var imageSrc = $this.attr('src');
    
    $('.' + imageID).removeClass('hide');
    $('.' + imageID + ' .product-detail-image img').attr('src', imageSrc);
  });
  
  $('.product-detail-close,.product-detail').on('click', function() {
    $('.product-detail').addClass('hide');
  });
  
    $('.modal-video').on('hidden.bs.modal', function (e) {
      $('.modal-video iframe').attr('src', $('.modal-video iframe').attr('src'));
    });
  
  autoPlayYouTubeModal();
  
    function autoPlayYouTubeModal() {
        var trigger = $("body").find('[data-the-video]');
        trigger.click(function () {
            var theModal = $(this).data("target"),
                videoSRC = $(this).attr("data-the-video"),
                videoSRCauto = videoSRC + "&autoplay=1";
            $(theModal + ' iframe').attr('src', videoSRCauto);
            $(theModal + ' button.close').click(function () {
                $(theModal + ' iframe').attr('src', videoSRC);
            });
            $('.modal-video').click(function () {
                $(theModal + ' iframe').attr('src', videoSRC);
            });
        });
    }
  
  $(window).on('load resize', function(){
    var $window = $(window);
    $('.modal-fill-vert .modal-body > *').height(function(){
        return $window.height()-60;
      });
    }); 
  });
  


  function saatGuncelle() {
    var simdi = new Date();
    var saat = simdi.getHours();
    var dakika = simdi.getMinutes();
    var saniye = simdi.getSeconds();

    saat = (saat < 10) ? "0" + saat : saat;
    dakika = (dakika < 10) ? "0" + dakika : dakika;
    saniye = (saniye < 10) ? "0" + saniye : saniye;

    var saatString = saat + ":" + dakika + ":" + saniye;

    document.getElementById("saat").innerHTML = saatString;
}

// Sayfa yüklendiğinde saat güncellensin
saatGuncelle();

// Her 1 saniyede bir saat güncellensin
setInterval(saatGuncelle, 1000);


//
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  var scrollToTopButton = document.getElementById("scrollToTopBtn");

  // Sayfa aşağı kaydırıldığında butonu göster
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTopButton.style.display = "block";
  } else {
      scrollToTopButton.style.display = "none";
  }
}

// Butona tıklandığında sayfanın en üstüne git
function topFunction() {
  document.body.scrollTop = 0; // Safari için
  document.documentElement.scrollTop = 0; // Diğer tarayıcılar için
}
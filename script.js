import { acessKey } from './acessKey.js';

const photoGalleryTable = document.querySelector('.photo-gallery__list');
const quantity = document.querySelector('#quantity');

let number = 1;

// Для загрузки фотографий необходимо ввести сгенерированный acess key
const acessKeyIm = acessKey;

quantity.addEventListener("change", () => {
   loadMorePhotos(quantity.value);
});

async function fetchPhotos (numberPage, quantity) {
   try {
      const response = await fetch(`https://api.unsplash.com/photos?page=${numberPage}&per_page=${quantity}&client_id=${acessKeyIm}&lang=ru`);
      const photos = await response.json();
      return photos;
   } catch (error) {
      console.error('Ошибка при загрузке фотографий:', error);
      return [];
   }
}

async function loadMorePhotos (quantityPhoto) {
   fetchPhotos(number, quantityPhoto).then((photos) => {
      photos.forEach(photo => {
         photoGalleryTable.innerHTML += `
         <div class="photo-gallery__item">
            <div class="photo-gallery__item-wrap">
               <img class="photo-gallery__item-img" src="${photo.urls.small}">
            </div>
            <div class="photo-gallery__item-info">
               <p class="photo-gallery__name-photographer">Фотограф: ${photo.user.name}</p>
               <div class="like">
                  <i onClick="countUp(this)" class="fa fa-thumbs-up"></i>
                  <p class="count">0</p>
                  <i onClick="countDown(this)" class="fa fa-thumbs-down"></i>
               </div>
            </div>
         </div>
         `
      });
   });
   number++;
}

function countUp (element) {
   let btnLike = element.parentElement.querySelector(".count");
   let count = Number.parseInt(btnLike.textContent);
   count++;
   showCount(btnLike, count);
}

function countDown (element) {
   let btnLike = element.parentElement.querySelector(".count");
   let count = Number.parseInt(btnLike.textContent);
   count--;
   showCount(btnLike, count);
}

function showCount (btnLike, count) {
   btnLike.textContent = count;
}

window.addEventListener('scroll', () => {
   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadMorePhotos(quantity.value);
   }
});

// Загрузка первой партии фотографий при загрузке страницы
loadMorePhotos(quantity.value);
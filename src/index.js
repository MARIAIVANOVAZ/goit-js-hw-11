import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PhotoApiService from './fetchPhoto';
import './sass/gallery.scss';

const photoApiService = new PhotoApiService();

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('input[name="searchQuery"]'),
  buttonEl: document.querySelector('button'),
  galleryEl: document.querySelector('.gallery'),
  btnLoadMoreEl: document.querySelector('.load-more'),
  lightBox: null,
};

refs.formEl.addEventListener('submit', onSearch);
refs.btnLoadMoreEl.addEventListener('click', onLoadMore);
refs.btnLoadMoreEl.setAttribute('hidden', true);

function onSearch(event) {
  onRemoveMarkup();
  event.preventDefault();
  photoApiService.resetPage();

  photoApiService.searchQuery = event.target.elements.searchQuery.value;
  console.log(photoApiService.searchQuery);
  if (photoApiService.searchQuery === '') {
    onRemoveMarkup();
    return;
  }
  onFetch();
}

async function onFetch() {
  try {
    const { data, nextPage } = await photoApiService.fetchPhoto();
    onRenderMarkup(data);
    onLightBox();

    if (data.totalHits > 0) {
      refs.btnLoadMoreEl.removeAttribute('hidden');
    }

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      onRemoveMarkup();
      return;
    }

    if (nextPage) {
      Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
      refs.btnLoadMoreEl.setAttribute('hidden', true);
      return;
    }
  } catch (error) {
    console.log('error');
    onFetchError();
  }
}

function onRenderMarkup({ ...data }) {
  console.log(data);
  const markup = data.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
      <li>
      <a class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
            <img src="${webformatURL}" width="250" height="200" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${downloads}
              </p>
            </div>
        </div>
        </a>
        </li>
        `;
    })
    .join('');

  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}

function onRemoveMarkup() {
  refs.galleryEl.innerHTML = '';
  refs.btnLoadMoreEl.setAttribute('hidden', true);
}

function onFetchError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function onLoadMore() {
  onFetch();
}

function onLightBox() {
  if (!refs.lightBox) {
    refs.lightBox = new SimpleLightbox('.gallery a');
    return;
  }
  refs.lightBox.refresh();
}

import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';

export default class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchPhoto() {
    const url = `${BASE_URL}/?key=24940342-42b3a055a9e1adb2b613cb878&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;
    const { data } = await axios.get(url);

    this.incrementPage();
    const totalPages = Math.ceil(data.totalHits / this.perPage);
    const nextPage = this.page > totalPages;
    console.log(totalPages);
    console.log(this.page);

    return { data, nextPage };
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

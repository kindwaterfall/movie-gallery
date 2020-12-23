const movieList = document.querySelector('.movie-list');
const movieListFavorite = document.querySelector('.movie-list-favorite');
const modal = document.querySelector('.modal-full');
const modalElement = document.querySelector('.modal');

let storage = [];
let localMovies;

async function getMovies(url) {
    const res = await fetch(url);
    const movies = await res.json();
    localMovies = movies;
    if (localStorage.length > 0) {
        let local = JSON.parse(localStorage.getItem('storage'));
        local.forEach(status => {
            storage.push(status);
        });
    } else {
        movies.forEach(() => {
            let obj = new Object();
            obj.status = false;
            storage.push(obj);
        });
        localStorage.setItem('storage', JSON.stringify(storage));
    }
    renderMovieList(movies);
    renderFavoriteList(movies);
}

function renderMovieList(movies) {
    if (movies.length === 0) {
        return movieList.children[0].classList.remove('error');
    }
    movies.forEach((movie, idx) => {
        movieList.insertAdjacentHTML('beforeend', `
            <div class="movie">
                <button 
                    class="icon-toggle ${ storage[idx].status ? 'icon-active' : 'icon-unactive' }" 
                    onclick="toggleMovieFavorite('${idx}')">
                </button>
                <img class="movie-poster" src="${movie.img}" alt="poster" onclick="openModal('${idx}')">   
                <p class="movie-description bold">${movie.name}</p>
                <p class="movie-description">${movie.year}</p>
            </div>
        `)
    });
}

function renderFavoriteList(movies) {
    if (localStorage.length === 0) {
        return movieListFavorite.children[0].classList.remove('error');
    }
    movieListFavorite.innerHTML = '';
    movies.forEach((movie, idx) => {
        if (storage[idx].status) {
            movieListFavorite.insertAdjacentHTML('beforeend', `
                <div class="movie-favorite">
                    <p class="bold"><span class="movie-id">${idx + 1}</span>${movie.name}</p>
                    <span class="icon icon-delete" onclick="toggleMovieFavorite('${idx}')"></span>
                </div>
            `)
        }
    })
}

function renderModal(id) {
    let movie = localMovies[id];  
    modalElement.insertAdjacentHTML('beforeend', `
        <div>
            <div class="poster">
                <img src="${movie.img}" alt="poster">
            </div>
            <div class="year flex">
                <button class="icon-toggle 
                    ${ storage[id].status ? 'icon-active' : 'icon-unactive' }" 
                    onclick="toggleMovieFavorite('${id}')">
                </button>
                <p class="movie-description">${movie.year}</p>
            </div>
            <div class="genres">
               ${movie.genres.map(genre => {
                   return `<p>${genre}</p>`
               }).join('')}
            </div>
        </div>
        <div>
            <div>
                <h4 class="bold">${movie.name}</h4>
                <p>${movie.description}</p>
            </div>
            <div>
               <p>Director: ${movie.director}</p>
               <div class="starring">
                ${movie.starring.map(star => {
                    return `<p>${star}</p>`
                })}
               </div>
            </div>
        </div>
        <div class="modal-close" onclick="closeModal()"></div>
    `)
}

function openModal(id) {
    modal.classList.add('modal-show');
    renderModal(id);
}

function closeModal() {
    modalElement.innerHTML = '';
    modal.classList.remove('modal-show');
}

function toggleMovieFavorite(getID) {
    let id = Number(getID);
    localStorage.removeItem('storage');
    const toggle = document.querySelectorAll('.icon-toggle')[id];
    if (storage[id].status) {
        toggle.classList.remove('icon-active');
        toggle.classList.add('icon-unactive');
    } else {
        toggle.classList.remove('icon-unactive');
        toggle.classList.add('icon-active');
    }
    storage[id].status = !storage[id].status;
    localStorage.setItem('storage', JSON.stringify(storage));
    renderFavoriteList(localMovies);
}

window.onload = () => {
    getMovies('http://my-json-server.typicode.com/moviedb-tech/movies/list');
}
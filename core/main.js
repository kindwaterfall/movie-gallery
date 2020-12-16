const nodeMovieList = document.querySelector('.movie-list');

async function getMovies(url) {
    const res = await fetch(url);
    const movies = await res.json();
    renderMovieList(movies);
}

function renderMovieList(movies) {
    return movies.map((movie) => {
        nodeMovieList.insertAdjacentHTML('beforeend', `
            <div class="movie" data-movie="${movie.id}">
                <span class="movie-toggle"></span>
                <img class="movie-poster" src="${movie.img}">
                <p class="movie-description bold">${movie.name}</p>
                <p class="movie-description">${movie.year}</p>
            </div>
        `)
    })
}
    
window.onload = () => {
    getMovies('http://my-json-server.typicode.com/moviedb-tech/movies/list');
}
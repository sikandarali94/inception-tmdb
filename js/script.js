/* Code inside here needs to run only once so it is suitable to put it into an IIFE. Added benefit is that data inside
is private */
(function() {
    // Cache the DOM elements to load data into.
    const title = document.getElementById('movie-title');
    const director = document.getElementById('director');
    const cast = document.getElementById('cast');
    const writer = document.getElementById('writer');
    const producers = document.getElementById('producers');
    const poster = document.getElementById('poster');

    // Cache the DOM elements to animate and change display.
    const showcase = document.getElementById('showcase');
    const overlay = document.getElementById('overlay');
    const errorMessage = document.getElementById('error-message');
    const loader = document.getElementById('loader');

    // Define dangerous characters that need to be replaced from within the data.
    const tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };

    // Function checks if a character matches a dangerous character and replaces it if it is.
    function replaceTag(tag) {
        return tagsToReplace[tag] || tag;
    }

    //Function constructor that constructs an object capable of sending out a HTTP request with the data it has.
    const MovieRequestTMDB = function(extID, language) {
        this.extID = extID;
        this.language = language;
    };

    // Define the HTTP Request method in the prototype.
    MovieRequestTMDB.prototype.apiKey = '226f1081add256202b3ba5ae80361765';
    MovieRequestTMDB.prototype.makeRequest = function() {
        // Define URL of page that will handle HTTP request.
        const url = 'https://api.themoviedb.org/3/movie/' + this.extID + '?api_key=' + this.apiKey + '&language='
            + this.language + '&append_to_response=credits';

        const xhr = new XMLHttpRequest();

        // When response returns from the page which we sent request to.
        xhr.onload = function() {
            // If status code returned is successful (200 indicates success)
            if (xhr.status === 200) {
                // Define variables that will store the HTML content to place into unordered lists of the page.
                let directorElems = '';
                let castElems = '';
                let writerElems = '';
                let producerElems = '';

                // Convert JSON to JavaScript Object.
                const response = JSON.parse(xhr.responseText);

                // Select movie title from data, replace dangerous characters and display it on the page.
                title.textContent = response.title.replace(/[&<>]/g, replaceTag);

                /* Since we are displaying the most important crew members' information, it makes sense that their
                credits will be in the top 50 of the credits of the people who worked on the film.
                 */
                for (let crew of response.credits.crew.slice(0,50)) {

                    // If credit is of Director.
                    if (crew.job === 'Director') {
                        /* Append the director name as list item to be displayed on the page; Replace any dangerous
                        characters */
                        directorElems += '<li>' + crew.name.replace(/[&<>]/g, replaceTag) + '</li>';
                    }

                    // If credit is of Writer.
                    if (crew.job === 'Writer') {
                        /* Append the writer name as list item to be displayed on the page; Replace any dangerous
                        characters */
                        writerElems += '<li>' + crew.name.replace(/[&<>]/g, replaceTag) + '</li>';
                    }

                    // If credit is of Producer.
                    if (crew.job === 'Producer' || crew.job === 'Executive Producer') {
                        /* Append the producer name as list item to be displayed on the page; Replace any dangerous
                        characters */
                        producerElems += '<li>' + crew.name.replace(/[&<>]/g, replaceTag) + '</li>';
                    }

                }

                /* Find the first four most important cast members and append their name as list item to be displayed
                on the page. */
                for (let i = 0; i < 4; i++) {
                    castElems += '<li>' + response.credits.cast[i].name.replace(/[&<>]/g, replaceTag) + '</li>';
                }

                /* Using the poster path data, define the url of the poster image path; Replace any dangerous
                characters. */
                const posterPath = 'https://image.tmdb.org/t/p/w500' + response['poster_path']
                    .replace(/[&<>]/g, replaceTag);

                // Insert the HTML content onto the page in their proper places within the DOM.
                director.innerHTML = directorElems;
                cast.innerHTML = castElems;
                writer.innerHTML = writerElems;
                producers.innerHTML = producerElems;

                // Set the poster image url as value of src attribute of the poster image element.
                poster.setAttribute('src', posterPath);

                // Hide the loading spinner GIF.
                loader.style.display = 'none';
                // Fade out the overlay.
                overlay.setAttribute('class', 'animated fadeOut slower');

                /* After fade out animation is complete (animation is 3 seconds), set overlay display off and show the
                movie data display. */
                setTimeout(function() {
                    overlay.style.display = 'none';
                    showcase.style.display = 'block';
                }, 3000);

            // If status code returned indicates request was not successful.
            } else {
                // Hide the loading spinner GIF.
                loader.style.display = 'none';

                // Display error message.
                errorMessage.style.display = 'block';
            }
        };

        // Send GET request to TMDB API; Request should be asynchronous.
        xhr.open('GET', url , true);
        // Don't send any data to API, we only want to receive data.
        xhr.send(null);
    };

    // This object holds required data for Inception movie to be able to make a successful request to TMDB API.
    const inception = new MovieRequestTMDB('27205', 'en-US');
    // Make request for Inception movie data.
    inception.makeRequest();
})();
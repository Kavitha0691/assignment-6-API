$(document).ready(function () {
    const API_ENDPOINT = "https://swapi.dev/api/people/";
    let buddyCharacter = {}; 

    // Function to fetch a random character from the API
    const fetchRandomCharacter = async () => {
        let randomID = Math.floor(Math.random() * 82 + 1);  

        try {
            let response = await fetch(`${API_ENDPOINT}${randomID}/`);
            let characterData = await response.json();

            // character information
            $('.character__id').text(`ID: ${characterData.url.split('/')[5]}`);
            $('.character__name').text(characterData.name);

            // Fetch films and species
            const films = await getFilms(characterData.films);
            const species = await getSpecies(characterData.species);

            $('.character__films').text(films.length > 0 ? `Films: ${films.join(", ")}` : "Films: None");
            $('.character__species').text(species.length > 0 ? `Species: ${species.join(", ")}` : "Species: Unknown");

            // Get character image based on the character's name
            const imageUrl = await getCharacterImage(characterData.url);  
            $('.character__image img').prop('src', imageUrl);

            // Set up the buddy character object
            buddyCharacter.name = characterData.name;
            buddyCharacter.image = imageUrl;

            // Show the character details 
            $(".character__image").show();
            $(".character__id").show();
            $(".character__films").show();
            $(".character__species").show();
            $(".character__catch").show(); 
            $(".character__save").show(); 
        } catch (error) {
            console.log(error);
            $(".error-message").text("Something went wrong! Please try again.");
        }
    };

    const getCharacterImage = async (characterUrl) => {
        const characterId = characterUrl.split('/').filter(Boolean).pop(); 
        const imageUrl = `https://starwars-visualguide.com/assets/img/characters/${characterId}.jpg`;
    
        try {
            const response = await fetch(imageUrl, { method: 'HEAD' });
            if (response.ok) {
                return imageUrl;  
            } else {
                console.warn(`Image not found for ID ${characterId}, using placeholder.`);
                return "https://via.placeholder.com/200x200.png?text=No+Image+Available";
            }
        } catch (error) {
            console.error(`Error fetching image for ID ${characterId}:`, error);
            return "https://via.placeholder.com/100x100.png?text=No+Image+Available"; 
        }
    };

    // Function to get films
    const getFilms = async (filmUrls) => {
        let films = [];
        for (let url of filmUrls) {
            let response = await fetch(url);
            let filmData = await response.json();
            films.push(filmData.title);
        }
        return films;
    };

    // Function to get species
    const getSpecies = async (speciesUrls) => {
        if (speciesUrls.length === 0) {
            return ["Human"];  
        }
    
        let species = [];
        for (let url of speciesUrls) {
            let response = await fetch(url);
            let speciesData = await response.json();
            species.push(speciesData.name);
        }
        return species;
    };

    const saveBuddy = () => {
        if (buddyCharacter.name) {
            localStorage.setItem("buddy", JSON.stringify(buddyCharacter));
            displayBuddy(buddyCharacter);  
        }
    };

    // Function to display the saved buddy from localStorage
    const displayBuddy = (buddy) => {
        const headerBuddy = $('.header__buddy');
        headerBuddy.empty();
        headerBuddy.append(
            `<img class="header__buddy--image" src="${buddy.image}" alt="${buddy.name}" width="60" height="auto">`
        );
        headerBuddy.append(`<div class="header__buddy--name">${buddy.name}</div>`);
    };

    // Retrieve and display the buddy it's stored in localStorage
    const retrieveBuddy = () => {
        let savedBuddy = localStorage.getItem("buddy");
        if (savedBuddy) {
            savedBuddy = JSON.parse(savedBuddy);
            displayBuddy(savedBuddy);
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        $('body').toggleClass('dark');
        const mode = $('body').hasClass('dark') ? 'dark' : 'light';
        localStorage.setItem('mode', mode);
    };

    const setMode = () => {
        const mode = localStorage.getItem('mode');
        if (mode === 'dark') {
            $('body').addClass('dark');
        }
    };

    // Event listeners
    $(".character__catch").on("click", fetchRandomCharacter);  
    $(".character__save").on("click", saveBuddy);  
    $(".mode").on("click", toggleDarkMode);  

    retrieveBuddy(); 
    setMode();  
});

$(document).ready(function () {
    const addBackgroundVideo = (videoSource) => {
        const existingVideo = document.querySelector('.background-video');
        if (existingVideo) {
            existingVideo.remove();
        }

        const video = document.createElement("video");
        video.src = videoSource;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.classList.add("background-video");
        video.style.position = "fixed";
        video.style.top = "0";
        video.style.left = "0";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";
        video.style.zIndex = "-1";

        document.body.appendChild(video);
    };

    const setMode = (isDarkMode) => {
        if (isDarkMode) {
            addBackgroundVideo("./images/starwar.mp4"); 
            $(".mode").text("Light Mode");  
        } else {
            addBackgroundVideo("./images/starwar1.mp4");  
            $(".mode").text("Dark Mode");  
        }
    };

    let isDarkMode = false;
    setMode(isDarkMode);  

    $(".mode").on("click", function () {
        isDarkMode = !isDarkMode;  
        setMode(isDarkMode); 
    });
});



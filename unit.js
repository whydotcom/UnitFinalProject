const pokedexArray = [];

const searchArray = [];

const pcArray = [];

const ranchArray = [];

const search = document.getElementById("search");

const container = document.getElementById("container");

const pcContainer = document.getElementById("pc-container")

let animating = false;

const suggestionContainer = document.getElementById("suggestion-container");

const pokedexForm = document.getElementById("pokedex-form");

const pcForm = document.getElementById("pc-form");

let suggestionClickable = false;

let whichScreen = 1;

displayScreen(1);


pokedexForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const submittedName = search.value;

    fetchPokedex(submittedName);

})

search.addEventListener("input", function(e) {

    let typed = e.target.value;

    didYouMean(typed);


    const liveSearchArray = searchArray.filter(searched => searched.name.toLowerCase().includes(typed));

    container.innerHTML = "Pokemon you've searched before:";

    renderCard(liveSearchArray, {liveSearch : true});

    if (liveSearchArray.length === 0){
        container.innerHTML = "";
    }
})



pcForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    console.log("X")

    const pcObject =  takeFormMakeObject();

    console.log(pcObject);

    const fetchedData = await pcFetch(pcObject.name);

    const pcSprite = fetchedData.sprites.front_default;

    pcObject.sprite = pcSprite;

    renderPcObject(pcObject);

    this.reset();

})

async function fetchPokedex (species){

    const inputValue = species;

    container.textContent = "Loading Pokedex Entry...";

    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`);

        if (!response.ok){
            throw new Error("Unable to find pokemon")
        }

        const data = await response.json();

        console.log(data)
        
        
        const response2  = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`);

        if (!response2.ok){
            throw new Error("Unable to find pokedex entry")
        }

        const data2 = await response2.json();

        container.textContent = "";

        suggestionContainer.textContent = "";
        
        pokedexArray.length = [];
        
        pokedexMakeAndAddObject(data, data2);

        renderCard(pokedexArray);

    }catch(error){
       container.textContent = `Could Not Find This ${inputValue}`;

       console.log(error);

    }

    
}

async function pcFetch(species){
    const inputValue = species;

    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`);

        if (!response.ok){
            throw new Error("Unable to find pokemon")
        }

        const data = await response.json();

        return data;


    }catch(error){


       console.log(error);

    }
}
    
function displayScreen(value){

    whichScreen = value;


    if (whichScreen === 1){
        const dexScreen1 = document.querySelector(".dex-screen-1");
        const dexScreen2 = document.querySelector(".dex-screen-2");
        const dexScreen3 = document.querySelector(".dex-screen-3");

        dexScreen1.style.display = "flex";
        dexScreen2.style.display = "none";
        dexScreen3.style.display = "none";


    }
    if (whichScreen === 2){
        const dexScreen1 = document.querySelector(".dex-screen-1");
        const dexScreen2 = document.querySelector(".dex-screen-2");
        const dexScreen3 = document.querySelector(".dex-screen-3");

        dexScreen1.style.display = "none";
        dexScreen2.style.display = "flex";
        dexScreen3.style.display = "none";


    }    
    if (whichScreen === 3){
        const dexScreen1 = document.querySelector(".dex-screen-1");
        const dexScreen2 = document.querySelector(".dex-screen-2");
        const dexScreen3 = document.querySelector(".dex-screen-3");

        dexScreen1.style.display = "none";
        dexScreen2.style.display = "none";
        dexScreen3.style.display = "flex";


        //assigns each one a random start, and it does it now
        //because this is when screen 3 is visible and will have dimensions
        randomStart(pcArray);


        ///start the pokemon ranch
        //randomStart(pcArray);
        if (animating === false){
            animating = true;
            update(pcArray);

        }
    }

}

function renderCard(array, {liveSearch = false} = {}){
    
    array.forEach(loop => {
        const card = document.createElement("div");
        const pImgBox = document.createElement("div");
        const pImg = document.createElement("img");
        const pInfoBox = document.createElement("div");
        const pName = document.createElement("h3");
        const pHeight = document.createElement("p");
        const pWeight = document.createElement("p");
        const pTyping = document.createElement("p");
        const pEntryIcon = document.createElement("img");
        const pEntry = document.createElement("p");
        const entryBtn = document.createElement("button");
        const pCryIcon = document.createElement("img");
        const cryBtn = document.createElement("button");

        entryBtn.onclick = pokedexVoice(entryBtn,loop);

        cryBtn.onclick = pokemonCryEffect(cryBtn,loop.sound);
        pImg.src = loop.sprite;
        pName.textContent = `${loop.name}`;
        pHeight.textContent = `Height: ${loop.height}`;
        pWeight.textContent = `Weight: ${loop.weight}lb`;
        pTyping.textContent = `Type: ${loop.typing}`;
        pEntry.textContent = loop.entry;
        entryBtn.textContent = "Play Recording"
        cryBtn.textContent = "Hear Me!";

        card.classList.add("poke-card");
        pInfoBox.classList.add("poke-info-box");
        pImgBox.classList.add("poke-sprite-container");
        pImg.classList.add("poke-sprite");
        pName.classList.add("poke-name");
        pHeight.classList.add("poke-height");
        pWeight.classList.add("poke-weight");
        pTyping.classList.add("poke-typing");
        pEntry.classList.add("poke-entry");
        entryBtn.classList.add("poke-entry-button");
        cryBtn.classList.add("poke-cry-button");

        if (liveSearch === true){

            card.style.cursor = "pointer";
            card.onclick = () => {
                fetchPokedex(pName.textContent);
            }

            pImg.style.height = "120px";
            pImg.style.width = "120px";

            container.appendChild(card);
            card.appendChild(pImgBox);
            pImgBox.appendChild(pImg);

            card.appendChild(pInfoBox);
            pInfoBox.appendChild(pName);
  
            pInfoBox.appendChild(pTyping);
 

        } else{
            container.appendChild(card);
            card.appendChild(pImgBox);
            pImgBox.appendChild(pImg);
            card.appendChild(cryBtn);
            card.appendChild(pInfoBox);
            pInfoBox.appendChild(pName);
            pInfoBox.appendChild(pHeight);
            pInfoBox.appendChild(pWeight);
            pInfoBox.appendChild(pTyping);
            pInfoBox.appendChild(pEntry);
            pInfoBox.appendChild(entryBtn);
        }


        
    })
    
    


}

function pokemonCryEffect(button,url){
    button.addEventListener("click", function(e) {
        const cry = new Audio(url);
    
        cry.volume = 0.5;

        cry.play()
            .then(() => console.log("playing cry!"))
            .catch(error => console.error("Playback blocked or failed:", error));
    })
}

function pokedexVoice(button,object){



    button.addEventListener("click", () => {

        const correctedText = fixReading(object);

        console.log(correctedText);

        const utterance = new SpeechSynthesisUtterance(correctedText); 
        utterance.rate = 1.0; 
        utterance.pitch = 1.02; 
        utterance.volume = 1.0; 
        window.speechSynthesis.speak(utterance);
    })
}

function pokedexMakeAndAddObject(data, data2){
    const pokeName = data.name;

    let convertToInches = data.height*3.937;
    let roundDownConversionInFeet = Math.floor(convertToInches/12);
    let remainingInInches = convertToInches - (roundDownConversionInFeet*12);
    let inchesRoundedUp = Math.round(remainingInInches);
    
    const pokeHeight = `${roundDownConversionInFeet}' ${inchesRoundedUp}"`

    let weightInKilo = data.weight/10;

    const pokeWeight = (weightInKilo*2.20462).toFixed(2);

    const pokeSprite = data.sprites.front_default;

    const pokemonTypeArray = data.types

    const pokemonType1 = data.types[0].type.name;

    let pokemonType2 = "";

    if (pokemonTypeArray.length > 1){
        pokemonType2 = ", " + data.types[1].type.name;
    };

    const pokeTyping = `${pokemonType1}${pokemonType2}`

    const pokeCryUrl = data.cries.latest;

    const pokeEntry =  fixEntry(data2);
    
 

    const pokedexPokemonObject= {
        name: pokeName,
        height: pokeHeight,
        weight: pokeWeight,
        sprite: pokeSprite,
        typing: pokeTyping,
        sound: pokeCryUrl,
        entry: pokeEntry
    }

    pokedexArray.push(pokedexPokemonObject)
    searchArray.push(pokedexPokemonObject);
}

function takeFormMakeObject(){

    const nameInput = document.getElementById("pokemon-name").value;
    const nicknameInput = document.getElementById("nickname").value;
    const firstMoveInput = document.getElementById("move1").value;
    const secondMoveInput = document.getElementById("move2").value;
    const thirdMoveInput = document.getElementById("move3").value;
    const fourthMoveInput = document.getElementById("move4").value;

    const pcPokemonObject = {
        name: nameInput,
        nickname: nicknameInput,
        move1: firstMoveInput,
        move2: secondMoveInput,
        move3: thirdMoveInput,
        move4: fourthMoveInput,
        sprite: "",
        posx: 0,
        posy: 0,
        speedx: 1,
        speedy: 1
    }

    

    ranchArray.push(pcPokemonObject);

    return pcPokemonObject;

}

//function createAndPushRanchObject(){
    const ranchObject = {
        img:""

    }
//}

function renderPcObject(object){
    const icon = document.createElement("img");

    object.element = icon;

    icon.src = object.sprite;

    icon.classList.add("pc-icon");
  
    pcContainer.appendChild(icon);
    
    pcArray.unshift(object);
 

}

function getRandomDecimal(min, max) {
    return Math.floor(Math.random() * (max - min) + min);

}

function storeSearch(){

}

function recallSearch(){

}

function storePC(){

}

function recallPC(){

}

function fixEntry(object){
    let contentArray = []
    let correctDescription = ""

    object.flavor_text_entries.forEach(loop => {
        if (loop.language.name === "en" && loop.language && contentArray.length < 5 ){
            let entry = loop.flavor_text

            contentArray.push(entry);


        }


    })

    const noDuplicates = contentArray.filter((item, index, array) => {
            if (index === array.length-1){
                return true
            }

            if (item.slice(0, 10) === array[index+1].slice(0,10)){
                return false
            }

            return true;
    })
    
    noDuplicates.forEach(item => {
        correctDescription += `${item} `
    })

    return correctDescription;
}

function fixReading(object){


    console.log(object.entry.toLowerCase());

    console.log(object.name);

    if (object.entry.toLowerCase().includes(object.name)){

        console.log("HI");

        const eName = object.name;
        const eText = object.entry.toLowerCase();

        const nameObject = pokemonNameArray.filter(object => object.name.toLowerCase().includes(eName));

        console.log();

        

        const newText = eText.replaceAll(eName,nameObject[0].pronounced);

        return newText;
    }
}

function didYouMean(input){
    const didYouMeanArray = pokemonNameArray.filter(object => object.name.toLowerCase().includes(input));

    console.log(didYouMeanArray);

    if (didYouMeanArray.length != 0 && input.length != 0){
        const suggestionCard = document.createElement("div")
        const title = document.createElement("p")

        suggestionContainer.innerHTML = "";

        title.textContent = "Did you mean:";

        suggestionContainer.appendChild(suggestionCard);
        suggestionCard.appendChild(title);


        didYouMeanArray.forEach(object => {
   
            const suggestion = document.createElement("p");
            suggestion.textContent = object.name;
            suggestion.onclick = () => {
                fetchPokedex(suggestion.textContent);
                search.textContent = suggestion.textContent;   
            };
            suggestionCard.appendChild(suggestion);

        })



    } else {
        suggestionContainer.innerHTML = "";
    }

}

function randomStart(array){
    array.forEach(pokemon => {

        const maxW = pcContainer.clientWidth - pokemon.element.clientWidth;
        const maxH = pcContainer.clientHeight - pokemon.element.clientHeight;

        pokemon.posx = getRandomDecimal(1,maxW);
        pokemon.posy = getRandomDecimal(1,maxH);
    })

    console.log(pcArray);
}



function update(array) {


    array.forEach(pokemon => {

        const maxW = pcContainer.clientWidth - pokemon.element.clientWidth;
        const maxH = pcContainer.clientHeight - pokemon.element.clientHeight;

        
        pokemon.posx += pokemon.speedx;
        pokemon.posy += pokemon.speedy;

        if (pokemon.posx <= 0 || pokemon.posx >= maxW) {
            pokemon.speedx *= -1;
        }

        if (pokemon.posy <= 0 || pokemon.posy >= maxH) {
            pokemon.speedy *= -1;
        }

    

        pokemon.element.style.left = pokemon.posx + "px";
        pokemon.element.style.top = pokemon.posy + "px";



    })
    requestAnimationFrame(() => update(array));

    
}



const pokemonNameArray = [
    { 
        name: "Bulbasaur", pronounced: "bulb-ah-sore" 
    },
    { 
        name: "Ivysaur", pronounced: "eye-vee-sore" 
    },
    { 
        name: "Venusaur", pronounced: "vee-nuh-sore" 
    },
    { 
        name: "Charmander", pronounced: "char-man-der" 
    },
    { 
        name: "Charmeleon", pronounced: "char-mee-lee-un" 
    },
    { 
        name: "Charizard", pronounced: "char-ih-zard" 
    },
    { 
        name: "Squirtle", pronounced: "skwirt-uhl" 
    },
    { 
        name: "Wartortle", pronounced: "war-tor-tuhl" 
    },
    { 
        name: "Blastoise", pronounced: "blas-toys" 
    },
    { 
        name: "Caterpie", pronounced: "cat-er-pee" 
    },
    { 
        name: "Metapod", pronounced: "met-uh-pod" 
    },
    { 
        name: "Butterfree", pronounced: "butter-free" 
    },
    { 
        name: "Weedle", pronounced: "wee-dul" 
    },
    { 
        name: "Kakuna", pronounced: "kah-koo-nah" 
    },
    { 
        name: "Beedrill", pronounced: "bee-drill" 
    },
    { 
        name: "Pidgey", pronounced: "pidge-ee" 
    },
    { 
        name: "Pidgeotto", pronounced: "pidge-ee-otto" 
    },
    { 
        name: "Pidgeot", pronounced: "pidge-ee-ot" 
    },
    { 
        name: "Rattata", pronounced: "rat-uh-tah" 
    },
    { 
        name: "Raticate", pronounced: "rat-ih-kate" 
    },
    { 
        name: "Spearow", pronounced: "speer-oh" 
    },
    { 
        name: "Fearow", pronounced: "feer-oh" 
    },
    { 
        name: "Ekans", pronounced: "ee-kans" 
    },
    { 
        name: "Arbok", pronounced: "ar-bok" 
    },
    { 
        name: "Pikachu", pronounced: "pee-kah-choo" 
    },
    { 
        name: "Raichu", pronounced: "rye-choo" 
    },
    { 
        name: "Sandshrew", pronounced: "sand-shroo" 
    },
    { 
        name: "Sandslash", pronounced: "sand-slash" 
    },
    { 
        name: "Nidoran♀", pronounced: "nee-doh-ran female" 
    },
    { 
        name: "Nidorina", pronounced: "nee-doh-ree-nah" 
    },
    { 
        name: "Nidoqueen", pronounced: "nee-doh-kween" 
    },
    { 
        name: "Nidoran♂", pronounced: "nee-doh-ran male" 
    },
    { 
        name: "Nidorino", pronounced: "nee-doh-ree-noh" 
    },
    { 
        name: "Nidoking", pronounced: "nee-doh-king" 
    },
    { 
        name: "Clefairy", pronounced: "clef-air-ee" 
    },
    { 
        name: "Clefable", pronounced: "clef-uh-bul" 
    },
    { 
        name: "Vulpix", pronounced: "vul-picks" 
    },
    { 
        name: "Ninetales", pronounced: "nine-tails" 
    },
    { 
        name: "Jigglypuff", pronounced: "jig-lee-puff" 
    },
    { 
        name: "Wigglytuff", pronounced: "wig-lee-tuff" 
    },
    { 
        name: "Zubat", pronounced: "zoo-bat" 
    },
    { 
        name: "Golbat", pronounced: "goal-bat" 
    },
    { 
        name: "Oddish", pronounced: "odd-ish" 
    },
    { 
        name: "Gloom", pronounced: "gloom" 
    },
    { 
        name: "Vileplume", pronounced: "vile-plume" 
    },
    { 
        name: "Paras", pronounced: "pair-us" 
    },
    { 
        name: "Parasect", pronounced: "pair-uh-sect" 
    },
    { 
        name: "Venonat", pronounced: "ven-uh-nat" 
    },
    { 
        name: "Venomoth", pronounced: "ven-uh-moth" 
    },
    { 
        name: "Diglett", pronounced: "dig-let" 
    },
    { 
        name: "Dugtrio", pronounced: "dug-tree-oh" 
    },
    { 
        name: "Meowth", pronounced: "meowth" 
    },
    { 
        name: "Persian", pronounced: "per-zhun" 
    },
    { 
        name: "Psyduck", pronounced: "sigh-duck" 
    },
    { 
        name: "Golduck", pronounced: "goal-duck" 
    },
    { 
        name: "Mankey", pronounced: "man-key" 
    },
    { 
        name: "Primeape", pronounced: "pry-mape" 
    },
    { 
        name: "Growlithe", pronounced: "grow-lith" 
    },
    { 
        name: "Arcanine", pronounced: "ark-uh-nine" 
    },
    { 
        name: "Poliwag", pronounced: "poly-wag" 
    },
    { 
        name: "Poliwhirl", pronounced: "poly-whirl" 
    },
    { 
        name: "Poliwrath", pronounced: "poly-rath" 
    },
    { 
        name: "Abra", pronounced: "ab-rah" 
    },
    { 
        name: "Kadabra", pronounced: "kuh-dab-rah" 
    },
    { 
        name: "Alakazam", pronounced: "al-uh-kuh-zam" 
    },
    { 
        name: "Machop", pronounced: "mack-op" 
    },
    { 
        name: "Machoke", pronounced: "mack-ohk" 
    },
    { 
        name: "Machamp", pronounced: "mack-amp" 
    },
    { 
        name: "Bellsprout", pronounced: "bell-sprout" 
    },
    { 
        name: "Weepinbell", pronounced: "wee-pin-bell" 
    },
    { 
        name: "Victreebel", pronounced: "vik-tree-bell" 
    },
    { 
        name: "Tentacool", pronounced: "ten-tuh-cool" 
    },
    { 
        name: "Tentacruel", pronounced: "ten-tuh-cruel" 
    },
    { 
        name: "Geodude", pronounced: "jee-oh-dude" 
    },
    { 
        name: "Graveler", pronounced: "grav-uh-ler" 
    },
    { 
        name: "Golem", pronounced: "goh-lem" 
    },
    { 
        name: "Ponyta", pronounced: "poh-nee-tah" 
    },
    { 
        name: "Rapidash", pronounced: "rap-ih-dash" 
    },
    { 
        name: "Slowpoke", pronounced: "slow-poke" 
    },
    { 
        name: "Slowbro", pronounced: "slow-broh" 
    },
    { 
        name: "Magnemite", pronounced: "mag-neh-mite" 
    },
    { 
        name: "Magneton", pronounced: "mag-neh-ton" 
    },
    { 
        name: "Farfetch'd", pronounced: "far-fetched" 
    },
    { 
        name: "Doduo", pronounced: "doh-doo-oh" 
    },
    { 
        name: "Dodrio", pronounced: "doh-dree-oh" 
    },
    { 
        name: "Seel", pronounced: "seal" 
    },
    { 
        name: "Dewgong", pronounced: "doo-gong" 
    },
    { 
        name: "Grimer", pronounced: "grye-mer" 
    },
    { 
        name: "Muk", pronounced: "muck" 
    },
    { 
        name: "Shellder", pronounced: "shell-der" 
    },
    { 
        name: "Cloyster", pronounced: "kloy-ster" 
    },
    { 
        name: "Gastly", pronounced: "gast-lee" 
    },
    { 
        name: "Haunter", pronounced: "haunt-er" 
    },
    { 
        name: "Gengar", pronounced: "gen-gar" 
    },
    { 
        name: "Onix", pronounced: "on-icks" 
    },
    { 
        name: "Drowzee", pronounced: "drow-zee" 
    },
    { 
        name: "Hypno", pronounced: "hip-noh" 
    },
    { 
        name: "Krabby", pronounced: "krab-ee" 
    },
    { 
        name: "Kingler", pronounced: "king-ler" 
    },
    { 
        name: "Voltorb", pronounced: "vol-torb" 
    },
    { 
        name: "Electrode", pronounced: "ee-lek-trode" 
    },
    { 
        name: "Exeggcute", pronounced: "ex-egg-cute" 
    },
    { 
        name: "Exeggutor", pronounced: "ex-egg-you-tor" 
    },
    { 
        name: "Cubone", pronounced: "cue-bone" 
    },
    { 
        name: "Marowak", pronounced: "mare-oh-wak" 
    },
    { 
        name: "Hitmonlee", pronounced: "hit-mon-lee" 
    },
    { 
        name: "Hitmonchan", pronounced: "hit-mon-chan" 
    },
    { 
        name: "Lickitung", pronounced: "lick-it-ung" 
    },
    { 
        name: "Koffing", pronounced: "cough-ing" 
    },
    { 
        name: "Weezing", pronounced: "wee-zing" 
    },
    { 
        name: "Rhyhorn", pronounced: "rye-horn" 
    },
    { 
        name: "Rhydon", pronounced: "rye-don" 
    },
    { 
        name: "Chansey", pronounced: "chan-see" 
    },
    { 
        name: "Tangela", pronounced: "tan-jel-uh" 
    },
    { 
        name: "Kangaskhan", pronounced: "kang-uh-skan" 
    },
    { 
        name: "Horsea", pronounced: "hor-see" 
    },
    { 
        name: "Seadra", pronounced: "see-drah" 
    },
    { 
        name: "Goldeen", pronounced: "gol-deen" 
    },
    { 
        name: "Seaking", pronounced: "see-king" 
    },
    { 
        name: "Staryu", pronounced: "star-you" 
    },
    { 
        name: "Starmie", pronounced: "star-mee" 
    },
    { 
        name: "Mr. Mime", pronounced: "mister mime" 
    },
    { 
        name: "Scyther", pronounced: "sigh-ther" 
    },
    { 
        name: "Jynx", pronounced: "jinks" 
    },
    { 
        name: "Electabuzz", pronounced: "ee-lek-tuh-buzz" 
    },
    { 
        name: "Magmar", pronounced: "mag-mar" 
    },
    { 
        name: "Pinsir", pronounced: "pin-sir" 
    },
    { 
        name: "Tauros", pronounced: "tor-us" 
    },
    { 
        name: "Magikarp", pronounced: "mag-ih-karp" 
    },
    { 
        name: "Gyarados", pronounced: "gear-uh-dose" 
    },
    { 
        name: "Lapras", pronounced: "lap-rass" 
    },
    { 
        name: "Ditto", pronounced: "dit-oh" 
    },
    { 
        name: "Eevee", pronounced: "ee-vee" 
    },
    { 
        name: "Vaporeon", pronounced: "vap-oh-ree-on" 
    },
    { 
        name: "Jolteon", pronounced: "jole-tee-on" 
    },
    { 
        name: "Flareon", pronounced: "flair-ee-on" 
    },
    { 
        name: "Porygon", pronounced: "por-ee-gon" 
    },
    { 
        name: "Omanyte", pronounced: "oh-man-ite" 
    },
    { 
        name: "Omastar", pronounced: "oh-muh-star" 
    },
    { 
        name: "Kabuto", pronounced: "kuh-boo-toh" 
    },
    { 
        name: "Kabutops", pronounced: "kuh-boo-tops" 
    },
    { 
        name: "Aerodactyl", pronounced: "air-oh-dak-til" 
    },
    { 
        name: "Snorlax", pronounced: "snore-lax" 
    },
    { 
        name: "Articuno", pronounced: "ar-tih-koo-noh" 
    },
    { 
        name: "Zapdos", pronounced: "zap-dose" 
    },
    { 
        name: "Moltres", pronounced: "mole-tress" 
    },
    { 
        name: "Dratini", pronounced: "drah-tee-nee" 
    },
    { 
        name: "Dragonair", pronounced: "drag-on-air" 
    },
    { 
        name: "Dragonite", pronounced: "drag-on-ite" 
    },
    { 
        name: "Mewtwo", pronounced: "mew-too" 
    },
    { 
        name: "Mew", pronounced: "myoo" 
    },
    { 
        name: "Chikorita", pronounced: "chick-oh-ree-tah" 
    },
    { 
        name: "Bayleef", pronounced: "bay-leef" 
    },
    { 
        name: "Meganium", pronounced: "meh-gan-ee-um" 
    },
    { 
        name: "Cyndaquil", pronounced: "sin-duh-kwil" 
    },
    { 
        name: "Quilava", pronounced: "kwil-ah-vah" 
    },
    { 
        name: "Typhlosion", pronounced: "tie-flow-zhun" 
    },
    { 
        name: "Totodile", pronounced: "toh-toh-dile" 
    },
    { 
        name: "Croconaw", pronounced: "crock-uh-naw" 
    },
    { 
        name: "Feraligatr", pronounced: "fer-al-ih-gator" 
    },
    { 
        name: "Sentret", pronounced: "sen-tret" 
    },
    { 
        name: "Furret", pronounced: "fur-et" 
    },
    { 
        name: "Hoothoot", pronounced: "hoot-hoot" 
    },
    { 
        name: "Noctowl", pronounced: "nok-towl" 
    },
    { 
        name: "Ledyba", pronounced: "leh-dee-bah" 
    },
    { 
        name: "Ledian", pronounced: "lee-dee-an" 
    },
    { 
        name: "Spinarak", pronounced: "spin-uh-rak" 
    },
    { 
        name: "Ariados", pronounced: "air-ee-uh-dose" 
    },
    { 
        name: "Crobat", pronounced: "crow-bat" 
    },
    { 
        name: "Chinchou", pronounced: "chin-choh" 
    },
    { 
        name: "Lanturn", pronounced: "lan-turn" 
    },
    { 
        name: "Pichu", pronounced: "pee-choo" 
    },
    { 
        name: "Cleffa", pronounced: "clef-uh" 
    },
    { 
        name: "Igglybuff", pronounced: "ig-lee-buff" 
    },
    { 
        name: "Togepi", pronounced: "toh-geh-pee" 
    },
    { 
        name: "Togetic", pronounced: "toh-geh-tick" 
    },
    { 
        name: "Natu", pronounced: "nah-too" 
    },
    { 
        name: "Xatu", pronounced: "zah-too" 
    },
    { 
        name: "Mareep", pronounced: "mair-eep" 
    },
    { 
        name: "Flaaffy", pronounced: "flah-fee" 
    },
    { 
        name: "Ampharos", pronounced: "am-fair-os" 
    },
    { 
        name: "Bellossom", pronounced: "bell-uh-som" 
    },
    { 
        name: "Marill", pronounced: "mar-ill" 
    },
    { 
        name: "Azumarill", pronounced: "az-oo-mar-ill" 
    },
    { 
        name: "Sudowoodo", pronounced: "soo-doh-woo-doh" 
    },
    { 
        name: "Politoed", pronounced: "poly-toad" 
    },
    { 
        name: "Hoppip", pronounced: "hop-ip" 
    },
    { 
        name: "Skiploom", pronounced: "skip-loom" 
    },
    { 
        name: "Jumpluff", pronounced: "jump-luff" 
    },
    { 
        name: "Aipom", pronounced: "eye-pom" 
    },
    { 
        name: "Sunkern", pronounced: "sun-kern" 
    },
    { 
        name: "Sunflora", pronounced: "sun-flor-uh" 
    },
    { 
        name: "Yanma", pronounced: "yan-mah" 
    },
    { 
        name: "Wooper", pronounced: "woo-per" 
    },
    { 
        name: "Quagsire", pronounced: "kwag-sire" 
    },
    { 
        name: "Espeon", pronounced: "ess-pee-on" 
    },
    { 
        name: "Umbreon", pronounced: "um-bree-on" 
    },
    { 
        name: "Murkrow", pronounced: "mur-kroh" 
    },
    { 
        name: "Slowking", pronounced: "slow-king" 
    },
    { 
        name: "Misdreavus", pronounced: "miss-dree-vus" 
    },
    { 
        name: "Unown", pronounced: "un-known" 
    },
    { 
        name: "Wobbuffet", pronounced: "wob-buh-fet" 
    },
    { 
        name: "Girafarig", pronounced: "jir-ah-far-ig" 
    },
    { 
        name: "Pineco", pronounced: "pine-koh" 
    },
    { 
        name: "Forretress", pronounced: "for-eh-tress" 
    },
    { 
        name: "Dunsparce", pronounced: "dun-sparse" 
    },
    { 
        name: "Gligar", pronounced: "gly-gar" 
    },
    { 
        name: "Steelix", pronounced: "steel-icks" 
    },
    { 
        name: "Snubbull", pronounced: "snub-bull" 
    },
    { 
        name: "Granbull", pronounced: "gran-bull" 
    },
    { 
        name: "Qwilfish", pronounced: "kwil-fish" 
    },
    { 
        name: "Scizor", pronounced: "sigh-zor" 
    },
    { 
        name: "Shuckle", pronounced: "shuck-ull" 
    },
    { 
        name: "Heracross", pronounced: "her-uh-cross" 
    },
    { 
        name: "Sneasel", pronounced: "snee-zul" 
    },
    { 
        name: "Teddiursa", pronounced: "ted-ee-ur-sah" 
    },
    { 
        name: "Ursaring", pronounced: "ur-sah-ring" 
    },
    { 
        name: "Slugma", pronounced: "slug-mah" 
    },
    { 
        name: "Magcargo", pronounced: "mag-car-go" 
    },
    { 
        name: "Swinub", pronounced: "swin-ub" 
    },
    { 
        name: "Piloswine", pronounced: "pie-loh-swine" 
    },
    { 
        name: "Corsola", pronounced: "cor-soh-lah" 
    },
    { 
        name: "Remoraid", pronounced: "rem-oh-raid" 
    },
    { 
        name: "Octillery", pronounced: "ok-till-er-ee" 
    },
    { 
        name: "Delibird", pronounced: "del-ee-bird" 
    },
    { 
        name: "Mantine", pronounced: "man-teen" 
    },
    { 
        name: "Skarmory", pronounced: "skar-more-ee" 
    },
    { 
        name: "Houndour", pronounced: "hound-our" 
    },
    { 
        name: "Houndoom", pronounced: "hound-oom" 
    },
    { 
        name: "Kingdra", pronounced: "king-drah" 
    },
    { 
        name: "Phanpy", pronounced: "fan-pee" 
    },
    { 
        name: "Donphan", pronounced: "don-fan" 
    },
    { 
        name: "Porygon2", pronounced: "por-ee-gon too" 
    },
    { 
        name: "Stantler", pronounced: "stant-ler" 
    },
    { 
        name: "Smeargle", pronounced: "smeer-gul" 
    },
    { 
        name: "Tyrogue", pronounced: "tie-rohg" 
    },
    { 
        name: "Hitmontop", pronounced: "hit-mon-top" 
    },
    { 
        name: "Smoochum", pronounced: "smoo-chum" 
    },
    { 
        name: "Elekid", pronounced: "el-eh-kid" 
    },
    { 
        name: "Magby", pronounced: "mag-bee" 
    },
    { 
        name: "Miltank", pronounced: "mill-tank" 
    },
    { 
        name: "Blissey", pronounced: "bliss-ee" 
    },
    { 
        name: "Raikou", pronounced: "rye-koh" 
    },
    { 
        name: "Entei", pronounced: "en-tay" 
    },
    { 
        name: "Suicune", pronounced: "swee-koon" 
    },
    { 
        name: "Larvitar", pronounced: "lar-vee-tar" 
    },
    { 
        name: "Pupitar", pronounced: "pyoo-pih-tar" 
    },
    { 
        name: "Tyranitar", pronounced: "tie-ran-ih-tar" 
    },
    { 
        name: "Lugia", pronounced: "loo-gee-uh" 
    },
    { 
        name: "Ho-Oh", pronounced: "hoh-oh" 
    },
    { 
        name: "Celebi", pronounced: "seh-leh-bee" 
    },
    { 
        name: "Treecko", pronounced: "tree-koh" 
    },
    { 
        name: "Grovyle", pronounced: "groh-vile" 
    },
    { 
        name: "Sceptile", pronounced: "sep-tile" 
    },
    { 
        name: "Torchic", pronounced: "tor-chick" 
    },
    { 
        name: "Combusken", pronounced: "com-bus-ken" 
    },
    { 
        name: "Blaziken", pronounced: "blaze-ih-ken" 
    },
    { 
        name: "Mudkip", pronounced: "mud-kip" 
    },
    { 
        name: "Marshtomp", pronounced: "marsh-tomp" 
    },
    { 
        name: "Swampert", pronounced: "swam-pert" 
    },
    { 
        name: "Poochyena", pronounced: "poo-chee-en-uh" 
    },
    { 
        name: "Mightyena", pronounced: "might-ee-en-uh" 
    },
    { 
        name: "Zigzagoon", pronounced: "zig-zag-oon" 
    },
    { 
        name: "Linoone", pronounced: "lih-noon" 
    },
    { 
        name: "Wurmple", pronounced: "wurm-pul" 
    },
    { 
        name: "Silcoon", pronounced: "sil-koon" 
    },
    { 
        name: "Beautifly", pronounced: "beaut-ih-fly" 
    },
    { 
        name: "Cascoon", pronounced: "kas-koon" 
    },
    { 
        name: "Dustox", pronounced: "dust-ox" 
    },
    { 
        name: "Lotad", pronounced: "low-tad" 
    },
    { 
        name: "Lombre", pronounced: "lom-bray" 
    },
    { 
        name: "Ludicolo", pronounced: "loo-dee-koh-loh" 
    },
    { 
        name: "Seedot", pronounced: "see-dot" 
    },
    { 
        name: "Nuzleaf", pronounced: "nuz-leef" 
    },
    { 
        name: "Shiftry", pronounced: "shif-tree" 
    },
    { 
        name: "Taillow", pronounced: "tay-loh" 
    },
    { 
        name: "Swellow", pronounced: "swell-oh" 
    },
    { 
        name: "Wingull", pronounced: "win-gull" 
    },
    { 
        name: "Pelipper", pronounced: "pel-ip-per" 
    },
    { 
        name: "Ralts", pronounced: "ralts" 
    },
    { 
        name: "Kirlia", pronounced: "keer-lee-uh" 
    },
    { 
        name: "Gardevoir", pronounced: "gar-deh-vwar" 
    },
    { 
        name: "Surskit", pronounced: "sur-skit" 
    },
    { 
        name: "Masquerain", pronounced: "mask-uh-rain" 
    },
    { 
        name: "Shroomish", pronounced: "shroom-ish" 
    },
    { 
        name: "Breloom", pronounced: "bree-loom" 
    },
    { 
        name: "Slakoth", pronounced: "slay-koth" 
    },
    { 
        name: "Vigoroth", pronounced: "vig-uh-roth" 
    },
    { 
        name: "Slaking", pronounced: "slay-king" 
    },
    { 
        name: "Nincada", pronounced: "nin-kah-dah" 
    },
    { 
        name: "Ninjask", pronounced: "nin-jask" 
    },
    { 
        name: "Shedinja", pronounced: "sheh-din-jah" 
    },
    { 
        name: "Whismur", pronounced: "whiz-mur" 
    },
    { 
        name: "Loudred", pronounced: "lowd-red" 
    },
    { 
        name: "Exploud", pronounced: "ex-plowd" 
    },
    { 
        name: "Makuhita", pronounced: "mah-koo-hee-tah" 
    },
    { 
        name: "Hariyama", pronounced: "har-ee-yah-mah" 
    },
    { 
        name: "Azurill", pronounced: "az-oo-rill" 
    },
    { 
        name: "Nosepass", pronounced: "nose-pass" 
    },
    { 
        name: "Skitty", pronounced: "skit-ee" 
    },
    { 
        name: "Delcatty", pronounced: "del-cat-ee" 
    },
    { 
        name: "Sableye", pronounced: "say-bull-eye" 
    },
    { 
        name: "Mawile", pronounced: "maw-ile" 
    },
    { 
        name: "Aron", pronounced: "air-on" 
    },
    { 
        name: "Lairon", pronounced: "lay-ron" 
    },
    { 
        name: "Aggron", pronounced: "ag-ron" 
    },
    { 
        name: "Meditite", pronounced: "med-ih-tite" 
    },
    { 
        name: "Medicham", pronounced: "med-ih-cham" 
    },
    { 
        name: "Electrike", pronounced: "ee-lek-trike" 
    },
    { 
        name: "Manectric", pronounced: "man-ek-trick" 
    },
    { 
        name: "Plusle", pronounced: "plus-ull" 
    },
    { 
        name: "Minun", pronounced: "min-oon" 
    },
    { 
        name: "Volbeat", pronounced: "vol-beet" 
    },
    { 
        name: "Illumise", pronounced: "ill-oo-meez" 
    },
    { 
        name: "Roselia", pronounced: "roh-zee-lee-uh" 
    },
    { 
        name: "Gulpin", pronounced: "gull-pin" 
    },
    { 
        name: "Swalot", pronounced: "swah-lot" 
    },
    { 
        name: "Carvanha", pronounced: "car-van-uh" 
    },
    { 
        name: "Sharpedo", pronounced: "shar-pee-doh" 
    },
    { 
        name: "Wailmer", pronounced: "whale-mer" 
    },
    { 
        name: "Wailord", pronounced: "whale-ord" 
    },
    { 
        name: "Numel", pronounced: "new-mel" 
    },
    { 
        name: "Camerupt", pronounced: "cam-er-upt" 
    },
    { 
        name: "Torkoal", pronounced: "tor-kohl" 
    },
    { 
        name: "Spoink", pronounced: "spoynk" 
    },
    { 
        name: "Grumpig", pronounced: "grum-pig" 
    },
    { 
        name: "Spinda", pronounced: "spin-dah" 
    },
    { 
        name: "Trapinch", pronounced: "trap-inch" 
    },
    { 
        name: "Vibrava", pronounced: "vye-brah-vah" 
    },
    { 
        name: "Flygon", pronounced: "fly-gon" 
    },
    { 
        name: "Cacnea", pronounced: "cak-nee-uh" 
    },
    { 
        name: "Cacturne", pronounced: "cack-turn" 
    },
    { 
        name: "Swablu", pronounced: "swab-loo" 
    },
    { 
        name: "Altaria", pronounced: "al-tair-ee-uh" 
    },
    { 
        name: "Zangoose", pronounced: "zan-goose" 
    },
    { 
        name: "Seviper", pronounced: "sev-eye-per" 
    },
    { 
        name: "Lunatone", pronounced: "loo-nuh-tone" 
    },
    { 
        name: "Solrock", pronounced: "sol-rock" 
    },
    { 
        name: "Barboach", pronounced: "bar-boach" 
    },
    { 
        name: "Whiscash", pronounced: "wish-cash" 
    },
    { 
        name: "Corphish", pronounced: "cor-fish" 
    },
    { 
        name: "Crawdaunt", pronounced: "craw-dawnt" 
    },
    { 
        name: "Baltoy", pronounced: "bal-toy" 
    },
    { 
        name: "Claydol", pronounced: "clay-doll" 
    },
    { 
        name: "Lileep", pronounced: "lie-leep" 
    },
    { 
        name: "Cradily", pronounced: "cray-dilly" 
    },
    { 
        name: "Anorith", pronounced: "an-uh-rith" 
    },
    { 
        name: "Armaldo", pronounced: "ar-mal-doh" 
    },
    { 
        name: "Feebas", pronounced: "fee-bas" 
    },
    { 
        name: "Milotic", pronounced: "my-low-tick" 
    },
    { 
        name: "Castform", pronounced: "cast-form" 
    },
    { 
        name: "Kecleon", pronounced: "keh-klee-on" 
    },
    { 
        name: "Shuppet", pronounced: "shup-et" 
    },
    { 
        name: "Banette", pronounced: "ban-et" 
    },
    { 
        name: "Duskull", pronounced: "dusk-ull" 
    },
    { 
        name: "Dusclops", pronounced: "dusk-lops" 
    },
    { 
        name: "Tropius", pronounced: "troh-pee-us" 
    },
    { 
        name: "Chimecho", pronounced: "chime-echo" 
    },
    { 
        name: "Absol", pronounced: "ab-sol" 
    },
    { 
        name: "Wynaut", pronounced: "why-not" 
    },
    { 
        name: "Snorunt", pronounced: "snor-unt" 
    },
    { 
        name: "Glalie", pronounced: "glay-lee" 
    },
    { 
        name: "Spheal", pronounced: "sfeel" 
    },
    { 
        name: "Sealeo", pronounced: "see-lee-oh" 
    },
    { 
        name: "Walrein", pronounced: "wall-rain" 
    },
    { 
        name: "Clamperl", pronounced: "clam-perl" 
    },
    { 
        name: "Huntail", pronounced: "hunt-tail" 
    },
    { 
        name: "Gorebyss", pronounced: "gore-biss" 
    },
    { 
        name: "Relicanth", pronounced: "rel-ih-kanth" 
    },
    { 
        name: "Luvdisc", pronounced: "luv-disk" 
    },
    { 
        name: "Bagon", pronounced: "bay-gon" 
    },
    { 
        name: "Shelgon", pronounced: "shell-gon" 
    },
    { 
        name: "Salamence", pronounced: "sal-uh-mence" 
    },
    { 
        name: "Beldum", pronounced: "bell-dum" 
    },
    { 
        name: "Metang", pronounced: "met-ang" 
    },
    { 
        name: "Metagross", pronounced: "met-uh-gross" 
    },
    { 
        name: "Regirock", pronounced: "reh-jee-rock" 
    },
    { 
        name: "Regice", pronounced: "reh-jice" 
    },
    { 
        name: "Registeel", pronounced: "reh-jee-steel" 
    },
    { 
        name: "Latias", pronounced: "lah-tee-as" 
    },
    { 
        name: "Latios", pronounced: "lah-tee-os" 
    },
    { 
        name: "Kyogre", pronounced: "kye-oh-gur" 
    },
    { 
        name: "Groudon", pronounced: "grow-don" 
    },
    { 
        name: "Rayquaza", pronounced: "ray-kwah-zah" 
    },
    { 
        name: "Jirachi", pronounced: "jee-rah-chee" 
    },
    { 
        name: "Deoxys", pronounced: "dee-ox-iss" 
    },
    { 
        name: "Turtwig", pronounced: "turt-wig" 
    },
    { 
        name: "Grotle", pronounced: "grot-ull" 
    },
    { 
        name: "Torterra", pronounced: "tor-ter-rah" 
    },
    { 
        name: "Chimchar", pronounced: "chim-char" 
    },
    { 
        name: "Monferno", pronounced: "mon-fer-noh" 
    },
    { 
        name: "Infernape", pronounced: "in-fer-nape" 
    },
    { 
        name: "Piplup", pronounced: "pip-lup" 
    },
    { 
        name: "Prinplup", pronounced: "prin-plup" 
    },
    { 
        name: "Empoleon", pronounced: "em-pole-ee-on" 
    },
    { 
        name: "Starly", pronounced: "star-lee" 
    },
    { 
        name: "Staravia", pronounced: "star-ay-vee-uh" 
    },
    { 
        name: "Staraptor", pronounced: "star-rap-tor" 
    },
    { 
        name: "Bidoof", pronounced: "bee-doof" 
    },
    { 
        name: "Bibarel", pronounced: "bib-uh-rel" 
    },
    { 
        name: "Kricketot", pronounced: "crick-eh-tot" 
    },
    { 
        name: "Kricketune", pronounced: "crick-eh-toon" 
    },
    { 
        name: "Shinx", pronounced: "shinks" 
    },
    { 
        name: "Luxio", pronounced: "lux-ee-oh" 
    },
    { 
        name: "Luxray", pronounced: "lux-ray" 
    },
    { 
        name: "Budew", pronounced: "boo-doo" 
    },
    { 
        name: "Roserade", pronounced: "rose-uh-rahd" 
    },
    { 
        name: "Cranidos", pronounced: "cran-ee-dose" 
    },
    { 
        name: "Rampardos", pronounced: "ram-par-dose" 
    },
    { 
        name: "Shieldon", pronounced: "sheeld-on" 
    },
    { 
        name: "Bastiodon", pronounced: "bas-tee-oh-don" 
    },
    { 
        name: "Burmy", pronounced: "bur-mee" 
    },
    { 
        name: "Wormadam", pronounced: "worm-uh-dam" 
    },
    { 
        name: "Mothim", pronounced: "moth-im" 
    },
    { 
        name: "Combee", pronounced: "com-bee" 
    },
    { 
        name: "Vespiquen", pronounced: "ves-pee-kwen" 
    },
    { 
        name: "Pachirisu", pronounced: "patch-ee-ree-soo" 
    },
    { 
        name: "Buizel", pronounced: "bwee-zul" 
    },
    { 
        name: "Floatzel", pronounced: "float-zul" 
    },
    { 
        name: "Cherubi", pronounced: "chair-oo-bee" 
    },
    { 
        name: "Cherrim", pronounced: "chair-im" 
    },
    { 
        name: "Shellos", pronounced: "shell-os" 
    },
    { 
        name: "Gastrodon", pronounced: "gas-troh-don" 
    },
    { 
        name: "Ambipom", pronounced: "am-bih-pom" 
    },
    { 
        name: "Drifloon", pronounced: "drif-loon" 
    },
    { 
        name: "Drifblim", pronounced: "drif-blim" 
    },
    { 
        name: "Buneary", pronounced: "boo-nair-ee" 
    },
    { 
        name: "Lopunny", pronounced: "loh-pun-ee" 
    },
    { 
        name: "Mismagius", pronounced: "mis-mag-ee-us" 
    },
    { 
        name: "Honchkrow", pronounced: "honk-crow" 
    },
    { 
        name: "Glameow", pronounced: "glam-ee-ow" 
    },
    { 
        name: "Purugly", pronounced: "pyoo-rug-lee" 
    },
    { 
        name: "Chingling", pronounced: "ching-ling" 
    },
    { 
        name: "Stunky", pronounced: "stun-kee" 
    },
    { 
        name: "Skuntank", pronounced: "skun-tank" 
    },
    { 
        name: "Bronzor", pronounced: "bron-zor" 
    },
    { 
        name: "Bronzong", pronounced: "bron-zong" 
    },
    { 
        name: "Bonsly", pronounced: "bons-lee" 
    },
    { 
        name: "Mime Jr.", pronounced: "mime junior" 
    },
    { 
        name: "Happiny", pronounced: "hap-pee-nee" 
    },
    { 
        name: "Chatot", pronounced: "chat-ot" 
    },
    { 
        name: "Spiritomb", pronounced: "spear-it-oom" 
    },
    { 
        name: "Gible", pronounced: "gibble" 
    },
    { 
        name: "Gabite", pronounced: "gah-bite" 
    },
    { 
        name: "Garchomp", pronounced: "gar-chomp" 
    },
    { 
        name: "Munchlax", pronounced: "munch-lax" 
    },
    { 
        name: "Riolu", pronounced: "ree-oh-loo" 
    },
    { 
        name: "Lucario", pronounced: "loo-car-ee-oh" 
    },
    { 
        name: "Hippopotas", pronounced: "hip-oh-poh-tas" 
    },
    { 
        name: "Hippowdon", pronounced: "hip-oh-don" 
    },
    { 
        name: "Skorupi", pronounced: "skor-oo-pee" 
    },
    { 
        name: "Drapion", pronounced: "dray-pee-on" 
    },
    { 
        name: "Croagunk", pronounced: "crow-gunk" 
    },
    { 
        name: "Toxicroak", pronounced: "toxic-croke" 
    },
    { 
        name: "Carnivine", pronounced: "car-nih-vine" 
    },
    { 
        name: "Finneon", pronounced: "fin-ee-on" 
    },
    { 
        name: "Lumineon", pronounced: "loo-min-ee-on" 
    },
    { 
        name: "Mantyke", pronounced: "man-tike" 
    },
    { 
        name: "Snover", pronounced: "snoh-ver" 
    },
    { 
        name: "Abomasnow", pronounced: "uh-bom-uh-snow" 
    },
    { 
        name: "Weavile", pronounced: "wee-vile" 
    },
    { 
        name: "Magnezone", pronounced: "mag-nee-zone" 
    },
    { 
        name: "Lickilicky", pronounced: "lick-ih-lick-ee" 
    },
    { 
        name: "Rhyperior", pronounced: "rye-peer-ee-or" 
    },
    { 
        name: "Tangrowth", pronounced: "tan-growth" 
    },
    { 
        name: "Electivire", pronounced: "ee-lek-tih-vire" 
    },
    { 
        name: "Magmortar", pronounced: "mag-mor-tar" 
    },
    { 
        name: "Togekiss", pronounced: "toh-geh-kiss" 
    },
    { 
        name: "Yanmega", pronounced: "yan-meg-uh" 
    },
    { 
        name: "Leafeon", pronounced: "leaf-ee-on" 
    },
    { 
        name: "Glaceon", pronounced: "glay-see-on" 
    },
    { 
        name: "Gliscor", pronounced: "gly-score" 
    },
    { 
        name: "Mamoswine", pronounced: "mam-oh-swine" 
    },
    { 
        name: "Porygon-Z", pronounced: "por-ee-gon zee" 
    },
    { 
        name: "Gallade", pronounced: "guh-lade" 
    },
    { 
        name: "Probopass", pronounced: "pro-boh-pass" 
    },
    { 
        name: "Dusknoir", pronounced: "dusk-nwar" 
    },
    { 
        name: "Froslass", pronounced: "fros-lass" 
    },
    { 
        name: "Rotom", pronounced: "roh-tom" 
    },
    { 
        name: "Uxie", pronounced: "ook-see" 
    },
    { 
        name: "Mesprit", pronounced: "mess-preet" 
    },
    { 
        name: "Azelf", pronounced: "az-elf" 
    },
    { 
        name: "Dialga", pronounced: "dee-al-gah" 
    },
    { 
        name: "Palkia", pronounced: "pal-kee-uh" 
    },
    { 
        name: "Heatran", pronounced: "hee-tran" 
    },
    { 
        name: "Regigigas", pronounced: "reh-jee-gee-gas" 
    },
    { 
        name: "Giratina", pronounced: "gear-uh-tee-nah" 
    },
    { 
        name: "Cresselia", pronounced: "creh-sell-ee-uh" 
    },
    { 
        name: "Phione", pronounced: "fee-oh-nee" 
    },
    { 
        name: "Manaphy", pronounced: "man-uh-fee" 
    },
    { 
        name: "Darkrai", pronounced: "dark-rye" 
    },
    { 
        name: "Shaymin", pronounced: "shy-min" 
    },
    { 
        name: "Arceus", pronounced: "ar-see-us" 
    },
    { 
        name: "Victini", pronounced: "vik-tee-nee" 
    },
    { 
        name: "Snivy", pronounced: "snye-vee" 
    },
    { 
        name: "Servine", pronounced: "sur-vine" 
    },
    { 
        name: "Serperior", pronounced: "sur-peer-ee-or" 
    },
    { 
        name: "Tepig", pronounced: "tep-ig" 
    },
    { 
        name: "Pignite", pronounced: "pig-night" 
    },
    { 
        name: "Emboar", pronounced: "em-boar" 
    },
    { 
        name: "Oshawott", pronounced: "oh-shuh-wot" 
    },
    { 
        name: "Dewott", pronounced: "doo-wot" 
    },
    { 
        name: "Samurott", pronounced: "sam-uh-rot" 
    },
    { 
        name: "Patrat", pronounced: "pat-rat" 
    },
    { 
        name: "Watchog", pronounced: "watch-og" 
    },
    { 
        name: "Lillipup", pronounced: "lil-ee-pup" 
    },
    { 
        name: "Herdier", pronounced: "her-dee-er" 
    },
    { 
        name: "Stoutland", pronounced: "stout-land" 
    },
    { 
        name: "Purrloin", pronounced: "pur-loyn" 
    },
    { 
        name: "Liepard", pronounced: "lee-pard" 
    },
    { 
        name: "Pansage", pronounced: "pan-sage" 
    },
    { 
        name: "Simisage", pronounced: "sim-ih-sage" 
    },
    { 
        name: "Pansear", pronounced: "pan-seer" 
    },
    { 
        name: "Simisear", pronounced: "sim-ih-seer" 
    },
    { 
        name: "Panpour", pronounced: "pan-poor" 
    },
    { 
        name: "Simipour", pronounced: "sim-ih-poor" 
    },
    { 
        name: "Munna", pronounced: "mun-ah" 
    },
    { 
        name: "Musharna", pronounced: "moo-shar-nah" 
    },
    { 
        name: "Pidove", pronounced: "pih-dove" 
    },
    { 
        name: "Tranquill", pronounced: "tran-kwil" 
    },
    { 
        name: "Unfezant", pronounced: "un-fez-unt" 
    },
    { 
        name: "Blitzle", pronounced: "blit-zul" 
    },
    { 
        name: "Zebstrika", pronounced: "zeb-stry-kuh" 
    },
    { 
        name: "Roggenrola", pronounced: "rog-en-roll-uh" 
    },
    { 
        name: "Boldore", pronounced: "bowl-door" 
    },
    { 
        name: "Gigalith", pronounced: "gig-uh-lith" 
    },
    { 
        name: "Woobat", pronounced: "woo-bat" 
    },
    { 
        name: "Swoobat", pronounced: "swoo-bat" 
    },
    { 
        name: "Drilbur", pronounced: "drill-bur" 
    },
    { 
        name: "Excadrill", pronounced: "ex-uh-drill" 
    },
    { 
        name: "Audino", pronounced: "aw-dee-noh" 
    },
    { 
        name: "Timburr", pronounced: "tim-bur" 
    },
    { 
        name: "Gurdurr", pronounced: "gur-dur" 
    },
    { 
        name: "Conkeldurr", pronounced: "con-kel-dur" 
    },
    { 
        name: "Tympole", pronounced: "tim-pole" 
    },
    { 
        name: "Palpitoad", pronounced: "pal-pih-toad" 
    },
    { 
        name: "Seismitoad", pronounced: "size-mih-toad" 
    },
    { 
        name: "Throh", pronounced: "throw" 
    },
    { 
        name: "Sawk", pronounced: "sock" 
    },
    { 
        name: "Sewaddle", pronounced: "soo-wad-ul" 
    },
    { 
        name: "Swadloon", pronounced: "swad-loon" 
    },
    { 
        name: "Leavanny", pronounced: "lee-van-ee" 
    },
    { 
        name: "Venipede", pronounced: "ven-ih-peed" 
    },
    { 
        name: "Whirlipede", pronounced: "whirl-ih-peed" 
    },
    { 
        name: "Scolipede", pronounced: "skoh-li-peed" 
    },
    { 
        name: "Cottonee", pronounced: "cot-uh-nee" 
    },
    { 
        name: "Whimsicott", pronounced: "whim-zih-cot" 
    },
    { 
        name: "Petilil", pronounced: "pet-ih-lil" 
    },
    { 
        name: "Lilligant", pronounced: "lil-ih-gant" 
    },
    { 
        name: "Basculin", pronounced: "bas-kyoo-lin" 
    },
    { 
        name: "Sandile", pronounced: "san-dile" 
    },
    { 
        name: "Krokorok", pronounced: "krok-uh-rok" 
    },
    { 
        name: "Krookodile", pronounced: "krook-uh-dile" 
    },
    { 
        name: "Darumaka", pronounced: "dar-oo-mah-kah" 
    },
    { 
        name: "Darmanitan", pronounced: "dar-man-ih-tan" 
    },
    { 
        name: "Maractus", pronounced: "mar-ack-tus" 
    },
    { 
        name: "Dwebble", pronounced: "dweb-bul" 
    },
    { 
        name: "Crustle", pronounced: "crus-tul" 
    },
    { 
        name: "Scraggy", pronounced: "skrag-ee" 
    },
    { 
        name: "Scrafty", pronounced: "skraf-tee" 
    },
    { 
        name: "Sigilyph", pronounced: "sig-ih-liff" 
    },
    { 
        name: "Yamask", pronounced: "yam-ask" 
    },
    { 
        name: "Cofagrigus", pronounced: "cof-uh-grig-us" 
    },
    { 
        name: "Tirtouga", pronounced: "tur-too-gah" 
    },
    { 
        name: "Carracosta", pronounced: "car-uh-costa" 
    },
    { 
        name: "Archen", pronounced: "ar-ken" 
    },
    { 
        name: "Archeops", pronounced: "ar-kee-ops" 
    },
    { 
        name: "Trubbish", pronounced: "trub-ish" 
    },
    { 
        name: "Garbodor", pronounced: "gar-boh-dor" 
    },
    { 
        name: "Zorua", pronounced: "zor-oo-uh" 
    },
    { 
        name: "Zoroark", pronounced: "zor-oh-ark" 
    },
    { 
        name: "Minccino", pronounced: "min-chee-noh" 
    },
    { 
        name: "Cinccino", pronounced: "chin-chee-noh" 
    },
    { 
        name: "Gothita", pronounced: "goth-ee-tah" 
    },
    { 
        name: "Gothorita", pronounced: "goth-oh-ree-tah" 
    },
    { 
        name: "Gothitelle", pronounced: "goth-ih-tell" 
    },
    { 
        name: "Solosis", pronounced: "sol-oh-sis" 
    },
    { 
        name: "Duosion", pronounced: "doo-oh-see-on" 
    },
    { 
        name: "Reuniclus", pronounced: "roy-oo-nih-klus" 
    },
    { 
        name: "Ducklett", pronounced: "duck-let" 
    },
    { 
        name: "Swanna", pronounced: "swan-uh" 
    },
    { 
        name: "Vanillite", pronounced: "van-ill-ite" 
    },
    { 
        name: "Vanillish", pronounced: "van-ill-ish" 
    },
    { 
        name: "Vanilluxe", pronounced: "van-ill-ux" 
    },
    { 
        name: "Deerling", pronounced: "deer-ling" 
    },
    { 
        name: "Sawsbuck", pronounced: "sawz-buck" 
    },
    { 
        name: "Emolga", pronounced: "eh-mol-gah" 
    },
    { 
        name: "Karrablast", pronounced: "kar-uh-blast" 
    },
    { 
        name: "Escavalier", pronounced: "es-kav-uh-leer" 
    },
    { 
        name: "Foongus", pronounced: "foon-gus" 
    },
    { 
        name: "Amoonguss", pronounced: "uh-moon-gus" 
    },
    { 
        name: "Frillish", pronounced: "frill-ish" 
    },
    { 
        name: "Jellicent", pronounced: "jell-ih-sent" 
    },
    { 
        name: "Alomomola", pronounced: "al-oh-moh-moh-lah" 
    },
    { 
        name: "Joltik", pronounced: "jole-tick" 
    },
    { 
        name: "Galvantula", pronounced: "gal-van-too-lah" 
    },
    { 
        name: "Ferroseed", pronounced: "fer-oh-seed" 
    },
    { 
        name: "Ferrothorn", pronounced: "fer-oh-thorn" 
    },
    { 
        name: "Klink", pronounced: "klink" 
    },
    { 
        name: "Klang", pronounced: "klang" 
    },
    { 
        name: "Klinklang", pronounced: "klink-klang" 
    },
    { 
        name: "Tynamo", pronounced: "tie-nah-moh" 
    },
    { 
        name: "Eelektrik", pronounced: "ee-lek-trick" 
    },
    { 
        name: "Eelektross", pronounced: "ee-lek-tross" 
    },
    { 
        name: "Elgyem", pronounced: "el-jee-em" 
    },
    { 
        name: "Beheeyem", pronounced: "bee-hee-yem" 
    },
    { 
        name: "Litwick", pronounced: "lit-wick" 
    },
    { 
        name: "Lampent", pronounced: "lam-pent" 
    },
    { 
        name: "Chandelure", pronounced: "shan-duh-lure" 
    },
    { 
        name: "Axew", pronounced: "ax-you" 
    },
    { 
        name: "Fraxure", pronounced: "frack-sure" 
    },
    { 
        name: "Haxorus", pronounced: "hax-or-us" 
    },
    { 
        name: "Cubchoo", pronounced: "cub-choo" 
    },
    { 
        name: "Beartic", pronounced: "bear-tick" 
    },
    { 
        name: "Cryogonal", pronounced: "cry-oh-gon-ul" 
    },
    { 
        name: "Shelmet", pronounced: "shell-met" 
    },
    { 
        name: "Accelgor", pronounced: "ax-el-gore" 
    },
    { 
        name: "Stunfisk", pronounced: "stun-fisk" 
    },
    { 
        name: "Mienfoo", pronounced: "mee-en-foo" 
    },
    { 
        name: "Mienshao", pronounced: "mee-en-shao" 
    },
    { 
        name: "Druddigon", pronounced: "drud-ih-gon" 
    },
    { 
        name: "Golett", pronounced: "goh-let" 
    },
    { 
        name: "Golurk", pronounced: "goh-lurk" 
    },
    { 
        name: "Pawniard", pronounced: "pawn-yard" 
    },
    { 
        name: "Bisharp", pronounced: "bee-sharp" 
    },
    { 
        name: "Bouffalant", pronounced: "boo-fuh-lant" 
    },
    { 
        name: "Rufflet", pronounced: "ruff-let" 
    },
    { 
        name: "Braviary", pronounced: "bray-vee-air-ee" 
    },
    { 
        name: "Vullaby", pronounced: "vul-uh-bee" 
    },
    { 
        name: "Mandibuzz", pronounced: "man-dih-buzz" 
    },
    { 
        name: "Heatmor", pronounced: "heat-more" 
    },
    { 
        name: "Durant", pronounced: "doo-rant" 
    },
    { 
        name: "Deino", pronounced: "day-noh" 
    },
    { 
        name: "Zweilous", pronounced: "zwy-lus" 
    },
    { 
        name: "Hydreigon", pronounced: "high-dray-gon" 
    },
    { 
        name: "Larvesta", pronounced: "lar-vest-uh" 
    },
    { 
        name: "Volcarona", pronounced: "vol-kuh-roh-nah" 
    },
    { 
        name: "Cobalion", pronounced: "koh-bah-lee-on" 
    },
    { 
        name: "Terrakion", pronounced: "ter-rah-kee-on" 
    },
    { 
        name: "Virizion", pronounced: "vih-riz-ee-on" 
    },
    { 
        name: "Tornadus", pronounced: "tor-nad-us" 
    },
    { 
        name: "Thundurus", pronounced: "thun-dur-us" 
    },
    { 
        name: "Reshiram", pronounced: "reh-shee-ram" 
    },
    { 
        name: "Zekrom", pronounced: "zek-rom" 
    },
    { 
        name: "Landorus", pronounced: "lan-dor-us" 
    },
    { 
        name: "Kyurem", pronounced: "kyoo-rem" 
    },
    { 
        name: "Keldeo", pronounced: "kel-dee-oh" 
    },
    { 
        name: "Meloetta", pronounced: "mel-oh-ett-uh" 
    },
    { 
        name: "Genesect", pronounced: "gen-uh-sect" 
    },
    { 
        name: "Chespin", pronounced: "ches-pin" 
    },
    { 
        name: "Quilladin", pronounced: "kwil-uh-din" 
    },
    { 
        name: "Chesnaught", pronounced: "ches-nawt" 
    },
    { 
        name: "Fennekin", pronounced: "fen-uh-kin" 
    },
    { 
        name: "Braixen", pronounced: "bray-zen" 
    },
    { 
        name: "Delphox", pronounced: "del-fox" 
    },
    { 
        name: "Froakie", pronounced: "froak-ee" 
    },
    { 
        name: "Frogadier", pronounced: "fro-gah-deer" 
    },
    { 
        name: "Greninja", pronounced: "greh-nin-jah" 
    },
    { 
        name: "Bunnelby", pronounced: "bun-ul-bee" 
    },
    { 
        name: "Diggersby", pronounced: "dig-erz-bee" 
    },
    { 
        name: "Fletchling", pronounced: "fletch-ling" 
    },
    { 
        name: "Fletchinder", pronounced: "fletch-in-der" 
    },
    { 
        name: "Talonflame", pronounced: "talon-flame" 
    },
    { 
        name: "Scatterbug", pronounced: "skat-er-bug" 
    },
    { 
        name: "Spewpa", pronounced: "spyoo-pah" 
    },
    { 
        name: "Vivillon", pronounced: "vih-vill-un" 
    },
    { 
        name: "Litleo", pronounced: "lit-lee-oh" 
    },
    { 
        name: "Pyroar", pronounced: "pie-roar" 
    },
    { 
        name: "Flabébé", pronounced: "flah-bay-bay" 
    },
    { 
        name: "Floette", pronounced: "flo-et" 
    },
    { 
        name: "Florges", pronounced: "flor-jess" 
    },
    { 
        name: "Skiddo", pronounced: "skid-oh" 
    },
    { 
        name: "Gogoat", pronounced: "go-goat" 
    },
    { 
        name: "Pancham", pronounced: "pan-cham" 
    },
    { 
        name: "Pangoro", pronounced: "pan-gor-oh" 
    },
    { 
        name: "Furfrou", pronounced: "fur-froo" 
    },
    { 
        name: "Espurr", pronounced: "es-purr" 
    },
    { 
        name: "Meowstic", pronounced: "meow-stick" 
    },
    { 
        name: "Honedge", pronounced: "on-edge" 
    },
    { 
        name: "Doublade", pronounced: "doo-blade" 
    },
    { 
        name: "Aegislash", pronounced: "ee-jis-lash" 
    },
    { 
        name: "Spritzee", pronounced: "spritz-ee" 
    },
    { 
        name: "Aromatisse", pronounced: "air-oh-muh-tees" 
    },
    { 
        name: "Swirlix", pronounced: "swirl-icks" 
    },
    { 
        name: "Slurpuff", pronounced: "slurp-uff" 
    },
    { 
        name: "Inkay", pronounced: "ink-eye" 
    },
    { 
        name: "Malamar", pronounced: "mal-uh-mar" 
    },
    { 
        name: "Binacle", pronounced: "bin-uh-kul" 
    },
    { 
        name: "Barbaracle", pronounced: "bar-bar-uh-kul" 
    },
    { 
        name: "Skrelp", pronounced: "skrelp" 
    },
    { 
        name: "Dragalge", pronounced: "drag-alj" 
    },
    { 
        name: "Clauncher", pronounced: "clawn-cher" 
    },
    { 
        name: "Clawitzer", pronounced: "claw-it-zer" 
    },
    { 
        name: "Helioptile", pronounced: "hee-lee-op-tile" 
    },
    { 
        name: "Heliolisk", pronounced: "hee-lee-oh-lisk" 
    },
    { 
        name: "Tyrunt", pronounced: "tie-runt" 
    },
    { 
        name: "Tyrantrum", pronounced: "tie-ran-trum" 
    },
    { 
        name: "Amaura", pronounced: "uh-more-uh" 
    },
    { 
        name: "Aurorus", pronounced: "aw-roar-us" 
    },
    { 
        name: "Sylveon", pronounced: "sil-vee-on" 
    },
    { 
        name: "Hawlucha", pronounced: "haw-loo-cha" 
    },
    { 
        name: "Dedenne", pronounced: "deh-den" 
    },
    { 
        name: "Carbink", pronounced: "car-bink" 
    },
    { 
        name: "Goomy", pronounced: "goo-mee" 
    },
    { 
        name: "Sliggoo", pronounced: "slih-goo" 
    },
    { 
        name: "Goodra", pronounced: "goo-drah" 
    },
    { 
        name: "Klefki", pronounced: "klef-kee" 
    },
    { 
        name: "Phantump", pronounced: "fan-tump" 
    },
    { 
        name: "Trevenant", pronounced: "trev-uh-nant" 
    },
    { 
        name: "Pumpkaboo", pronounced: "pump-kuh-boo" 
    },
    { 
        name: "Gourgeist", pronounced: "gore-gist" 
    },
    { 
        name: "Bergmite", pronounced: "berg-mite" 
    },
    { 
        name: "Avalugg", pronounced: "av-uh-lug" 
    },
    { 
        name: "Noibat", pronounced: "noy-bat" 
    },
    { 
        name: "Noivern", pronounced: "noy-vern" 
    },
    { 
        name: "Xerneas", pronounced: "zer-nee-us" 
    },
    { 
        name: "Yveltal", pronounced: "ee-vel-tall" 
    },
    { 
        name: "Zygarde", pronounced: "zye-gard" 
    },
    { 
        name: "Diancie", pronounced: "dee-an-see" 
    },
    { 
        name: "Hoopa", pronounced: "hoo-pah" 
    },
    { 
        name: "Volcanion", pronounced: "vol-cay-nee-on" 
    },
    { 
        name: "Rowlet", pronounced: "row-let" 
    },
    { 
        name: "Dartrix", pronounced: "dar-tricks" 
    },
    { 
        name: "Decidueye", pronounced: "deh-sid-joo-eye" 
    },
    { 
        name: "Litten", pronounced: "lit-en" 
    },
    { 
        name: "Torracat", pronounced: "tor-uh-cat" 
    },
    { 
        name: "Incineroar", pronounced: "in-sin-uh-roar" 
    },
    { 
        name: "Popplio", pronounced: "pop-lee-oh" 
    },
    { 
        name: "Brionne", pronounced: "bree-on" 
    },
    { 
        name: "Primarina", pronounced: "prim-uh-ree-nuh" 
    },
    { 
        name: "Pikipek", pronounced: "peek-ee-peck" 
    },
    { 
        name: "Trumbeak", pronounced: "trum-beak" 
    },
    { 
        name: "Toucannon", pronounced: "too-can-un" 
    },
    { 
        name: "Yungoos", pronounced: "yun-goos" 
    },
    { 
        name: "Gumshoos", pronounced: "gum-shooz" 
    },
    { 
        name: "Grubbin", pronounced: "grub-in" 
    },
    { 
        name: "Charjabug", pronounced: "char-jah-bug" 
    },
    { 
        name: "Vikavolt", pronounced: "vih-kuh-volt" 
    },
    { 
        name: "Crabrawler", pronounced: "crab-raw-ler" 
    },
    { 
        name: "Crabominable", pronounced: "crab-om-ih-nuh-bul" 
    },
    { 
        name: "Oricorio", pronounced: "or-ih-kor-ee-oh" 
    },
    { 
        name: "Cutiefly", pronounced: "cue-tee-fly" 
    },
    { 
        name: "Ribombee", pronounced: "rib-om-bee" 
    },
    { 
        name: "Rockruff", pronounced: "rock-ruff" 
    },
    { 
        name: "Lycanroc", pronounced: "ly-can-rock" 
    },
    { 
        name: "Wishiwashi", pronounced: "wish-ee-wash-ee" 
    },
    { 
        name: "Mareanie", pronounced: "mar-ee-nee" 
    },
    { 
        name: "Toxapex", pronounced: "tox-uh-pex" 
    },
    { 
        name: "Mudbray", pronounced: "mud-bray" 
    },
    { 
        name: "Mudsdale", pronounced: "mud-sdale" 
    },
    { 
        name: "Dewpider", pronounced: "doo-pie-der" 
    },
    { 
        name: "Araquanid", pronounced: "air-uh-kwuh-nid" 
    },
    { 
        name: "Fomantis", pronounced: "foh-man-tis" 
    },
    { 
        name: "Lurantis", pronounced: "loo-ran-tis" 
    },
    { 
        name: "Morelull", pronounced: "more-uh-lull" 
    },
    { 
        name: "Shiinotic", pronounced: "shee-not-ick" 
    },
    { 
        name: "Salandit", pronounced: "sal-an-dit" 
    },
    { 
        name: "Salazzle", pronounced: "suh-laz-ul" 
    },
    { 
        name: "Stufful", pronounced: "stuf-ul" 
    },
    { 
        name: "Bewear", pronounced: "bee-wear" 
    },
    { 
        name: "Bounsweet", pronounced: "boon-sweet" 
    },
    { 
        name: "Steenee", pronounced: "stee-nee" 
    },
    { 
        name: "Tsareena", pronounced: "suh-ree-nah" 
    },
    { 
        name: "Comfey", pronounced: "com-fee" 
    },
    { 
        name: "Oranguru", pronounced: "or-an-groo" 
    },
    { 
        name: "Passimian", pronounced: "pass-im-ee-an" 
    },
    { 
        name: "Wimpod", pronounced: "wimp-od" 
    },
    { 
        name: "Golisopod", pronounced: "gol-ih-soh-pod" 
    },
    { 
        name: "Sandygast", pronounced: "sandy-gast" 
    },
    { 
        name: "Palossand", pronounced: "pal-oh-sand" 
    },
    { 
        name: "Pyukumuku", pronounced: "pyoo-koo-moo-koo" 
    },
    { 
        name: "Type: Null", pronounced: "type null" 
    },
    { 
        name: "Silvally", pronounced: "sil-val-lee" 
    },
    { 
        name: "Minior", pronounced: "min-ee-or" 
    },
    { 
        name: "Komala", pronounced: "koh-mah-lah" 
    },
    { 
        name: "Turtonator", pronounced: "tur-ton-ay-tor" 
    },
    { 
        name: "Togedemaru", pronounced: "toh-geh-deh-mah-roo" 
    },
    { 
        name: "Mimikyu", pronounced: "mim-ih-kyoo" 
    },
    { 
        name: "Bruxish", pronounced: "bruk-sish" 
    },
    { 
        name: "Drampa", pronounced: "dram-pah" 
    },
    { 
        name: "Dhelmise", pronounced: "del-mize" 
    },
    { 
        name: "Jangmo-o", pronounced: "jang-moh" 
    },
    { 
        name: "Hakamo-o", pronounced: "hah-kah-moh" 
    },
    { 
        name: "Kommo-o", pronounced: "kom-moh" 
    },
    { 
        name: "Tapu Koko", pronounced: "tah-poo koh-koh" 
    },
    { 
        name: "Tapu Lele", pronounced: "tah-poo lay-lay" 
    },
    { 
        name: "Tapu Bulu", pronounced: "tah-poo boo-loo" 
    },
    { 
        name: "Tapu Fini", pronounced: "tah-poo fee-nee" 
    },
    { 
        name: "Cosmog", pronounced: "cos-mog" 
    },
    { 
        name: "Cosmoem", pronounced: "cos-moh-em" 
    },
    { 
        name: "Solgaleo", pronounced: "sol-gah-lee-oh" 
    },
    { 
        name: "Lunala", pronounced: "loo-nah-lah" 
    },
    { 
        name: "Nihilego", pronounced: "nih-hee-lay-go" 
    },
    { 
        name: "Buzzwole", pronounced: "buz-wol" 
    },
    { 
        name: "Pheromosa", pronounced: "fair-oh-moh-sah" 
    },
    { 
        name: "Xurkitree", pronounced: "zur-kit-tree" 
    },
    { 
        name: "Celesteela", pronounced: "seh-les-tee-lah" 
    },
    { 
        name: "Kartana", pronounced: "kar-tah-nah" 
    },
    { 
        name: "Guzzlord", pronounced: "guz-lord" 
    },
    { 
        name: "Necrozma", pronounced: "neh-kroz-mah" 
    },
    { 
        name: "Magearna", pronounced: "mah-jee-ar-nah" 
    },
    { 
        name: "Marshadow", pronounced: "mar-shadow" 
    },
    { 
        name: "Poipole", pronounced: "poy-pole" 
    },
    { 
        name: "Naganadel", pronounced: "nah-gah-nah-del" 
    },
    { 
        name: "Stakataka", pronounced: "stak-uh-tak-uh" 
    },
    { 
        name: "Blacephalon", pronounced: "blace-ef-uh-lon" 
    },
    { 
        name: "Zeraora", pronounced: "zer-ee-or-uh" 
    },
    { 
        name: "Meltan", pronounced: "mel-tan" 
    },
    { 
        name: "Melmetal", pronounced: "mel-met-ul" 
    },
    { 
        name: "Grookey", pronounced: "groo-kee" 
    },
    { 
        name: "Thwackey", pronounced: "thwak-ee" 
    },
    { 
        name: "Rillaboom", pronounced: "rill-uh-boom" 
    },
    { 
        name: "Scorbunny", pronounced: "score-bun-ee" 
    },
    { 
        name: "Raboot", pronounced: "ruh-boot" 
    },
    { 
        name: "Cinderace", pronounced: "sin-der-ace" 
    },
    { 
        name: "Sobble", pronounced: "sob-ul" 
    },
    { 
        name: "Drizzile", pronounced: "driz-ile" 
    },
    { 
        name: "Inteleon", pronounced: "in-tell-ee-on" 
    },
    { 
        name: "Skwovet", pronounced: "skwoh-vet" 
    },
    { 
        name: "Greedent", pronounced: "gree-dent" 
    },
    { 
        name: "Rookidee", pronounced: "rook-ih-dee" 
    },
    { 
        name: "Corvisquire", pronounced: "cor-vih-skwire" 
    },
    { 
        name: "Corviknight", pronounced: "cor-vik-night" 
    },
    { 
        name: "Blipbug", pronounced: "blip-bug" 
    },
    { 
        name: "Dottler", pronounced: "dot-ler" 
    },
    { 
        name: "Orbeetle", pronounced: "or-beet-ul" 
    },
    { 
        name: "Nickit", pronounced: "nick-it" 
    },
    { 
        name: "Thievul", pronounced: "thee-vul" 
    },
    { 
        name: "Gossifleur", pronounced: "goss-ih-flur" 
    },
    { 
        name: "Eldegoss", pronounced: "el-deh-goss" 
    },
    { 
        name: "Wooloo", pronounced: "woo-loo" 
    },
    { 
        name: "Dubwool", pronounced: "dub-wool" 
    },
    { 
        name: "Chewtle", pronounced: "choo-tul" 
    },
    { 
        name: "Drednaw", pronounced: "dred-naw" 
    },
    { 
        name: "Yamper", pronounced: "yam-per" 
    },
    { 
        name: "Boltund", pronounced: "bolt-und" 
    },
    { 
        name: "Rolycoly", pronounced: "roh-lee-coh-lee" 
    },
    { 
        name: "Carkol", pronounced: "car-kol" 
    },
    { 
        name: "Coalossal", pronounced: "koh-loss-ul" 
    },
    { 
        name: "Applin", pronounced: "ap-lin" 
    },
    { 
        name: "Flapple", pronounced: "flap-ul" 
    },
    { 
        name: "Appletun", pronounced: "ap-ul-tun" 
    },
    { 
        name: "Silicobra", pronounced: "sil-ih-coh-brah" 
    },
    { 
        name: "Sandaconda", pronounced: "sand-uh-con-duh" 
    },
    { 
        name: "Cramorant", pronounced: "cram-oh-rant" 
    },
    { 
        name: "Arrokuda", pronounced: "air-oh-koo-dah" 
    },
    { 
        name: "Barraskewda", pronounced: "bar-uh-skew-duh" 
    },
    { 
        name: "Toxel", pronounced: "tox-ul" 
    },
    { 
        name: "Toxtricity", pronounced: "tox-triss-ih-tee" 
    },
    { 
        name: "Sizzlipede", pronounced: "siz-uh-peed" 
    },
    { 
        name: "Centiskorch", pronounced: "sen-tih-skorch" 
    },
    { 
        name: "Clobbopus", pronounced: "clob-uh-pus" 
    },
    { 
        name: "Grapploct", pronounced: "grap-locked" 
    },
    { 
        name: "Sinistea", pronounced: "sin-ih-stee-uh" 
    },
    { 
        name: "Polteageist", pronounced: "pol-tee-uh-gyst" 
    },
    { 
        name: "Hatenna", pronounced: "huh-ten-uh" 
    },
    { 
        name: "Hattrem", pronounced: "hat-rem" 
    },
    { 
        name: "Hatterene", pronounced: "hat-er-een" 
    },
    { 
        name: "Impidimp", pronounced: "im-pih-dimp" 
    },
    { 
        name: "Morgrem", pronounced: "mor-grem" 
    },
    { 
        name: "Grimmsnarl", pronounced: "grim-snar-ul" 
    },
    { 
        name: "Obstagoon", pronounced: "ob-stuh-goon" 
    },
    { 
        name: "Perrserker", pronounced: "pur-ser-ker" 
    },
    { 
        name: "Cursola", pronounced: "cur-soh-lah" 
    },
    { 
        name: "Sirfetch'd", pronounced: "sir-fetched" 
    },
    { 
        name: "Mr. Rime", pronounced: "mister rime" 
    },
    { 
        name: "Runerigus", pronounced: "roo-neh-rig-us" 
    },
    { 
        name: "Milcery", pronounced: "mill-ser-ee" 
    },
    { 
        name: "Alcremie", pronounced: "al-kree-mee" 
    },
    { 
        name: "Falinks", pronounced: "fal-inks" 
    },
    { 
        name: "Pincurchin", pronounced: "pin-ker-chin" 
    },
    { 
        name: "Snom", pronounced: "snom" 
    },
    { 
        name: "Frosmoth", pronounced: "fros-moth" 
    },
    { 
        name: "Stonjourner", pronounced: "stone-jur-ner" 
    },
    { 
        name: "Eiscue", pronounced: "ice-cue" 
    },
    { 
        name: "Indeedee", pronounced: "in-dee-dee" 
    },
    { 
        name: "Morpeko", pronounced: "mor-peh-koh" 
    },
    { 
        name: "Cufant", pronounced: "cue-fant" 
    },
    { 
        name: "Copperajah", pronounced: "cop-uh-rah-jah" 
    },
    { 
        name: "Dracozolt", pronounced: "dray-co-zolt" 
    },
    { 
        name: "Arctozolt", pronounced: "ark-toh-zolt" 
    },
    { 
        name: "Dracovish", pronounced: "dray-co-vish" 
    },
    { 
        name: "Arctovish", pronounced: "ark-toh-vish" 
    },
    { 
        name: "Duraludon", pronounced: "dur-uh-loo-don" 
    },
    { 
        name: "Dreepy", pronounced: "dree-pee" 
    },
    { 
        name: "Drakloak", pronounced: "drak-lohk" 
    },
    { 
        name: "Dragapult", pronounced: "drag-uh-pult" 
    },
    { 
        name: "Zacian", pronounced: "zay-shee-an" 
    },
    { 
        name: "Zamazenta", pronounced: "zah-mah-zen-tah" 
    },
    { 
        name: "Eternatus", pronounced: "ee-ter-nuh-tus" 
    },
    { 
        name: "Kubfu", pronounced: "koo-boo" 
    },
    { 
        name: "Urshifu", pronounced: "ur-shee-foo" 
    },
    { 
        name: "Zarude", pronounced: "zah-rood" 
    },
    { 
        name: "Regieleki", pronounced: "reh-jee-eh-leh-kee" 
    },
    { 
        name: "Regidrago", pronounced: "reh-jee-drah-goh" 
    },
    { 
        name: "Glastrier", pronounced: "glass-tree-er" 
    },
    { 
        name: "Spectrier", pronounced: "speck-tree-er" 
    },
    { 
        name: "Calyrex", pronounced: "cal-uh-rex" 
    },
    { 
        name: "Wyrdeer", pronounced: "wier-deer" 
    },
    { 
        name: "Kleavor", pronounced: "cleaver" 
    },
    { 
        name: "Ursaluna", pronounced: "ur-suh-loo-nah" 
    },
    { 
        name: "Basculegion", pronounced: "bas-kyoo-lee-jee-on" 
    },
    { 
        name: "Sneasler", pronounced: "snee-zler" 
    },
    { 
        name: "Overqwil", pronounced: "over-kwil" 
    },
    { 
        name: "Enamorus", pronounced: "en-uh-mor-us" 
    },
    { 
        name: "Sprigatito", pronounced: "spree-gah-tee-toh" 
    },
    { 
        name: "Floragato", pronounced: "flor-uh-gah-toh" 
    },
    { 
        name: "Meowscarada", pronounced: "meow-ska-rah-dah" 
    },
    { 
        name: "Fuecoco", pronounced: "fway-coh-coh" 
    },
    { 
        name: "Crocalor", pronounced: "croak-uh-lor" 
    },
    { 
        name: "Skeledirge", pronounced: "skel-eh-dirj" 
    },
    { 
        name: "Quaxly", pronounced: "kwax-lee" 
    },
    { 
        name: "Quaxwell", pronounced: "kwax-well" 
    },
    { 
        name: "Quaquaval", pronounced: "kwak-wuh-vahl" 
    },
    { 
        name: "Lechonk", pronounced: "leh-chonk" 
    },
    { 
        name: "Oinkologne", pronounced: "oyn-koh-lohn" 
    },
    { 
        name: "Tarountula", pronounced: "tah-roon-too-lah" 
    },
    { 
        name: "Spidops", pronounced: "spy-dops" 
    },
    { 
        name: "Nymble", pronounced: "nim-bul" 
    },
    { 
        name: "Lokix", pronounced: "low-kicks" 
    },
    { 
        name: "Pawmi", pronounced: "paw-mee" 
    },
    { 
        name: "Pawmo", pronounced: "paw-moh" 
    },
    { 
        name: "Pawmot", pronounced: "paw-mot" 
    },
    { 
        name: "Tandemaus", pronounced: "tan-deh-mouse" 
    },
    { 
        name: "Maushold", pronounced: "mouse-hold" 
    },
    { 
        name: "Fidough", pronounced: "fye-doh" 
    },
    { 
        name: "Dachsbun", pronounced: "dax-bun" 
    },
    { 
        name: "Smoliv", pronounced: "smoh-liv" 
    },
    { 
        name: "Dolliv", pronounced: "doll-iv" 
    },
    { 
        name: "Arboliva", pronounced: "ar-boh-lee-vah" 
    },
    { 
        name: "Squawkabilly", pronounced: "squawk-uh-bill-ee" 
    },
    { 
        name: "Nacli", pronounced: "nah-klee" 
    },
    { 
        name: "Naclstack", pronounced: "nack-ul-stack" 
    },
    { 
        name: "Garganacl", pronounced: "gar-gan-ack-ul" 
    },
    { 
        name: "Charcadet", pronounced: "char-kuh-det" 
    },
    { 
        name: "Armarouge", pronounced: "ar-mar-ooj" 
    },
    { 
        name: "Ceruledge", pronounced: "seh-roo-ledge" 
    },
    { 
        name: "Tadbulb", pronounced: "tad-bulb" 
    },
    { 
        name: "Bellibolt", pronounced: "bel-ih-bolt" 
    },
    { 
        name: "Wattrel", pronounced: "wat-rel" 
    },
    { 
        name: "Kilowattrel", pronounced: "kil-oh-wat-rel" 
    },
    { 
        name: "Maschiff", pronounced: "mas-shiff" 
    },
    { 
        name: "Mabosstiff", pronounced: "mah-boss-tiff" 
    },
    { 
        name: "Shroodle", pronounced: "shroo-dul" 
    },
    { 
        name: "Grafaiai", pronounced: "graf-eye-eye" 
    },
    { 
        name: "Bramblin", pronounced: "bram-blin" 
    },
    { 
        name: "Brambleghast", pronounced: "bram-bul-gast" 
    },
    { 
        name: "Toedscool", pronounced: "toad-skool" 
    },
    { 
        name: "Toedscruel", pronounced: "toad-skrool" 
    },
    { 
        name: "Klawf", pronounced: "klawf" 
    },
    { 
        name: "Capsakid", pronounced: "cap-sack-id" 
    },
    { 
        name: "Scovillain", pronounced: "skoh-vil-ain" 
    },
    { 
        name: "Rellor", pronounced: "rel-or" 
    },
    { 
        name: "Rabsca", pronounced: "rab-skuh" 
    },
    { 
        name: "Flittle", pronounced: "flit-ul" 
    },
    { 
        name: "Espathra", pronounced: "es-path-rah" 
    },
    { 
        name: "Tinkatink", pronounced: "tink-uh-tink" 
    },
    { 
        name: "Tinkatuff", pronounced: "tink-uh-tuff" 
    },
    { 
        name: "Tinkaton", pronounced: "tink-uh-ton" 
    },
    { 
        name: "Wiglett", pronounced: "wig-let" 
    },
    { 
        name: "Wugtrio", pronounced: "wug-tree-oh" 
    },
    { 
        name: "Bombirdier", pronounced: "bom-bird-ee-er" 
    },
    { 
        name: "Finizen", pronounced: "fin-ih-zen" 
    },
    { 
        name: "Palafin", pronounced: "pal-uh-fin" 
    },
    { 
        name: "Varoom", pronounced: "vuh-room" 
    },
    { 
        name: "Revavroom", pronounced: "reh-vuh-vroom" 
    },
    { 
        name: "Cyclizar", pronounced: "sigh-clih-zar" 
    },
    { 
        name: "Orthworm", pronounced: "orth-worm" 
    },
    { 
        name: "Glimmet", pronounced: "glim-et" 
    },
    { 
        name: "Glimmora", pronounced: "glim-or-uh" 
    },
    { 
        name: "Greavard", pronounced: "gree-vard" 
    },
    { 
        name: "Houndstone", pronounced: "hound-stone" 
    },
    { 
        name: "Flamigo", pronounced: "flam-ee-go" 
    },
    { 
        name: "Cetoddle", pronounced: "seh-tod-ul" 
    },
    { 
        name: "Cetitan", pronounced: "seh-tie-tan" 
    },
    { 
        name: "Veluza", pronounced: "veh-loo-zah" 
    },
    { 
        name: "Dondozo", pronounced: "don-doh-zoh" 
    },
    { 
        name: "Tatsugiri", pronounced: "tat-soo-gee-ree" 
    },
    { 
        name: "Annihilape", pronounced: "an-ih-hy-lape" 
    },
    { 
        name: "Clodsire", pronounced: "clod-sire" 
    },
    { 
        name: "Farigiraf", pronounced: "fair-ih-jee-raf" 
    },
    { 
        name: "Dudunsparce", pronounced: "doo-dun-sparse" 
    },
    { 
        name: "Kingambit", pronounced: "king-am-bit" 
    },
    { 
        name: "Great Tusk", pronounced: "great tusk" 
    },
    { 
        name: "Scream Tail", pronounced: "scream tail" 
    },
    { 
        name: "Brute Bonnet", pronounced: "broot bon-et" 
    },
    { 
        name: "Flutter Mane", pronounced: "flut-er mane" 
    },
    { 
        name: "Slither Wing", pronounced: "slith-er wing" 
    },
    { 
        name: "Sandy Shocks", pronounced: "san-dee shocks" 
    },
    { 
        name: "Iron Treads", pronounced: "eye-urn treads" 
    },
    { 
        name: "Iron Bundle", pronounced: "eye-urn bun-dul" 
    },
    { 
        name: "Iron Hands", pronounced: "eye-urn hands" 
    },
    { 
        name: "Iron Jugulis", pronounced: "eye-urn joo-guh-liss" 
    },
    { 
        name: "Iron Moth", pronounced: "eye-urn moth" 
    },
    { 
        name: "Iron Thorns", pronounced: "eye-urn thorns" 
    },
    { 
        name: "Frigibax", pronounced: "frig-ih-bax" 
    },
    { 
        name: "Arctibax", pronounced: "ark-tih-bax" 
    },
    { 
        name: "Baxcalibur", pronounced: "bax-cal-ih-bur" 
    },
    { 
        name: "Gimmighoul", pronounced: "gim-mee-gool" 
    },
    { 
        name: "Gholdengo", pronounced: "gold-en-go" 
    },
    { 
        name: "Wo-Chien", pronounced: "woh chee-en" 
    },
    { 
        name: "Chien-Pao", pronounced: "chee-en pow" 
    },
    { 
        name: "Ting-Lu", pronounced: "ting loo" 
    },
    { 
        name: "Chi-Yu", pronounced: "chee you" 
    },
    { 
        name: "Roaring Moon", pronounced: "roar-ing moon" 
    },
    { 
        name: "Iron Valiant", pronounced: "eye-urn val-ee-ant" 
    },
    { 
        name: "Koraidon", pronounced: "kor-eye-don" 
    },
    { 
        name: "Miraidon", pronounced: "meer-eye-don" 
    },
    { 
        name: "Walking Wake", pronounced: "walking wake" 
    },
    { 
        name: "Iron Leaves", pronounced: "eye-urn leaves" 
    },
    { 
        name: "Dipplin", pronounced: "dip-lin" 
    },
    { 
        name: "Poltchageist", pronounced: "pole-chuh-gyst" 
    },
    { 
        name: "Sinistcha", pronounced: "sin-iss-chah" 
    },
    { 
        name: "Okidogi", pronounced: "oh-kee-doh-gee" 
    },
    { 
        name: "Munkidori", pronounced: "mun-kee-doh-ree" 
    },
    { 
        name: "Fezandipiti", pronounced: "feh-zan-dih-pee-tee" 
    },
    { 
        name: "Ogerpon", pronounced: "oh-ger-pon" 
    },
    { 
        name: "Archaludon", pronounced: "ar-kuh-loo-don" 
    },
    { 
        name: "Hydrapple", pronounced: "high-drap-ul" 
    },
    { 
        name: "Gouging Fire", pronounced: "goo-jing fire" 
    },
    { 
        name: "Raging Bolt", pronounced: "ray-jing bolt" 
    },
    { 
        name: "Iron Boulder", pronounced: "eye-urn bowl-der" 
    },
    { 
        name: "Iron Crown", pronounced: "eye-urn crown" 
    },
    { 
        name: "Terapagos", pronounced: "ter-uh-pag-os" 
    },
    { 
        name: "Pecharunt", pronounced: "peh-chuh-runt" 
    }

]

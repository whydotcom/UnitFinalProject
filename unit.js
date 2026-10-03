const pokedexArray = [];

const searchArray = [];

const pcArray = [];

const search = document.getElementById("search");

const container = document.getElementById("container");

const pcContainer = document.getElementById("pc-container")

const pokedexForm = document.getElementById("pokedex-form");

const pcForm = document.getElementById("pc-form");

let whichScreen = 1;

displayScreen(1);


pokedexForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const submittedName = search.value;

    fetchPokedex(submittedName);

})

search.addEventListener("input", function(e) {

    let typed = e.target.value;

    const liveSearchArray = searchArray.filter(searched => searched.name.toLowerCase().includes(typed));

    container.innerHTML = "Pokemon you've searched before:";

    renderCard(liveSearchArray, {liveSearch : true});

    if (typed.length === 0 || liveSearchArray.length === 0){
        container.innerHTML = "";
    }
})

pcForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    console.log("X")

    const pcObject =  takeFormMakeObject();

    console.log(pcObject);

    const fetchedData = await pcFetch(pcObject.name);

    const pcSprite = fetchedData.sprites.other.official-artwork.front_default;

    pcObject.sprite = pcSprite;

    renderPcObject(pcObject);

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

        console.log(data2)
        
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

    pcContainer.textContent = "Loading Pokedex Entry...";

    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`);

        if (!response.ok){
            throw new Error("Unable to find pokemon")
        }

        const data = await response.json();

        return data;


    }catch(error){
       pcContainer.textContent = `Could Not Find This ${inputValue}`;

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

        entryBtn.onclick = pokedexVoice(entryBtn,loop.entry);

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

function pokedexVoice(button,text){
    button.addEventListener("click", () => {
        const utterance = new SpeechSynthesisUtterance(text); 
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
        sprite: ""
    }

    pcArray.unshift(pcPokemonObject);

    return pcPokemonObject;

}

function renderPcObject(object){
    const iconBox = document.createElement("div");
    const icon = document.createElement("img");

    icon.src = object.sprite;

    iconBox.classList.add("pc-icon-box");
    icon.classList.add("pc-icon");

    pcContainer.appendChild(iconBox);
    iconBox.appendChild(icon);


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

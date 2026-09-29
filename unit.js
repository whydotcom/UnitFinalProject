const pokedexArray = [];

const searchArray = [];

const pcArray = [];

const search = document.getElementById("search");

const container = document.querySelector(".container");

const pokedexForm = document.getElementById("pokedex-form");

pokedexForm.addEventListener("submit", function(e) {
    e.preventDefault();

    fetchPokedex();

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



async function fetchPokedex (){

    const inputValue = search.value;

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
        
        createAndAddObject(data, data2);


        renderCard(pokedexArray);

        

        

    }catch(error){
       container.textContent = `Could Not Find This ${inputValue}`;

       console.log(error);

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

function createAndAddObject(data, data2){
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

    const pokeEntry = `${data2.flavor_text_entries[1].flavor_text} ` + `${data2.flavor_text_entries[2].flavor_text} ` + `${data2.flavor_text_entries[3].flavor_text} `;

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

    console.log(searchArray);
}

function storeSearch(){

}

function recallSearch(){

}

function storePC(){

}

function recallPC(){

}

search.addEventListener("input", function(e){
    const input = e.target.value

    if (searchArray.length){
        //filter through searchArray using input
        //render
    }
})
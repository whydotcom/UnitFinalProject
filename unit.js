const pokedexArray = [];

const searchArray = [];

const pcArray = [];

const search = document.getElementById("search");

const container = document.querySelector(".container");


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

        console.log(pokemonTypeArray);

        if (pokemonTypeArray.length > 1){
            pokemonType2 = ", " + data.types[1].type.name;
        };

        const pokeTyping = `${pokemonType1}${pokemonType2}`

        const pokeCryUrl = data.cries.latest;

        const pokeEntry = `${data2.flavor_text_entries[1].flavor_text} ` + `${data2.flavor_text_entries[2].flavor_text} ` + `${data2.flavor_text_entries[3].flavor_text} ` +  `${data2.flavor_text_entries[4].flavor_text}`;

        //should maybe add an array parameter 
        renderCard(pokeName, pokeHeight, pokeWeight, pokeSprite, pokeTyping, pokeCryUrl, pokeEntry);

        

        

    }catch(error){
       container.textContent = `Could Not Find This ${inputValue}`;

       console.log(error);

    }

    
}



function renderCard(name,height,weight,sprite,typing,cry,entry){
const card = document.createElement("div");
const pImgBox = document.createElement("div");
const pImg = document.createElement("img");
const pInfoBox = document.createElement("div");
const pName = document.createElement("h1");
const pHeight = document.createElement("p");
const pWeight = document.createElement("p");
const pTyping = document.createElement("p");
const pEntryIcon = document.createElement("img");
const pEntry = document.createElement("h3");
const pCryIcon = document.createElement("img");
const cryBtn = document.createElement("button");

cryBtn.onclick = pokemonCryEffect(cryBtn,cry);


pImg.src = sprite;
pName.textContent = name;
pHeight.textContent = height;
pWeight.textContent = weight;
pTyping.textContent = typing;
pEntry.textContent = entry;

pImgBox.classList.add("poke-sprite-container");
pImg.classList.add("poke-sprite");
pName.classList.add("poke-name");
pEntry.classList.add("poke-entry");
cryBtn.classList.add("poke-cry-button");



container.appendChild(card);
card.appendChild(pImgBox);
pImgBox.appendChild(pImg);
card.appendChild(pInfoBox);
pInfoBox.appendChild(pName);
pInfoBox.appendChild(pHeight);
pInfoBox.appendChild(pWeight);
pInfoBox.appendChild(pTyping);
pInfoBox.appendChild(pEntry);


}

function pokemonCryEffect(button,url){
    button.addEventListener("click", function(e) {
        const cry = new Audio(url);
    
        cry.play()
            .then(() => console.log("playing cry!"))
            .catch(error => console.error("Playback blocked or failed:", error));
    })
}

function pokedexAddObject(){

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
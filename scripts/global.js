/////////////////////////////////////////////////////////////////  GLOBALS  /////////////////////////////////////////////////////////////////

// Game state variables

var enlightened = false;
var movementKeyPressCount = 0;

// Character handle and attributes

const characterHandle = document.querySelector("#character");
var characterPosition = 700;
var characterSpeed = 5;
var characterRunning = false;
var characterDirection = true; // true == RIGHT | false == LEFT


// Map landscape handle

const mapHandle = document.querySelector(".zone-background");
const mapLeftLimit = 0;
const mapRightLimit = window.innerWidth - 100;
var currentMap;


//Handles for game info screen elements

const mapNameHandle = document.querySelector(".zone-name");
const inventoryHandle = document.querySelector(".inventory");
const eventMessageHandle = document.querySelector(".event-message");


// Handles for NPCs

const NPCArcanaHandle = document.querySelector("#npc_arcana");
const NPCFiremageHandle = document.querySelector("#npc_firemage");
const NPCIcemageHandle = document.querySelector("#npc_icemage");
const NPCBonesHandle = document.querySelector("#npc_bones");
const NPCBlacksmithHandle = document.querySelector("#npc_blacksmith");


// Handles for popups and dialogs

const PopupArcanaHandle = document.querySelector("#popup_arcana");
const PopupFiremageHandle = document.querySelector("#popup_firemage");
const PopupIcemageHandle = document.querySelector("#popup_icemage");
const PopupBonesHandle = document.querySelector("#popup_bones");
const PopupBlacksmithHandle = document.querySelector("#popup_blacksmith");

const DialogArcanaHandle = document.querySelector("#dialog_arcana");
const DialogBonesHandle = document.querySelector("#dialog_bones");
const DialogFiremageHandle = document.querySelector("#dialog_firemage");
const DialogBlacksmithHandle = document.querySelector("#dialog_blacksmith");
const DialogIcemageHandle = document.querySelector("#dialog_icemage");


// Handles for items

// items...


// Handles for environment

// environment elements...


// Initiate audio system

var backgroundMusic;


// Audio engine

function changeMusic(map){
    if(backgroundMusic === undefined) {
        backgroundMusic = new Audio("https://ju-nmd2022.github.io/wuid-adventure-game-arashtarafar/media/audio/music/BGM2_" + map + ".wav");
        
    }
    else{
        backgroundMusic.pause();
        backgroundMusic.src = "https://ju-nmd2022.github.io/wuid-adventure-game-arashtarafar/media/audio/music/BGM2_" + map + ".wav";
    }
    backgroundMusic.volume = 0.1;
    backgroundMusic.loop = true;
    backgroundMusic.play();
}

function soundEffect(effectName){
    let effectTrack = new Audio("https://ju-nmd2022.github.io/wuid-adventure-game-arashtarafar/media/audio/effects/FX_" + effectName + ".wav");
    effectTrack.volume = 0.1;
    effectTrack.play();
}


// Initializer function
function init(){
    currentMap = "sunpeaks";
    characterHandle.style.transform = "translateX(" + characterPosition + "px) scaleX(1)";
    drawMap();
}

// Call initializer once at the start of our game
init();

/////////////////////////////////////////////////////////////////  MAP DRAW FUNCTIONS  /////////////////////////////////////////////////////////////////

function drawMap(){
    // Change map landscape
    mapHandle.setAttribute("src", "https://ju-nmd2022.github.io/wuid-adventure-game-arashtarafar/media/images/still/zone_" + currentMap + ".png");

    // Remove all NPCs and items from screen
    for(let iterator =  0; iterator < document.querySelectorAll(".npc").length; iterator++){
        document.querySelectorAll(".npc")[iterator].style.display = "none";
    }
    for(let iterator =  0; iterator < document.querySelectorAll(".popup").length; iterator++){
        document.querySelectorAll(".popup")[iterator].style.display = "none";
    }
    for(let iterator =  0; iterator < document.querySelectorAll(".dialog").length; iterator++){
        document.querySelectorAll(".dialog")[iterator].style.display = "none";
    }

    // Populate map with items and NPCs based on its type
    switch (currentMap){
        case "desert":
            mapNameHandle.innerHTML = "The Vast Desert";
            NPCBlacksmithHandle.style.display = "block";
            PopupBlacksmithHandle.style.display = "block";
            DialogBlacksmithHandle.style.display = "block";
            break;
        case "crimsonwood":
            mapNameHandle.innerHTML = "Crimsonwood";
            NPCFiremageHandle.style.display = "block";
            PopupFiremageHandle.style.display = "block";
            DialogFiremageHandle.style.display = "block";
            break;
        case "gloomwood":
            mapNameHandle.innerHTML = "Gloomwood";
            NPCArcanaHandle.style.display = "block";
            PopupArcanaHandle.style.display = "block";
            DialogArcanaHandle.style.display = "block";
            break;
        case "island":
            mapNameHandle.innerHTML = "The Island";
            NPCBonesHandle.style.display = "block";
            PopupBonesHandle.style.display = "block";
            DialogBonesHandle.style.display = "block";
            break;
        case "sunpeaks":
            mapNameHandle.innerHTML = "Sunpeaks";
            NPCIcemageHandle.style.display = "block";
            PopupIcemageHandle.style.display = "block";
            DialogIcemageHandle.style.display = "block";
            break;
    }
    
    changeMusic(currentMap);
}

function changeMap(direction){
    let mapChange = false;
    if(direction){
        switch (currentMap){
            case "desert":
                mapChange = true;
                currentMap = "crimsonwood";
                characterPosition = mapLeftLimit;
                eventMessageHandle.innerHTML = "The sun turns red, the land black.";
                break;
            case "crimsonwood":
                mapChange = true;
                currentMap = "gloomwood";
                characterPosition = mapLeftLimit;
                eventMessageHandle.innerHTML = "Fire of the forest turns into chill of the grave.";
                break;
            case "gloomwood":
                mapChange = true;
                currentMap = "island";
                characterPosition = mapLeftLimit;
                eventMessageHandle.innerHTML = "A familiar place, less reminding of impending grief.";
                break;
            case "island":
                if(enlightened){
                    mapChange = true;
                    currentMap = "sunpeaks";
                    characterPosition = mapLeftLimit;
                    eventMessageHandle.innerHTML = "Is this the end, or the beginning or a cycle?";
                }else{
                    // No access to end zone yet
                    characterPosition = mapRightLimit;
                    eventMessageHandle.innerHTML = "Freezing storms block the path ahead...";
                }
                break;
            case "sunpeaks":
                mapChange = true;
                currentMap = "desert";
                characterPosition = mapLeftLimit;
                eventMessageHandle.innerHTML = "Cooling off the chill under desert sun?";
                break;
        }
    }else{
        switch (currentMap){
            case "desert":
                if(enlightened){
                    mapChange = true;
                    currentMap = "sunpeaks";
                    characterPosition = mapRightLimit;
                    eventMessageHandle.innerHTML = "The thought of vanity is cold, and so is the ice.";
                }else{
                    // No access to end zone yet
                    characterPosition = mapLeftLimit;
                    eventMessageHandle.innerHTML = "Freezing storms block the path ahead...";
                }
                break;
            case "sunpeaks":
                mapChange = true;
                currentMap = "island";
                characterPosition = mapRightLimit;
                eventMessageHandle.innerHTML = "All the way back from the end, and why?";
                break;
            case "island":
                mapChange = true;
                currentMap = "gloomwood";
                characterPosition = mapRightLimit;
                eventMessageHandle.innerHTML = "Your lost soul yearns for the fog here.";
                break;
            case "gloomwood":
                mapChange = true;
                currentMap = "crimsonwood";
                characterPosition = mapRightLimit;
                eventMessageHandle.innerHTML = "Earth is set ablaze here. what will is greater than the grave?";
                break;
            case "crimsonwood":
                mapChange = true;
                currentMap = "desert";
                characterPosition = mapRightLimit;
                eventMessageHandle.innerHTML = "Twice the hope, twice the fire.";
                break;
        }
    }

    if(mapChange) drawMap();
}

/////////////////////////////////////////////////////////////////  CHARACTER KEYBOARD INPUT  /////////////////////////////////////////////////////////////////

// Listen for keyboard event
document.addEventListener("keydown", function(event){
    // Retrieve detected key data
    let keyName = event.key;
    let keyCode = event.code;

    // Useful line for checking key code
    // alert("Key " + keyCode + " detected!");

    if(keyCode === "ArrowLeft"){                
        if(!characterRunning) {
            characterHandle.setAttribute("src", "https://ju-nmd2022.github.io/wuid-adventure-game-arashtarafar/media/images/animated/character_knight_walking.gif");
            characterHandle.style.transform = "scaleX(-1)";
            characterRunning = true;
            characterDirection = false;
        }
        movementKeyPressCount++;
        if(movementKeyPressCount === 2) characterHandle.setAttribute("src", "https://ju-nmd2022.github.io/wuid-adventure-game-arashtarafar/media/images/animated/character_knight_running.gif");
        if(movementKeyPressCount >= 2)characterPosition -= characterSpeed;
    }
    else if(keyCode === "ArrowRight"){                
        if(!characterRunning) {
            characterHandle.setAttribute("src", "https://ju-nmd2022.github.io/wuid-adventure-game-arashtarafar/media/images/animated/character_knight_walking.gif");
            characterHandle.style.transform = "scaleX(1)";
            characterRunning = true;
            characterDirection = true;
        }
        movementKeyPressCount++;
        if(movementKeyPressCount === 2) characterHandle.setAttribute("src", "https://ju-nmd2022.github.io/wuid-adventure-game-arashtarafar/media/images/animated/character_knight_running.gif");
        if(movementKeyPressCount >= 2)characterPosition += characterSpeed;
    }
    // UP and DOWN arrow keys set for flash navigation between maps (DEVELOPER MODE)
    else if(keyCode === "ArrowUp"){
        enlightened = true;
        changeMap(true);
    }else if(keyCode === "ArrowDown"){
        enlightened = true;
        changeMap(false);
    }
    else{
        // Some other key was detected
    }

    // Move our character
    if(characterPosition >= mapLeftLimit && characterPosition <= mapRightLimit){
        if(characterDirection){
            characterHandle.style.transform = "translateX(" + characterPosition + "px) scaleX(1)";
        }else{
            characterHandle.style.transform = "translateX(" + characterPosition + "px) scaleX(-1)";
        }
    } else{
        changeMap(characterDirection);
    }
    
});

document.addEventListener("keyup", function(event){
    if(characterRunning) characterHandle.setAttribute("src", "https://ju-nmd2022.github.io/wuid-adventure-game-arashtarafar/media/images/animated/character_knight_idle.png");
    characterRunning = false;
    movementKeyPressCount = 0;
});

/////////////////////////////////////////////////////////////////  MOUSE CLICK EVENTS  /////////////////////////////////////////////////////////////////

// Character inventory

characterHandle.addEventListener("click", function(){
    inventoryHandle.classList.toggle("open");
    soundEffect("inventory");
});

// NPC Interactions

NPCBonesHandle.addEventListener("click", function(){
    soundEffect("dialog_bones");
});

NPCArcanaHandle.addEventListener("click", function(){
    soundEffect("dialog_arcana");
});

NPCFiremageHandle.addEventListener("click", function(){
    soundEffect("dialog_firemage");
});

NPCBlacksmithHandle.addEventListener("click", function(){
    soundEffect("dialog_blacksmith");
});

NPCIcemageHandle.addEventListener("click", function(){
    soundEffect("dialog_icemage");
});

// Item Pickup




// Environment Interactions


/////////////////////////////////////////////////////////////////  LOCAL vs DEPLOY  /////////////////////////////////////////////////////////

const localPrefix = "";
const deployPrefix = "https://ju-nmd2022.github.io/wuid-adventure-game-arashtarafar";

const currentPrefix = deployPrefix;

/////////////////////////////////////////////////////////////////  DEVELOPER MODE  //////////////////////////////////////////////////////////

var inDeveloperMode = false;

/////////////////////////////////////////////////////////////////  GLOBALS  /////////////////////////////////////////////////////////////////

// Game state variables

var gameStarted = false;

var enlightened;
var chestLocked;

var movementKeyPressCount = 0;

var dialogBonesState;
var dialogArcanaState;
var dialogFiremageState;
var dialogIcemageState;
var dialogBlacksmithState;

var characterInventory = [];

// Start button handles

const newGameHandle = document.querySelector("#btn-new-game");
const loadGameHandle = document.querySelector("#btn-load-game");

// Character handle and attributes

const characterHandle = document.querySelector("#character");
var characterPosition;
var characterSpeed = 5;
var characterRunning = false;
var characterDirection; // true == RIGHT | false == LEFT


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

const ItemAshesHandle = document.querySelector("#item_ashes");
const ItemChestHandle = document.querySelector("#item_chest");
const ItemMetalsHandle = document.querySelector("#item_metals");
const ItemGemHandle = document.querySelector("#item_gem");

// Handles for environment

const EnvironmentTornadoWestHandle = document.querySelector("#obstacle_tornado_west");
const EnvironmentTornadoEastHandle = document.querySelector("#obstacle_tornado_east");
const EnvironmentTornadoesHandle = document.querySelector(".obstacle_tornado");


// Initiate audio system

var backgroundMusic;


// Audio engine

function changeMusic(map){
    if(backgroundMusic === undefined) {
        backgroundMusic = new Audio(currentPrefix + "/media/audio/music/BGM2_" + map + ".wav");
        
    }
    else{
        backgroundMusic.pause();
        backgroundMusic.src = currentPrefix + "/media/audio/music/BGM2_" + map + ".wav";
    }
    backgroundMusic.volume = 0.1;
    backgroundMusic.loop = true;
    backgroundMusic.play();
}

function soundEffect(effectName){
    let effectTrack = new Audio(currentPrefix + "/media/audio/effects/FX_" + effectName + ".wav");
    effectTrack.volume = 0.1;
    effectTrack.play();
}

function placeMapElements(){
    // NPC placement
    NPCArcanaHandle.style.left = "1200px";
    NPCBonesHandle.style.left = "500px";
    NPCFiremageHandle.style.left = "650px";
    NPCIcemageHandle.style.left = "900px";
    NPCBlacksmithHandle.style.left = "400px";
    // Item placement
    ItemAshesHandle.style.left = "600px";
    ItemChestHandle.style.left = "290px";
    ItemMetalsHandle.style.left = "350px";
    ItemGemHandle.style.left = "1250px";
}

function saveData(dataType){
    switch(dataType){
        case "character":
            localStorage.characterPosition = characterPosition;
            localStorage.characterDirection = characterDirection;
            break;
        case "inventory":
            for(var iterator = 0; iterator < characterInventory.length; iterator++){
                localStorage.setItem("inventory_" + (iterator + 1), characterInventory[iterator]);
            }
            for(var iterator = characterInventory.length; iterator < 3; iterator++){
                localStorage.removeItem("inventory_" + (iterator + 1));
            }
            break;
        case "dialog":
            localStorage.dialogBonesState = dialogBonesState;
            localStorage.dialogArcanaState = dialogArcanaState;
            localStorage.dialogFiremageState = dialogFiremageState;
            localStorage.dialogBlacksmithState = dialogBlacksmithState;
            localStorage.dialogIcemageState = dialogIcemageState;
            localStorage.dialogs = true;
            break;
        case "chest":
            localStorage.chestLocked = chestLocked;
            break;
        case "item":
            // Removal of items hardcoded into respective interaction functions
            break; 
        case "map":
            localStorage.currentMap = currentMap;
            break;       
        case "end":
            localStorage.enlightened = true;
            break;
    }
    localStorage.saveDataAvailable = true;
}

function loadLastSave(){
    // Load character data
    characterPosition = Number(localStorage.characterPosition);
    characterDirection = (localStorage.characterDirection === "true");

    // Load map data
    if(localStorage.currentMap) currentMap = localStorage.currentMap;

    // Load NPC dialog data
    if(localStorage.dialogs){
        dialogBonesState = Number(localStorage.dialogBonesState);
        dialogArcanaState = Number(localStorage.dialogArcanaState);
        dialogFiremageState = Number(localStorage.dialogFiremageState);
        dialogBlacksmithState = Number(localStorage.dialogBlacksmithState);
        dialogIcemageState = Number(localStorage.dialogIcemageState);
    }

    // Load inventory data
    for(var iterator = 1; iterator <=3; iterator++){
        if(localStorage.getItem("inventory_" + iterator)) characterInventory[iterator - 1] = localStorage.getItem("inventory_" + iterator);
    }
    updateInventory();    

    // Load chest data
    if(localStorage.chestLocked === "false"){
        chestLocked = false;
        ItemChestHandle.style.transform = "scaleX(-1) rotate(-90deg)";
    }

    // Load item existence data
    if(localStorage.ashesPicked === "true") ItemAshesHandle.remove();
    if(localStorage.gemPicked === "true") ItemGemHandle.remove();
    if(localStorage.metalsPicked === "true") ItemMetalsHandle.remove();

    // Load game finished state
    if(localStorage.enlightened){
        enlightened = true;
        EnvironmentTornadoWestHandle.remove();
        EnvironmentTornadoEastHandle.remove();
    }
}

// Initializer function
function init(){
    placeMapElements();
    switch(characterDirection){
        case true:
            characterHandle.style.transform = "translateX(" + characterPosition + "px) scaleX(1)";
            break;
        case false:
            characterHandle.style.transform = "translateX(" + characterPosition + "px) scaleX(-1)";
            break;
        default:
            break;
    }
    drawMap();
}
/////////////////////////////////////////////////////////////////  INVENTORY LOGIC FUNCTIONS  ////////////////////////////////////////////////////////////////

function updateInventory(){
    for(var iterator = 1; iterator <= characterInventory.length; iterator++){
        document.querySelector("#inventory_slot_" + iterator + " img").src = currentPrefix + "/media/images/still/item_" + characterInventory[iterator - 1] + ".png";
        document.querySelector("#inventory_slot_" + iterator).dataset.full = "true";
        for(var removalIterator = iterator + 1; removalIterator <= 3; removalIterator++){
            document.querySelector("#inventory_slot_" + removalIterator).dataset.full = "false";
        }
    }
    for(var iterator = 1; iterator <= 3; iterator++){
        if(document.querySelector("#inventory_slot_" + iterator).dataset.full === "false")
        document.querySelector("#inventory_slot_" + iterator + " img").src = currentPrefix + "/media/images/still/inventory_slot_empty.png";
    }
}

function inventoryHasSpace(){
    return (characterInventory.length < 3);
}

function isInInventory(item){
    let isInInventory = false;
    for(var iterator = 0; iterator < characterInventory.length; iterator++){
        if(characterInventory[iterator] === item){
            isInInventory = true;
            break;
        }
    }
    return isInInventory;
}

function addToInventory(item){
    characterInventory.push(item);
    updateInventory();
}

function removeFromInventory(item){
    for(var iterator = 0; iterator < characterInventory.length; iterator++){
        if(characterInventory[iterator] === item){
            characterInventory.splice(iterator, 1);
        }
    }
    updateInventory();
}

/////////////////////////////////////////////////////////////////  MAP DRAW FUNCTIONS  /////////////////////////////////////////////////////////////////

function drawMap(){
    // Change map landscape
    mapHandle.setAttribute("src", currentPrefix + "/media/images/still/zone_" + currentMap + ".png");

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
    for(let iterator =  0; iterator < document.querySelectorAll(".item").length; iterator++){
        document.querySelectorAll(".item")[iterator].style.display = "none";
    }
    for(let iterator =  0; iterator < document.querySelectorAll(".obstacle").length; iterator++){
        document.querySelectorAll(".obstacle")[iterator].style.display = "none";
    }


    // Populate map with items and NPCs based on its type
    switch (currentMap){
        case "desert":
            mapNameHandle.innerHTML = "The Vast Desert";
            NPCBlacksmithHandle.style.display = "block";
            if(!enlightened) EnvironmentTornadoEastHandle.style.display = "block";
            ItemChestHandle.style.display = "block";
            if(!localStorage.metalsPicked && !chestLocked) ItemMetalsHandle.style.display = "block";
            break;
        case "crimsonwood":
            mapNameHandle.innerHTML = "Crimsonwood";
            NPCFiremageHandle.style.display = "block";        
            break;
        case "gloomwood":
            mapNameHandle.innerHTML = "Gloomwood";
            NPCArcanaHandle.style.display = "block";
            ItemAshesHandle.style.display = "block";            
            break;
        case "island":
            mapNameHandle.innerHTML = "The Island";
            NPCBonesHandle.style.display = "block";
            ItemGemHandle.style.display = "block";
            if(!enlightened) EnvironmentTornadoWestHandle.style.display = "block";            
            break;
        case "sunpeaks":
            mapNameHandle.innerHTML = "Sunpeaks";
            NPCIcemageHandle.style.display = "block";
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
                if(enlightened || inDeveloperMode){
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
                if(enlightened || inDeveloperMode){
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

    if(mapChange){
        drawMap();

        // Save map data
        saveData("map");
    }
}

/////////////////////////////////////////////////////////////////  CHARACTER KEYBOARD INPUT  /////////////////////////////////////////////////////////////////

// Listen for keyboard event
document.addEventListener("keydown", function(event){
    if(!gameStarted) return;

    // Retrieve detected key data
    let keyName = event.key;
    let keyCode = event.code;

    // Useful line for checking key code
    // alert("Key " + keyCode + " detected!");

    if(keyCode === "ArrowLeft"){                
        if(!characterRunning) {
            characterHandle.setAttribute("src", currentPrefix + "/media/images/animated/character_knight_walking.gif");
            characterHandle.style.transform = "scaleX(-1)";
            characterRunning = true;
            characterDirection = false;
        }
        movementKeyPressCount++;
        if(movementKeyPressCount === 2) characterHandle.setAttribute("src", currentPrefix + "/media/images/animated/character_knight_running.gif");
        if(movementKeyPressCount >= 2)characterPosition -= characterSpeed;
    }
    else if(keyCode === "ArrowRight"){
        if(!characterRunning) {
            characterHandle.setAttribute("src", currentPrefix + "/media/images/animated/character_knight_walking.gif");
            characterHandle.style.transform = "scaleX(1)";
            characterRunning = true;
            characterDirection = true;
        }
        movementKeyPressCount++;
        if(movementKeyPressCount === 2) characterHandle.setAttribute("src", currentPrefix + "/media/images/animated/character_knight_running.gif");
        if(movementKeyPressCount >= 2)characterPosition += characterSpeed;
    }
    /////////////////////////////////// UP and DOWN arrow keys set for flash navigation between maps (DEVELOPER MODE) ////////////////////////////
    else if(keyCode === "ArrowUp" && inDeveloperMode){
        characterDirection = true;
        changeMap(true);
    }else if(keyCode === "ArrowDown" && inDeveloperMode){
        characterDirection = false;
        changeMap(false);
    }
    /////////////////////////////////// UP and DOWN arrow keys set for flash navigation between maps (DEVELOPER MODE) ////////////////////////////
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
    
    // Save character data
    saveData("character");
});

document.addEventListener("keyup", function(event){
    if(characterRunning) characterHandle.setAttribute("src", currentPrefix + "/media/images/animated/character_knight_idle.png");
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
    let questsCompleted = false;

    let NPCPosition = parseInt(this.style.left.slice(0, this.style.left.length - 2));
    if(((characterPosition > NPCPosition) && ((characterPosition - NPCPosition) < 150) && !characterDirection)){
        PopupBonesHandle.style.display = "block";
        switch(dialogBonesState){
            case 0:
                DialogBonesHandle.innerHTML = "Another lost risen? This one still has armor...";
                break;
            case 1:
                DialogBonesHandle.innerHTML = "I was once a wanderer like you. Ages had mine ground to dust. Oh how I long its scent...";
                break;
            case 2:
                DialogBonesHandle.innerHTML = "Happeneth thee upon the ashes, bring me them. I shall repay you with whatever I have left...";
                break;
            case 3:
                DialogBonesHandle.innerHTML = "Happeneth thee upon the ashes, bring me them. I shall repay you with whatever I have left...";
                if(isInInventory("ashes")){
                    DialogBonesHandle.innerHTML = "Kindness in this lost land... From a spawn of darkness no less. Here is the last glimmer for thee...";
                    if(inventoryHasSpace()){
                        removeFromInventory("ashes");
                        addToInventory("key");
                        soundEffect("item_pickup");
                        saveData("inventory");
                        questsCompleted = true;
                        dialogBonesState = 4;
                    } else{
                        eventMessageHandle.innerHTML = "I cannot carry any more...";
                    }
                } else dialogBonesState -= 2;
                break;
            case 4:
                questsCompleted = true;
                DialogBonesHandle.innerHTML = "Kind undead... Happeneth thee upon the sun, break the cycle. Release us... I beg thee...";
                break;                
        }        
        if(!questsCompleted) dialogBonesState = (dialogBonesState + 1) % 4;        
        DialogBonesHandle.style.display = "block";
        soundEffect("dialog_bones");
        saveData("dialog");
    }
});

NPCArcanaHandle.addEventListener("click", function(){
    let questsCompleted = false;

    let NPCPosition = parseInt(this.style.left.slice(0, this.style.left.length - 2));
    if(((characterPosition < NPCPosition) && ((NPCPosition - characterPosition) < 120) && characterDirection)){
        PopupArcanaHandle.style.display = "block";
        switch(dialogArcanaState){
            case 0:
                DialogArcanaHandle.innerHTML = "Who dares set foot in the grave itself... Foolish, are you not? Or... A soul?";
                break;
            case 1:
                DialogArcanaHandle.innerHTML = "My power wanes. And yet the shattering of the ring brings void a step closer with each passing night...";
                break;
            case 2:
                DialogArcanaHandle.innerHTML = "Bring me a ring. I shall give you what you crave. Even if for the worse...";
                break;
            case 3:
                DialogArcanaHandle.innerHTML = "Bring me a ring. I shall give you what you crave. Even if for the worse...";
                if(isInInventory("ring_diamond")){
                    removeFromInventory("ring_diamond");
                    saveData("inventory");
                    DialogArcanaHandle.innerHTML = "My dark returns! No chill can master the one of the void. And bargain as great.";
                } else {
                    dialogArcanaState -= 2;
                }
                break;
            case 4:                
                DialogArcanaHandle.innerHTML = "Seeketh thee the frost plume, not? My brethren awaits thee over yonder...";
                addToInventory("feather");
                soundEffect("item_pickup");
                saveData("inventory");
                questsCompleted = true;
                dialogArcanaState = 5;
                break;
            case 5:
                questsCompleted = true;
                DialogArcanaHandle.innerHTML = "Traveled to world's end yet, haven't you? Seldom hope you have child... Tarry or not.";
                break;
        }
        if(!questsCompleted) dialogArcanaState = (dialogArcanaState + 1) % 5;
        DialogArcanaHandle.style.display = "block";
        soundEffect("dialog_arcana");
        saveData("dialog");
    }   
});

NPCFiremageHandle.addEventListener("click", function(){
    let questsCompleted = false;

    let NPCPosition = parseInt(this.style.left.slice(0, this.style.left.length - 2));
    if(((characterPosition > NPCPosition) && ((characterPosition - NPCPosition) < 150) && !characterDirection)){
        PopupFiremageHandle.style.display = "block";
        switch(dialogFiremageState){
            case 0:
                DialogFiremageHandle.innerHTML = "If only we had held on a little longer. Seldom hope had the fire...";
                break;
            case 1:
                DialogFiremageHandle.innerHTML = "The glory of the fire waned, with it our spark. barely to keep warm in the chill of the grave...";
                break;
            case 2:
                DialogFiremageHandle.innerHTML = "The glory of the fire waned, with it our spark. barely to keep warm in the chill of the grave...";
                if(isInInventory("bar_bronze_2")){
                    DialogFiremageHandle.innerHTML = "Ingots? The truth of our cycle...? Hmmm I suppose the last of my spark will be of use...";                    
                } else dialogFiremageState -= 2;
                break;
            case 3:
                DialogFiremageHandle.innerHTML = "Here, take this and light a fire... Give us hope. Hope...";
                removeFromInventory("bar_bronze_2");
                addToInventory("ore_coal_2");
                soundEffect("item_pickup");
                saveData("inventory");
                questsCompleted = true;
                dialogFiremageState = 4;
                break;
            case 4:
                questsCompleted = true;
                DialogFiremageHandle.innerHTML = "Make a fire in storm's eye. Let deceit crumble. Save this world, I beg thee...";
                break;                
        }
        if(!questsCompleted) dialogFiremageState = (dialogFiremageState + 1) % 4;
        DialogFiremageHandle.style.display = "block";
        soundEffect("dialog_firemage");
        saveData("dialog");
    }   
});

NPCBlacksmithHandle.addEventListener("click", function(){
    let questsCompleted = false;

    let NPCPosition = parseInt(this.style.left.slice(0, this.style.left.length - 2));
    if(((characterPosition > NPCPosition) && ((characterPosition - NPCPosition) < 150) && !characterDirection)){
        PopupBlacksmithHandle.style.display = "block";
        switch(dialogBlacksmithState){
            case 0:
                DialogBlacksmithHandle.innerHTML = "What hope has a soul without vessel for armor? Oh, you are... Mayhaps...";
                break;
            case 1:
                DialogBlacksmithHandle.innerHTML = "A ring you say? Hmmm needs a gem of some sort, and binding. Bring me the metal and stone...";
                break;
            case 2:
                DialogBlacksmithHandle.innerHTML = "A ring you say? Hmmm needs a gem of some sort, and binding. Bring me the metal and stone...";
                if(isInInventory("ore_coal_2") && isInInventory("diamond_1")){
                    removeFromInventory("ore_coal_2");
                    removeFromInventory("diamond_1");
                    saveData("inventory");
                    DialogBlacksmithHandle.innerHTML = "Now let me see... This fire has seen many blades and ornaments. What spark is this...";
                } else dialogBlacksmithState -= 2;
                break;
            case 3:
                DialogBlacksmithHandle.innerHTML = "A fine ring it is indeed. Take care, wanderer. Lest the glimmer claims your soul. Irony...";
                addToInventory("ring_diamond");
                soundEffect("item_pickup");
                saveData("inventory");
                questsCompleted = true;
                dialogBlacksmithState = 4;
                break;
            case 4:
                questsCompleted = true;
                DialogBlacksmithHandle.innerHTML = "Had I this then, that cold sun would bow. Have you now the stone...? Heh heh...";
                break;                
        }
        if(!questsCompleted) dialogBlacksmithState = (dialogBlacksmithState + 1) % 4;
        DialogBlacksmithHandle.style.display = "block";
        soundEffect("dialog_blacksmith");
        saveData("dialog");
    }   
});

NPCIcemageHandle.addEventListener("click", function(){
    let NPCPosition = parseInt(this.style.left.slice(0, this.style.left.length - 2));
    if(((characterPosition < NPCPosition) && ((NPCPosition - characterPosition) < 120) && characterDirection)){
        PopupIcemageHandle.style.display = "block";
        switch(dialogIcemageState){
            case 0:
                DialogIcemageHandle.innerHTML = "Foolish undead. What hope have you for breaking the true cycle...";
                break;
            case 1:
                DialogIcemageHandle.innerHTML = "I have spoken. There is no hope for your kind. That ended with Elden Ring release...";
                break;
            case 2:
                DialogIcemageHandle.innerHTML = "Go touch some grace. Mayhaps get yourself some maidens...";
                break;
        }
        dialogIcemageState = (dialogIcemageState + 1) % 3;
        DialogIcemageHandle.style.display = "block";
        soundEffect("dialog_icemage");
        saveData("dialog");
    }   
});

// Item Pickup

ItemAshesHandle.addEventListener("click", function(){
    let itemPosition = parseInt(this.style.left.slice(0, this.style.left.length - 2));
    if(((characterPosition > itemPosition) && ((characterPosition - itemPosition) < 100) && !characterDirection) || 
    ((characterPosition < itemPosition) && ((itemPosition - characterPosition) < 140) && characterDirection)){        
        if(inventoryHasSpace()){
            addToInventory("ashes");
            saveData("inventory");
            ItemAshesHandle.remove();
            localStorage.ashesPicked = true;
        } else{
            eventMessageHandle.innerHTML = "I cannot carry any more...";
        }
        soundEffect("item_pickup");
    }    
});

ItemChestHandle.addEventListener("click", function(){
    let itemPosition = parseInt(this.style.left.slice(0, this.style.left.length - 2));
    if(((characterPosition < itemPosition) && ((itemPosition - characterPosition) < 140) && characterDirection)){
        if(chestLocked && isInInventory("key")){
            chestLocked = false;
            ItemChestHandle.style.transform = "scaleX(-1) rotate(-90deg)";
            ItemMetalsHandle.style.display = "block";
            soundEffect("item_pickup");
        } else if(chestLocked){
            eventMessageHandle.innerHTML = "The chest is locked...";
        }        
    }
    saveData("chest");
});

ItemMetalsHandle.addEventListener("click", function(){
    let itemPosition = parseInt(this.style.left.slice(0, this.style.left.length - 2));
    if(((characterPosition > itemPosition) && ((characterPosition - itemPosition) < 100) && !characterDirection) || 
    ((characterPosition < itemPosition) && ((itemPosition - characterPosition) < 140) && characterDirection)){        
        if(inventoryHasSpace()){
            addToInventory("bar_bronze_2");
            saveData("inventory");
            ItemMetalsHandle.remove();
            localStorage.metalsPicked = true;
        } else{
            eventMessageHandle.innerHTML = "I cannot carry any more...";
        }
        soundEffect("item_pickup");
    }  
});

ItemGemHandle.addEventListener("click", function(){
    let itemPosition = parseInt(this.style.left.slice(0, this.style.left.length - 2));
    if(((characterPosition > itemPosition) && ((characterPosition - itemPosition) < 100) && !characterDirection) || 
    ((characterPosition < itemPosition) && ((itemPosition - characterPosition) < 140) && characterDirection)){        
        if(inventoryHasSpace()){
            addToInventory("diamond_1");
            saveData("inventory");
            ItemGemHandle.remove();
            localStorage.gemPicked = true;
        } else{
            eventMessageHandle.innerHTML = "I cannot carry any more...";
        }
        soundEffect("item_pickup");
    }    
});

// Environment Interactions

EnvironmentTornadoesHandle.addEventListener("click", function(){
    if(isInInventory("feather")){
        removeFromInventory("feather");
        EnvironmentTornadoWestHandle.remove();
        EnvironmentTornadoEastHandle.remove();
        eventMessageHandle.innerHTML = "The fog recedes at the distant screech of phoenix.";
        enlightened = true;
        saveData("inventory");
        saveData("end");
    } else{
        eventMessageHandle.innerHTML = "No steel or will breaks the wind...";
    }
});

/////////////////////////////////////////////////////////////////  START BUTTON CLICKS  ////////////////////////////////////////////////////////////////

newGameHandle.addEventListener("click", function(){
    // Clear all save data
    localStorage.clear();

    // Set default values
    enlightened = false;
    chestLocked = true;
    characterPosition = 800;
    characterDirection = false;
    currentMap = "island";
    dialogBonesState = dialogArcanaState = dialogFiremageState = dialogIcemageState = dialogBlacksmithState = 0;

    // Call initializer at the start of our game
    init();

    // Close the start screen
    document.querySelector(".start-screen").classList.add("closed");
    gameStarted = true;
});

loadGameHandle.addEventListener("click", function(){
    // If there is no save data, do nothing
    if(!(localStorage.saveDataAvailable === "true")) return;

    // Set default values
    enlightened = false;
    chestLocked = true;
    characterPosition = 800;
    characterDirection = false;
    currentMap = "island";
    dialogBonesState = dialogArcanaState = dialogFiremageState = dialogIcemageState = dialogBlacksmithState = 0;

    loadLastSave();

    // Call initializer at the start of our game
    init();

    // Close the start screen
    document.querySelector(".start-screen").classList.add("closed");
    gameStarted = true;
});

/////////////////////////////////////////////////////////////////  GLOBAL LAUNCH OPTIONS  ////////////////////////////////////////////////////////////////

// Learned and taken from "stackoverflow.com", answer by user "guinaps". Revised by multiple members of the community wiki
if(!(localStorage.saveDataAvailable === "true"))loadGameHandle.classList.add("disabled");
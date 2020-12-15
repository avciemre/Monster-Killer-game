// Import stylesheets
import './style.css';

const ATTACK_VALUE = 10; //uppercase just to show its a constant
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const enteredValue = prompt('Maximum life for you and the monster.', '100');
//some adjustment to avoid typos
const MODE_ATTACK = 'ATTACK'; //MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; //MODE_STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let chosenMaxLife = parseInt(enteredValue);
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

adjustHealthBars(chosenMaxLife);

//logging game entries
function writeLog(event, value, monsterHealth, playerHealth) {
    //let logEntry; //for the longer code
    let logEntry = {
        event: event,
            value: value,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
    };
    if (event === LOG_EVENT_PLAYER_ATTACK){
        //logEntry = {
        //    event: event,
        //    value: value,
        //    target: 'MONSTER',
        //    finalMonsterHealth: monsterHealth,
        //    finalPlayerHealth: playerHealth
        //}; //same output, short code by turning logEntry in an object
        logEntry.target = 'Monster';
    } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK){
        //logEntry = {
        //    event: event,
        //    value: value,
        //    target: 'MONSTER',
        //    finalMonsterHealth: monsterHealth,
        //    finalPlayerHealth: playerHealth
        //};
        logEntry.target = 'MONSTER';
    } else if (event === LOG_EVENT_MONSTER_ATTACK) {
        //logEntry = {
        //    event: event,
        //    value: value,
        //    target: 'PLAYER',
        //    finalMonsterHealth: monsterHealth,
        //    finalPlayerHealth: playerHealth
        //};
        logEntry.target = 'PLAYER'
    } else if (event === LOG_EVENT_PLAYER_HEAL) {
        //logEntry= {
        //    event: event,
        //    value: value,
        //    target: 'PLAYER',
        //    finalMonsterHealth: monsterHealth,
        //    finalPlayerHealth: playerHealth
        //};
        logEntry.target = 'PLAYER'
    } else if (event === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: event,
            value: value,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };   
    }
    battleLog.push(logEntry);
}

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}

function reset() {
    let currentMonsterHealth = chosenMaxLife;
    let currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}
/* 
function attackHandler(){
    const damage = dealMonsterDamage(ATTACK_VALUE);
    currentMonsterHealth -= damage;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You Won!');
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You Lost!')
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0)
    alert('You Have A Draw!')
}
function strongAttackHandler() {
    const damage = dealMonsterDamage(STRONG_ATTACK_VALUE);
    currentMonsterHealth -= damage;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You Won!');
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You Lost!')
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0)
    alert('You Have A Draw!')
}
*/

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);
    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You would be death but the bonus life saved you!');
    }
    //win condition
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You Won!');
        writeLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You Lost!');
        writeLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You Have A Draw!');
    writeLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMonsterHealth, currentPlayerHealth);
    }
    if (currentMonsterHealth <=0 || currentPlayerHealth  <=0) {
        reset();
    }
}

//better way to code this part, below

function attackMonster(mode) {
    //makes damage value dynamic
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    //if (mode === MODE_ATTACK) {
    //    maxDamage = ATTACK_VALUE;
    //    logEvent = LOG_EVENT_PLAYER_ATTACK;
    //} else if (mode === MODE_STRONG_ATTACK) {
    //    maxDamage = STRONG_ATTACK_VALUE;
    //    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    //}
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    //const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE); //all goes to endRound;
    //currentPlayerHealth -= playerDamage;
    //if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    //    alert('You Won!');
    //} else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    //    alert('You Lost!')
    //} else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0)
    //alert('You Have A Draw!')
    writeLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}
function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}
function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal to more than your max health.");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHealth += HEAL_VALUE;
    writeLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
    endRound();
}
function printLogHandler() {
    console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);

//Sounds
var background_music = new Audio("sounds/camelot.wav");
var bow_fire = new Audio("sounds/bow_fire.wav");
var large_fireball = new Audio("sounds/large_fireball.wav");
var small_fireball = new Audio("sounds/small_fireball.wav");
var fort_damage = new Audio("sounds/fort_damage.wav");
var meteor_fall = new Audio("sounds/meteor_fall.wav");
var soldier_dying = new Audio("sounds/soldier_dying.wav");
var player_spawn = new Audio("sounds/player_spawn.wav");


//Constant Variables
var XMax = 500;       
var YMax = 500;
var ZMax = 500;
var ZScalingFactor = .5;
var YScalingFactor = .3;
var GameSpeed = 50;
var Lane1 = 480;    
var Lane2 = 445;
var Lane3 = 410;
var Lane4 = 375;
var MenuLength = 1000;
var MenuHeight = 115;

//Global Variables

var pFortHealth = 500; //Player fort health (int)
var eBossHealth;       //Enemy boss health (int)
var materials = 20;    //Materials (int)
var selection;         //For menu (String)

//Basic foot soldier
function stickMan(x, y, z, speed, health, atk, rng, fight, type, img_status){
	this.x = x;                   // x = int x coordinate
	this.y = y;                   // y = int y coordinate
	this.z = z;                   // z = int z coordinate
	this.speed = speed;           // speed = int movement speed
	this.health = health;         // health = int health
	this.atk = atk;               // atk = int attack
	this.rng = rng;               // rng = int range
	this.fight = fight;           // fight = bool in a fight or not
	this.type = type;             // type = string type of soldier
	this.img_status = img_status; // img_status = int for run/fight animation
}

//Player Army
var pArmy = new Object;
	pArmy.pFootSoldiers = [];   // pFootSoldiers = Array foot soldiers
	pArmy.pTowerSoldiers = [];	// pTowerSoldiers = Array tower soldiers
	pArmy.pTowerSupport = [];   // pTowerSupport = Array tower support
	pArmy.pGodMoves= [];        // pGodMoves = Array god moves


//Enemy Army
var eArmy = new Object;
	eArmy.eFootSoldiers = [];   // eFootSoldiers = Array foot soldiers

//GOD ATTACK OBJECTS
function meteor(x, y, z, dmg, status, splash, duration, type, xInit, yInit) {
	this.x = x;               // x = int x coordinate
	this.y = y;               // y = int y coordinate
	this.z = z;               // z = int z coordinate
	this.dmg = dmg;           // dmg = int damage
	this.status = status;     // status = string ("activated" or "inactive")
	this.splash = splash;     // splash = int range of damage
	this.duration = duration; // duration = int duration once activated
	this.type = type;         // type = string type of god move
	this.xInit = xInit;       // xInit = int initial x coordinate (for god screen)
	this.yInit = yInit;       // yInit = int initial y coordinate (for god screen)
}

// preload images for quicker game speed
if (document.images)
{
	var img = new Array();
	img[0] = new Image();
	img[0].src = 'bg_images/main_background.png';
	img[1] = new Image();
	img[1].src = 'bg_images/god_background.png';
	img[2] = new Image();
	img[2].src = 'bg_images/menu_background.png';
	img[3] = new Image();
	img[3].src = 'player_images/p_grunt_side1.png';
	img[4] = new Image();
	img[4].src = 'player_images/p_heavy_side1.png';
	img[5] = new Image();
	img[5].src = 'enemy_images/e_grunt_side.png';
	img[6] = new Image();
	img[6].src = 'player_images/p_grunt_top.png';
	img[7] = new Image();
	img[7].src = 'menu_icons/valid_grunt_icon.png';
	img[8] = new Image();
	img[8].src = 'menu_icons/invalid_grunt_icon.png';
	img[9] = new Image();
	img[9].src = 'menu_icons/selected_grunt_icon.png';
	img[10] = new Image();
	img[10].src = 'menu_icons/valid_heavy_icon.png';
	img[11] = new Image();
	img[11].src = 'menu_icons/invalid_heavy_icon.png';
	img[12] = new Image();
	img[12].src = 'menu_icons/selected_heavy_icon.png';
	img[13] = new Image();
	img[13].src = 'player_images/p_heavy_top.png';
	img[14] = new Image();
	img[14].src = 'enemy_images/e_grunt_top.png';
	img[14] = new Image();
	img[14].src = 'player_images/p_grunt_side2.png';
	img[14] = new Image();
	img[14].src = 'player_images/p_grunt_side3.png';
	img[15] = new Image();
	img[15].src = 'player_images/p_heavy_side2.png';
	img[16] = new Image();
	img[16].src = 'player_images/p_heavy_side3.png';
	img[17] = new Image();
	img[17].src = 'god_images/meteor.png';
}


//////////////////// PLAYER ARMY ///////////////////////////////////

//moves the soldiers in the player army
//sets img_status of each soldier 
function move_player_soldiers()
{
	for (var i = 0; i < pArmy.pFootSoldiers.length; i++)
	{
		if (!pArmy.pFootSoldiers[i].fight)
		{
			pArmy.pFootSoldiers[i].x += pArmy.pFootSoldiers[i].speed;
			if (pArmy.pFootSoldiers[i].img_status < 8)
			{
				pArmy.pFootSoldiers[i].img_status += 1;
			}
			else 
			{
				pArmy.pFootSoldiers[i].img_status = 1;
			}
		}
		else 
		{
			if (pArmy.pFootSoldiers[i].img_status < 16)
			{
				pArmy.pFootSoldiers[i].img_status += 1;
			}
			else 
			{
				pArmy.pFootSoldiers[i].img_status = 9;
			}
		}
	}
}

//Spawns player soldiers in player army
//called from keylistener
//yPos = int y-axis (lane)
function spawn_player_soldiers(ypos)
{
	player_spawn.currentTime = 0;
	player_spawn.play();
	if (selection == "grunt" && materials >= 5)
	{
		var zpos = ypos;
		//stickMan(x, y, z, speed, health, atk, rng, fight, type, img_status){
		var soldier = new stickMan(0, ypos, zpos, 2, 200, 5, 15, false, "grunt", 0);
		pArmy.pFootSoldiers.push(soldier);
		materials -= 5;
    }
    else if (selection == "heavy" && materials >= 10)
    {
    	var zpos = ypos;
		//stickMan(x, y, z, speed, health, atk, rng, fight, type, img_status){
		var soldier = new stickMan(0, ypos, zpos, 1, 400, 10, 15, false, "heavy", 0);
		pArmy.pFootSoldiers.push(soldier);
		materials -= 10;
    }
    else if (selection == "archer" && materials >= 15)
    {
    	var zpos = ypos;
		//stickMan(x, y, z, speed, health, atk, rng, fight, type, img_status){
		var soldier = new stickMan(0, ypos, zpos, 2, 100, 2, 100, false, "archer", 0);
		pArmy.pFootSoldiers.push(soldier);
		materials -= 15;
    }
}

////////////////////// ENEMY ARMY /////////////////////////////////////

//Moves the soldiers in the enemy army
//sets img_status of each enemy soldier
function move_enemy_soldiers()
{
	for (var i = 0; i < eArmy.eFootSoldiers.length; i++)
	{
		if (!eArmy.eFootSoldiers[i].fight)
		{
		eArmy.eFootSoldiers[i].x -= eArmy.eFootSoldiers[i].speed;
	    	if (eArmy.eFootSoldiers[i].img_status < 8)
			{
				eArmy.eFootSoldiers[i].img_status += 1;
			}
			else 
			{
				eArmy.eFootSoldiers[i].img_status = 1;
			}
		}
		else 
		{
			if (eArmy.eFootSoldiers[i].img_status < 16)
			{
				eArmy.eFootSoldiers[i].img_status += 1;
			}
			else 
			{
				eArmy.eFootSoldiers[i].img_status = 9;
			}
		}
	}
}

//Spawns the soldiers in enemy army
function spawn_enemy_soldiers()
{
	//Generate random number for random lane
	var randNum = Math.floor((Math.random() * 4) + 1);
	var yPos;
	var zPos;
	if (randNum == 1)
	{
		yPos = Lane1;
		zPos = Lane1;
	}
	else if (randNum == 2)
	{
		yPos = Lane2;
		zPos = Lane2;
	}
	else if (randNum == 3)
	{
		yPos = Lane3;
		zPos = Lane3;
	}
	else 
	{
		yPos = Lane4;
		zPos = Lane4;
	}
	//stickMan(x, y, z, speed, health, atk, rng, fight, type, img_status){
	var soldier = new stickMan(500, yPos, zPos, 1, 200, 2, 15, false, "grunt", 0);
	eArmy.eFootSoldiers.push(soldier);
}

////////////////////////// GOD ATTACKS /////////////////////////////////////

//Called by clicking in god screen
//Adds a god attack to pArmy.pGodMoves[]
function make_god_attack(xPos, yPos, xInit, yInit)
{
	var zPos;
	if (yPos <= 125)
	{
		zPos = Lane4;
	}
	else if (yPos <= 250)
	{
		zPos = Lane3;
	}
	else if (yPos <= 375)
	{
		zPos = Lane2;
	}
	else if (yPos <= 500)
	{
		zPos = Lane1;
	}

	if (materials >= 20)
	{

	//meteor(x, y, z, dmg, status, splash, duration, type, xInit, yInit)
    var god_move = new meteor(xPos, 0, zPos, 50, "inactive", 30, 10, "meteor", xInit, yInit);
	pArmy.pGodMoves.push(god_move);
	meteor_fall.play();
	materials -= 10;
	}

}

//Move each God attack
function move_god_attacks(){
	for (var i = 0; i < pArmy.pGodMoves.length; i++)
	{
		//If the god move has hit the ground
		if (pArmy.pGodMoves[i].y >= (pArmy.pGodMoves[i].z - 30))
		{
			//Set to activated and start duration counter
			pArmy.pGodMoves[i].status = "activated";
			pArmy.pGodMoves[i].duration -= 1;
			meteor_fall.pause();
			meteor_fall.currentTime = 0;
		}
		else 
		{
			pArmy.pGodMoves[i].y += 20;
		}

		//If duration = 0 remove god move
		if (pArmy.pGodMoves[i].duration <= 0)
		{
			pArmy.pGodMoves.splice(i, 1);
		}
	}
}

//Deal god move damage to relevant enemies
function god_attack_damage(){
	for (var i = 0; i < pArmy.pGodMoves.length; i++)
	{
		if (pArmy.pGodMoves[i].status == "activated")
		{
			for (var e = 0; e < eArmy.eFootSoldiers.length; e++)
			{
				if (pArmy.pGodMoves[i].z == eArmy.eFootSoldiers[e].y &&
					Math.abs(pArmy.pGodMoves[i].x - eArmy.eFootSoldiers[e].x) <= pArmy.pGodMoves[i].splash)
				{
					eArmy.eFootSoldiers[e].health -= pArmy.pGodMoves[i].dmg;
				}
			}		
		}
	}
}

////////////////////////// ANIMATION /////////////////////////////////////

//For running and fighting
// 1 - 8: running
// 9 - 16: fighting
function soldier_animation(num)
{
	if (num <= 2)
	{
		return 1;
	}
	else if (num <= 4)
	{
		return 2;
	}
	else if (num <= 6)
	{
		return 3;
	}
	else if (num <= 8)
	{
		return 2;
	}
	else if (num <= 10)
	{
		return 4;
	}
	else if (num <= 13)
	{
		return 5;
	}
	else if (num <= 16)
	{
		return 6;
	}
}


//////////////////// COLLISION AND COMBAT ///////////////////////////////////

//All this does right now is set speed to 0 on collision
function check_combat()
{
	//for each soldier, check if within range of enemy
	//If so, attack one enemy
	for (var i = 0; i < pArmy.pFootSoldiers.length; i++)
	{
		pArmy.pFootSoldiers[i].fight = false;
		for (var e = 0; e < eArmy.eFootSoldiers.length; e++)
		{
			if (pArmy.pFootSoldiers[i].y == eArmy.eFootSoldiers[e].y &&
				(Math.abs(pArmy.pFootSoldiers[i].x - eArmy.eFootSoldiers[e].x) <= pArmy.pFootSoldiers[i].rng))
			{
				pArmy.pFootSoldiers[i].fight = true;
				eArmy.eFootSoldiers[e].health -= pArmy.pFootSoldiers[i].atk;
				combat_sounds(pArmy.pFootSoldiers[i]); //play appropriate sound
				break;
			}
		}
	}
	//for each enemy, check if within range of player soldier
	//If so, attack one player soldier
	for (var e = 0; e < eArmy.eFootSoldiers.length; e++)
	{
		eArmy.eFootSoldiers[e].fight = false;
		for (var i = 0; i < pArmy.pFootSoldiers.length; i++)
		{
			if (pArmy.pFootSoldiers[i].y == eArmy.eFootSoldiers[e].y &&
				(Math.abs(pArmy.pFootSoldiers[i].x - eArmy.eFootSoldiers[e].x) <= eArmy.eFootSoldiers[e].rng))
			{
				eArmy.eFootSoldiers[e].fight = true;
				pArmy.pFootSoldiers[i].health -= eArmy.eFootSoldiers[e].atk;
				break;
			}
		}
	}
}

//If enemies are at wall, attack wall
//If player soldiers are off screen, remove and add materials
function check_boundaries()
{
	for (var i = 0; i < pArmy.pFootSoldiers.length; i++)
	{
	  	if (pArmy.pFootSoldiers[i].x >= 500)
	  	{
	  		pArmy.pFootSoldiers.splice(i, 1);
	  		materials += 5;
	  	}
	}

	for (var e = 0; e < eArmy.eFootSoldiers.length; e++)
	{
	  	if (eArmy.eFootSoldiers[e].x <= 40)
	  	{
	  		pFortHealth -= 1;
	  		eArmy.eFootSoldiers[e].fight = true;
	  		fort_damage.play();
	  	}
	}
}

//If in combat, removes soldier (enemy or player) if health <= 0
//Gain 10 materials for killing an enemy
function check_health()
{
	for (var i = 0; i < pArmy.pFootSoldiers.length; i++)
	{
	  	if (pArmy.pFootSoldiers[i].health <= 0)
	  	{
	  		pArmy.pFootSoldiers.splice(i, 1);
	  	}
	}

	for (var e = 0; e < eArmy.eFootSoldiers.length; e++)
	{
	  	if (eArmy.eFootSoldiers[e].health <= 0)
	  	{
	  		eArmy.eFootSoldiers.splice(e, 1);
	  		soldier_dying.currentTime = 0;
	  		soldier_dying.play();
	  		materials += 10;
	  	}
	}
}

//////////////////// MANAGE SOUNDS ///////////////////////////////////

function combat_sounds(soldier){
	if (soldier.type == "grunt")
	{
		small_fireball.play();
	}
	else if (soldier.type == "heavy")
	{
		large_fireball.play();
	}
	else if (soldier.type == "archer")
	{
		bow_fire.play();
	}
}
//////////////////// KEY LISTENERS ////////////////////////////////////

//Spawns player soldier at click location
//CURRENTLY: MAPPED TO KEYS 1, 2, 3, and 4 to represent lanes
function mainKeyListener(e) {
    if(!e)
	{
		e = window.event;
	}
    var ypos;
	if(e.keyCode == 49)
	{
		yPos = Lane1;
	}		
	else if(e.keyCode == 50)
	{
		yPos = Lane2;
	}
	else if(e.keyCode == 51)
	{
		yPos = Lane3;
	}
	else if(e.keyCode == 52)
	{
		yPos = Lane4;
	}
    
    if (e.keyCode >= 49 && e.keyCode <= 52)
    {
   		 spawn_player_soldiers(yPos);
	}

    //Spawn random enemy soldier with 5
    if(e.keyCode == 53)
	{
		spawn_enemy_soldiers();
	}

}

//Menu selections
function menuKeyListener(event) {
    var canvas = document.getElementById("menu_screen");
	
	var yPos = event.y;
	var xPos = event.x;
   
    xPos -= canvas.offsetLeft;
    yPos -= canvas.offsetTop;

    if (xPos <= 60 && yPos <= 60 && materials >= 5)
    {
    	selection = "grunt";
    }
    else if (xPos >= 65 && xPos <= 110 && yPos <= 60 && materials >= 10)
    {
    	selection = "heavy";
    }
    else if (xPos <= 60 && yPos >= 65 && materials >= 15)
    {
    	selection = "archer";
    }
}


//God Actions
function godKeyListener(event) {
    var canvas = document.getElementById("god_screen");
	
	var yPos = event.y;
	var xPos = event.x;
	var yInit = event.y - 30;
	var xInit = event.x - 30;
   
    xPos -= canvas.offsetLeft;
    yPos -= canvas.offsetTop;
    xInit -= canvas.offsetLeft;
    yInit -= canvas.offsetTop;
    
    make_god_attack(xPos, yPos, xInit, yInit);

}

/////////////////// DISPLAY METHODS ///////////////////////////////

function display_materials()
{
	document.getElementById("materials").innerHTML = materials;
}
/////////////////// DRAW METHODS ///////////////////////////////////

//Draw to main canvas
function main_draw()
{
	//locate main canvas in document and clear
	var main_canvas = document.getElementById("main_screen");
	var context = main_canvas.getContext("2d");
	context.clearRect(0,0,XMax,YMax);

	//Draw main background
	var background = new Image();
	background.src = "bg_images/main_background.png";
	context.drawImage(background,0,0);

	//background for Castle Health
	context.beginPath();
	context.lineWidth="6";
	context.fillStyle="red";
	context.rect(5,5,166,30); 
	context.fill();

	//Visual for Castle Health
	context.beginPath();
	context.lineWidth="6";
	context.fillStyle="green";
	context.rect(5,5,pFortHealth/3,30); 
	context.fill();

	//Draw every player soldier
	for (var i = 0; i < pArmy.pFootSoldiers.length; i++)
	{
		var img_type = soldier_animation(pArmy.pFootSoldiers[i].img_status);
		var stick_image = new Image();
		stick_image.src = "player_images/p_" + pArmy.pFootSoldiers[i].type + "_side" + img_type + ".png";
		context.drawImage(stick_image,pArmy.pFootSoldiers[i].x,pArmy.pFootSoldiers[i].y);
	}

	//Draw every enemy soldier
	for (var i = 0; i < eArmy.eFootSoldiers.length; i++)
	{
		var img_type = soldier_animation(eArmy.eFootSoldiers[i].img_status);
		var enemy_image = new Image();
		enemy_image.src = "enemy_images/e_" + eArmy.eFootSoldiers[i].type + "_side" + img_type + ".png";
		context.drawImage(enemy_image,eArmy.eFootSoldiers[i].x,eArmy.eFootSoldiers[i].y);
	}

	//Draw every god attack
	for (var i = 0; i < pArmy.pGodMoves.length; i++)
	{
		var god_attack = new Image();
		god_attack.src = "god_images/" + pArmy.pGodMoves[i].type + ".png";
		context.drawImage(god_attack,pArmy.pGodMoves[i].x,pArmy.pGodMoves[i].y);
	}
	
}

//Draw to god canvas
function god_draw()
{
	//locate god canvas in document and clear
	var god_canvas = document.getElementById("god_screen");
	var context = god_canvas.getContext("2d");
	context.clearRect(0,0,XMax,ZMax);

	//Draw god background
	var background = new Image();
	background.src = "bg_images/god_background.png";
	context.drawImage(background,0,0);

	//Draw every player soldier
	for (var i = 0; i < pArmy.pFootSoldiers.length; i++)
	{
		var stick_image = new Image();
		stick_image.src = "player_images/p_" + pArmy.pFootSoldiers[i].type + "_top.png";
		context.drawImage(stick_image,pArmy.pFootSoldiers[i].x,pArmy.pFootSoldiers[i].z);
	}

	//Draw every enemy soldier
	for (var i = 0; i < eArmy.eFootSoldiers.length; i++)
	{
		var enemy_image = new Image();
		enemy_image.src = "enemy_images/e_" + eArmy.eFootSoldiers[i].type + "_top.png";
		context.drawImage(enemy_image,eArmy.eFootSoldiers[i].x,eArmy.eFootSoldiers[i].z);
	}

	//Draw every god attack
	for (var i = 0; i < pArmy.pGodMoves.length; i++)
	{
		var god_attack = new Image();
		god_attack.src = "god_images/" + pArmy.pGodMoves[i].type + ".png";
		context.drawImage(god_attack,pArmy.pGodMoves[i].xInit,pArmy.pGodMoves[i].yInit);
	}
}

//Draw to god canvas
function menu_draw()
{
	//locate menu canvas in document and clear
	var menu_canvas = document.getElementById("menu_screen");
	var context = menu_canvas.getContext("2d");
	context.clearRect(0,0,MenuLength,MenuHeight);

	//Draw menu background
	var background = new Image();
	background.src = "bg_images/menu_background.png";
	context.drawImage(background,0,0);

	//Grunt soldier icon
	if (materials >= 5 && selection == "grunt")
	{
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/selected_grunt_icon.png";
	context.drawImage(menu_icon,15,15);
    }
	else if (materials >= 5)
	{
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/valid_grunt_icon.png";
	context.drawImage(menu_icon,15,15);
    }
    else 
    {
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/invalid_grunt_icon.png";
	context.drawImage(menu_icon,15,15);
    }

    //Heavy soldier icon
    if (materials >= 10 && selection == "heavy")
	{
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/selected_heavy_icon.png";
	context.drawImage(menu_icon,65,15);
    }
    else if (materials >= 10)
	{
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/valid_heavy_icon.png";
	context.drawImage(menu_icon,65,15);
    }
    else 
    {
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/invalid_heavy_icon.png";
	context.drawImage(menu_icon,65,15);
    }

    //Archer soldier icon
    if (materials >= 15 && selection == "archer")
	{
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/selected_archer_icon.png";
	context.drawImage(menu_icon,15,60);
    }
    else if (materials >= 15)
	{
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/valid_archer_icon.png";
	context.drawImage(menu_icon,15,60);
    }
    else 
    {
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/invalid_archer_icon.png";
	context.drawImage(menu_icon,15,60);
    }

    //meteor icon
    if (materials >= 20)
	{
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/valid_meteor_icon.png";
	context.drawImage(menu_icon,945,15);
    }
    else 
    {
	var menu_icon = new Image();
	menu_icon.src = "menu_icons/invalid_meteor_icon.png";
	context.drawImage(menu_icon,945,15);
    }
}

//Draw to each canvas
function draw_all()
{
	main_draw();
	god_draw();
	menu_draw();
}

///////////////////// MAIN GAME RUNNING METHODS /////////////////////////////////

//Calls draw function
//Checks game end condition
//Waits for next step
function step()
{
	draw_all();               //Draw to each canvas
	move_player_soldiers();   //Move each player soldier
	move_enemy_soldiers();    //Move each enemy soldier
	move_god_attacks();       //Move each god attack
	check_combat();           //Check fight status
	god_attack_damage();      //Deal god move damage
	check_health();           //Check for deaths
	check_boundaries();       //check enemy and player soldier locations
	display_materials();      //Display current amount of materials
	
	//If player fort health <= 0, then END GAME
	if(pFortHealth <= 0)
	{
		document.getElementById("result").innerHTML = "GAME OVER";
		document.getElementById("button").style.visibility = 'visible';
	}
	else
	{
		if (background_music.paused)
		{
			background_music.play();
		}
		wait_for_step();
	}

}

//Timer til next draw
function wait_for_step()
{
	setTimeout('step()', GameSpeed);  //Wait (int) GameSpeed, call step()
}

//Main
function game()
{
	//Hide start button once clicked
	document.getElementById("button").style.visibility = 'hidden';
	
	//document.getElementById("main_screen").onmousedown = keyListener;  //Removed to use keys instead (temporary)
	
	//Add event listener to get clicks in the menu screen
	document.getElementById("menu_screen").addEventListener("mousedown", menuKeyListener, false);
	
	//Add event listener to ger clicks in the god screen
	document.getElementById("god_screen").addEventListener("mousedown", godKeyListener, false);
	
	//Add key listener to get button presses in the main screen
	document.onkeydown = mainKeyListener;  //Allows key use (for player and enemy spawn)
	
	//Start wait-for-step cycle (run game)
	wait_for_step();
}

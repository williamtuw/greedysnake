//← -1 →1 ↑2 ↓-2
// a -1 d 1 w 2 s -2

CONTENT_WIDTH = 1488;
CONTENT_HEIGHT = 597;
UNIT_INIT_SIZE = 30;
FOOD_SIZE = 10;
INIT_LEFT1 = 16;
INIT_TOP1 = 8;
INIT_LEFT2 = 16;
INIT_TOP2 = 10;
FOODS = [];
PAINT_INTERVAL = 50;
FOODS_MAX_NUM = 25;
//ALL_OBJ = [];
BORDER_SCALE = 10;
FOOD_GENARATOR_SPEED = 500;
MOVE_SPEED = 660;
LAST_KEY_DOWN1 = 0;
LAST_KEY_DOWN2 = 0;
//1 单人 2 双人
GAME_MODE = 1;
GAME_STATE = false;
Level = 1;
Timer = -1;
High_Score = 0;

var TanChiShe1,TanChiShe2;

$("#btn-cg").click(function() {
    onChange();
});
$("#btn-restart").click(function() {
    onRestart();
});
$("#btn-transfer").click(function() {
    onTransfer();
});
FOOD_GENARATOR = setInterval(function() {
    foodGenarator();
},
FOOD_GENARATOR_SPEED);
setInterval(paintEvent,PAINT_INTERVAL);
document.onkeydown = function(event) {
    onKeyDown(event);
}
function info(msg,duration)
{
	var state_bar = $("#state_bar");
	state_bar.text(String(msg));
	setTimeout(function(){state_bar.html("");},duration);
}
//重开
function onRestart(t) {

    //清空FOODS
    FOODS.splice(0, FOODS.length);
    //清空ALL_OBJ
    //ALL_OBJ.splice(0,ALL_OBJ.length)
    //清空食物
    $("div.food").remove();
    //清除timer
    clearInterval(Timer);
    //把原来的unit 清除
    $("div.unit").remove();
    //重置
    $("img#btn-cg").attr("src", "start.png");
	GAME_STATE = false;
	Level = 1;
	TanChiShe1 = {
		"name":"TanChiShe1",
		"state":false,
		"score": 0,
		"last_cd":0,
		"direction": -1,
		"init_left":INIT_LEFT1,
		"init_top":INIT_TOP1,
		"units": []
	}
	TanChiShe2 = {
		"name":"TanChiShe2",
		"state":false,
		"score": 0,
		"last_cd":0,
		"direction": -1,
		"init_left":INIT_LEFT2,
		"init_top":INIT_TOP2,
		"units": []
	}
    init(TanChiShe1);
	if(GAME_MODE==2)init(TanChiShe2);

	Timer = setInterval(function() {
        routine();
    },
    MOVE_SPEED-60*(Level-1));
		info("Restart the game ,mode = "+String(GAME_MODE),2000);
	paint();
}

//---------------------------------------
//开始
onRestart();
//---------------------------------------



//判断一个位置是否已经存在对象
function judgeObj(left, top) {
    for (var i = 0; i < FOODS.length; i++) {
        if ((FOODS[i].left == left) && (FOODS[i].top == top)) {
            return false;
        }
    }
	if(TanChiShe1.state)
    for (var i = 0; i < TanChiShe1.units.length; i++) {
        if ((TanChiShe1.units[i].left == left) && (TanChiShe1.units[i].top == top)) {
            return false;
        }
    }
	if(TanChiShe2.state)
	for (var i = 0; i < TanChiShe2.units.length; i++) {
        if ((TanChiShe2.units[i].left == left) && (TanChiShe2.units[i].top == top)) {
            return false;
        }
    }
    return true;
}
//产生食物
function foodGenarator(t) {

    if ((!GAME_STATE) || (FOODS.length >= FOODS_MAX_NUM)) {
        return 0;
    }
    //left top bg id
    var left = rand(0, 44);
    var top = rand(0, 16);
    var bg = [rand(0, 255), rand(0, 255), rand(0, 255)];
    var id = String(Math.floor(left)) + "-" + String(Math.floor(top));
    var width = FOOD_SIZE;
    var height = FOOD_SIZE;
    var border = String((UNIT_INIT_SIZE * ((BORDER_SCALE + 2) / BORDER_SCALE) - FOOD_SIZE) / 2) + "px solid #FFF";

    while (!judgeObj(left, top)) {
        left = rand(0, 44);
        top = rand(0, 16);
    }
    //ALL_OBJ.push({"left":left,"top":top})
    FOODS.push({
        "left": left,
        "top": top,
        "bg": bg,
        "id": id,
        "width": width,
        "height": height,
        "border": border
    });
    //在html 中加入相应元素
    var food = $("<div class='food' id='" + id + "'></div>");
    food.css({
        "position": "absolute"
    });
    $("div#content").append(food);
}

//keydown
function onKeyDown(e, t) {
	var e = event || window.event;
    var keyCode = e.keyCode || e.which;
	now = new Date();
	if(keyCode<=40&&keyCode>=37&&TanChiShe1.state)
	{
		//one 
		if ((!GAME_STATE) || ((now.getTime() - LAST_KEY_DOWN1) < PAINT_INTERVAL))return 0;
		LAST_KEY_DOWN1 = now.getTime();
		switch (keyCode) {
    case 37:
        //←
        changeDir(TanChiShe1, -1);
        break;
    case 38:
        //↑
        changeDir(TanChiShe1, 2);
        break;
    case 39:
        //→
        changeDir(TanChiShe1, 1);
        break;
    case 40:
        //↓
        changeDir(TanChiShe1, -2);
        break;
    default:
        break;
    }
		
	}
	else if(TanChiShe2.state&&(keyCode==65||keyCode==68||keyCode==87||keyCode==83))
	{
		//two
		if ((!GAME_STATE) || ((now.getTime() - LAST_KEY_DOWN2) < PAINT_INTERVAL))return 0;
			LAST_KEY_DOWN2 = now.getTime();
		switch (keyCode) {
    case 65:
        //←
        changeDir(TanChiShe2, -1);
        break;
    case 87:
        //↑
        changeDir(TanChiShe2, 2);
        break;
    case 68:
        //→
        changeDir(TanChiShe2, 1);
        break;
    case 83:
        //↓
        changeDir(TanChiShe2, -2);
        break;
    default:
        break;
    }
	}
	else return 0;
}
//转向
function changeDir(t, d) {
    if (Math.abs(t.direction) == Math.abs(d)) {
        return 0;
    } else {
        t.direction = d;
        t.units[0].direction = d;
        t.last_cd = new Date().getTime();
        run(t);
    }
}
//蛇身加长
function weightAdd(t) {
    var unit = {
        "direction": 0,
        "left": 0,
        "top": 0,
        "width": UNIT_INIT_SIZE,
        "height": UNIT_INIT_SIZE,
        "bg": [rand(0, 255), rand(0, 255), rand(0, 255)]
    }
    unit.border = String(Math.floor(unit.width / BORDER_SCALE)) + "px solid #FFF";
    unit.direction = t.units[t.units.length - 1].direction;

    if (Math.abs(t.units[t.units.length - 1].direction) == 1) {
        unit.left = ( - 1) * t.units[t.units.length - 1].direction + t.units[t.units.length - 1].left;
        unit.top = t.units[t.units.length - 1].top;
    } else {
        unit.top = t.units[t.units.length - 1].direction / 2 + t.units[t.units.length - 1].top;
        unit.left = t.units[t.units.length - 1].left;
    }
    //加入到t.units
    unit.id = "unit" + t.name +String(t.units.length);
    t.units.push(unit);
    //ALL_OBJ.push({"left":unit.left,"top":unit.top});
    //加入相应html元素
    var html_unit = $("<div class='unit' id='" + unit.id + "'></div>");
    html_unit.css({
        "position": "absolute"
    });
    $("div#content").append(html_unit);
	info(t.name + " grows",2000);
}
function clearUnit(t)
{

	for(var i = 0;i < t.units.length;i++)
	{
		$("#"+t.units[i].id).remove();
	}
	t.units.splice(0,t.units.length);
}
function paintEvent()
{
if(GAME_STATE)
paint();
}
function dead(t)
{
	info(t.name + " has dead!",2000);
	t.state = false;

if(!TanChiShe1.state && !TanChiShe2.state)
{
	    //游戏结束
		higher_score = TanChiShe1.score  > TanChiShe2.score ? TanChiShe1.score:TanChiShe2.score;
        alert("game over\nplayer1_score =  " + String(TanChiShe1.score) + "\nplayer2_score = "+ String(TanChiShe2.score)+"\nhigher_score = "+ String(higher_score)+"\n太棒了!");
        onRestart(t);
}
else{
	clearUnit(t);
}
}
//运行
function run(t) {
    if (!GAME_STATE) {
        return 0;
    }

    for (var i = t.units.length - 1; i > 0; i--) {
        t.units[i].direction = t.units[i - 1].direction;
        t.units[i].left = t.units[i - 1].left;
        t.units[i].top = t.units[i - 1].top;
    }
	
    if (Math.abs(t.direction) == 1) {
        t.units[0].left += t.direction;
    } else {
        t.units[0].top -= t.direction / 2;
    }
    //判断是否撞到自己
    for (var i = 1; i < t.units.length; i++) {
        if ((t.units[i].left == t.units[0].left) && (t.units[i].top == t.units[0].top)) {
            //t dead
			dead(t);
            return 0;
        }
    }
    if(GAME_MODE == 2)
    {
    otherPlayer = t == TanChiShe1? TanChiShe2:TanChiShe1;
    if(otherPlayer.state)
    for (var i = 0; i < otherPlayer.units.length; i++) {
        if ((otherPlayer.units[i].left == t.units[0].left) && (otherPlayer.units[i].top == t.units[0].top)) {
            //t dead
			dead(t);
            return 0;
        }
    }
    }
    //判断是否撞到墙
    if ((t.units[0].left < 0) || ((t.units[0].top < 0)) || ((t.units[0].left > (CONTENT_WIDTH - (UNIT_INIT_SIZE / BORDER_SCALE)) / (UNIT_INIT_SIZE * (BORDER_SCALE + 1) / BORDER_SCALE) - 1)) || ((t.units[0].top > (CONTENT_HEIGHT - (UNIT_INIT_SIZE / BORDER_SCALE)) / (UNIT_INIT_SIZE * (BORDER_SCALE + 1) / BORDER_SCALE) - 1))) {

            //t dead
			dead(t);
            return 0;
    }

    //判断是否吃到食物
    for (var i = 0; i < FOODS.length; i++) {
        //吃到食物
        if ((FOODS[i].left == t.units[0].left) && (FOODS[i].top == t.units[0].top)) {
            t.score += 1;
			if(t.score>High_Score)High_Score = t.score;
            level = Math.floor(t.score / 5) + 1;
            if ((level > Level) && (Level < 6)) {
				//level up 
				info("level up to "+String(level),2000);
                Level = level;
                changeSpd();
				
            }
            //食物消失
            //console.log("eat food!",FOODS[i].id,t.units[0].left,FOODS[i].left);
            $("#" + FOODS[i].id).remove();
            FOODS.splice(i, 1);

            //蛇身加长
            if ((t.units.length - 5) != Math.floor(t.score / 2)) {
                weightAdd(t);
            }
            break;
        }

    }
}
//改变速度
function changeSpd() {
    clearInterval(Timer);
    Timer = setInterval(function() {
        routine();
    },
    MOVE_SPEED - 60 * (Level - 1));
}
function routine()
{
now = new Date().getTime();
	if(TanChiShe1.state&&now - TanChiShe1.last_cd > MOVE_SPEED-60*(Level-1))
	run(TanChiShe1);
	if(TanChiShe2.state&&now - TanChiShe2.last_cd > MOVE_SPEED-60*(Level-1))
	run(TanChiShe2);
}
//随机数
function rand(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m);
}
//渲染
function paint() {
    $("span.level").html("level: " + String(Level));
    $("span.play1_score").html("play1_score: " + String(TanChiShe1.score));
    $("span.high-score").html("high-score: " + String(High_Score));
	if(GAME_MODE ==2)
	$("span.play2_score").html("play2_score: " + String(TanChiShe2.score));
    //显示所有食物
    for (var i = 0; i < FOODS.length; i++) {
        $("#" + FOODS[i].id).css({
            "width": FOODS[i].width,
            "height": FOODS[i].height,
            "left": FOODS[i].left * UNIT_INIT_SIZE * ((BORDER_SCALE + 1) / BORDER_SCALE),
            "top": FOODS[i].top * UNIT_INIT_SIZE * ((BORDER_SCALE + 1) / BORDER_SCALE),
            "background": "rgb(" + String(FOODS[i].bg[0]) + "," + String(FOODS[i].bg[1]) + ',' + String(FOODS[i].bg[2]) + ")",
            "border": FOODS[i].border
        });
    }
    //显示蛇身
	if(TanChiShe1.state)
    for (var i = 0; i < TanChiShe1.units.length; i++) {
        $("#" + TanChiShe1.units[i].id).css({
            "width": TanChiShe1.units[i].width,
            "height": TanChiShe1.units[i].height,
            "left": TanChiShe1.units[i].left * UNIT_INIT_SIZE * ((BORDER_SCALE + 1) / BORDER_SCALE),
            "top": TanChiShe1.units[i].top * UNIT_INIT_SIZE * ((BORDER_SCALE + 1) / BORDER_SCALE),
            "background": "rgb(" + String(TanChiShe1.units[i].bg[0]) + "," + String(TanChiShe1.units[i].bg[1]) + ',' + String(TanChiShe1.units[i].bg[2]) + ")",
            "border": TanChiShe1.units[i].border
        });
    }
	if(TanChiShe2.state)
	for (var i = 0; i < TanChiShe2.units.length; i++) {
        $("#" + TanChiShe2.units[i].id).css({
            "width": TanChiShe2.units[i].width,
            "height": TanChiShe2.units[i].height,
            "left": TanChiShe2.units[i].left * UNIT_INIT_SIZE * ((BORDER_SCALE + 1) / BORDER_SCALE),
            "top": TanChiShe2.units[i].top * UNIT_INIT_SIZE * ((BORDER_SCALE + 1) / BORDER_SCALE),
            "background": "rgb(" + String(TanChiShe2.units[i].bg[0]) + "," + String(TanChiShe2.units[i].bg[1]) + ',' + String(TanChiShe2.units[i].bg[2]) + ")",
            "border": TanChiShe2.units[i].border
        });
    }
}
//初始化
function init(tanchishe) {
    //获取最高分
    //var fso=new ActiveXObject(Scripting.FileSystemObject);
    //var f=fso.createtextfile('highscore.txt',1,true);
	tanchishe.state = true;
    for (var i = 0; i < 5; i++) {
        var unit = {
            "direction": -1,
            "left": tanchishe.init_left + i,
            "top": tanchishe.init_top,
            "width": UNIT_INIT_SIZE,
            "height": UNIT_INIT_SIZE,
            "bg": [rand(0, 255), rand(0, 255), rand(0, 255)]
        }
        unit.border = String(Math.floor(unit.width / BORDER_SCALE)) + "px solid #FFF";
        unit.id = "unit" + tanchishe.name + String(tanchishe.units.length);
        tanchishe.units.push(unit);
        //ALL_OBJ.push({"left":INIT_LEFT/(UNIT_INIT_SIZE*((BORDER_SCALE+1)/BORDER_SCALE))+i,"top":INIT_TOP/(UNIT_INIT_SIZE*((BORDER_SCALE+1)/BORDER_SCALE))+i});
    }
    var content = $("#content");
    for (var i = 0; i < 5; i++) {
        var html_unit = $("<div class='unit' id='" + tanchishe.units[i].id + "'></div>");
        html_unit.css({
            "position": "absolute"
        });
		if(i==0)
		html_unit.text(tanchishe.name[9]);
        content.append(html_unit);
    }
}
//开始暂停按钮控制
function onChange() {
    GAME_STATE = GAME_STATE ? false: true;
	actionName = GAME_STATE==true?"start":"pause";
	info("you "+actionName+" the game!",2000);
    if (!GAME_STATE) {
        $("img#btn-cg").attr("src", "start.png");
    } else {
        $("img#btn-cg").attr("src", "pause.png");
    }
}

function onTransfer(){
	GAME_MODE = GAME_MODE == 1 ? 2:1;
	onRestart();
}
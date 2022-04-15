//← -1 →1 ↑2 ↓-2
CONTENT_WIDTH = 1488;
CONTENT_HEIGHT = 597;
UNIT_INIT_SIZE = 30;
FOOD_SIZE = 10;
INIT_LEFT = 16;
INIT_TOP = 9;
FOODS = [];
FOODS_MAX_NUM = 15;
//ALL_OBJ = [];
BORDER_SCALE = 10;
FOOD_GENARATOR_SPEED = 1000;
MOVE_SPEED = 700;
LAST_KEY_DOWN = 0;
//1 单人 2 双人
GAME_MODE = 1;
var TanChiShe = {
    "state": false,
    "timer": 0,
    "score": 0,
    "level": 1,
    "high_score": 0,
    "direction": -1,
    "units": []
}
init(TanChiShe);
$("#btn-cg").click(function() {
    onChange(TanChiShe);
});
$("#btn-restart").click(function() {
    onRestart(TanChiShe);
});
$("#btn-transfer").click(function() {
    onTransfer(TanChiShe);
});
FOOD_GENARATOR = setInterval(function() {
    foodGenarator(TanChiShe);
},
FOOD_GENARATOR_SPEED);
document.onkeydown = function(event) {
    onKeyDown(event, TanChiShe);
}
//判断一个位置是否已经存在对象
function judgeObj(left, top) {
    for (var i = 0; i < FOODS.length; i++) {
        if ((FOODS[i].left == left) && (FOODS[i].top == top)) {
            return false;
        }
    }
    for (var i = 0; i < TanChiShe.units.length; i++) {
        if ((TanChiShe.units[i].left == left) && (TanChiShe.units[i].top == top)) {
            return false;
        }
    }
    return true;
}
//产生食物
function foodGenarator(t) {

    if ((!t.state) || (FOODS.length >= FOODS_MAX_NUM)) {
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
    now = new Date();
    if ((!t.state) || ((now.getTime() - LAST_KEY_DOWN) < (MOVE_SPEED-60*(t.level-1)))) {
        return 0;
    }
    LAST_KEY_DOWN = now.getTime();
    var e = event || window.event;
    var keyCode = e.keyCode || e.which;
    switch (keyCode) {
    case 37:
        //←
        changeDir(t, -1);
        break;
    case 38:
        //↑
        changeDir(t, 2);
        break;
    case 39:
        //→
        changeDir(t, 1);
        break;
    case 40:
        //↓
        changeDir(t, -2);
        break;
    default:
        break;
    }

}
//转向
function changeDir(t, d) {
    if (Math.abs(t.direction) == Math.abs(d)) {
        return 0;
    } else {
        t.direction = d;
        t.units[0].direction = d;
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
    unit.id = "unit" + String(t.units.length);
    t.units.push(unit);
    //ALL_OBJ.push({"left":unit.left,"top":unit.top});
    //加入相应html元素
    var html_unit = $("<div class='unit' id='" + unit.id + "'></div>");
    html_unit.css({
        "position": "absolute"
    });
    $("div#content").append(html_unit);
}

//运行
function run(t) {
    if (!t.state) {
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
            //游戏结束
            alert("game over\n你的分数为: " + String(t.score) + "\n太棒了!");
            onRestart(t);
            return 0;
        }
    }
    //判断是否撞到墙
    if ((t.units[0].left < 0) || ((t.units[0].top < 0)) || ((t.units[0].left > (CONTENT_WIDTH - (UNIT_INIT_SIZE / BORDER_SCALE)) / (UNIT_INIT_SIZE * (BORDER_SCALE + 1) / BORDER_SCALE) - 1)) || ((t.units[0].top > (CONTENT_HEIGHT - (UNIT_INIT_SIZE / BORDER_SCALE)) / (UNIT_INIT_SIZE * (BORDER_SCALE + 1) / BORDER_SCALE) - 1))) {
        //游戏结束
        alert("game over\n你的分数为: " + String(t.score) + "\n太棒了!");
        onRestart(t);
        return 0;
    }

    //判断是否吃到食物
    for (var i = 0; i < FOODS.length; i++) {
        //吃到食物
        if ((FOODS[i].left == t.units[0].left) && (FOODS[i].top == t.units[0].top)) {
            t.score += 1;
			if(t.score>t.high_score)t.high_score = t.score;
            level = Math.floor(t.score / 5) + 1;
            if ((level != t.level) && (t.level < 6)) {
                t.level = level;

                changeSpd(t);
				
            }
            //食物消失
            //console.log("eat food!",FOODS[i].id,t.units[0].left,FOODS[i].left);
            $("#" + FOODS[i].id).remove();
            FOODS.splice(i, 1);

            //蛇身加长
            if ((t.units.length - 5) != Math.floor(t.score / 2)) {
                weightAdd(t);
            }

        }

    }
    paintEvent(t.units);
}
//改变速度
function changeSpd(t) {
    clearInterval(t.timer);
    t.timer = setInterval(function() {
        run(t);
    },
    MOVE_SPEED - 60 * (t.level - 1));
}

//随机数
function rand(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m);
}
//渲染
function paintEvent(units) {
    $("span.level").html("level: " + String(TanChiShe.level));
    $("span.分数").html("score: " + String(TanChiShe.score));
    $("span.最高分").html("high-score: " + String(TanChiShe.high_score));
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
    for (var i = 0; i < units.length; i++) {
        $("#" + units[i].id).css({
            "width": units[i].width,
            "height": units[i].height,
            "left": units[i].left * UNIT_INIT_SIZE * ((BORDER_SCALE + 1) / BORDER_SCALE),
            "top": units[i].top * UNIT_INIT_SIZE * ((BORDER_SCALE + 1) / BORDER_SCALE),
            "background": "rgb(" + String(units[i].bg[0]) + "," + String(units[i].bg[1]) + ',' + String(units[i].bg[2]) + ")",
            "border": units[i].border
        });
    }
}
//初始化
function init(tanchishe) {
    //获取最高分
    //var fso=new ActiveXObject(Scripting.FileSystemObject);
    //var f=fso.createtextfile('highscore.txt',1,true);
    for (var i = 0; i < 5; i++) {
        var unit = {
            "direction": -1,
            "left": INIT_LEFT + i,
            "top": INIT_TOP,
            "width": UNIT_INIT_SIZE,
            "height": UNIT_INIT_SIZE,
            "bg": [rand(0, 255), rand(0, 255), rand(0, 255)]
        }
        unit.border = String(Math.floor(unit.width / BORDER_SCALE)) + "px solid #FFF";
        unit.id = "unit" + String(tanchishe.units.length);
        tanchishe.units.push(unit);
        //ALL_OBJ.push({"left":INIT_LEFT/(UNIT_INIT_SIZE*((BORDER_SCALE+1)/BORDER_SCALE))+i,"top":INIT_TOP/(UNIT_INIT_SIZE*((BORDER_SCALE+1)/BORDER_SCALE))+i});
    }
    var content = $("#content");
    for (var i = 0; i < 5; i++) {
        var html_unit = $("<div class='unit' id='" + tanchishe.units[i].id + "'></div>");
        html_unit.css({
            "position": "absolute"
        });
        content.append(html_unit);
    }
    paintEvent(tanchishe.units);
    tanchishe.timer = setInterval(function() {
        run(tanchishe)
    },
    MOVE_SPEED);

}
//开始暂停按钮控制
function onChange(t) {
    t.state = t.state ? false: true;
    if (!t.state) {
        $("img#btn-cg").attr("src", "start.png");
    } else {
        $("img#btn-cg").attr("src", "pause.png");
    }
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
    clearInterval(t.timer);
    //把原来的unit 清除
    $("div.unit").remove();
    //重置
    $("img#btn").attr("src", "start.png");
    var high_score = t.high_score;
    TanChiShe = {
        "state": false,
        "timer": 0,
        "score": 0,
        "level": 1,
        "high_score": high_score,
        "direction": -1,
        "units": []
    }
    init(TanChiShe);
}
function onTransfer(t){
	GAME_MODE = GAME_MODE == 1 ? 2:1;
	onRestart(t);
}
var canvasWidth=Math.min(600,$(window).width()-20);
var canvasHeight=canvasWidth;

var strokeColor="black";
var isMouseDown=false;
var lastloc={x:0,y:0};
var lastTimestamp=0;
var lastlineWidth=-1;

var canvas=document.getElementById("canvas");
var context=canvas.getContext("2d");

canvas.width=canvasWidth;
canvas.height=canvasHeight;

$("#controller").css("width",canvasWidth+"px");
drawGrid();
$("#clear_btn").click(
	function(e){
		context.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	}	
)
$(".color_btn").click(
	function(e){
		$(".color_btn").removeClass("color_btn_selected");
		$(this).addClass("color_btn_selected");
		strokeColor=$(this).css("background-color");
	} 
)

function beginStroke(point){
	isMouseDown=true;
    lastloc=windowToCanvas(point.x,point.y);
    lastTimestamp=new Date().getTime();
}

function endStroke(){
	isMouseDown=false;
}

function moveStroke(point){
	var curloc=windowToCanvas(point.x,point.y);
    var curTimestamp=new Date().getTime();
    var s=calcDistance(curloc,lastloc);
    var t=curTimestamp-lastTimestamp;

    var lineWidth=calcLineWidth(t,s);

    context.beginPath();
    context.moveTo(lastloc.x, lastloc.y);
    context.lineTo(curloc.x,curloc.y);

    context.strokeStyle=strokeColor;
    context.lineWidth=lineWidth;
    context.lineCap="round";
    context.lineJion="round";
    context.stroke();
    
    lastloc=curloc;
    lastTimestamp=curTimestamp;
    lastlineWidth=lineWidth;
}

canvas.onmousedown = function(e){
    e.preventDefault();
    beginStroke({x:e.clientX,y:e.clientY});
};
canvas.onmouseup = function(e){
    e.preventDefault();
    endStroke();
};
canvas.onmouseout = function(e){
    e.preventDefault();
    endStroke();
};
canvas.onmousemove = function(e){
    e.preventDefault();
    if( isMouseDown ){
        moveStroke({x:e.clientX,y:e.clientY});
    }
};

canvas.addEventListener('touchstart',function(e){
	e.preventDefault();
	touch=e.touches[0];
	beginStroke({x:touch.pageX,y:touch.pageY});
});
canvas.addEventListener('touchmove',function(e){
	e.preventDefault();
	if( isMouseDown ){
		touch=e.touches[0];
        moveStroke({x:touch.pageX,y:touch.pageY});
    }
});
canvas.addEventListener('touchend',function(e){
	e.preventDefault();
	endStroke();
});

function calcLineWidth(t,s){
	var v=s/t;
	var resultlineWidth;
	if (v<=0.1){
		resultlineWidth=30;
	}else if (v>=10){
		resultlineWidth=1;
	}else{
		resultlineWidth=30-(v-0.1)/(10-0.10)*(30-1);
	}
	if (lastlineWidth==-1)
		return resultlineWidth;
	return lastlineWidth*2/3+resultlineWidth*1/3;
}

function calcDistance(loc1,loc2){
	return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y));
}

function windowToCanvas(x,y){
	var bbox=canvas.getBoundingClientRect();
	return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)};
}

function drawGrid(){
	context.save();
	context.strokeStyle="red";

	context.beginPath();
	context.moveTo(3, 3);
	context.lineTo(canvasWidth-3,3);
	context.lineTo(canvasWidth-3,canvasHeight-3);
	context.lineTo(3,canvasHeight-3);
	context.closePath();
	context.lineWidth=6;
	context.stroke();

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(canvasWidth,canvasHeight);

	context.moveTo(canvasWidth, 0);
	context.lineTo(0,canvasHeight);

	context.moveTo(canvasWidth/2, 0);
	context.lineTo(canvasWidth/2,canvasHeight);

	context.moveTo(0, canvasHeight/2);
	context.lineTo(canvasWidth,canvasHeight/2);

	context.lineWidth=1;
	context.stroke();
	context.restore();		
} 

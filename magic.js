$(document).ready(function(){
	$('#mainScroll').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 500);
    return false;
	});

	for (var i=0; i<31; i++){
		content = '<option>' + (1984+i) + '</option>';
		$('#an1').append(content);
		if (i) $('#an2').append(content);
	}
});
	
	$.getJSON("media/data.json", function(data){
	$('#go').click(function(){
		time = 0;
		ss = new Audio('media/sound.mp3');
		ss.play();
		x = $('#one').val();
		y = $('#two').val();
		if (x != y)
			globalID = setInterval(function(){
			draw(x, y, 'Gross national savings');
			}, 10000 / 60);
		else
			alert('Axele coincid');
	});

	$('#gen').click(function(){
		var start = parseInt($('#an1').val())-1984;
		var end = parseInt($('#an2').val())-1984;
		if (start < end){
			var content = '<tr><th></th>';
			for (var c=start; c<=end; c++)
					content += '<th>' + (c+1984) + '</th>';
			content += '</tr>';
			data.forEach(function(aa){
				console.log(aa);
				content += '<tr class="titlu"><td>' + aa["name"] + '</td></tr>';
				for (var b in aa){
					if (b != 'name'){
						content += '<td>' + b + '</td>';
						for (var i=start; i<=end; i++)
							content += '<td>' + aa[b][i] + '</td>';
						content += '</tr>'
					}
				}
			});
			// console.log(start + ' ' + end );
			$("#tabel").html(content);
		}
		else{
			alert('Anul de sfarsit trebuie sa fie mai mic decat cel de inceput');
		}
	});

	function initLegend(){
		cs = document.getElementById('legend');
		cx = cs.getContext('2d');
		cx.fillStyle = 'black';
		cx.font = '13px Georgia';
		cx.fillText("Legenda:", 2, 15);
		colors = ["red","green","blue","DeepSkyBlue ","orange", "brown", "purple", "black"];
		color = 0;
		data.forEach(function(a){
			//console.log(a[size]);
			cx.save();
			x = color<4?65:350;
			y = (color*20) %80 + 10;
			cx.fillStyle = colors[color%7];
			cx.beginPath();
			cx.arc(x, y, 5, 0, Math.PI*2);
			cx.fill();
			cx.fillText(a["name"], x + 10, y+5);
			cx.restore();
			color++;
		});
		cx.beginPath();
		y = 70;
		cx.arc(x, y, 5, 0, Math.PI*2);
		cx.fill();
		cx.fillText("Marimea cercurilor e data de - Gross national savings", x + 10, y+5);
	}
	initLegend();

	var context;

	var time = 0;
	function draw(xLabel, yLabel, size){
		var canvas = document.getElementById('paper')
		var context = canvas.getContext('2d');
		var w = canvas.width;
		var h = canvas.height;

		context.clearRect(0, 0, w, h);
		context.fillStyle = "#ffffff";
		context.fillRect(0, 0, w, h);

		var xI = (w) / 10;
		var yI = (h) / 10;

		var minx = Math.min.apply(null, data[0][xLabel]);
		var maxx = Math.max.apply(null, data[0][xLabel]);
		var miny = Math.min.apply(null, data[0][yLabel]);
		var maxy = Math.max.apply(null, data[0][yLabel]);

		data.forEach(function(a){
			minx1 = Math.min.apply(null, a[xLabel]);
			if (minx1<minx)
				minx = minx1;
			miny1 = Math.min.apply(null, a[yLabel]);
			if (miny1<miny)
				miny = miny1;
			maxx1 = Math.max.apply(null, a[xLabel]);
			if (maxx1>maxx)
				maxx = maxx1;
			maxy1 = Math.max.apply(null, a[yLabel]);
			if (maxy1 > maxy)
				maxy = maxy1;
		})

		minx < miny ? min = minx : min = miny;

		console.log(minx);
		console.log(maxx);
		console.log(miny);
		console.log(maxy);

		context.strokeStyle = '#DEDEDE';
		context.lineWidth = 1.5;

		context.beginPath();
		context.fillStyle = '#dedede';
		context.font = "13px Georgia";

		coefxX = (maxx - min) / (w - 30);
		coefXx = (w - 30) / (maxx - min);
		coefyY = (maxy - min) / (h-30);
		coefYy = (h-30) / (maxy - min);

		context.save();
		context.textAlign = "center";
		context.fillText(min, 15, h-15);

		for (var xpos = 30; xpos < w; xpos += xI){
			context.moveTo(xpos, 0);
			context.lineTo(xpos, h-30);
			if (xpos>30) context.fillText(Math.round((xpos-30) * coefxX ), xpos, h-10);
		}

		for (var ypos = h-30; ypos > 0; ypos -= yI){
			context.moveTo(30, ypos);
			context.lineTo(w, ypos);
			if (ypos<h-30) context.fillText( Math.round(maxy - (ypos * coefyY)), 10, ypos);
		}

		context.stroke();
		context.font="italic 100px Calibri";
		context.textAlign = 'right';
		context.fillText(1984+time, w-10, h-40);

		context.restore();

		context.fillStyle = 'black';
		context.fillText("OX : " + xLabel, 60, h-40);
		
		context.save();
		context.translate(50, 390);
		context.rotate(-0.5*Math.PI);
		context.fillText("OY : " + yLabel, 0, 0);
		context.restore();

		var colors = ["red","green","blue","DeepSkyBlue ","orange", "brown", "purple"];
		var color = 0;


		data.forEach(function(a){
			//console.log(a[size]);
			context.save();
			context.fillStyle = colors[color%7];
			context.globalAlpha = 0.7;
			context.beginPath();
			context.arc((a[xLabel][time]* coefXx )+30, h-30-a[yLabel][0]* coefYy, a[size][0], 0, Math.PI*2);
			context.fill();
			context.restore();
			color++;
		});

		time++;
		if (time > 30){
			clearInterval(globalID);
		}
	};

 });


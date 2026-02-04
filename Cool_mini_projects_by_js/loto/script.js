

var tb = document.querySelector("#tb");

var table = document.createElement("table");
tb.appendChild(table);
var k=1;
for(var i=1; i<=10; ++i){
	var tr = document.createElement("tr");
	table.appendChild(tr);
	for(var j=1; j<=10; ++j){
		var td = document.createElement("td");
		var text = document.createTextNode(k);
		td.className = "td";
		td.appendChild(text);
		tr.appendChild(td);
		++k;
	}
}

var td = document.querySelectorAll("td");
for(var i=0; i<td.length; i++){
	var w = window.innerWidth-500;
	var h = window.innerHeight-500;
	var t = Math.round(Math.random()*h);
	var l = Math.round(Math.random()*w-(w/2));
	td[i].style = `position:relative; 
				   top:${t}px; 
				   left:${l}px; 
				   backgrond-color:rgb(85,98,240)`;
}

for(var i = 0; i<td.length; i++){
	setTimeout( function(a){
		het(a);
	} , 40 * i ,td[i] )
}

function het(k){
	k.style = `transition: 0.5s;
			   transition-timing-function:cubic-bezier(0.88, 0.24, 0.35, 0.96); 
			   position:relative; 
			   top:0px; 
			   left:0px; 
			   transform: rotateY(360deg);` 
	k.className = "td tdd";
}


//--------------------------------------------------
var but = document.querySelector("#but");
var y = document.querySelector("#y");
var yntrvac = [];
for(var i = 0; i < td.length; ++i){
	td[i].onclick = function(){
		if(yntrvac.length < 10){
			var k = true;
			for(var j = 0; j<yntrvac.length; ++j){
				if(yntrvac[j] == this.innerText){
				k = false;
				}
			}
			if(k){
				this.className = "td tdd nshvac";
				yntrvac.push(this.innerText);
				y.innerHTML += "<div class='taky'>"+this.innerText+"</div>";
				if(yntrvac.length == 10){
					path();
				}
			}
		}	
	}
}

var pat = [];
var miavor = document.querySelector("#miavor");
var p = document.querySelector("#p");
var bal = 0;
function path(){
	while(pat.length < 10){
		let n = Math.round(Math.random()*100+1);
		var k = true;
		for(var i = 0; i < pat.length; ++i){
			if(n == pat[i]){
				k = false;
			}
		}
		if(k){
			pat.push(n);
			p.innerHTML += "<div class='takp'>"+n+"</div>";



		}
	}
	for(var i = 0; i < td.length; ++i){
		td[i].style = "";
		for(var j = 0; j < pat.length; ++j){
			if(td[i].innerText == pat[j]){
				td[ i ].className = "td tdd pat";

			}
		}
	}
	for(var i = 0; i < td.length; ++i){
		for(var j = 0; j < yntrvac.length; j++){
			for(var k = 0; k < pat.length; k++){
				if(pat[ k ] == yntrvac[ j ] && pat[ k ] == td [ i ].innerText){
					td[ i ].className = "td tdd chisht";
					++bal;
				}
			}
		}
	}
	setTimeout(function(){
		miavor.innerText = "Դուք վաստակեցիք "+bal+" միավոր:";
		but.style.display = "block";
		but.onclick = function(){
			but.style.display = "none";
			pat.length = 0;
			yntrvac.length = 0;
			p.innerHTML = "";
			y.innerHTML = "";
			bal = 0;
			miavor.innerText = "";
			for(let j=0; j<td.length; j++){
				td[j].className = "td tdd";
			}

		}
	},1000)

}















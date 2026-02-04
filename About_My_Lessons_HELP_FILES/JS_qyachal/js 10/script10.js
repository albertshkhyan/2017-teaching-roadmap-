//DOM
//html tegerin kpnelu dzever
//dranc atributnery 
//-------------------------------




//document.getElementsByTagName       -- tvyal anunov tegery lriv kvercni zanvaci tescov
//document.getElementsByClassName     -- tvyal klasov tegery bolory kvercni zangvaci tesqov
//getElementById                      -- kvercni tvyal id-ov tegy
//document.querySelector              -- kkpni araji tvyal tegin
//document.querySelectorAll           -- kkpni bolor tvyal tegerin

//element.attrName = " attrValue "    -- atribut poxely

//lav chi ashxatum


//innerText
//innerHTML



//let p=document.getElementsByTagName('p');
//p[0].innerText='hello world';



//for(let i=0; i<p.length; i++){
//   p[i].innerText='hello world'+' '+i;
//   p[i].innerHTML="<b>hello world</b>"
//}




//style


//let p1=document.getElementsByClassName("p1");
//p1[0].style.color='red';
//p1[1].style.fontSize='2em';
//p1[1].title='hello';

//p1[0].style.border='solid';
//p1[0].style.textShadow='5px 5px 7px blue';






//let p2=document.getElementById('p2');
//p2.style.display='none';




//let div=document.getElementById('main');
//div.innerHTML='<p>year<select id="tari"></select></p><p>month<select id="amis"></select></p><p>day<select id="or"></select></p>';
//let tari=document.getElementById('tari');
//let amis=document.getElementById('amis');
//for (let i=1930; i<2017; i++){
//	if (i===1996) {
//		tari.innerHTML+='<option value='+i+' selected>'+i+'</option>';
//		continue
//	}
//	tari.innerHTML+='<option value='+i+'>'+i+'</option>';
//}











// function bodyColor(a){
// 	document.querySelector('a').style.background=document.querySelector("select").value;
// }




let n1=+prompt('toxeri qanak');
let n2=+prompt('syunakneri qanak');
for(i=0; i<n1; i++){
	document.querySelector('#tbody').innerHTML+='<tr></tr>'
}
let tr=document.getElementsByTagName("tr");
let k=1;
for(i=0; i<tr.length; i++){
	for(j=0; j<n2; j++, k++){
		if ((i+j)%2==0) {
			tr[i].innerHTML+="<th style='background:black; color:white'>"+k+"</th>"
		}
		else{
			tr[i].innerHTML+="<th>"+k+"</th>"
		}
		
	}
}













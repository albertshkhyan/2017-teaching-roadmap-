var div=document.querySelector("#nkari_div")
var poqr=document.querySelector("#poqr_div")
var img=document.querySelector("img")
function cursor(e) {
	poqr.style.left=e.pageX-poqr.offsetWidth/2 +"px";
	poqr.style.top=e.pageY-poqr.offsetHeight/2 +"px";
	f((e.pageX-poqr.offsetWidth/2)*4,(e.pageY-poqr.offsetWidth/2)*4);//poqr.offsetWidth/2 === 25
}
function f(x,y) {
	img.style.left=-x+"px"
	img.style.top=-y+"px"
}
console.log(div.getBoundingClientRect())
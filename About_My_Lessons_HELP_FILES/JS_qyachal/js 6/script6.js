//function
//parametrakan function
//toxayin function
//rekursia
//setInterval
//setTimeout
//-----------------------





// function


//function name(){
//    alert("ashxatec funcian");
//}
//name();
//name();
//name();



//function showMessage() {
//  var message = 'Hello world'; // lokalni popoxakan 
//  alert( message );
//}
//showMessage(); // 'Привет, я - Вася!'
//alert( message ); // error klini , popoxakany stex chi erevum


//function count() {
//  // i,j popoxakannery cikli verjum chen kori
//  for (var i = 0; i < 3; i++) {
//    var j = i * 2;
//  }
//
//  alert( i ); // i=3,i-i verjin arjeqy , erb cikly el chi ashxatel
//  alert( j ); // j=4, j-i verji arjeqy erb cikly el chi ashxatel
//}


//var userName = 'Alex';
//function showMessage() {
//  var message = 'Hello ' + userName;
//  alert(message);
//}
//
//showMessage(); // Hello Alex



//function get(a){
//    alert(a);
//}
//get("Hello");


//function num(a,b){
//    return a+b;
//}
//alert(num(5,6));

//var num=(a,b)=>a+b;   //toxayin funkciaa
//alert(num(2,3));      // ES 6 




//var age = +prompt("qani tarekan eq?", 20);
//if (age >= 18) {
//  function sayHi() {
//    alert( 'kareli e!' );
//  }
//} else {
//  function sayHi() {
//    alert( 'minchev 18 chi kareli' );
//  }
//}
//sayHi();




//nshum enq fibonchii sharqi vor andamnenq uzum cragiry veradardznum e

//function fibonacci(a){
//	let f1=0, f2 = 1, F=f1+f2;//1
//	if(a==1){
//		return f1;
//	}
//	else if(a==2){
//		return f2;
//	}
//	for(let i = 3; i<a; i++){
//		f1=f2;
//		f2=F;
//		F=f1+f2;
//	}
//	return F
//}
//let p = +prompt('fib')
//alert(fibonacci(p));




// Function Expression
//var f = function() { ... }


// Function Declaration
//function f() { ... }










//rekursia





//------------------------------------------------------------



// SET TIMEOUT


//tali enq te qani varkyan heto kanchi functiony

//var timerId = setTimeout(func / code, delay[, arg1, arg2...])

//func/code  --  funkcia kam kod vory petq e ashxati
//delay      -- qani mili varkyan heto (1000 knshanaki 1 varkyan)
//args       -- argumentner voronq piti tanq funciayin



//orinak

//function func() {
//  document.writeln( 'Hello' );
//}
//
//setTimeout(func, 3000);

//cragiry kkanchi func funkcian brawsery baceluc 3 varkyan heto






//ete araji argumenty sring e apa cragiry ksarqi ananun funkcia

//setTimeout("alert('Привет')", 1000);  -- ays greladzevy xorurd chi trvum

//dra poxaren karox enq ogtagorcel urish greladzev

//setTimeout(function() { alert('Привет') }, 1000);



//cleartimeout

//setTimeouty kangnacnelu hamar

//var timerId = setTimeout(...);
//clearTimeout(timerId);











// SET INTERVAL

//talis enq te qani varkyany mek kanchvi funkcian

//var timerId = setInterval(func / code, delay[, arg1, arg2...])

//func / code   --  funkcia kam katarveliq kod
//delay         --  qani mili varkyany mek petq e kanchvi (1000 klini 1 varkyan)
//args          --  argumentner vor petq e tanq funkciayin

//clearInterval - ov kangnacnum enq




//// 2 varkyany mek kkanchi setIntervaly
//var timerId = setInterval(function() {
//  alert( "tik" );
//}, 2000);
//
//// 5 varkyan heto kanjatvi
//setTimeout(function() {
//  clearInterval(timerId);
//  alert( 'stop' );
//}, 5000);







// REKURSIA SETTIMEOUT

 
//grenq mi cragir setInterval-ov

//var i = 1;
//setInterval(function() {
//  func(i);
//}, 100);

//hima nuyny setTimeout-ov

//var i = 1;
//setTimeout(function run() {
//  func(i);
//  setTimeout(run, 100);
//}, 100);


//rekursiayov gracy aveli chisht e



//brauzerin trvac mili varkyannery minimum chap unen
//amenapoqr tivy vor petq e tal da 4-n e
//brauzeri hamar tarberutyun chka tvel enq 1 te 4


//Internet Explorer -um 0-n chi ashxatum












//-----------------------------------------------------------------------------



//hashvenq tvi faktoryaly

//var num=+prompt("mutqagreq tiv"),a=1;
//for(var i=1; i<=num; i++){
//    a*=i;
//}
//alert(a);



//hashvenq tvi factorial rekursiv funkciayi mijocov

//var num=+prompt("mutqagreq tiv");
//function factoryal(a){
//    if(a>1){
//        return a*factoryal(a-1);
//    }
//    else{
//        return a;
//    }
//}
//alert(factoryal(num));


































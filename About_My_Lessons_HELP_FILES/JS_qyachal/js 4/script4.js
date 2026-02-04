//logikayi operatorner(&& , ||);
//jxtum( ! )
//popoxakani tipi popoxutyun
//-------------------------------------



//logikayi operatorner && || !


// or || (kam) - կամ աշխատելու համար գոնե մեկը պիտի true լինի

//alert( true || true ); // true
//alert( false || true ); // true
//alert( true || false ); // true
//alert( false || false ); // false
// alert( false || false || true); // false


//if (1 || 0) {    //kashxati inchpes if(true || false)
//  alert( 'chisht e' );
//}


//var x;
//true || (x = 1);
//alert(x); // undefined
////qani vor paymani araji masy true er x-in chveragrvec


//var x;
//false || (x = 1);
//alert(x); // 1

//alert( 1 || 0 ); // 1
//alert( true || 'inchvor mi ban' ); // true

//alert( null || 1 ); // 1
//alert( undefined || 0 ); // 0






// and && (yev)


//alert( true && true ); // true
//alert( false && true ); // false
//alert( true && false ); // false
//alert( false && false ); // false


//var jam = 12,rope = 30;
//if (hour == 12 && minute == 30) {
//  alert( 'Время 12:30' );
//}


//if (1 && 0) {   //  true && false
//  alert( 'chi ashxati' );
//}

//alert( 1 && 0 ); // 0
//alert( 1 && 5 ); // 5
//arajiny tru e , dra hamar ancnum e araj yev veradardznum erkrordy

//alert( null && 5 ); // null
//alert( 0 && "не важно" ); // 0
//arajiny false a , dra hamar veradardznum a arajiny


//alert( 1 && 2 && null && 3 ); // null
//alert( 1 && 2 && 3 ); // 3






// ! jxtum


//alert( !true ); // false
//alert( !0 ); // true

//alert( !!"string" ); // true
//alert( !!null ); // false




//alert( null || 2 || undefined );
//alert( alert(1) || 2 || alert(3) );
//alert( 1 && null && 2 );
//alert( alert(1) && alert(2) );
//alert( null || 2 && 3 || 4 );



//stugum enq tariqy

// var tariq=prompt("qani tarekan es?",18)    //18 -y tvecinq defult inch lini
// if (tariq<=0 || tariq>=120) {
// 	alert("du chkas");
// }
// else if(tariq>0 && tariq<18) {
// 	alert("anchapahas")
// }
// else if (tariq>=18 && tariq<=120) {
// 	alert("chapahas")
// }








//--------------------------------------------------------------


// popoxakani tipi popoxutyun

//String(value)   ->    value + ""
//Number(value)   ->    +value
//Boolean(value)  ->    !! value




//alert( String(null) === "null" ); // true
//stringy funkcia e , vory sarqum e string tipi

//alert( true + "test" ); // "truetest"
//alert( "123" + undefined ); // "123undefined"
//alert( 12 + "" ); // "12"


//var a = +"123"; // 123
//var a = Number("123"); // 123
//number sarqelu hamar

//number tipi dardzneluc 
//undefined ->	NaN
//null ->  0
//true / false  ->	1 / 0
//string  -> dimacic etevic brobelnery hanvum e, apa ete mnum e datark apa kdarna 0
// hakarak depqum NaN


//alert( +true ); // 1
//alert( +false ); // 0



//popoxakani tipery vorpes payman ogtagorcelis

//undefined, null  -> 	false
//tvery bolory ->  true, baci 0, NaN -- false.
//toxery	bolory -> true, baci datarkic "" -- false
//objectnery misht -> true


//lav patkeracnelu hamar kogtagorcenq !! kkrknaki jxtum

//alert( !!"0" ); // true
//alert( !!" " ); // bolor voch datark toxery nuynisk miayn brobelov - true



// xndirner

//"" + 1 + 0
//"" - 1 + 0
//true + false
//6 / "3"
//"2" * "3"
//4 + 5 + "px"
//"$" + 4 + 5

//"4" - 2

//"4px" - 2

//7 / 0

//5 && 2

//2 && 5

//5 || 0

//0 || 5
//null + 1
//undefined + 1




















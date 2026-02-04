//ashxatanq tveri het
//Math
//sxal hashvumner
//---------------------





// ashxatanq tveri het


//alert( 1 / 0 ); // Infinity
//alert( 12345 / 0 ); // Infinity


//alert( Infinity > 1234567890 ); // true
//alert( Infinity + 5 == Infinity ); // true


//alert( -1 / 0 ); // -Infinity


//alert( 0 / 0 ); // NaN



//alert ( NaN == NaN ); // false
//alert ( NaN === NaN ); // false



//alert( isNaN(n) ); // true
//alert( isNaN("12") ); // false, toxy haskacav voncor sovorakan tiv 12


//alert( NaN + 1 ); // NaN



//var n = 0 / 0;
//alert( n !== n ) ; // true
//if ( isNaN(n) ) ;  // true




//isFinite

//baci NaN, Infinity yev -Infinity mnacacy veradardznum e true


//alert( isFinite(1) ); // true
//alert( isFinite(Infinity) ); // false
//alert( isFinite(NaN) ); // false





//var s = "12.34";
//alert( +s ); // 12.34



//alert( +"12test" ); // NaN



//alert( +"  -12" ); // -12
//alert( +" \n34  \n" ); // 34, toxadardzi nshany \n probel e hamarvum
//alert( +"" ); // 0, datark toxy 0 e
//alert( +"1 2" ); // NaN, tveri aranqy probel ka





//parseInt  parseFloat


//alert(+"12px") // NaN

//alert( parseInt('12px') ); // 12



//alert( parseInt('12px') ) // 12, sxal gtav  'p' simvolum
//alert( parseFloat('12.3.4') ) // 12.3, sxal gtam erkrord ketum



//alert( parseInt('a123') ); // NaN





// toString

//var n = 255;
//alert( n.toString(16) ); // ff

//ksarqi 16-akan kodov



//var n = 4;
//alert( n.toString(2) ); // 100

//ksarqi erkuakan kodov



//var n = 1234567890;
//alert( n.toString(36) ); // kf12oi

//ksarqi 36 akan







//num.toFixed(precision)

//kkloracni minchev mer asac texy

//var n = 12.34;
//alert( n.toFixed(1) ); // "12.3"

//var n = 12.36;
//alert( n.toFixed(1) ); // "12.4"

//var n = 12.34;
//alert( n.toFixed(5) ); // "12.34000"









//Math

//mathi himnakan metodner

//Math.abc      // bacardzak arjeq
//Math.round    // kkloracni
//Math.floor    // kkloracni depi nerqev
//Math.ceil     // kkloracni depi verev
//Math.pow(x,y)      // kbardzracni x-in y astichan  
//Math.sqrt     // armat khani
//Math.min      // nvazaguyn arjeqy kta
//Math.max      // aravelaguyn arjeqy
//Math.random   // patahakan tiv 0-1 mijakayqum


//aveli bard

//Math.acos(x)     // arccosinus radiannerov
//Math.asin(x)     // arcsinus radiannerov
//Math.atan(x)     // arctanges radiannerov
//Math.atan2(y, x) // veradardznum e ankyuny minchev (y, x)
//Math.sin(x)      //sinus
//Math.cos(x)      // cosinus
//Math.tan(x)      // tangens






//alert(Math.abc(-5))          //bacardzak arjeq
//alert(Math.round(4.5))       //kkloracni
//alert(Math.floor(4.1))       //kkloracni depi nerqev
//alert(Math.ceil(4.7))        //kkloracni depi verev
//alert(Math.pow(x,y))         //kbardzracni x-in y astichan  
//alert(Math.sqrt(16))         //armat khani
//
//alert(Math.min(8,5,6,8,7))   //nvazaguyn arjeqy kta
//alert(Math.max(8,5,6,8,7))   //aravelaguyn arjeqy
//
//let arr=[5,7,8,9];
//alert(Math.min(...arr))      //zangvaci hamar
//
//alert(Math.random())          //patahakan tiv 0-1 mijakayqum
//alert(Math.random()*10)       //0-10 mijakayqic
//alert(Math.floor(Math.random()*10))   //0-10 amboxj tiv



//var price = 6.35;
//
//alert( price.toFixed(1) ); // 6.3
//alert( Math.round(price * 10) / 10 ); // 6.4



//var n1=+prompt('poqr tiv');
//var n2=+prompt('mec tiv');
//function pow(n1,n2){
//	return Math.floor(Math.random()*(n2-n1))+n1;
//}
//alert(pow(n1,n2));





//----------------------------------------------------------------------------






//voch chisht hashvumner



//alert( 0.1 + 0.2 == 0.3 );  //false

//alert( 0.1 + 0.2 ); // 0.30000000000000004

//alert( 0.1 + 0.2 > 0.3 ); // true

//alert( 0.1.toFixed(20) ); // 0.10000000000000000555



//ays xndri hamar ka erku tarberak
//1  dardznenq amboxj tiv , anenq gorcoxutyun , apa dardznenq tasnordakan

//alert( (0.1 * 10 + 0.2 * 10) / 10 ); // 0.3


//2  gumarenq apa kloracnenq tasnordakan chapi

//var result = 0.1 + 0.2;
//alert( +result.toFixed(10) ); // 0.3




//alert( 9999999999999999 ); // 10000000000000000




//  1 / 2      // 0.5    JavaScript
//  1 / 2      //  0     Java 

// 1.0 / 2.0  //  0.5     JavaScript  Java

//2.0 / 0    //  Infinity      JavaScript
//2.0 / 0.0  //  Infinity
//2.0 / -0.0 //  -Infinity   JavaScript






//vorpeszi tivy gexecik ereva ECMA 402 standartov

//var number = 123456789;
//alert( number.toLocaleString() ); // 123 456 789































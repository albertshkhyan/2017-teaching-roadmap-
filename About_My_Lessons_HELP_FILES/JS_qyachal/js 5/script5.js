//while
//do...while
//for
//----------------





// while

//while (payman) {
  // gorcoxutyan kod
//}



//var a=1;
//while(a<5){
//	alert(a);
//	a++;
//}



//var a=1;
//while(a<10){
//	alert(a);
//	a++;
//	if (a===7) {
//      break;
//	}
//}



//var num=+prompt("mutqagreq tiv"),count=0;
//while(num){
//	num-=num%10;
//	num/=10;
//	count++;
//}
//alert(count)




//do...while

//do {
  // gorcoxutyan kod
//} while (payman);

//var i = 0;
//do {
//  alert( i );
//  i++;
//} while (i < 3);







// for

//var i=0;         //cikli skizb
//while(i < 5){    //cikli payman
//    i++;           //cikli qayl  
      //gorcoxutyunner
//}

// nuyn cikly grenq for-i mijocov

//for(var i=0; i<5; i++){     //skizb , payman , qayl
      //gorcoxutyunner
//}



//for (var i = 0; i < 3; i++) {
//  alert(i); // 0, 1, 2
//}


//var i = 0;
//for (; i < 3; i++) {
//  alert( i ); // 0, 1, 2
//}


//var i = 0;
//for (; i < 3;) {
//  alert( i );
  // cikly dardzav inchpes while (i<3)
//}

//for (;;) {
  // anyndhat kkatarvi
//}



//for..in


//break , continue



//var sum = 0;
//while (true) {
//  var value = +prompt("greq tiv", '');
 // if (!value) break; 
//  sum += value;
//}
//alert( 'yndhanur: ' + sum );


//for (var i = 0; i < 10; i++) {
//  if (i % 2 == 0) continue;
//  alert(i);
//}






// tpel 0-100 parz tvery

//var k=true;
//for(var i=2; i<100; i++){
//    for(var j=2; j<i; j++){
//        if(i%j==0){
//            k=false;
//        }
//        else{
//            continue;
//        }
//    }
//    if(k){
//        document.writeln(i);
//    }
//    k=true;
//}








//------------------------------------------------------------

//****
//****
//****
//for(var i=1;i<=12;i++){
//	document.write("*");
//	if(i%4==0){
//	document.write('<br>');
//	
//	}
//}


//Document.write("<div></div>");



//document.write('<table width="500px" height="500px" border="l">');
//
//for(var i=1; i<10; i++){
//    
//    document.write("<tr>");
//    
//    for(var j=1; j<10; j++){
//        document.write('<td>'+(i*j)+'</td>');
//    }
//    
//    document.write('</tr>');
//}
//
//document.write('</table>');





document.write('<table width="500px" height="500px" border="l">');
//
for(var i=1; i<10; i++){
   
   document.write("<tr>");
   
   for(var j=1; j<10; j++){
       if((i+j)%2==0){
           document.write('<td bgcolor="black">'+(i*j)+'</td>');
       }
       else{
           document.write('<td>'+(i*j)+'</td>');
       }
   }
   
   document.write('</tr>');
}

document.write('</table>');




//document.write('<table width="500px" height="500px" border="l">');
//
//for(var i=1; i<10; i++){
//    
//    document.write("<tr>");
//    
//    for(var j=1; j<10; j++){
//        if((i+j)==10){
//            document.write('<td bgcolor="red">'+(i*j)+'</td>');
//        }
//        else{
//            document.write('<td>'+(i*j)+'</td>');
//        }
//    }
//    
//    document.write('</tr>');
//}
//
//document.write('</table>');






//document.write('<table width="500px" height="500px" border="l">');
//
//for(var i=1; i<10; i++){
//    
//    document.write("<tr>");
//    
//    for(var j=1; j<10; j++){
//        if((i+j)>=10){
//            document.write('<td bgcolor="red">'+(i*j)+'</td>');
//        }
//        else{
//            document.write('<td>'+(i*j)+'</td>');
//        }
//    }
//    
//    document.write('</tr>');
//}
//
//document.write('</table>');





//document.write('<table width="500px" height="500px" border="l">');
//
//for(var i=1; i<10; i++){
//    
//    document.write("<tr>");
//    
//    for(var j=1; j<10; j++){
//        if(i==j){
//            document.write('<td bgcolor="red">'+(i*j)+'</td>');
//        }
//        else{
//            document.write('<td>'+(i*j)+'</td>');
//        }
//    }
//    
//    document.write('</tr>');
//}
//
//document.write('</table>');





















//3 i ev 7 i bajanvox tvere tpel ciklov 
//
//  <!-- for(var i=1;i<=100;i++){
//   if(i%3==0 && i%7==0){
//  document.write(i+"<br>")
//
//   }
//	} -->
//
//hashvel 7i bajanvox 9chbajanvox tveri artadryale 20-177 mijakayqum
// for(var i=20;i<=177;i++){
//
// 	if(i%7==0 && i%9!=0){
// 		document.write(i+"<br>");
// 	}
// }


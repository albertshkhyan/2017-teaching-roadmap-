//stringi metodner
//array
//----------------------






// stringi metodner


//length metod chi hamaravum


//split           sarqum a zangvac

//toUpperCase     ksarqi mecatar

//toLowerCase     ksarqi poqratar

//indexOf         talis enq arjeqy veradardznum e araji handipaci indexy

//lastIndexOf     talis enq arjeqy veradardznum e verji handipaci indexy

//charAt          talis enc indeqsy veradardznum e arjeqy

//charCodeAt      talis enq indexy veradarznum e arjeqi kody

//slice           talis enq ktri vortexic vortex




//split 

//arr = "a,b,c".split(',') // zangvac ["a", "b", "c"]




//toUpperCase 

//var upperText="BaRev";
//document.write(upperText.toUpperCase()) // BAREV




//toLowerCase

//var upperText="BaRev"
//document.write(upperText.toLowerCase()) // barev





//indexOf

//"Hello , world".indexOf("H");    //  0
//"Hello , world".indexOf("o");    //  4






//lastIndexOf 

//"Hello , world".lastIndexOf("o");  // 9





//charAt 

//"Hello , world".charAt(0); // H
//"Hello , world".charAt(2); // l





//slice 

//var str ="inchvor mi tox"
//str.slice(0,2) // "in"
//str.slice(1,-1) // "nchvor mi to"








// let num=prompt("mutqagreq tiv"),l=num.length,a=b=0,s1,s2;
// if (l%2===1 ) {
// 	alert(false)
// }
// else{
//    s1=num.slice(0,l/2);
//    s2=num.slice(l/2);
//    for(i=0;i<l/2;i++){
//    	a+=+s1[i];
//    	b+=+s2[i];
//    }
//    if (a===b) {
//    	alert("lucky number")
//    }
//    else{
//    	alert("not lucky number")
//    }
  

// }




//------------------------------------




//array


// varanun=new Array('apple','orange','banan');     zangvac haytararelu hin dzev

// var anun=['apple','orange','banan'];             nuynn a, kashxatenq sranov

// var anun=[];

// anun[1]='apple'

// console.log(anun[2]);

// var str='hello world';
// var arr=str.split(' ')   kbajani yst prabeli , ''-aranqy probel kashxatenq


var arr=['barev',123,false,['a','b','c']];
// arr[3][1]; //b

for (i=0;i<arr.length;i++){
	alert(arr[i])
}

var zang=[];
for (i=0; i<10; i++){
	zang[i]=i+1;
}
console.log(zang)


var zang=[];
for(var i=j=0; i<10; i++,j+=10){
	zang[i]=j;
}
console.log(zang)













































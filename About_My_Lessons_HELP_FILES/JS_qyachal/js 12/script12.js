// tegeri atributner
//date
//--------------------



//elem.hasAttribute(name)         -- stugum e atributy
//elem.getAttribute(name)         -- vercnum e atributi arjeqy
//elem.setAttribute(name, value)  -- talis e atribut
//elem.removeAttribute(name)      -- jnjum e atribut

//elem.attributes    -- kvercni elementi bolor atributnery vorpes psevdo-zangvac






//    alert( elem.getAttribute('About') ); --  'Elephant'  vercrecinq atributy

//    elem.setAttribute('Test', 123); --  Test atributy drecinq

//    alert( document.body.innerHTML ); --  HTML -um bolor atributnery erevum en



//    var attrs = elem.attributes;          --   ayspes vercnenq bolor atributnery
//    for (var i = 0; i < attrs.length; i++) {
//      alert( attrs[i].name + " = " + attrs[i].value );
//    }





//vorosh atributneri jamanak ayl kerp en ashxatum ayd atributi metody yev getAtribut-y

//<a id="a" href="#"></a>
//<script>
//  a.href = '/';
//
//  alert( 'atribut:' + a.getAttribute('href') );  -- '/' nshany cuyc kta
//  alert( 'metod:' + a.href );                 -- ays depqum amboxj URL hascen
//
//</script>


//ayspes linum e vorovhetev getAtribut-ov vercracy karox e linel yuraqancchyur atribut
//isk elem.href -y petq e lini henc amboxj URL hascen



//goyutyun uni mi bacarutyun
//ete poxum enq  elem.value  apa  elem.getAttribut("value") -n  chi poxvum

//sa petq e gexecik ogtagorcel , orinak vercnel nerkayis u skzbnakan arjeqnery hamematel poxvel e te che

//isk ete poxenq elem.setAttribut("value" , "") ays depqum kpoxvi




//class bary qani vor js-um ayl nshanakutyun uni ayd patcharov class atributin dimelu hamar grum enq
//elem.className

//qani vor classy unenum e shat arjeqner nra het vorpes tox anharmar e ashxatel
//nor brausernerum className-i poxaren ka classList

//elem.classList.contains("class")  –- talis a true/false kaxvac te elem-y uni class te che
//elem.classList.add("class")       -– avelacnum a class
//elem.classList.remove("class")    -– jnjum a class
//elem.classList.toggle("class")    -– ete ayd classy chka, avelacnum e, ete ka – jnjum.



//kan atributner vor amen tegi chenq karox tal , ayd depqum chi ashxati





// Data-*

//atribut data-*

//dimel kareli e elem.dataset.*

//orinak --  data-about = "..."           --  elem.dataset.about
//orinak --  data-user-location = "..."   --  elem.dataset.userLocation  --erkrord bary mecatarov





//HIDDEN

//ayn tegery voronq nor en hin brauesernerum chpetqy erevan

//<style>
//  [hidden] { display: none }
//</style>
//
//<div>Текст</div>
//<div hidden>С атрибутом hidden</div>
//<div id="last">Со свойством hidden</div>
//
//<script>
//  last.hidden = true;
//</script>








//----------------------------------------------------------------------------------------


//DATE


//d=new Date();         -- amsativ , jamov ,  jamayin gotiov

//d.getFullYear();      -- tari

//d.getMonth();         -- amis

//d.getDate();          -- or

//d.getDay();           -- shabatva or , hashvarky kirakic ( kirakin 0 )

//d.getHours();         -- jam

//d.getMinutes();       -- rope

//d.getSeconds();       -- varkyan

//d.getMilliseconds();  -- mili varkyanner


//d.getTime()           -- veradarcnum e 1970 tvakanai hunvari 1-ic qani mili varkyan e ancel






//document.write("<p id='jam'></p>");
//let p=document.querySelector("#jam");
//p.style="font-size:80px;color:green";
//let k=1;
//function jam(){
//    if(k){
//	   let d=new Date();
//	   let jam=d.getHours();
//	   let rope=d.getMinutes();
//	   let vayrkyan=d.getSeconds();
//	   p.innerHTML=jam+':'+rope+':'+vayrkyan;
//       k=0;
//    }
//    else{
//       let d=new Date();
//	   let jam=d.getHours();
//	   let rope=d.getMinutes();
//	   let vayrkyan=d.getSeconds();
//	   p.innerHTML=jam+'  '+rope+'  '+vayrkyan;
//       k=1;    
//    }
//}
//let clock=setInterval(jam, 500);




































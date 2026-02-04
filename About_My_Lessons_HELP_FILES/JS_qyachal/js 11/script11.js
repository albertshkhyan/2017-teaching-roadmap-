//teger stexcel yev jnjel

//----------------------------



//document.createElement(tag)                 -- sarqum a teg
//document.createTextNode(value)              -- sarqum a text

//parentElem.appendChild(elem)                -- sarqacy dnum enq
//parentElem.insertBefore(elem, nextSibling)  -- sarqacy dnum enq konkret texy

//elem.cloneNode(true)                        -- elementy klonavorum neq

//parentElem.removeChild(elem)                --jnjum a elementy
//parentElem.replaceChild(newElem, elem)      --jnjum u poxarinum a elementy
//elem.remove()                               -- jnjum a elementy

//elem.children[i]    --  i-rd erexaner
//elem.firstChild     --  araji erexan
//elem.parentNode     --  cnoxy
//elem.nextSibiling   --  hajord harevany







// CREAT ELEMENT

//document.createElement(tag)
//sarqum a nor element

//var div = document.createElement('div');

//divy sarqel enq bayc eji het kapvac chi , dra hamar chi ereva




// CREAT TEXT

//document.createTextNode(value)
//sarqum a nor text

//var textElem = document.createTextNode('Hello');




// APPEND CHILD

//parentElem.appendChild(elem)
//elem-y qcum enq parentElem-i  mej

//ete uzum enq qcel henc body-i mej uremn 

//document.body.parentElem.appendChild(div);

//kam

//div.appendChild(textElem);

//appendChild-y qcum e tegi bolor erexaneric heto






// INSERT BEFORE

//parentElem.insertBefore(elem, nextSibling)

//elem-y qcum enq parentElem-i mej , nextSibiling erexayic araj

//ete nextSibiling-y lini datark aysinqn null apa noric kashxati
//ays depqum kashxati inchpes appendChild-y



//nextSibiling = document.body.firstChild   kdni body-i aamena skzbum

//nextSibiling = document.body.children[1]  1 indexov elementic araj





// CLONE

//elem.cloneNode(true)

//sarqum a klon
//true -- klon sarqeluc kklonavorven nayev miji bolor tegern u dranc atributnery
//false -- kklonavorvi iayn trvac elementy

//var div2 = div.cloneNode(true);


//div.parentNode.insertBefore(div2, div.nextSibling);

//erb vor menq chgiteq div-i cnoxy , byc div2-y uzum enq koxqy dnenq
//div.parentNode--klini divi cnoxy

//div2-y uzum enq lini div-ic anmijapes heto
//bayc goyutyun uni miayn insertBefore , aysinqn te inchic araj qcenq
//div.nextSibiling -- klini div-i hajord harevany







// REMOVE

//parentElem.removeChild(elem)
//elem- kjnjvi


//parentElem.replaceChild(newElem, elem)
//elem-y kjnjvi , yev poxareny klini newElem-y


//nor standartum goyutyun uni
//elem.remove()
//vortex petq chi nshel parent , aveli harmar e






//elementy texapoxelu hamar petq chi jnjel u noric sarqel
//append hramannery hin texic jnjum en

//var first = document.body.children[0];
//var last = document.body.children[1];
//document.body.insertBefore(last, first);

//body-i 0-rd yev 1-rd erexanerin texerov poxecinq



































































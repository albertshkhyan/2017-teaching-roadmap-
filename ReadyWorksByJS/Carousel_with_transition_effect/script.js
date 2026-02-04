
let imageContainer = document.querySelector('.slideContainer');
let sliderImages = document.querySelectorAll('.slideContainer img');

//Buttons
let prevBtn = document.querySelector('#prev');
let nextBtn = document.querySelector('#next');

//Հաշվիչ

let counter = 1; //առաջին նկարից սկսելու համար ոչ թե 0 -ից։
// let size = sliderImages[0].clientWidth;

let size = sliderImages[0].getBoundingClientRect().width;

// imageContainer.style.transform = `translateX(${-size * counter}px)`;//շարժվի 1 նկար առաջ։
imageContainer.style.transform = `translateX(${-size * 1}px)`;//

/*++++++++ button listener +++++++*/


//transition effect
nextBtn.addEventListener('click', ()=> {
	imageContainer.style.transition = `transform 1s ease-in-out`;
//

counter++;//որ հաջորդ նկարը փոխվի
imageContainer.style.transform = `translateX(${-size * counter}px)`;//շարժվի 1 նկար առաջ։

console.log("counter", counter);
console.log("sliderImages.length", sliderImages.length);
if(counter == sliderImages.length-1) {
	counter = 1;
}
});

prevBtn.addEventListener('click', ()=> {
	imageContainer.style.transition = `transform 1s ease-in-out`;
//
counter--;//որ հաջորդ նկարը փոխվի
imageContainer.style.transform = `translateX(${-size * counter}px)`;//շարժվի 1 նկար առաջ։

});


//transition finish, reset(վերականգնել) transition

//Եթե մենք հասելենք կլոնավորված նկարին թող ցուցադրվի մեր օրիգինալ նկարը։

// imageContainer.addEventListener('transitionend', ()=>{//հենց tranistion-ը ավարտվի։
// console.log(sliderImages[counter]);
// console.log(sliderImages[counter].id);
// 	if(sliderImages[counter].id === 'firstImage') {
// 		imageContainer.style.transition = `none`;//
// 		// counter = sliderImages.length - 2;
// 	}
// });

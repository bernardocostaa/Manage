const wrapper = document.querySelector(".wrapper");
const slide = document.querySelector(".slide");
let dist = {
  posicaoFinal: 0,
  startX: 0,
  movimento: 0,
};

let indexObj; 
let control;
let controlArray;
let slideArray = slidesConfg();
let changeEvent = new Event('changeEvent')
 
function transsition(active){
  slide.style.transition = active ? 'transform .3s' : ''
}

function updatePosicao(clientX) {
  dist.movimento = (dist.startX - clientX) * 1.6;
  return dist.posicaoFinal - dist.movimento;
}

function moveSlide(distX) {
  dist.ultimoMovimento = distX;
  slide.style.transform = `translate3d(${distX}px, 0 ,0)`;


}

function onStart(event) {
  let moveType;
  if (event.type === "mousedown") {
    event.preventDefault();
    dist.startX = event.clientX;
    moveType = "mousemove";
  } else {
    dist.startX = event.changedTouches[0].clientX;
    moveType = "touchmove";
  }
  wrapper.addEventListener(moveType, onMove);
  
}

function onMove(event) {
  const pointerPos =
    event.type === "mousemove"
      ? event.clientX
      : event.changedTouches[0].clientX;
  const finalPosi = updatePosicao(pointerPos);
  moveSlide(finalPosi);
  transsition(false)
}

function onEnd(event) {
  const moveType = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
  wrapper.removeEventListener(moveType, onMove);
  dist.posicaoFinal = dist.ultimoMovimento;
  transsition(true)
  changeSlideOnEnd();

}


function onResize() {
  setTimeout(() => {
      slideArray = slidesConfg()
      changeSlide(indexObj.active, slideArray);
    }, 1000);
}

function addReziseEvent(){
  window.addEventListener('resize', onResize)
}

function changeSlideOnEnd() {
  if (dist.movimento > 100 && indexObj.next !== undefined) {
    activeNextSlide();
  } else if (dist.movimento < 100 && indexObj.prev !== undefined) {
    activePrevSlide();
  } else {
    changeSlide(indexObj.active, slideArray);
  }
}

function slidesPosicao(slide) {
  const margin = (wrapper.offsetWidth - slide.offsetWidth) / 2;
  return -(slide.offsetLeft - margin);
}

function slidesConfg() {
  let slideArray = [...slide.children].map((element) => {
    const posicao = slidesPosicao(element);
    return {
      posicao,
      element,
    };
  });
  return slideArray;
}


let currentIndex = 1;

function changeSlide(index, slideArray) {
  const slideAtivo = slideArray[index];
  moveSlide(slideAtivo.posicao);
  indexObj = slideIndexNav(index);
  currentIndex = indexObj.active;
  dist.posicaoFinal = slideAtivo.posicao;
  wrapper.dispatchEvent(changeEvent);
}

function slideIndexNav(index) {
  const last = slideArray.length - 1;
  const indexObj = {
    prev: index > 0 ? index - 1 : undefined,
    active: index,
    next: index < last ? index + 1 : undefined,
  };
  return indexObj;
}


function activePrevSlide() {
  if (currentIndex !== undefined) {
    changeSlide(currentIndex - 1, slideArray);
  }
}

function activeNextSlide() {
  if (currentIndex !== undefined) {
    changeSlide(currentIndex + 1, slideArray);
  }
}

changeSlide(1, slideArray);


transsition(true)
addReziseEvent()

function creatControll(){
  const control = document.createElement('ul')
  control.dataset.control = 'slide'
  slideArray.forEach((item,index)=>{
    control.innerHTML += `<li><a href="#slide${index + 1}">${index}</a></li>` 
  });
  wrapper.appendChild(control)
  return control
}

function addAtivoClass(){
  controlArray.forEach((item)=>{
    item.classList.remove('ativo')
  })
  controlArray[indexObj.active].classList.add('ativo')
}

function eventControl(item, index){
  item.addEventListener('click',(e)=>{
    e.preventDefault()
    changeSlide(index,slideArray)

  })
  wrapper.addEventListener('changeEvent', addAtivoClass);
}

function addControl(customControl){
  control = document.querySelector(customControl) || creatControll()
  controlArray = [...control.children]
  controlArray.forEach(eventControl)
  addAtivoClass()
}


addControl()
wrapper.addEventListener("mousedown", onStart);
wrapper.addEventListener("touchstart", onStart);
wrapper.addEventListener("mouseup", onEnd);
wrapper.addEventListener("touchend", onEnd);




const menuMobile = document.querySelector('#mobile');
const menuMobileImg = menuMobile.querySelector('img');
const menu = document.querySelector('#menu');
const body = document.querySelector('body');

menuMobile.addEventListener('click', handleMenu.bind(menuMobile));

function handleMenu() {
  menu.classList.toggle('mobileMenu');
  menuMobileImg.setAttribute('src', menu.classList.contains('mobileMenu') ? '/img/icon-close.svg' : '/img/icon-hamburger.svg');
  menu.classList.contains('mobileMenu') ? body.classList.add('bg-mobile') : body.classList.remove('bg-mobile');
}

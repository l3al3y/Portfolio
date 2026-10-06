const root=document.documentElement;
try{const theme=localStorage.getItem('lab-theme');root.dataset.theme=theme==='light'?'light':'dark';}catch{root.dataset.theme='dark';}
const button=document.createElement('button');button.className='legal-theme';
function sync(){button.textContent=root.dataset.theme==='dark'?'Light theme ◐':'Dark theme ◐';}
button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('lab-theme',root.dataset.theme);}catch{}sync();});
document.querySelector('.wrap').prepend(button);sync();

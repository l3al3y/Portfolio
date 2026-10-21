import {gsap} from 'gsap';
import {createGSAPFrameAdapter} from '@hyperframes/core';

export const seconds=16, fps=24;
// Keep this composition at the edges: the portfolio, not the effect, is the focus.
export const networkMarkup=`<svg class="atmosphere-network" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
 <defs><pattern id="atmosphere-grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="currentColor" stroke-width=".65" opacity=".22"/></pattern></defs>
 <rect width="1600" height="1000" fill="url(#atmosphere-grid)" opacity=".45"/>
 <g class="network-lines" fill="none" stroke="currentColor" stroke-width="1">
  <path d="M-80 244H140L216 320H360M-30 650H92L176 566H300M1250 90V180L1170 260V390H1440L1550 500H1660M1370 1000V820L1460 730V600H1630M-20 890H160L240 810H420"/>
  <path d="M920 -50V100L1020 200H1250M1170 390V500L1280 610H1460M140 244V85M176 566V430H-30M240 810V950" opacity=".45"/>
 </g>
 <g class="network-junctions" fill="currentColor">${[[140,244],[216,320],[176,566],[240,810],[1250,180],[1170,260],[1170,390],[1440,390],[1460,730],[1370,820],[1020,200]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g>
 <g fill="none" stroke="currentColor" opacity=".4"><circle cx="1250" cy="180" r="12"/><circle cx="176" cy="566" r="9"/><rect x="1431" y="381" width="18" height="18" rx="4"/></g>
 <circle class="signal-a" cx="0" cy="0" r="4" fill="currentColor"/>
 <circle class="signal-b" cx="0" cy="0" r="3" fill="currentColor"/>
 <g class="network-click" transform="translate(1250 180)"><circle class="click-ring" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle class="click-core" r="5" fill="currentColor"/></g>
 <g class="network-cursor"><path d="M0 0L0 23L6.8 17L12 28L17 25.5L11.5 15L21 14Z" fill="var(--cursor-fill, #dae9f4)" stroke="var(--cursor-stroke, #101a29)" stroke-width="1.5"/></g>
</svg>`;

export function createNetwork(root){
 const q=s=>root.querySelector(s), tl=gsap.timeline({paused:true});
 tl.fromTo(q('.signal-a'),{attr:{cx:920,cy:100},opacity:0},{attr:{cx:1020,cy:200},opacity:.8,duration:2,ease:'none'},0)
   .to(q('.signal-a'),{attr:{cx:1250,cy:200},duration:3,ease:'none'},2)
   .to(q('.signal-a'),{opacity:0,duration:1},5)
   .fromTo(q('.signal-b'),{attr:{cx:92,cy:650},opacity:0},{attr:{cx:176,cy:566},opacity:.9,duration:2,ease:'none'},8)
   .to(q('.signal-b'),{attr:{cx:300,cy:566},duration:3,ease:'none'},10)
   .to(q('.signal-b'),{opacity:0,duration:1},13);
 tl.fromTo(q('.network-cursor'),{x:1360,y:290,opacity:0},{x:1250,y:180,opacity:.6,duration:2.3,ease:'power2.inOut'},1)
   .to(q('.network-cursor'),{scale:.9,duration:.2},3.3)
   .to(q('.network-cursor'),{scale:1,duration:.35},3.5)
   .to(q('.network-cursor'),{x:1170,y:260,duration:2.5,ease:'power2.inOut'},5)
   .to(q('.network-cursor'),{opacity:0,duration:1},8);
 tl.fromTo(q('.click-ring'),{attr:{r:8},opacity:0},{attr:{r:42},opacity:0,duration:1.8,ease:'power1.out',keyframes:[{opacity:.7,duration:.15},{opacity:0,duration:1.65}]},3.4);
 tl.fromTo(q('.click-core'),{opacity:0},{opacity:.7,duration:.2},3.4).to(q('.click-core'),{opacity:0,duration:1.2},3.6);
 tl.set({}, {}, seconds);
 const adapter=createGSAPFrameAdapter({id:'portfolio-network',fps,timeline:tl});
 adapter.init({compositionId:'portfolio-network',fps,width:1600,height:1000,rootElement:root});
 adapter.seekFrame(0);
 return {adapter,timeline:tl,destroy(){tl.kill();gsap.ticker.sleep();}};
}

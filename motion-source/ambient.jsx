import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

export function Ambient(){
 const f=useCurrentFrame(),{durationInFrames}=useVideoConfig();
 const phase=f/durationInFrames*Math.PI*2;
 const x=74+9*Math.sin(phase),y=20+10*Math.cos(phase);
 const x2=10+8*Math.cos(phase),y2=80+8*Math.sin(phase);
 return <AbsoluteFill><svg width="100%" height="100%" viewBox="0 0 960 600" preserveAspectRatio="none">
  <defs>
   <radialGradient id="cyan" cx={`${x}%`} cy={`${y}%`} r="62%"><stop stopColor="#28657b" stopOpacity=".72"/><stop offset="1" stopColor="#101b2b" stopOpacity="0"/></radialGradient>
   <radialGradient id="rose" cx={`${x2}%`} cy={`${y2}%`} r="53%"><stop stopColor="#794359" stopOpacity=".46"/><stop offset="1" stopColor="#101b2b" stopOpacity="0"/></radialGradient>
   <radialGradient id="blue" cx="45%" cy="40%" r="60%"><stop stopColor="#273951" stopOpacity=".4"/><stop offset="1" stopColor="#101b2b" stopOpacity="0"/></radialGradient>
  </defs>
  <rect width="960" height="600" fill="#101b2b"/><rect width="960" height="600" fill="url(#cyan)"/><rect width="960" height="600" fill="url(#rose)"/><rect width="960" height="600" fill="url(#blue)"/>
 </svg></AbsoluteFill>;
}

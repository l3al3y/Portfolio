import {copyFile,mkdir} from 'node:fs/promises';
await mkdir(new URL('./assets/',import.meta.url),{recursive:true});
await copyFile(new URL('../assets/portfolio-atmosphere.mp4',import.meta.url),new URL('./assets/portfolio-atmosphere.mp4',import.meta.url));
await copyFile(new URL('../lab/atmosphere.css',import.meta.url),new URL('./atmosphere.css',import.meta.url));

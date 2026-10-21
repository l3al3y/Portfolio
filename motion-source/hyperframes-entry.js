import {createNetwork,networkMarkup} from './network.js';
export function mountNetwork(root){
 root.querySelector('.network-layer').innerHTML=networkMarkup;
 return createNetwork(root);
}

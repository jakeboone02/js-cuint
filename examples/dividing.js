import { UINT32 } from '..';

const v1 = new UINT32('3266489917');
const v2 = new UINT32('668265263');
const v1div2 = v1.clone().div(v2);
console.log(`${v1} / ${v2} = ${v1div2}`);

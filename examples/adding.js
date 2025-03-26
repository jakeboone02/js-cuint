import { UINT32 } from '..';

const v1 = new UINT32('326648991');
const v2 = new UINT32('265443576');
const v1plus2 = v1.clone().add(v2);
console.log(`${v1} + ${v2} = ${v1plus2}`);

let x = [0, 1, 2, 3];
let y = x.slice();//复制x数组到y（但修改x，y不受影响）
x[0] = 1;//修改x的数值
console.log(x);
console.log(y);

let p = [0, 1, 2, 3];
let q = x.slice();//复制p数组到q（但修改q，p不受影响）
q[0] = 1;//修改q的数值
console.log(q);
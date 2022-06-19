import Treap from './treap.js';

const getRandInt = (from, to) => from + Math.floor((to - from + 1) * Math.random());

const NUMBER_OF_ITERATIONS = 10 ** 5
const MAX_ELEM = 10 ** 5

let st = new Treap();

for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
    const cur_elem = getRandInt(0, MAX_ELEM);
    if (!st.has(cur_elem)) {
        st.add(cur_elem);
    }
}

let new_st = new Treap();

for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
    new_st.add(i);
}

for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
    if (!new_st.has(i)) {
        console.log('Your set is not working');
    }
}
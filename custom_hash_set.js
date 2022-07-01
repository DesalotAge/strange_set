import Hashtable from "./hash.js";

const getRandInt = (from, to) => from + Math.floor((to - from + 1) * Math.random());

const NUMBER_OF_ITERATIONS = 10 ** 5
const MAX_ELEM = 10 ** 5

let st = new Hashtable();

for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
    const cur_elem = getRandInt(0, MAX_ELEM);
    if (!st.containsKey(cur_elem)) {
        st.put(cur_elem, 1);
    }
}
// console.log(st.keys().length, right_st.size);
// let new_st = new Hashtable();

for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
    new_st.put(i, 1);
}

for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
    if (!new_st.containsKey(i)) {
        console.log('Your set is not working');
    }
}



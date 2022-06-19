const getRandInt = (from, to) => from + Math.floor((to - from + 1) * Math.random());

const NUMBER_OF_ITERATIONS = 5 * 10 ** 5
const MAX_ELEM = 5 * 10 ** 5

let st = new Set();

for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
    const cur_elem = getRandInt(0, MAX_ELEM);
    if (!st.has(cur_elem)) {
        st.add(cur_elem);
    }
}

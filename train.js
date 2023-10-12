// ======== Task I. Shunday function tuzing, u bir array argument qilib qabul qilib, osha arrayning 0 index qiymatni arrayning oxiriga qoyib return qilsin. ===========//
function getCompute(array) {
    if (array.length < 2) {
        return arr;
    }

    const firstElement = array.shift();
    array.push(firstElement);
    return array;
}
const array = ['A', 'B', 'C', 'D', 'E'];
const result = getCompute(array);
console.log(result);

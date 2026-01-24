
/**
 * @param {[string]} list 
 */
export default function kelasMaker(list){
    if(!Array.isArray(list) && list?.length)
        throw Error("list is not an array or empty")

    const res = new Set(list);
    const arr = Array.from(res.values());
    
    for(let i = 0; i < arr.length ; ++i){
        arr[i] = {nama: arr[i]};
    }

    return arr;
}
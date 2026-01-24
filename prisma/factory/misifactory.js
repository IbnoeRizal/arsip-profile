import { fakerID_ID } from "@faker-js/faker";

export default function misiMaker(idVisi,count){
    if(typeof count !== "number")
        throw Error("count harus berupa number");
    const data = [];
    for(let i = 0; i < count; ++i){
        data.push({
            idVisi,
            mision: fakerID_ID.commerce.productDescription(),
        });
    }
    return data;
}
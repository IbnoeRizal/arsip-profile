import { fakerID_ID } from "@faker-js/faker";

export default function visiMaker(){
    return Object.freeze({
        vision : fakerID_ID.company.catchPhrase()
    });
}
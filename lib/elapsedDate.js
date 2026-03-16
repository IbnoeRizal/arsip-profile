

export class ElapsedTDate {
    static locales = "id-ID";
    static defOptions = Object.freeze({
        year: "numeric",
        month: "long",
        weekday: "long",
        day: "numeric"
    }) 
    static tail = Object.freeze([
        Object.freeze(["menit",60]),
        Object.freeze(["jam",60*60]),
        Object.freeze(["hari",24*60*60]),
        Object.freeze(["bulan",30*24*60*60])
    ]);
    #item;
    constructor(item){
        /**@type {Date} */
        this.#item = new Date(item);
    }

    getRawElapsedTime(){
        return Date.now() - this.#item;
    }

    /**
     * 
     * @returns {string}
     */
    getDescriptionElapsedTime(){
        let numerator = this.getRawElapsedTime() / 1000;
        let elapsedDetail = "";

        for(let i = ElapsedTDate.tail.length-1; i >= 0 ;--i){

            const [timeDetail , denominator] = ElapsedTDate.tail[i];
            if(numerator % denominator === numerator) continue;

            elapsedDetail += ` ${(numerator/denominator).toFixed()} ${timeDetail}`;
            numerator = numerator % denominator;
            break;
        }

        return elapsedDetail.length?  elapsedDetail+" yang lalu" :  "Baru saja";
    }

    /**
     * 
     * @returns {string}
     */
    getFormatedDate(){
        return this.#item.toLocaleString(ElapsedTDate.locales,ElapsedTDate.defOptions);
    }
}
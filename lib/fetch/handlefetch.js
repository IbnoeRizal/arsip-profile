/**
 * 
 * @param {Response} response 
 * @returns {Promise<any>}
 */
export default async function handleParseResponse(response){
    const type = response.headers.get("content-type") ?? "";

    if(type.includes("application/json")){
        return response.json();
    }

    const guess = await response.text();

    try{
        return JSON.parse(guess);
    }catch(e){
        if(process?.env?.NODE_ENV === "development")
            console.error(e);
    }finally{
        return guess;
    }
}
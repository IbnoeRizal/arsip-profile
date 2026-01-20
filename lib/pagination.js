
/**
 * @param {import("next/server").NextRequest} request 
 * @returns {{page:Number , limit:Number}}
 */
export function pagination(request){
    const searchparams = request.nextUrl.searchParams;
    const page = Number(searchparams.get("page"));
    const limit = Number(searchparams.get("limit"));

    return{
        page: (Number.isFinite(page) && page) > 0 ? Math.round(page)-1 : 0,
        limit: (Number.isFinite(limit) && limit) > 0 ? Math.round(limit) : 10
    }
}


import J from "@/generated/prisma/indexedSchema.json"
/** filter nextrequest
 * @param {import("next/server").NextRequest} request - request nextjs
 * @param {string} tableName - db table name 
 * @returns {Record<string,string> | {}} - return object filled with allowed (indexed db) property so query is fast. or {} if tablename does not exist
 */
export function filterQuery(request,tableName) {
    const refer = J[tableName];
    if(!refer) return {};
    const searchParams = request.nextUrl.searchParams;

    for(const key in refer){
        refer[key] = searchParams.get(key) ?? undefined;
    }

    return refer;
}
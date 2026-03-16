import z from "zod"
import J from "@/generated/prisma/indexedSchema.json"

// to detect if field is indeed id or not
const detectid = z.cuid();

/** filter nextrequest
 * @param {import("next/server").NextRequest} request - request nextjs
 * @param {string} tableName - db table name 
 * @returns {Record<string,string> | {}} - return object filled with allowed (indexed db) property so query is fast. or {} if tablename does not exist
 */
export function filterQuery(request,tableName) {

    // clone the object, to prevent bug caused by race condition
    const refer = structuredClone(J[tableName]);

    if(!refer) return {};

    //get the search parameter
    const searchParams = request.nextUrl.searchParams;

    for(const key in refer){
        const parameter = searchParams.get(key);
        const isNull = parameter === "null";
        // try safeparse the parameter;
        const result = detectid.safeParse(parameter);
        
        //if failed the parameter is not cuid value and parameter exist then perform insensitive and using contains, 
        if(!result.success && parameter && !isNull){
            refer[key] = {
                contains: parameter,
                mode: 'insensitive',
            }

            continue;
        }

        //if condition above is failed, then it is either cuid or is null because deliberately searching for null or doesn't exist and must be replaced with undefined
        refer[key] = isNull? null : (parameter ?? undefined);
    }

    return refer;
}
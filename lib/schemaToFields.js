/**
 * 
 * @param {import("zod").ZodObject} object 
 * @param {{[key:string] : import("@/components/form/dynamicform").Field}} field 
 * @returns {import("@/components/form/dynamicform").Field[]}
 */
export default function schemaToFields(object, field = {}){
    const keys = Object.keys(object.shape);

    const list_of_fields = [];

    for(const name of keys){
        list_of_fields.push(
            /**@type {import("@/components/form/dynamicform").Field} */
            ({
                ...field?.[name],
                name,
                required: !(object.shape[name].isOptional()),
            })
        )
    }

    return list_of_fields;
}
import prisma from "./prisma";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path"; 


/** filled with {} or indexed schema
 * @type {Readonly<Record<string,Record<string,string>>>}
 */
const INDEXED_SCHEMA = globalThis.INDEXED_SCHEMA ?? await (async function(){
    const result = {};
    const pattern = /\(([^()]+)\)/g;
    try{
        const indexes = await prisma.$queryRaw`SELECT 
            tablename,
            string_agg(indexdef, ',') AS index_definitions
            FROM pg_indexes 
            WHERE tablename != '_prisma_migrations' 
            AND schemaname = 'public'
            GROUP BY tablename`;
        
        for (const index of indexes){
            result[index['tablename']] = {}
            
            /**
             * @type {string[]}
             */
            const values = index['index_definitions'].match(pattern);

            for(const value of values){
                
                const records = [...(value.slice(1,-1).split(',').map((element)=>element.trim().replace(/"/g, '')))];

                for(const record of records){
                    result[index['tablename']][record] = record;
                }
            };
        }


    }catch(err){
        console.error(err);
    }finally{
        return Object.freeze(result);
    }
    
})();

const isProduction = process.env.NODE_ENV === "production";
const isCLI = process.argv[1]?.includes("indexFromSchema");
const fileName = "indexedSchema.json"

if(!isProduction && !globalThis.INDEXED_SCHEMA){
    globalThis.INDEXED_SCHEMA = INDEXED_SCHEMA;
    console.table(INDEXED_SCHEMA);

}

if(isCLI){ 

    const schemaPath = resolve(process.cwd(), "prisma/schema.prisma");
    const schema = readFileSync(schemaPath, "utf-8");

    const pattern = /generator\s+\w+\s*\{[^}]*output\s*=\s*"([^"]+)"[^}]*\}/g;
    const schemaDirPath = resolve(schemaPath,"../");

    let match;
    let output;

    while ((match = pattern.exec(schema)) !== null) {
        output = resolve(schemaDirPath, match[1]);
    }

    if(output){
        writeFileSync(`${output}\\${fileName}`,JSON.stringify(INDEXED_SCHEMA,null,2),"utf-8");
        console.log(`${fileName} generated successfully \nlocation : ${output}`);
    }
}


await prisma.$disconnect();
export{
    INDEXED_SCHEMA
}

//@ts-check
import { BLOB_GET_RAW_BY_URL } from "@/lib/server_cache/cache_tags_name";
import { compileMDX } from "next-mdx-remote/rsc";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import Loading from "@/app/loading";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { myDirectivePlugin } from "@/lib/mdx-plugin";
import { Riframe } from "@/components/resizableiframe";
import { sourceOfTruth } from "@/components/dataShow/sourceEndpoint";
import { cache } from "react";

export default async function Page({params}) {
    const {id} = await params;

    return(
        <article className="prose prose-lg dark:prose-invert max-w-3xl mx-auto px-4 py-8">
            <Suspense fallback={<Loading/>}>
                <GetMd id={id}/>
            </Suspense>
        </article>
    )
}

const components = {
  YoutubeEmbed: ({ id, width }) => (
    <Riframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        defaultWidth={width}
        props={{
            allowFullScreen:true,
            title:"YouTube video player",
            referrerPolicy: process.env.NODE_ENV === "development" ? undefined: "strict-origin-when-cross-origin" 
        }}
    />
  ),
  DriveEmbed: ({ id, width }) => (
    <Riframe
        src={`${sourceOfTruth.DriveObj.source}/${id}`}
        defaultWidth={width}
        props={{
            allowFullScreen:true,
            title:"Google Drive Item Viewer"
        }}
    />
  ),
}

const getMdData  = cache(async (id) => {
    const mdId = await prisma.blog.findUniqueOrThrow({
        where: { id },
        select: { link: true }
    });
    const response = await BLOB_GET_RAW_BY_URL.getBlog(mdId.link);
    const source = await response.text();
    
    return compileMDX({
        source,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm, remarkDirective, myDirectivePlugin]
            }
        },
        components
    });
});

export async function generateMetadata({params}) {
    const {id} = await params;
    try {
        const { frontmatter } = await getMdData(id);
        return {
            title: frontmatter?.title,
            description: frontmatter?.description,
        };
    } catch {
        return { title: "Not Found", description: "" };
    }
}

async function GetMd({ id }) {
    try {
        const { content } = await getMdData(id);
        return content;
    } catch (err) {
        if (process.env.NODE_ENV === "development") {
            console.error(err);
        }
        return <p className="inset-0">Not found</p>;
    }
}
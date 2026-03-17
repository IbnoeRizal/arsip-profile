//@ts-check
'use client'
import { useCredential } from '@/context/usercredential';
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  InsertThematicBreak,
  markdownShortcutPlugin,
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  ListsToggle,
  toolbarPlugin,
  linkPlugin,
  linkDialogPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  tablePlugin,
  InsertTable,
  directivesPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  InsertCodeBlock,
  frontmatterPlugin,
  InsertFrontmatter
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css';
import { oneDark } from '@codemirror/theme-one-dark';
import { YouTubeButton, YoutubeDirectiveDescriptor } from './directivePlugin/YoutubePlugin';
import { GdriveButton, GdriveDirectiveDescriptor } from './directivePlugin/Gdrive';

/**
 * @param {{
 *   editorRef?: import('react').Ref<import('@mdxeditor/editor').MDXEditorMethods>
 * } & import('@mdxeditor/editor').MDXEditorProps} props
 * @returns {import('react').JSX.Element}
 */
export default function InitializedMDXEditor({ editorRef,readOnly, ...props }) {
  const credential = useCredential();
  const finalProps = {
    ...props,
    readOnly : !credential.id,
  }
  return (
    <MDXEditor
      plugins={[
        directivesPlugin({
          directiveDescriptors:[YoutubeDirectiveDescriptor,GdriveDirectiveDescriptor],
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        diffSourcePlugin(),
        tablePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'py' }),
        frontmatterPlugin(),
        codeMirrorPlugin({
          autoLoadLanguageSupport:true,
          codeBlockLanguages: {
            js: "JavaScript",
            ts: "TypeScript",
            jsx: "JSX",
            tsx: "TSX",
            json: "JSON",
            html: "HTML",
            css: "CSS",
            py: "Python",
            cpp: "Cpp"
          },
          codeMirrorExtensions:[oneDark]
        }),
        ...(finalProps.readOnly ? []: [toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <ListsToggle />
              <CreateLink />
              <InsertTable />
              <YouTubeButton />
              <GdriveButton/>
              <InsertThematicBreak/>
              <InsertCodeBlock/>
              <InsertFrontmatter/>
              <DiffSourceToggleWrapper options={["source", 'rich-text','diff']} >
                {null}
              </DiffSourceToggleWrapper>
            </>
          ),
          toolbarPosition:"bottom",
          toolbarClassName:"sticky bottom-0 z-0"
        })])
      ]}
      className='prose min-w-full'
      contentEditableClassName="[&_[data-lexical-text='true']]:text-foreground caret-foreground"
      {...finalProps}
      ref={editorRef}
      markdown={props.markdown || '/n'}
      readOnly={readOnly}
    />
  )
}
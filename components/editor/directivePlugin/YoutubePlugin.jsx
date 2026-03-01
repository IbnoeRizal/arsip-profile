//@ts-check
import {
    usePublisher,
    useMdastNodeUpdater,
    insertDirective$,
    DialogButton,

} from "@mdxeditor/editor";
import { YoutubeIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';


/**
 * @type {import('@mdxeditor/editor').DirectiveDescriptor}
 */
const YoutubeDirectiveDescriptor = {
  name: 'youtube',
  type: 'leafDirective',
  testNode(node) {
    return node.name === 'youtube'
  },
  attributes: ['id'],
  hasChildren: false,

  Editor: ({ mdastNode }) => {
    const refer = useRef(null);
    const updateNode = useMdastNodeUpdater()


    useEffect(()=>{
      const observer = new ResizeObserver(([entry])=>{
        
        const width = Math.round(entry.contentRect.width).toString();
        
        
        if(mdastNode.attributes?.width !== width) {
          updateNode(
            {
              ...mdastNode,
              attributes:{
                ...mdastNode.attributes,
                width
              }
            }
          )
        }
      });

      if(refer.current){
        observer.observe(refer.current);
      }

      return ()=>observer.disconnect()
    },[])

  return (
    <div 
      style={{ resize: 'horizontal', overflow: 'hidden', width: '560px', minWidth: '200px', maxWidth: '100%', paddingRight:10}}
      ref={refer}
    >
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          src={`https://www.youtube.com/embed/${mdastNode?.attributes?.id}`}
          allowFullScreen
        />
      </div>
    </div>
  )
}
}

const YouTubeButton = () => {
  // grab the insertDirective action (a.k.a. publisher) from the 
  // state management system of the directivesPlugin
  const insertDirective = usePublisher(insertDirective$)

  return (
    <DialogButton
      tooltipTitle="Insert Youtube video"
      submitButtonTitle="Insert video"
      dialogInputPlaceholder="Paste the youtube video URL"
      buttonContent={<YoutubeIcon/>}
      onSubmit={(url) => {
        let videoId = null;
        try {
          const parsed = new URL(url);
          if (parsed.hostname === 'youtu.be') {
            videoId = parsed.pathname.slice(1);
          } else {
            videoId = parsed.searchParams.get('v');
          }
        } catch {}
        
        if (videoId) {
          insertDirective({ name: 'youtube', type: 'leafDirective', attributes: { id: videoId }})
        } else {
          alert('Invalid YouTube URL')
        }
      }}
    />
  )
}

export{
    YouTubeButton,
    YoutubeDirectiveDescriptor
}
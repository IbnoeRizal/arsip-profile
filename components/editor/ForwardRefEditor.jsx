'use client'
// ForwardRefEditor.jsx
import dynamic from 'next/dynamic'

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import('./InitializedMDXEditor'), {
  // Make sure we turn SSR off
  ssr: false
})

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.

export function ForwardRefEditor({ref,readOnly,...props}){
  return <Editor {...props} editorRef={ref} readOnly={readOnly}/>
}
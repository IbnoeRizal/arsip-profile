import { visit } from 'unist-util-visit'

export function myDirectivePlugin() {
  return (tree) => {
    visit(tree, (node) => {
      
      if (node.type === 'leafDirective' && node.name === 'youtube') {
        const videoId = node.attributes?.id    // dari #itN5yVoxGNg
        const width = node.attributes?.width
        node.type = 'mdxJsxFlowElement'
        node.name = 'YoutubeEmbed'
        node.children = []
        node.attributes = [
          { type: 'mdxJsxAttribute', name: 'id', value: videoId },
          { type: 'mdxJsxAttribute', name: 'width', value: width },
        ]
      }

      if (node.type === 'leafDirective' && node.name === 'gdrive') {
        const id = node.attributes?.id         // dari #cmm7sl07d0000yg3qrep87w9x
        const width = node.attributes?.width
        node.type = 'mdxJsxFlowElement'
        node.name = 'DriveEmbed'
        node.children = []
        node.attributes = [
          { type: 'mdxJsxAttribute', name: 'id', value: id },
          { type: 'mdxJsxAttribute', name: 'width', value: width },
        ]
      }

    })
  }
}
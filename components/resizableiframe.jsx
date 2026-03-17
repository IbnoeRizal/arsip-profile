
/**
 * 
 * @param {{
 *  sizeref:import("react").Reference
 *  src: string | URL
 *  defaultWidth?: number | string
 *  props:import("react").IframeHTMLAttributes
 * }} params
 */
export function Riframe({sizeref,src,defaultWidth,props}){

    return(
        <div 
        style={{ resize: 'horizontal', overflow: 'hidden', width: defaultWidth ?? '560px', minWidth: '200px', maxWidth: '100%', paddingRight:10}}
        ref={sizeref}
        >
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src={src}
            {...props}
            />
        </div>
        </div>
    )
}
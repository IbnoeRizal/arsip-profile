export default function ThemeButton({fun, text, width, height}){
    return <button type="button" onClick={fun} className="flex dark:bg-blue-600 bg-red-600 rounded-md p-1 hover:scale-101 active:scale-99 text-white" style={{width, height}}>{text}</button>
}
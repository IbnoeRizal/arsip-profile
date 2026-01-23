
export default async function Page({params}){
    let data = null
    try{
        const {nama} = await params;
        data = await fetch("/api/guru/"+nama).then(x=>x.json())

    }catch(e){
        console.error(e)
    }

    return(
        <div>
            <Dataguru />
        </div>
    )

}

function Dataguru(props){
    const {nama,email,bio,jabatan,image} = props

    return (
        <div>
            
        </div>
    )
}
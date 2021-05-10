const applyFilter = async(latlong)=>{
    try{
        await axios.post(`/filter?name=${latlong}`)
    }catch(err){
        console.log(err)
    }
}
import '@babel/polyfill';
import {applyFilter} from applyFilter

map.on('click',async(e)=>{
    if(marker)
        map.removeLayer(marker);
    console.log(e.latlng)
    marker = L.marker(e.latlng,{icon:greenIcon}).addTo(map)
    applyFilter(e.latlng)
    console.log(res);
})
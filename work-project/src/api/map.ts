import {post} from "@/utils/http"
const MapList = "/mapList"

function mapListApi(){
    return post(MapList)
}

export {mapListApi}
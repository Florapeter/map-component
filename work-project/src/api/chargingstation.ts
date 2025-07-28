import { post } from "@/utils/http";

interface ListType{
    page:number,
    pageSize:number,
    name?:string,
    id?:string,
    status:number,
}
const List = '/stationList'

function listApi(data:ListType):Promise<any>{
    return post(List,data)
}
export {listApi}


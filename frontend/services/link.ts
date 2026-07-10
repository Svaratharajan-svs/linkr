import api from "@/lib/api";

import {
    CreateLinkRequest,
    CreateLinkResponse,
    PaginatedLinks,
    StatsResponse
} from "@/types/link";



export async function createLink(
    data: CreateLinkRequest
): Promise<CreateLinkResponse> {


    const response =
        await api.post<CreateLinkResponse>(
            "/api/links",
            data
        );


    return response.data;
}



export async function getLinks(
    page:number = 1,
    limit:number = 10
):Promise<PaginatedLinks>{
    const response =
        await api.get(
            "/api/links",
            {

                params:{
                    page,
                    limit
                }

            }
        );
    return response.data;
}



export async function getStats(
    code:string
): Promise<StatsResponse> {


    const response =
        await api.get<StatsResponse>(
            `/api/links/${code}/stats`
        );


    return response.data;
}
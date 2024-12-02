import { localAxios } from '@/util/http-commons'
import { useUserStore } from '@/stores/useUserStore'
const local = localAxios()

async function getCandidate(params) {
    try {
        const response = await local.get(`api/random/candidate`, { params });
        return response.data;
    } catch (error) {
        console.error("Error in getCandidate:", error);
        throw error;
    }
}


export { getCandidate }
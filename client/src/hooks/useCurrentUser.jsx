import { apiFetch } from '@/lib/action';
import {useQuery} from '@tanstack/react-query';

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: () => apiFetch('/api/me')
    })
}
import { useMutation } from '@tanstack/react-query'
import { leadsService } from '../services/leadsService'

export function useCreateLead() {
  return useMutation({
    mutationFn: leadsService.createLead,
  })
}

import apiClient from './apiClient'

export const leadsService = {
  createLead: (data: { propertyId: string; contactType: 'phone' | 'whatsapp'; userName: string; userPhone: string }) =>
    apiClient.post('/leads', data),
}

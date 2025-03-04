
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants';

// Utility functions for WebPay service
export const createHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
});

export const getWebPayConfirmEndpoint = () => `${SUPABASE_URL}/functions/v1/webpay-confirm`;

export const getWebPayInitEndpoint = () => `${SUPABASE_URL}/functions/v1/webpay-init`;

export const getClientInfoFromStorage = (): { name: string | null; email: string | null; phone: string | null } => {
  return {
    name: localStorage.getItem('client_name'),
    email: localStorage.getItem('client_email'),
    phone: localStorage.getItem('client_phone')
  };
};

export const storeClientInfo = (clientInfo: { name?: string; email?: string; phone?: string }) => {
  if (clientInfo.name) localStorage.setItem('client_name', clientInfo.name);
  if (clientInfo.email) localStorage.setItem('client_email', clientInfo.email);
  if (clientInfo.phone) localStorage.setItem('client_phone', clientInfo.phone);
};

export const storeReservationInfo = (reservationId: string, unitId?: string, isPackageUnit = false) => {
  localStorage.setItem('current_reservation_id', reservationId);
  if (unitId) localStorage.setItem('current_unit_id', unitId);
  localStorage.setItem('is_package_unit', isPackageUnit ? 'true' : 'false');
};

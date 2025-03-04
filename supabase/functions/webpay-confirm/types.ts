
// Definiciones de tipos para webpay-confirm

// Configuración de WebPay/Transbank
export interface WebPayConfig {
  commerceCode: string;
  apiKey: string;
  baseUrl: string;
}

// Datos de la reserva en Supabase
export interface ReservationData {
  id: string;
  status: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
}

// Información del cliente para actualizar
export interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
}

// Respuesta de Transbank/WebPay
export interface WebPayResponse {
  vci: string;
  amount: number;
  status: string;
  buy_order: string;
  session_id: string;
  card_detail: {
    card_number: string;
  };
  accounting_date: string;
  transaction_date: string;
  authorization_code: string;
  payment_type_code: string;
  response_code: number;
  installments_amount?: number;
  installments_number: number;
}

// Resultado final para el cliente
export interface TransactionResult extends WebPayResponse {
  reservation_id?: string | null;
  is_package_unit?: boolean;
}

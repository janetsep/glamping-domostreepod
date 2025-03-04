
// Definiciones de tipos para la función webpay-confirm

// Configuración para WebPay
export interface WebPayConfig {
  endpoint: string;
  apiKey: string;
  sharedSecret: string;
}

// Respuesta de WebPay
export interface WebPayResponse {
  response_code: number;
  authorization_code?: string;
  buy_order?: string;
  amount?: number;
  card_detail?: {
    card_number?: string;
  };
  status?: string;
  [key: string]: any; // Para otros campos que pueda incluir WebPay
}

// Datos de la reserva
export interface ReservationData {
  id: string;
  status: string;
}

// Resultado de la transacción
export interface TransactionResult extends WebPayResponse {
  reservation_id?: string;
  is_package_unit?: boolean;
}

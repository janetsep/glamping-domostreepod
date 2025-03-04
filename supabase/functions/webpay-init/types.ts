
// Definiciones de tipos para la función webpay-init

// Configuración para WebPay/Transbank
export interface WebPayConfig {
  commerceCode: string;
  apiKey: string;
  baseUrl: string;
}

// Información del cliente
export interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
}

// Datos para iniciar una transacción
export interface TransactionInitData {
  reservationId: string;
  amount: number;
  origin: string;
  unit_id?: string;
  client_info?: ClientInfo;
}

// Datos para crear una transacción en WebPay
export interface CreateTransactionData {
  buy_order: string;
  session_id: string;
  amount: number;
  return_url: string;
}

// Respuesta de WebPay al crear una transacción
export interface WebPayInitResponse {
  token: string;
  url: string;
}

// Respuesta final para el cliente
export interface InitResponsePayload {
  token: string;
  url: string;
  buy_order: string;
  is_package_unit: boolean;
}

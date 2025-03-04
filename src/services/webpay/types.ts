
// Types for WebPay service
export interface TransactionResult {
  authorization_code?: string;
  buy_order?: string;
  amount?: number;
  response_code: number;
  card_detail?: {
    card_number?: string;
  };
  status?: string;
  reservation_id?: string;
}

export interface ClientInfo {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

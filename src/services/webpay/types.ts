// Types for WebPay service
export interface TransactionResult {
  response_code: number;
  response_description?: string;
  amount?: number;
  status?: string;
  buy_order?: string;
  session_id?: string;
  card_number?: string;
  accounting_date?: string;
  transaction_date?: string;
  authorization_code?: string;
  payment_type_code?: string;
  shares_number?: number;
  shares_amount?: number;
  commerce_code?: string;
  token?: string;
  reservation_id?: string;
  check_in?: string;
  check_out?: string;
}

export interface ClientInfo {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}


export interface WebPayResponse {
  response_code: number;
  authorization_code?: string;
  accounting_date?: string;
  buy_order?: string;
  amount?: number;
  card_number?: string;
  transaction_date?: string;
  vci?: string;
  session_id?: string;
  installments_number?: number;
  installments_amount?: number;
  balance?: number;
}

export interface TransactionResult extends WebPayResponse {
  reservation_id?: string | null;
  is_package_unit?: boolean;
  reservation_data?: any;
}


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
  card_detail?: {
    card_number?: string;
  };
  reservation_data?: {
    unit_name?: string;
    check_in?: string;
    check_out?: string;
    guests?: number;
    reservation_code?: string;
    pets?: number;
    pets_price?: number;
    activities_total?: number;
    packages_total?: number;
    selected_activities?: any[];
    selected_packages?: any[];
  };
}

export interface ClientInfo {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

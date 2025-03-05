
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
  reservation_data?: {
    unit_name?: string;
    check_in?: string;
    check_out?: string;
    guests?: number;
    selected_activities?: any[];
    selected_packages?: any[];
  };
}

export interface ClientInfo {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

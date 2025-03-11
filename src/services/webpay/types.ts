
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
  unit_id?: string;
  is_package_unit?: boolean;
  reservation_data?: {
    unit_name?: string;
    check_in?: string;
    check_out?: string;
    guests?: number;
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

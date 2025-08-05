export interface IApiOrder {
  id: number;
  agent: IApiAgent;
  deadline: string;
  status: number;
  get_status_display: "Yangi" | "Tayyorlanmoqda" | "Pauza" | "Yuborilgan";
  items: IApiOrderItem[];
  created_date: string;
  sent_date: string | null;
  total_count: number;
  percentage: number;
  created_date_: string;
}

export interface IApiAgent {
  id: number;
  name: string;
  address: string;
  image: string;
}

export interface IApiOrderItem {
  id: number;
  product: IApiProduct;
  count: string;
  box_count: string;
  status: number;
  get_status_display: string;
}

export interface IApiProduct {
  id: number;
  name: string;
  measure: string;
}

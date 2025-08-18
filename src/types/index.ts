export interface IApiOrder {
  id: number;
  agent: IApiAgent;
  deadline: string;
  status: 1|2|3|4|5;
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
  count: number;
  box_count: string;
  status: 0|1|2;
  get_status_display: "Tayyorlanmoqda" | "Tayyor";
}

export interface IApiProduct {
  id: number;
  name: string;
  measure: string;
}

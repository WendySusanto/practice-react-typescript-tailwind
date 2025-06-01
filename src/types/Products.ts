export type MemberPrice = {
  member_id: number;
  member_name: string;
  harga: number;
};

export type GrosirConfig = {
  min_qty: number;
  harga: number;
};

export type Product = {
  id: number;
  name: string;
  satuan: string;
  harga: number;
  modal: number;
  expired: string;
  barcode: string;
  note: string;
  member_prices?: MemberPrice[];
  harga_grosir?: GrosirConfig[];
};

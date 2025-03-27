export type Member = {
  id: number;
  name: string;
  harga_member: number;
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
  members: Member[];
};

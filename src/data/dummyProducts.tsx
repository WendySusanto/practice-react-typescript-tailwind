import { Product } from "../types/Products";

export const products: Product[] = [
  {
    id: 1,
    name: "Produk 1",
    satuan: "pcs",
    harga: 10000,
    modal: 8000,
    expired: "2025-12-31",
    barcode: "1234567890123",
    note: "Catatan untuk produk 1",
    members: [
      { id: 1, name: "Member A", harga_member: 9500 },
      { id: 2, name: "Member B", harga_member: 9000 },
    ],
  },
  {
    id: 2,
    name: "Produk 2",
    satuan: "kg",
    harga: 20000,
    modal: 15000,
    expired: "2025-11-30",
    barcode: "1234567890124",
    note: "Catatan untuk produk 2",
    members: [
      { id: 1, name: "Member A", harga_member: 19000 },
      { id: 2, name: "Member B", harga_member: 18500 },
    ],
  },
  {
    id: 3,
    name: "Produk 3",
    satuan: "liter",
    harga: 15000,
    modal: 12000,
    expired: "2025-10-15",
    barcode: "1234567890125",
    note: "Catatan untuk produk 3",
    members: [
      { id: 1, name: "Member A", harga_member: 14000 },
      { id: 2, name: "Member B", harga_member: 13500 },
    ],
  },
  {
    id: 4,
    name: "Produk 4",
    satuan: "box",
    harga: 50000,
    modal: 40000,
    expired: "2025-09-01",
    barcode: "1234567890126",
    note: "Catatan untuk produk 4",
    members: [
      { id: 1, name: "Member A", harga_member: 48000 },
      { id: 2, name: "Member B", harga_member: 47000 },
    ],
  },
  {
    id: 5,
    name: "Produk 5",
    satuan: "pcs",
    harga: 30000,
    modal: 25000,
    expired: "2025-08-20",
    barcode: "1234567890127",
    note: "Catatan untuk produk 5",
    members: [
      { id: 1, name: "Member A", harga_member: 29000 },
      { id: 2, name: "Member B", harga_member: 28000 },
    ],
  },
  {
    id: 6,
    name: "Produk 6",
    satuan: "kg",
    harga: 12000,
    modal: 10000,
    expired: "2025-07-15",
    barcode: "1234567890128",
    note: "Catatan untuk produk 6",
    members: [
      { id: 1, name: "Member A", harga_member: 11500 },
      { id: 2, name: "Member B", harga_member: 11000 },
    ],
  },
  {
    id: 7,
    name: "Produk 7",
    satuan: "liter",
    harga: 18000,
    modal: 15000,
    expired: "2025-06-10",
    barcode: "1234567890129",
    note: "Catatan untuk produk 7",
    members: [
      { id: 1, name: "Member A", harga_member: 17500 },
      { id: 2, name: "Member B", harga_member: 17000 },
    ],
  },
  {
    id: 8,
    name: "Produk 8",
    satuan: "box",
    harga: 60000,
    modal: 50000,
    expired: "2025-05-05",
    barcode: "1234567890130",
    note: "Catatan untuk produk 8",
    members: [
      { id: 1, name: "Member A", harga_member: 58000 },
      { id: 2, name: "Member B", harga_member: 57000 },
    ],
  },
  {
    id: 9,
    name: "Produk 9",
    satuan: "pcs",
    harga: 25000,
    modal: 20000,
    expired: "2025-04-01",
    barcode: "1234567890131",
    note: "Catatan untuk produk 9",
    members: [
      { id: 1, name: "Member A", harga_member: 24000 },
      { id: 2, name: "Member B", harga_member: 23000 },
    ],
  },
  {
    id: 10,
    name: "Produk 10",
    satuan: "kg",
    harga: 22000,
    modal: 18000,
    expired: "2025-03-15",
    barcode: "1234567890132",
    note: "Catatan untuk produk 10",
    members: [
      { id: 1, name: "Member A", harga_member: 21000 },
      { id: 2, name: "Member B", harga_member: 20500 },
    ],
  },
];

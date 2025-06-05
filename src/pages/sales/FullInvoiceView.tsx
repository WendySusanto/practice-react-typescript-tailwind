import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import Logo from "../../assets/no-background-logo-invoice.png";
import Button from "../../components/Button";
import { ArrowLeft } from "lucide-react";
import { LoadingIcon } from "../../components/LoadingIcon";

type PrintProduct = {
  product_id: number;
  product_name: string;
  product_satuan?: string;
  harga: number;
  quantity: number;
};

type PrintSales = {
  id: number;
  kasir_id: number;
  kode_kasir?: string;
  kasir_name?: string;
  member_id: number;
  member_name?: string;
  member_address?: string;
  date_added: string;
  total: number;
  products: PrintProduct[];
};

export default function FullInvoiceView() {
  const { id } = useParams<{ id: string }>();
  const { get, isLoading, isError, errorMessage } = useFetch<PrintSales>();
  const [data, setData] = useState<PrintSales | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await get(`/api/sales/${id}`, {
        Authorization: "Bearer test",
      });
      if (res) setData(res);
    };
    fetchData();
  }, [id]);

  if (isLoading || !data)
    return (
      <div>
        <LoadingIcon />
      </div>
    );
  if (isError)
    return (
      <div className="text-text">
        Error...
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    );

  const dateObj = new Date(data.date_added);
  const date = dateObj.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const receiptNo = `ST${String(data.id).padStart(5, "0")}`;
  const formatCurrency = (num: number) =>
    num.toLocaleString("id-ID", { style: "decimal", minimumFractionDigits: 0 });

  return (
    <div>
      <Button className="mb-3" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div
        id="invoice"
        style={{
          padding: 30,
          fontFamily: "Calibri, Arial, sans-serif",
          fontSize: "8pt",
          fontWeight: 500,
          color: "black",
          background: "#fff",
        }}
      >
        <div>
          <header>
            <div className="row" style={{ marginBottom: 5 }}>
              <div className="col">
                <div
                  className="logo-detail"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="logo-container" style={{ display: "flex" }}>
                    <div className="logo-image">
                      <img
                        src={Logo}
                        alt="Logo"
                        style={{
                          maxWidth: 100,
                          marginRight: 30,
                          width: "100%",
                        }}
                      />
                    </div>
                    <div
                      className="text-bold details"
                      style={{ fontWeight: 800 }}
                    >
                      Jl. Villa Tangerang Regensi Blok BE1 <br /> No 8-9, Kota
                      Tangerang, Banten,15132
                      <br />
                      021-55733548
                      <br />
                      0812 1011 0281
                    </div>
                  </div>
                  <div
                    className="invoice-container"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "end",
                    }}
                  >
                    <h1 style={{ fontWeight: 800, fontSize: "18pt" }}>
                      INVOICE
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ border: "1px solid black" }} />
            <div className="row">
              <div className="col">
                <div
                  className="header-detail row"
                  style={{ fontSize: "12pt", marginBottom: 5 }}
                >
                  <div className="member-detail col-5">
                    <div className="member">
                      <div
                        className="text-bold me-5"
                        style={{ display: "inline-block", fontWeight: 800 }}
                      >
                        Pembeli Yth.
                      </div>
                      <div style={{ display: "inline-block" }}>
                        {data.member_name ?? "-"}
                      </div>
                    </div>
                    <div className="member">
                      <div
                        className="text-bold me-5"
                        style={{ fontWeight: 800 }}
                      >
                        Alamat
                      </div>
                      <div>{data.member_address ?? "-"}</div>
                    </div>
                  </div>
                  <div className="col-3"></div>
                  <div className="seller-detail col-4">
                    <div
                      className="date d-flex justify-content-between"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        className="text-bold me-5"
                        style={{ fontWeight: 800 }}
                      >
                        Tanggal
                      </div>
                      <div>
                        {date} {time}
                      </div>
                    </div>
                    <div
                      className="kasir d-flex justify-content-between"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        className="text-bold me-5"
                        style={{ fontWeight: 800 }}
                      >
                        Kasir
                      </div>
                      <div>{data.kode_kasir ?? data.kasir_name}</div>
                    </div>
                    <div
                      className="id-transaksi d-flex justify-content-between"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        className="text-bold me-5"
                        style={{ fontWeight: 800 }}
                      >
                        ID Transaksi
                      </div>
                      <div>{receiptNo}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <section>
            <table
              className="table list-product-table"
              style={{
                borderTop: "1.5px solid black",
                fontSize: "13.5pt",
                width: "100%",
                marginBottom: 0,
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#96BF47",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  <td>Nama Produk</td>
                  <td>Quantity</td>
                  <td>Harga Satuan</td>
                  <td>Subtotal</td>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product, idx) => (
                  <tr key={product.product_id + "-" + idx}>
                    <td>
                      {product.product_name}{" "}
                      {product.product_satuan && (
                        <>
                          [<b>{product.product_satuan}</b>]
                        </>
                      )}
                    </td>
                    <td className="fw-bold" style={{ fontWeight: 700 }}>
                      {product.quantity}
                    </td>
                    <td>{formatCurrency(product.harga)}</td>
                    <td>{formatCurrency(product.harga * product.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="text-start">
                  <td className="fw-bold" style={{ fontWeight: 700 }}>
                    {data.products.length} item(s)
                  </td>
                  <td></td>
                  <td></td>
                  <td>{formatCurrency(data.total)}</td>
                </tr>
              </tfoot>
            </table>
          </section>
          <footer>
            <div className="row">
              <div className="col">
                <div
                  className="sign"
                  style={{
                    fontSize: "14pt",
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: 30,
                  }}
                >
                  <div className="buyer">
                    <div className="container-sign">
                      <div className="text-center">Penerima/Pembeli</div>
                      <div
                        className="empty-space"
                        style={{
                          minHeight: 70,
                          width: 120,
                          borderBottom: "2px solid black",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="seller">
                    <div className="container-sign">
                      <div className="text-center">Toko Sinar Terang</div>
                      <div
                        className="empty-space"
                        style={{
                          minHeight: 70,
                          width: 120,
                          borderBottom: "2px solid black",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

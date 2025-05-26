import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { LoadingIcon } from "../../components/LoadingIcon";
import Logo from "../../assets/no-background-logo-invoice.png";
import Blibli from "../../assets/blibli.png";
import Shopee from "../../assets/shopee.ico";
import Tokopedia from "../../assets/tokped.ico";
import Maps from "../../assets/maps.ico";
import Button from "../../components/Button";
import { ArrowLeft } from "lucide-react";

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
  member_id: number;
  member_name?: string;
  date_added: string;
  total: number;
  products: PrintProduct[];
};

export default function SalesDetail() {
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

  if (isLoading || !data) return <LoadingIcon />;
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

  const formatCurrency = (num: number) =>
    num.toLocaleString("id-ID", { style: "decimal", minimumFractionDigits: 0 });

  // For receipt number
  const receiptNo = `ST${String(data.id).padStart(5, "0")}`;

  return (
    <div>
      <Button className="mb-3" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div
        id="receipt"
        style={{
          width: "80mm",
          margin: "0 auto",
          background: "#fff",
          color: "#222",
          fontFamily: "Tahoma, Arial, monospace",
          fontSize: "10pt",
          padding: "0",
        }}
      >
        {/* Header */}
        <div style={{ padding: "0 0 8px 0" }}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <img
              src={Logo}
              alt="Logo"
              style={{
                maxWidth: 120,
                width: "100%",
                margin: "0 auto",
                display: "block",
              }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "8pt",
              lineHeight: 1.3,
              marginBottom: 8,
            }}
          >
            Jl. Villa Tangerang Regensi Blok BE1 No 8-9, Kota Tangerang, Banten,
            15132
            <br />
            021-55733548
            <br />
            0812 1011 0281
          </div>
          <div style={{ fontSize: "8pt", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{date}</span>
              <span>{time}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Kasir</span>
              <span>{data.kode_kasir ?? data.kasir_id}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Pembeli</span>
              <span>{data.member_name ?? "-"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>ID Transaksi</span>
              <span>{receiptNo}</span>
            </div>
          </div>
        </div>
        {/* Products */}
        <section>
          <table
            style={{
              width: "100%",
              fontSize: "9pt",
              borderCollapse: "collapse",
              marginBottom: 8,
            }}
          >
            <tbody>
              <tr>
                <td colSpan={2}>
                  <hr style={{ border: "1px solid #000", margin: "4px 0" }} />
                </td>
              </tr>
              {data.products.map((product, idx) => (
                <tr key={product.product_id + "-" + idx}>
                  <td style={{ verticalAlign: "top", padding: 0 }}>
                    <table style={{ fontSize: "8pt", width: "100%" }}>
                      <tbody>
                        <tr>
                          <td>
                            {product.product_name}
                            {product.product_satuan && (
                              <>
                                {" "}
                                [<b>{product.product_satuan}</b>]
                              </>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="qty">{product.quantity}</span> x{" "}
                            <span className="harga">
                              @{formatCurrency(product.harga)}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontSize: "9pt",
                      verticalAlign: "top",
                      padding: 0,
                    }}
                  >
                    {formatCurrency(product.harga * product.quantity)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2}>
                  <hr style={{ border: "1px solid #000", margin: "4px 0" }} />
                </td>
              </tr>
              <tr style={{ fontWeight: 800, textAlign: "center" }}>
                <td>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td>Total</td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style={{ textAlign: "right", fontSize: "11pt" }}>
                  {formatCurrency(data.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        {/* Footer */}
        <div
          style={{ fontSize: "8pt", textAlign: "center", margin: "10px 0 0 0" }}
        >
          <div>Anda dapat mengunjungi kita di</div>
          <table style={{ margin: "0 auto", lineHeight: 2 }}>
            <tbody>
              <tr>
                <td>
                  <img
                    src={Tokopedia}
                    alt="Tokopedia"
                    style={{
                      width: 16,
                      height: 16,
                      marginRight: 3,
                      verticalAlign: "middle",
                    }}
                  />
                </td>
                <td>sinarterangregen</td>
              </tr>
              <tr>
                <td>
                  <img
                    src={Shopee}
                    alt="Shopee"
                    style={{
                      width: 16,
                      height: 16,
                      marginRight: 3,
                      verticalAlign: "middle",
                    }}
                  />
                </td>
                <td>sinarterangregency</td>
              </tr>
              <tr>
                <td>
                  <img
                    src={Blibli}
                    alt="Blibli"
                    style={{
                      width: 16,
                      height: 16,
                      marginRight: 3,
                      verticalAlign: "middle",
                    }}
                  />
                </td>
                <td>sinar-terang-regency</td>
              </tr>
              <tr>
                <td>
                  <img
                    src={Maps}
                    alt="Maps"
                    style={{
                      width: 16,
                      height: 16,
                      marginRight: 3,
                      verticalAlign: "middle",
                    }}
                  />
                </td>
                <td>Toko Sinar Terang</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

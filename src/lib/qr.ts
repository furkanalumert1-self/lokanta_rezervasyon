import QRCode from "qrcode";

export async function generateQRCode(tableId: string, baseUrl: string): Promise<string> {
  const url = `${baseUrl}/qr/${tableId}`;
  const dataUrl = await QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });
  return dataUrl;
}

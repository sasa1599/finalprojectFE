import { ShippingRateResponseNew } from "@/types/cekongkir-types";

export async function CekOngkirApi(
  origin: string, // asal atau alamat toko dalam bentuk kota
  destination: string, // tujuan atau alamat customer dalam bentuk kota
  weight: string, // berat barang
  couriers: string // jasa kurir
): Promise<ShippingRateResponseNew> {
  // fetch ke api express
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/cek-ongkir`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ origin, destination, weight, couriers }),
  });

  // data hasil dari express
  const data: ShippingRateResponseNew = await res.json();

  if (!data) {
    console.log("error api:", data);
    throw new Error(data || "Gagal mendapatkan ongkir");
  }

  return data;
}

interface LocationResponse {
  data?: { id: string }[];
}

interface CostResponse {
  data?: {
    calculate_cargo?: any[];
    calculate_reguler?: any[];
  };
}

export async function CheckPricing(
  postcodeReceiver: number | undefined, // kode pos penerima
  postcodeSender: number | undefined, // kode pos pengirim
  weight: number = 1, // berat barang dalam Kg, default 1
  price: number = 250000 // total harga barang, default 250000
): Promise<CostResponse> {
  // fetch ke api location
  const idLocation1Res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL_BE}/rajaongkir/location?keyword=${postcodeReceiver}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const idLocation2Res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL_BE}/rajaongkir/location?keyword=${postcodeSender}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const originLocation: LocationResponse = await idLocation1Res.json();
  const destinationLocation: LocationResponse = await idLocation2Res.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL_BE}/rajaongkir/cost`,
    {
      method: "POST",
      body: JSON.stringify({
        origin: originLocation?.data?.[0]?.id,
        destination: destinationLocation?.data?.[0]?.id,
        weight,
        price,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  // data hasil dari express
  const data: CostResponse = await res.json();

  if (!data) {
    console.log("error api:", data);
    throw new Error(data || "Gagal mendapatkan ongkir");
  }

  return data;
}

"use client";
import React, { useState } from "react";
import { CekOngkirApi } from "@/services/cek-ongkir/CekOngkirApi";
import Image from "next/image";
import { ShippingRateResponseNew } from "@/types/cekongkir-types";

export default function CekOngkir() {
  const [origin, setOrigin] = useState("cilegon");
  const [destination, setDestination] = useState("jakarta");
  const [weight, setWeight] = useState("1");
  const [couriers, setCouriers] = useState("jne");
  const [isSubmit, setIsSubmit] = useState(false);
  const [result, setResult] = useState<ShippingRateResponseNew | null>(null);
  const [error, setError] = useState<string | null>(null);

  // List Kurir dari BinderByte
  const courierOptions = [
    { code: "jne", name: "JNE" },
    { code: "sicepat", name: "SiCepat" },
    { code: "anteraja", name: "Anteraja" },
    { code: "lion", name: "Lion Parcel" },
    { code: "sap", name: "SAP Express" },
    { code: "pos", name: "POS Indonesia" },
    { code: "ide", name: "ID Express" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmit(true);
    setResult(null);

    try {
      const data = await CekOngkirApi(origin, destination, weight, couriers);
      console.log(data);
      if (data.status == 200) {
        setResult(data);
      } else if (data.status == 400) {
        setError("Courier not found");
      } else if (data.status == 500) {
        setError(
          "An error occurred, courier not found or your connection is not stable."
        );
      }
      setIsSubmit(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        setError(error.message);
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      }
      setIsSubmit(false);
    }
  };

  return (
    <div className="w-full h-screen gap-1 flex justify-center items-center">
      <div className="flex gap-1 mt-10">
        <div className="w-auto h-auto p-10 bg-gray-800 text-center justify-center items-center rounded-md">
          <h1>Cek Ongkir</h1>
          <form
            onSubmit={handleSubmit}
            className="flex mt-4 text-white placeholder:text-white text-start flex-col gap-3"
          >
            <label className="text-sm">
              Asal/alamat toko (dalam bentuk kota)
            </label>
            <input
              className="bg-gray-700 p-2 rounded-sm text-white"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="asal toko .. (city)"
            />

            <label className="text-sm">
              Tujuan/alamat cust (dalam bentuk kota)
            </label>
            <input
              className="bg-gray-700 p-2 rounded-sm text-white"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="alamat pengguna.. (city)"
            />

            <label className="text-sm">Berat Barang (dalam bentuk kg/g)</label>
            <input
              type="number"
              className="bg-gray-700 rounded-sm p-2 text-white"
              value={weight}
              placeholder="berat barang (dalam kg)"
              onChange={(e) => setWeight(String(e.target.value))}
            />

            <label className="text-sm">Pilih Kurir</label>
            <select
              className="bg-gray-700 rounded-sm p-2 text-white"
              value={couriers}
              onChange={(e) => setCouriers(e.target.value)}
            >
              {courierOptions.map((courier) => (
                <option key={courier.code} value={courier.code}>
                  {courier.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={isSubmit}
              className="button p-2 bg-indigo-500"
            >
              {isSubmit ? "fetching.." : "Cek Ongkir"}
            </button>
          </form>
        </div>

        <div className="w-80 h-auto p-10 bg-gray-800 text-center justify-center items-center rounded-md">
          <h1>Contoh Request Berhasil</h1>
          <Image
            src="/success-api-cekongkir.png"
            alt="success response"
            width={400}
            height={400}
          />
          <div className="text-start">
            <h1 className="mt-10">Hasil Request (loop costs) :</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="flex overflow-x-auto h-60 flex-wrap gap-3 mt-3">
              {result?.data?.map((courierData) =>
                courierData.cost.map((costData, index) => (
                  <div
                    key={index}
                    className="h-30 bg-gray-700 p-3 rounded-md gap-2 flex flex-wrap"
                  >
                    <p className="bg-gray-600 p-1 rounded-sm">
                      {courierData.courier}
                    </p>
                    <p className="bg-gray-600 p-1 rounded-sm">
                      Rp{costData.cost}
                    </p>
                    <p className="bg-gray-600 p-1 rounded-sm">{costData.etd}</p>
                  </div>
                ))
              ) || <p className="text-white mt-3">Tidak ada data ongkir.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

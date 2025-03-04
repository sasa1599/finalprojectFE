export interface ShippingRateResponseNew {
  status: number;
  data: {
    courier: string;
    cost: {
      service: string;
      description: string;
      cost: number;
      etd: string;
    }[];
  }[];
}

export interface ShippingCost {
    code: string;
    price: number;
    estimated: string;
    // tambahkan types lain disini untuk memakai variable response dari costs
}
export interface ShippingData {
    costs: ShippingCost[];
}
export interface ValueResponse {
    status: number;
    data: ShippingData;
}

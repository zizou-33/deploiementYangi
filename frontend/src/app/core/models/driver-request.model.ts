export interface DriverRequest {
  id: number;
  status: 'pending' | 'approved' | 'declined';
  motivation: string;
  id_card_number: string;
  car_brand: string;
  car_model: string;
  car_color: string;
  plate_number: string;
}

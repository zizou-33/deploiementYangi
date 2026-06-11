export interface Ride {
  id: number;
  customer: string | number;
  driver: string | number | null;
  pickup_address?: string;
  pickup_location?: string;
  pickup_lat?: number;
  pickup_lng?: number;
  destination_address?: string;
  destination?: string;
  destination_lat?: number;
  destination_lng?: number;
  distance_km?: number;
  price: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface CreateRidePayload {
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
}

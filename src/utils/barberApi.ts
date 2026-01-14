import { AvailabilityRequest, AvailabilityResponse, BarberDetailResponse, BarberResponse, BookingRequest, BookingResponse, CreateRecordInput, CustomerDetail, CustomerRequest, CustomerResponse, ServicesResponse } from '@/interfaces/BookingInterface';
import { apiSquare } from './apiClients';
import { AxiosResponse } from 'axios';
import { CustomerStatus } from '@/interfaces/UserInterface';


// Bentleigh API uses RESTful endpoint structure (different from Oakleigh)
export const getAllService = async (filter: string, type: string): Promise<ServicesResponse> => {
  const response: AxiosResponse<ServicesResponse> = await apiSquare.get(`/services?filter=${filter}&type=${type}`);
  return response.data;
};

export const getAllBarber = async (): Promise<BarberResponse> => {
  const response: AxiosResponse<BarberResponse> = await apiSquare.get('/barbers');
  return response.data;
};

export const getBarberDetail = async (barber_id: string): Promise<BarberDetailResponse> => {
  const response: AxiosResponse<BarberDetailResponse> = await apiSquare.get(`/barbers/${barber_id}`);
  return response.data;
};

export const getAvailability = async (data: AvailabilityRequest): Promise<AvailabilityResponse> => {
  const response: AxiosResponse<AvailabilityResponse> = await apiSquare.post('/availability', data);
  return response.data;
};

export const postCustomer = async (data: CustomerRequest): Promise<CustomerResponse> => {
  const response: AxiosResponse<CustomerResponse> = await apiSquare.post('/customers', data);
  return response.data;
};

export const postBooking = async (data: BookingRequest, bookFrom: string): Promise<BookingResponse> => {
  const response: AxiosResponse<BookingResponse> = await apiSquare.post(`/bookings?source=${bookFrom}`, data);
  return response.data;
};

export const getCustomerStatusByEmailAndPhone = async (email: string, phone: string): Promise<CustomerStatus> => {
  const response: AxiosResponse<CustomerStatus> = await apiSquare.get(`/customers/status?email=${email}&phone=${phone}`);
  return response.data;
};

export const getCustomerByEmailAndPhone = async (email: string, phone: string): Promise<CustomerDetail> => {
  const response: AxiosResponse<CustomerDetail> = await apiSquare.get(`/customers/search?email=${email}&phone=${phone}`);
  return response.data;
};

export const postUtmRecord = async (data: CreateRecordInput): Promise<CreateRecordInput> => {
  // Note: Bentleigh API doesn't have UTM record endpoint yet
  // This function is kept for compatibility but will need backend implementation
  console.warn('postUtmRecord: Endpoint not implemented in Bentleigh API');
  return data; // Return input data as fallback
};


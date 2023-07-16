import axios from 'axios';
import queryString from 'query-string';
import { PrintingRequestInterface, PrintingRequestGetQueryInterface } from 'interfaces/printing-request';
import { GetQueryInterface } from '../../interfaces';

export const getPrintingRequests = async (query?: PrintingRequestGetQueryInterface) => {
  const response = await axios.get(`/api/printing-requests${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPrintingRequest = async (printingRequest: PrintingRequestInterface) => {
  const response = await axios.post('/api/printing-requests', printingRequest);
  return response.data;
};

export const updatePrintingRequestById = async (id: string, printingRequest: PrintingRequestInterface) => {
  const response = await axios.put(`/api/printing-requests/${id}`, printingRequest);
  return response.data;
};

export const getPrintingRequestById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/printing-requests/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePrintingRequestById = async (id: string) => {
  const response = await axios.delete(`/api/printing-requests/${id}`);
  return response.data;
};

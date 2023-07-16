import axios from 'axios';
import queryString from 'query-string';
import { QuotationInterface, QuotationGetQueryInterface } from 'interfaces/quotation';
import { GetQueryInterface } from '../../interfaces';

export const getQuotations = async (query?: QuotationGetQueryInterface) => {
  const response = await axios.get(`/api/quotations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createQuotation = async (quotation: QuotationInterface) => {
  const response = await axios.post('/api/quotations', quotation);
  return response.data;
};

export const updateQuotationById = async (id: string, quotation: QuotationInterface) => {
  const response = await axios.put(`/api/quotations/${id}`, quotation);
  return response.data;
};

export const getQuotationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/quotations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteQuotationById = async (id: string) => {
  const response = await axios.delete(`/api/quotations/${id}`);
  return response.data;
};

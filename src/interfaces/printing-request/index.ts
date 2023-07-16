import { QuotationInterface } from 'interfaces/quotation';
import { CustomerInterface } from 'interfaces/customer';
import { GetQueryInterface } from 'interfaces';

export interface PrintingRequestInterface {
  id?: string;
  details: string;
  customer_id: string;
  created_at?: any;
  updated_at?: any;
  quotation?: QuotationInterface[];
  customer?: CustomerInterface;
  _count?: {
    quotation?: number;
  };
}

export interface PrintingRequestGetQueryInterface extends GetQueryInterface {
  id?: string;
  details?: string;
  customer_id?: string;
}

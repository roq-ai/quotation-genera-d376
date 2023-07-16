import { PrintingRequestInterface } from 'interfaces/printing-request';
import { GetQueryInterface } from 'interfaces';

export interface QuotationInterface {
  id?: string;
  estimate: number;
  printing_request_id: string;
  created_at?: any;
  updated_at?: any;

  printing_request?: PrintingRequestInterface;
  _count?: {};
}

export interface QuotationGetQueryInterface extends GetQueryInterface {
  id?: string;
  printing_request_id?: string;
}

import * as yup from 'yup';

export const quotationValidationSchema = yup.object().shape({
  estimate: yup.number().integer().required(),
  printing_request_id: yup.string().nullable().required(),
});

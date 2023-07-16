import * as yup from 'yup';

export const printingRequestValidationSchema = yup.object().shape({
  details: yup.string().required(),
  customer_id: yup.string().nullable().required(),
});

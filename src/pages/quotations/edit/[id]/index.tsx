import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getQuotationById, updateQuotationById } from 'apiSdk/quotations';
import { Error } from 'components/error';
import { quotationValidationSchema } from 'validationSchema/quotations';
import { QuotationInterface } from 'interfaces/quotation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { PrintingRequestInterface } from 'interfaces/printing-request';
import { getPrintingRequests } from 'apiSdk/printing-requests';

function QuotationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<QuotationInterface>(
    () => (id ? `/quotations/${id}` : null),
    () => getQuotationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: QuotationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateQuotationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/quotations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<QuotationInterface>({
    initialValues: data,
    validationSchema: quotationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Quotation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="estimate" mb="4" isInvalid={!!formik.errors?.estimate}>
              <FormLabel>Estimate</FormLabel>
              <NumberInput
                name="estimate"
                value={formik.values?.estimate}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('estimate', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.estimate && <FormErrorMessage>{formik.errors?.estimate}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<PrintingRequestInterface>
              formik={formik}
              name={'printing_request_id'}
              label={'Select Printing Request'}
              placeholder={'Select Printing Request'}
              fetcher={getPrintingRequests}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.details}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'quotation',
    operation: AccessOperationEnum.UPDATE,
  }),
)(QuotationEditPage);

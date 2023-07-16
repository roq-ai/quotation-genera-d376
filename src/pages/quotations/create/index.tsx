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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createQuotation } from 'apiSdk/quotations';
import { Error } from 'components/error';
import { quotationValidationSchema } from 'validationSchema/quotations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { PrintingRequestInterface } from 'interfaces/printing-request';
import { getPrintingRequests } from 'apiSdk/printing-requests';
import { QuotationInterface } from 'interfaces/quotation';

function QuotationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: QuotationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createQuotation(values);
      resetForm();
      router.push('/quotations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<QuotationInterface>({
    initialValues: {
      estimate: 0,
      printing_request_id: (router.query.printing_request_id as string) ?? null,
    },
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
            Create Quotation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(QuotationCreatePage);

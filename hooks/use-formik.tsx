import { useFormik } from "formik";
import * as yup from "yup";

interface UseFormHandlerProps<T extends Record<string, any>> {
  initialValues: T;
  validationSchema: yup.ObjectSchema<any>;
  onSubmit: (data: T) => void;
}

export const useFormHandler = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormHandlerProps<T>) => {
  const form = useFormik<T>({
    initialValues,
    enableReinitialize: true,
    onSubmit,
    validateOnChange: true,
    validationSchema,
  });

  const isDisabled = !form.isValid || !form.dirty;

  return { form, isDisabled };
};
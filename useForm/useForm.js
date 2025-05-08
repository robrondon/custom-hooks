import { useCallback, useEffect, useState } from "react";

export const useForm = (initialForm = {}, formValidations = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const validateForm = useCallback(() => {
    if (!formValidations || Object.keys(formValidations).length === 0) return;
    const errors = {}
    let valid = true

    for (const field in formValidations) {
      const validations = formValidations[field]
      for (const [fn, errorMessage] of validations) {
        const value = formState[field] || ''
        const isValid = fn(value)
        if (!isValid) {
          errors[field] = errorMessage
          valid = false
          break
        }
      }
    }

    setFormErrors(errors);
    setIsFormValid(valid);

  }, [formState, formValidations])

  const onInputChange = ({ target }) => {
    const { name, value } = target
    setFormState(prev => ({ ...prev, [name]: value }));
  }

  const onInputBlur = ({ target }) => {
    const { name } = target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const onResetForm = () => {
    setFormState(initialForm)
    setFormErrors({});
    setIsFormValid(false);
    setTouchedFields({});
  }

  useEffect(() => {
    validateForm()
  }, [formState, validateForm]);

  return {
    ...formState,
    formErrors,
    formState,
    isFormValid,
    onInputBlur,
    onInputChange,
    onResetForm,
    touchedFields
  }
}

export const buildFormData = (values: Record<string, any>): FormData => {
  const formData = new FormData();

  const buildFormDataInner = (values: Record<string, any>, objKey = '') => {
    Object.keys(values).forEach((key) => {
      const finalKey = objKey ? `${objKey}[${key}]` : key;
      const finalValues = values[key];

      if (Array.isArray(finalValues)) {
        finalValues.forEach((value: any) => {
          formData.append(`${finalKey}[]`, value?._id || value)
        })
        return;
      }

      if (typeof (finalValues) === 'object' && typeof finalValues.getMonth !== 'function' && finalValues?._id === undefined && finalValues?.lastModified === undefined) {
        buildFormDataInner(finalValues, finalKey);
        return;
      }

      formData.append(finalKey, finalValues?._id || finalValues)
    })
  }

  buildFormDataInner(values)

  return formData;
}
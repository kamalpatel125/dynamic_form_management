import React, { useEffect, useState } from 'react'

import { FormManagement } from '../FormManagement/FormManagement'
import { formDemoMetadata } from './FormDemoMetadata'

export const FormDemo = () => {
  const [initialValues, setInitialValues] = React.useState({
    firstName: 'Kamal',
    lastName: 'Patel'
  });

  const [dynamicOptions, setDynamicOptions] = useState({});

  const handleOnSubmit = (data: any) => {
    console.log('Form submitted with data:', data)
  }

  useEffect(() => {
    const fetchInitialValues = async () => {
      setTimeout(() => {
        setInitialValues((prev) => ({
          ...prev,
          email: "kamalpatel125@gmail.com",
        }))
      }, 1000);
      
      setTimeout(() => {
        setDynamicOptions((prev) => ({
          ...prev,
          country: [
            { value: 'US', label: 'United States' },
            { value: 'UK', label: 'United Kingdom' },
            { value: 'IN', label: 'India' },
            { value: 'JPN', label: 'Japan' },
          ],
        }))
      }, 1000);
    }
    fetchInitialValues()
  }, []);

  return (
    <FormManagement
      metadata={formDemoMetadata}
      onSubmit={handleOnSubmit}
      initialValues={initialValues}
      dynamicOptionsFromParent={dynamicOptions}
    />
  )
}



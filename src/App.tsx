import React, { use, useEffect, useState } from 'react'
import './App.css'
import { DynamicForm } from './DynamicForm'
import { complexMetadata } from './FormMetadata'

function App() {
  // Custom slider component

  const [initialValues, setInitialValues] = React.useState({
    firstName: 'Kamal',
    lastName: 'Patel'
  });

  const [dynamicOptions, setDynamicOptions] = useState({});

  const handleOnSubmit = (data: any) => {
    console.log('Form submitted with data:', data)
  }

  useEffect(() => {
    // Simulate fetching initial values from an API
    const fetchInitialValues = async () => {
      setTimeout(() => {
        setInitialValues((prev) => ({
          ...prev,
          email: "kamalpatel125@gmail.com",
          country: [
              { value: 'US', label: 'United States' },
              { value: 'UK', label: 'United Kingdom' },
              { value: 'IN', label: 'India' },
            ],
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
    <>
      <h1>Vite + React</h1>
      <DynamicForm
        metadata={complexMetadata}
        onSubmit={handleOnSubmit}
        initialValues={initialValues}
        dynamicOptionsFromParent={dynamicOptions}
      />
    </>
  )
}

export default App;

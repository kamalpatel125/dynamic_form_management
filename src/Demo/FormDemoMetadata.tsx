import { FormMetadata } from "../FormManagement/FormManagement";

export const formDemoMetadata: FormMetadata = {
  fields: [
    {
      id: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      validations: { minLength: 2, maxLength: 50, pattern: /^[A-Za-z]+$/ },
    },
    {
      id: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      validations: { minLength: 2, maxLength: 50, pattern: /^[A-Za-z]+$/ },
    },
    {
      id: 'email',
      label: 'Email',
      type: 'text',
      required: true,
      validations: { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    },
    {
      id: 'password',
      label: 'Password',
      type: 'text',
      required: true,
      validations: { minLength: 8 },
    },
    {
      id: 'confirmPassword',
      label: 'Confirm Password',
      type: 'text',
      required: true,
      validations: {
        custom: (value, formData: any) => (value === formData.password ? true : 'Passwords must match'),
      },
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      validations: { greaterThan: 18, lessThan: 100 },
    },
    {
      id: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },
    {
      id: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      // options: [
      //   { value: 'US', label: 'United States' },
      //   { value: 'UK', label: 'United Kingdom' },
      //   { value: 'IN', label: 'India' },
      // ],
    },
    {
      id: 'state',
      label: 'State',
      type: 'select',
      required: (formData) => formData.country === 'US', // ✅ Required only if Country is US
      dependencies: [
        { field: 'country', condition: 'equals', value: 'US' }, // ✅ Only visible if Country is US
      ],
      dynamicOptions: {
        promise: async (formData) => {
          if (formData.country === 'US') {
            return [
              { value: 'NY', label: 'New York' },
              { value: 'CA', label: 'California' },
            ];
          }
          return [];
        },
      },
    },
    {
      id: 'city',
      label: 'City',
      type: 'select',
      required: true,
      dependencies: [
        { field: 'state', condition: 'exists' }, // Only appears if State is selected
      ],
      dynamicOptions: {
        promise: async (formData) => {
          if (formData.state === 'NY') {
            return [{ value: 'NYC', label: 'New York City' }];
          } else if (formData.state === 'CA') {
            return [{ value: 'LA', label: 'Los Angeles' }];
          }
          return [];
        },
      },
    },
    {
      id: 'terms',
      label: 'Agree to Terms',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'resume',
      label: 'Upload Resume',
      type: 'file',
      required: true,
    },
    {
      id: 'portfolioLink',
      label: 'Portfolio URL',
      type: 'text',
      validations: { pattern: /^(https?:\/\/[^\s]+)$/ },
    },
    {
      id: 'customField',
      label: 'Custom Component',
      type: 'custom',
      customComponent: ({ value, onChange }) => (
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} />
      ),
    },
  ],
};




import { useState } from 'react';

const useForm = (callback, initState = {}) => {
  const [inputs, setInputs] = useState(initState);
  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault(); // Stop page reload
    }
    callback(inputs); // Pass form data to parent
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value, // Dynamic key update
    }));
  };

  return {
    inputs,
    handleInputChange,
    handleSubmit,
    reset: () => setInputs(initState),
  };
};

export default useForm;
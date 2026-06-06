import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { apiInstancePrivate } from '../../Utils/AxiosInstance';
import { showSnackbar } from '../Utils/enQueSnackBar';

function CustomEnrollment() {
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    // Fetch users
    apiInstancePrivate.get("/api/v1/course-access/fetchObj")
      .then((response) => {
        console.log(response.data.user);
        setUsers(response.data.user); // Store user data in state
        setCourses(response.data.courses); // Store course data in state
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    
  }, []);

  const getUserOptions = () => {
    return users.map(user => ({ value: user._id, label: user.firstName +" | " + user.email}));
  };

  const getCourseOptions = () => {
    return courses.map(course => ({ value: course._id, label: course.courseTitle }));
  };


  const formConfig = [
    { name: 'User name', label: 'User name', type: 'dropdown', placeholder: 'Select username', options: getUserOptions() },
    { name: 'Is All Course Subscribed', label: 'Is All Course Subscribed', type: 'dropdown', placeholder: 'Is All Course Subscribed', options: [{value:true,label:"Yes"},{value:false,label:"No"}] },
    { name: 'Course', label: 'Courses', type: 'dropdown', placeholder: 'Select Courses', options: getCourseOptions(), multiple: true },
    // { name: 'Amount', label: 'amount', type: 'number', placeholder: 'Enter amount' },
    { name: 'Payment Id', label: 'Payment Id', type: 'text', placeholder: 'Enter Payment Id' }
  ];

  const handleChange = (value, fieldName) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    apiInstancePrivate.post("/api/v1/course-access/addObj",formData).then((response) => {
        showSnackbar("Course access granted successfully","success","top");
        window.location.reload();
      }).catch((error) => {
        // Handle error
        console.error("Error:");
      }).finally((response) => {
       
  
      });
  };

  return (
    <>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <form onSubmit={handleSubmit}>
        {formConfig.map((field, index) => (
  <div key={index} className="-mx-3 md:flex mb-6">
    <div className="md:w-screen px-3 mb-6 md:mb-0">
      
      {field.name === 'Course' && formData['Is All Course Subscribed'] ? null : (
        <>
        <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor={`grid-${field.name}`}>
        {field.label}
      </label>
          {field.type === 'dropdown' ? (
            <Select
              options={field.options}
              placeholder={field.placeholder}
              onChange={(selectedOption) => handleChange(selectedOption.value, field.name)}
              required={!(field.name === 'Course' && formData['Is All Course Subscribed'])}
            />
          ) : field.type === 'select' ? (
            <Select
              options={field.options}
              isMulti={field.multiple}
              placeholder={field.placeholder}
              onChange={(selectedOption) => handleChange(selectedOption.map(option => option.value), field.name)}
            />
          ) : (
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
              name={field.name}
              id={`grid-${field.name}`}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(e.target.value, field.name)}
              required
            />
          )}
        </>
      )}
      {field.name === 'firstName' && <p className="text-red text-xs italic">Please fill out this field.</p>}
    </div>
  </div>
))}

          <div className="md:w-screen px-3 mb-6 md:mb-0">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CustomEnrollment;

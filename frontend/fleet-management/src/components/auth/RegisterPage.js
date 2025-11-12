import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import axios from 'axios';

const RegisterPage = () => {
  const [registrationType, setRegistrationType] = useState('newCompany');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = registrationType === 'newCompany' 
        ? { companyName, contactEmail, companyCode }
        : { employeeName, employeeEmail, employeePassword };

      const response = await axios.post('http://localhost:3001/users', data);

      console.log('User registered:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: 'url(/images/raivis-razgals-ostLWBW4hsw-unsplash.jpg)' }}
    >
      <div className="bg-white bg-opacity-60 backdrop-blur-md p-8 max-w-md w-full rounded-lg shadow-lg">
        <h4 className="text-center text-2xl font-bold mb-4">Register</h4>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Registration Type</FormLabel>
          <RadioGroup
            row
            value={registrationType}
            onChange={(e) => setRegistrationType(e.target.value)}
          >
            <FormControlLabel value="newCompany" control={<Radio />} label="New Company" />
            <FormControlLabel value="employee" control={<Radio />} label="Employee" />
          </RadioGroup>
        </FormControl>
        <form onSubmit={handleSubmit}>
          {registrationType === 'newCompany' ? (
            <>
              <TextField
                label="Company Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <TextField
                label="Contact Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="mt-2"
              >
                Request Quote
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Employee Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
              <TextField
                label="Employee Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={employeePassword}
                onChange={(e) => setEmployeePassword(e.target.value)}
              />
              <TextField
                label="Company Code"
                variant="outlined"
                fullWidth
                margin="normal"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="mt-2"
              >
                Register
              </Button>
            </>
          )}
        </form>
        <div className='mt-2'>
        <Button
          variant="outlined"
          fullWidth
          className="mt-2"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
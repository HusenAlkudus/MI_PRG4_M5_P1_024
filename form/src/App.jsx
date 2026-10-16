import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import SubmittedData from './components/SubmittedData';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Icon dari Bootstrap
import './App.css';

const App = () => {
  const [submitted, setSubmitted] = useState(null);
  // Mengubah key akan me-reset (mount ulang) form beserta semua inputannya
  const [formKey, setFormKey] = useState(0);

  const handleClear = () => {
    setSubmitted(null);
    setFormKey((k) => k + 1);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to the Registration Page</h1>

      <div className="card shadow p-4">
        <div className="bg-primary text-white text-center fw-semibold fs-5 py-2 rounded mb-4">
          Registration
        </div>

        <div className="row justify-content-center g-4">
          <div className="col-lg-5 col-md-6">
            <RegistrationForm key={formKey} onSubmit={setSubmitted} />
          </div>
          <div className="col-lg-4 col-md-6">
            <SubmittedData data={submitted} onClear={handleClear} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
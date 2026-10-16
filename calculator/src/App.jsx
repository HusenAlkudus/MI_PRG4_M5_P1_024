import React from 'react';
import Calculator from './components/Calculator';
import 'bootstrap/dist/css/bootstrap.min.css'; // Pastikan Bootstrap diimpor
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="row justify-content-center">
        <div className="col-md-12 text-center">
          <h1>Kalkulator Sederhana</h1>
          <Calculator />
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';

function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Menghandle perubahan input
  const handleInputChange = (e) => {
    const value = e.target.value;
    const validPattern = /^[0-9+\-*/]*$/; // Regex untuk angka dan operator tanpa spasi

    if (validPattern.test(value)) {
      setInput(value);
      setErrorMessage('');
    } else {
      setErrorMessage('Input hanya boleh berupa angka dan operator (+, -, *, /)');
    }
  };

  // Fungsi untuk melakukan perhitungan berdasarkan operator
  const calculate = () => {
    try {
      // Regex untuk mengekstrak angka dan operator
      const pattern = /(\d+)([+\-*/])(\d+)/;
      const match = input.match(pattern);

      if (match) {
        const operand1 = parseFloat(match[1]);
        const operator = match[2];
        const operand2 = parseFloat(match[3]);

        let calculationResult;

        // Gunakan switch-case untuk operasi
        switch (operator) {
          case '+':
            calculationResult = operand1 + operand2;
            break;
          case '-':
            calculationResult = operand1 - operand2;
            break;
          case '*':
            calculationResult = operand1 * operand2;
            break;
          case '/':
            if (operand2 === 0) {
              throw new Error('Tidak bisa membagi dengan nol!');
            }
            calculationResult = operand1 / operand2;
            break;
          default:
            throw new Error('Operator tidak valid!');
        }

        setResult(calculationResult);
      } else {
        throw new Error('Input tidak valid! Gunakan format: angka operator angka');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setResult('');
    }
  };

  // Menghapus input dan hasil
  const clear = () => {
    setInput('');
    setResult('');
    setErrorMessage('');
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: '400px', padding: '20px' }}>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Masukkan operasi (contoh: 23+4, 4*1)"
          value={input}
          onChange={handleInputChange}
        />
      </div>
      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}
      <button
        className="btn btn-primary btn-block mb-3"
        onClick={calculate}
        disabled={errorMessage !== '' || input === ''}
      >
        Hitung
      </button>
      <button
        className="btn btn-danger btn-block mb-3"
        onClick={clear}
      >
        Bersihkan
      </button>
      {result !== '' && (
        <div className="alert alert-info">
          <strong>Hasil: </strong>{result}
        </div>
      )}
    </div>
  );
}

export default Calculator;
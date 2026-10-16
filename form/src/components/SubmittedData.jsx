import React from 'react';

const items = [
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'password', label: 'Password' },
  { key: 'rePassword', label: 'Re-Password' },
  { key: 'birthPlace', label: 'Tempat Lahir' },
  { key: 'birthDate', label: 'Tanggal Lahir' },
];

const SubmittedData = ({ data, onClear }) => {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h6 className="text-center mb-4">Submitted Data:</h6>
        <ul className="list-group mb-3">
          {items.map(({ key, label }) => (
            <li className="list-group-item small" key={key}>
              <strong>{label}:</strong>{' '}
              {data && data[key] ? (
                data[key]
              ) : (
                <span className="text-danger">Not submitted yet</span>
              )}
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-danger w-100" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default SubmittedData;
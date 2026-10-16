import React, { useState, useRef } from 'react';

const initialData = {
  username: '',
  email: '',
  password: '',
  rePassword: '',
  birthPlace: '',
  birthDate: '',
};

// Konfigurasi field: label, tipe input, dan icon dari Bootstrap Icons
const fields = [
  { name: 'username', label: 'Username', type: 'text', icon: 'bi-person' },
  { name: 'email', label: 'Email', type: 'email', icon: 'bi-envelope' },
  { name: 'password', label: 'Password', type: 'password', icon: 'bi-lock' },
  { name: 'rePassword', label: 'Re-Password', type: 'password', icon: 'bi-lock' },
  { name: 'birthPlace', label: 'Tempat Lahir', type: 'text', icon: 'bi-geo-alt' },
  {
    name: 'birthDate',
    label: 'Tanggal Lahir',
    type: 'text',
    icon: 'bi-calendar-event',
    placeholder: 'dd/mm/yyyy',
    maxLength: 10,
    inputMode: 'numeric',
  },
];

// Mengubah input angka menjadi format dd/mm/yyyy secara otomatis
const formatDateInput = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

// dd/mm/yyyy -> yyyy-mm-dd (format yang dipakai panel kalender), '' jika belum lengkap
const toIsoDate = (v) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
};

// Tanggal hari ini (yyyy-mm-dd) untuk membatasi pilihan di kalender
const todayIso = () => {
  const t = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
};

// Aturan validasi tiap field. Mengembalikan pesan error, atau '' jika valid.
const validators = {
  username: (v) => {
    if (!v.trim()) return 'Username is required';
    if (v.trim().length < 5) return 'Username must be at least 5 characters long';
    if (!/^[A-Za-z\s]+$/.test(v)) return 'Username can only contain letters and spaces';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Email is invalid';
    return '';
  },
  password: (v) => {
    if (!v) return 'Password is required';
    const valid =
      v.length >= 8 &&
      /[A-Z]/.test(v) &&
      /[a-z]/.test(v) &&
      /[0-9]/.test(v) &&
      /[^A-Za-z0-9]/.test(v);
    if (!valid) {
      return 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol';
    }
    return '';
  },
  rePassword: (v, data) => {
    if (!v) return 'Re-password is required';
    if (v !== data.password) return 'Passwords must match';
    return '';
  },
  birthPlace: (v) => (!v.trim() ? 'Birth place is required' : ''),
  birthDate: (v) => {
    if (!v) return 'Birth date is required';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return 'Birth date must be in dd/mm/yyyy format';

    const [d, m, y] = v.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    const exists =
      y >= 1900 &&
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d;
    if (!exists) return 'Birth date is invalid';
    if (date > new Date()) return 'Birth date cannot be in the future';
    return '';
  },
};

const RegistrationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef({});
  const datePickerRef = useRef(null);

  // Validasi satu field, hasilnya langsung dimasukkan ke state errors
  const applyError = (prevErrors, name, data) => {
    const next = { ...prevErrors };
    const message = validators[name](data[name], data);
    if (message) next[name] = message;
    else delete next[name];
    return next;
  };

  // Mengisi satu field + validasi langsung (tanpa menekan tombol Register)
  const updateField = (name, value) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    setSuccess(false);

    setErrors((prev) => {
      let next = applyError(prev, name, newData);
      // Jika password diubah, cocokkan ulang Re-Password yang sudah terisi
      if (name === 'password' && newData.rePassword !== '') {
        next = applyError(next, 'rePassword', newData);
      }
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, name === 'birthDate' ? formatDateInput(value) : value);
  };

  // Tanggal dipilih dari panel kalender (yyyy-mm-dd) -> ditulis sebagai dd/mm/yyyy
  const handlePickDate = (e) => {
    const iso = e.target.value;
    if (!iso) return;
    const [y, m, d] = iso.split('-');
    updateField('birthDate', `${d}/${m}/${y}`);
  };

  // Membuka panel kalender bawaan browser
  const openCalendar = () => {
    const el = datePickerRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') el.showPicker();
    else el.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi semua field sekaligus
    let allErrors = {};
    fields.forEach(({ name }) => {
      allErrors = applyError(allErrors, name, formData);
    });
    setErrors(allErrors);

    const firstErrorField = fields.find(({ name }) => allErrors[name]);
    if (firstErrorField) {
      setSuccess(false);
      inputRefs.current[firstErrorField.name]?.focus();
      return;
    }

    onSubmit(formData);
    setSuccess(true);
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h6 className="text-center mb-4">Registration Form</h6>
        <form onSubmit={handleSubmit} noValidate>
          {fields.map(({ name, label, type, icon, placeholder, maxLength, inputMode }) => (
            <div className="row mb-3" key={name}>
              <label htmlFor={name} className="col-sm-4 col-form-label small">
                {label}
              </label>
              <div className="col-sm-8 position-relative">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className={`bi ${icon}`}></i>
                  </span>
                  <input
                    type={type}
                    className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                    id={name}
                    name={name}
                    ref={(el) => (inputRefs.current[name] = el)}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    inputMode={inputMode}
                    autoComplete={type === 'password' ? 'new-password' : 'off'}
                  />
                  {name === 'birthDate' && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={openCalendar}
                      title="Pilih tanggal"
                      aria-label="Pilih tanggal dari kalender"
                    >
                      <i className="bi bi-calendar3"></i>
                    </button>
                  )}
                </div>

                {/* Input date tersembunyi: hanya dipakai untuk memunculkan panel kalender */}
                {name === 'birthDate' && (
                  <input
                    type="date"
                    ref={datePickerRef}
                    value={toIsoDate(formData.birthDate)}
                    onChange={handlePickDate}
                    min="1900-01-01"
                    max={todayIso()}
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                      opacity: 0,
                      border: 0,
                      padding: 0,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {errors[name] && (
                  <div className="invalid-feedback d-block">{errors[name]}</div>
                )}
              </div>
            </div>
          ))}

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>

          {success && (
            <div className="alert alert-success mt-3 mb-0 py-2 small" role="alert">
              Registration successful!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
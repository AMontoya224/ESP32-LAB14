import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [device, setDevice] = useState(false);
  const [ledGreenStatus, setLedGreenStatus] = useState(false);
  const [ledRedStatus, setLedRedStatus] = useState(false);
  const [potValue, setPotValue] = useState(0);
  const [servoAngle, setServoAngle] = useState(94);
  const ESP32_IP = 'http://192.168.85.196';

  const handleRoot = () => {
    axios.get(`${ESP32_IP}/`)
      .then(() => {
        setLedGreenStatus(false);
        setLedRedStatus(false);
        setDevice(true);
        setServoAngle(94)
      })
      .catch(error => {
        setDevice(false);
        console.error('Error:', error);
      });
  };

  const handleLed = (led, e) => {
    let status = 'OFF';
    if(e.target.checked){
      status = 'ON';
    }
    else{
      status = 'OFF';
    }
    axios.get(`${ESP32_IP}/LED/${led}/${status}`)
      .then(() => {
        if(led === 'GREEN'){
          setLedGreenStatus(status === 'ON' ? true : false);
        }
        else{
          setLedRedStatus(status === 'ON' ? true : false);
        }
        setDevice(true);
      })
      .catch(error => {
        setDevice(false);
        console.error('Error:', error);
      });
  };

  const readSensor = () => {
    axios.get(`${ESP32_IP}/POT`)
      .then(response => {
        setPotValue(response.data);
        setDevice(true);
      })
      .catch(error => {
        setDevice(false);
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    const interval = setInterval(readSensor, 500);
    return () => clearInterval(interval);
  }, []);
  
  const writeServo = (angle) => {
    axios.get(`${ESP32_IP}/SERVO?angle=${angle}`)
      .then(() => {
        setDevice(true);
      })
      .catch(error => {
        setDevice(false);
        console.error('Error:', error);
      });
  };

  return (
    <div className='App'>
      <header>
        <div>
          <b>Device</b>
          <div>
            <div className={device ? 'success' : 'danger'}></div>
            <p>{device ? 'online' : 'offline'}</p>
          </div>
        </div>
        <button onClick={handleRoot}>ROOT</button>
        <div></div>
      </header>
      <main>
        <div className='widget'>
          <p>El LED VERDE está: {ledGreenStatus}</p>
          <div className='toggle'>
            <input type='checkbox' id='green' onClick={(e) => handleLed('GREEN', e)} checked={ledGreenStatus}/>
            <label for='green'></label>
          </div>
        </div>
        <div className='widget'>
          <p>El LED ROJO está: {ledRedStatus}</p>
          <div className='toggle'>
            <input type='checkbox' id='red' onClick={(e) => handleLed('RED', e)} checked={ledRedStatus}/>
            <label for='red'></label>
          </div>
        </div>
        <div className='widget'>
          <p>Valor del Potenciómetro:</p>
          <h1>{potValue}</h1>
        </div>
        <div className='widget'>
          <p>Servomotor se mueve a:</p>
          <div className='row'>
            <input type='number' value={servoAngle} onChange={(e) => setServoAngle(e.target.value)} min='0' max='180'/>
            <button onClick={() => writeServo(servoAngle)}>Move</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
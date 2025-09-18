import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useState } from 'react'
import Login from './components/Login';
import MultiStepForm from './components/MultiStepForm';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div className="form-container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return children;
};

function App() {
  const [values, setValues] = useState({
    fullname: '',
    email: '',
    phonenumber: '',
    address: '',
    nationality: '',
    language: '',
    subject: '',
    cv: '',
    linkedin: ''
  })
  const handleChanges = (e) => {
    setValues({...values, [e.target.name]:[e.target.value]})
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(values)
  }
  const handleReset = () => {
    setValues({
      fullname: '',
      email: '',
      phonenumber: '',
      address: '',
      nationality: '',
      language: '',
      subject: '',
      cv: '',
      linkedin: ''
    })
  }
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Personal Information Form Challenge</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <MultiStepForm />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

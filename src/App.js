import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Personal Information Form Challenge</h1>
          </header>
          <main>
            <form>
              <label htmlFor="fullname">Full Name*</label>
              <input type="text" placeholder="Your answer" name="fullname"/>
    
              <label htmlFor="email">Email*</label>
              <input type="email" placeholder="Your answer" name="email"/>
    
              <label htmlFor="phonenumber">Phone Number*</label>
              <input type="text" placeholder="Your answer" name="phonenumber"/>
    
              <label htmlFor="address">Full Address*</label>
              <input type="text" placeholder="Your answer" name="address"/>
    
              <label htmlFor="nationality">Nationality*</label>
              <input type="text" placeholder="Your answer" name="nationality"/>
    
              <label htmlFor="language">Preferred Language</label>
              <input type="text" placeholder="Your answer" name="language"/>

              <label hmtFor="subject">Research Interests</label>
              <select name="subject" id="subject">
                <option value="abio">Animal Sciences (ABIO)</option>
                <option value="beha">Behavioral Sciences (BEHA)</option>
                <option value="bchm">Biochemistry (BCHM)</option>
                <option value="mbio">Cellular and Molecular Biology (MBIO)</option>
                <option value="chem">Chemistry (CHEM)</option>
                <option value="comp">Computer Sciences (COMP)</option>
                <option value="elec">Electrical Engineering (ELEC)</option>
                <option value="envr">Environmental Sciences (ENVR)</option>
                <option value="mats">Material Science (MATS)</option>
                <option value="math">Mathematics (MATH)</option>
                <option value="mech">Mechanical Engineering (MECH)</option>
                <option value="neur">Neuroscience (NEUR)</option>
                <option value="phys">Physics and Astronomy (PHYS)</option>
                <option value="sust">Sustainable Energy (SUST)</option>
                <option value="othr">Other</option>
              </select>

              <label htmlFor="cv">CV (one-page)*</label>
              <input type="file" placeholder="Select File" name="cv"/>
    
              <label htmlFor="language">LinkedIn URL</label>
              <input type="text" placeholder="Your answer" name="linkedin"/>

              <button type="button">Reset</button>
              <button type="submit>Submit</button>

              
            <\form>
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

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
    setValues({...Values, [e.target.name]:[e.target.value]})
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
            <form onSubmit={handleSubmit}>
              <label htmlFor="fullname">Full Name*</label>
              <input type="text" placeholder="Your answer" name="fullname"
              onChange={(e) => handleChanges(e)} required value={values.firstname}/>
    
              <label htmlFor="email">Email*</label>
              <input type="email" placeholder="Your answer" name="email"
              onChange={(e) => handleChanges(e)} required value={values.email}/>
    
              <label htmlFor="phonenumber">Phone Number*</label>
              <input type="text" placeholder="Your answer" name="phonenumber"
              onChange={(e) => handleChanges(e)} required value={values.phonenumber}/>
    
              <label htmlFor="address">Full Address*</label>
              <input type="text" placeholder="Your answer" name="address"
              onChange={(e) => handleChanges(e)} required value={values.address}/>
    
              <label htmlFor="nationality">Nationality*</label>
              <input type="text" placeholder="Your answer" name="nationality"
              onChange={(e) => handleChanges(e)} required value={values.nationality}/>
    
              <label htmlFor="language">Preferred Language</label>
              <input type="text" placeholder="Your answer" name="language"
              onChange={(e) => handleChanges(e)} required value={values.language}/>

              <label hmtFor="subject">Research Interests</label>
              <select name="subject" id="subject" onChange={(e) => handleChanges(e)}/>
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
              <input type="file" placeholder="Select File" name="cv"
              onChange={(e) => handleChanges(e)} required value={values.cv}/>
    
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input type="text" placeholder="Your answer" name="linkedin"
              onChange={(e) => handleChanges(e)}/>

              <button type="button" onClick={handleReset}>Reset</button>
              <button type="submit">Submit</button>
                
            <\form>
            // <Routes>
            //   <Route path="/" element={
            //     <ProtectedRoute>
            //       <MultiStepForm />
            //     </ProtectedRoute>
            //   } />
            // </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import { submitForm, getFormSubmissions, getSubmissionCount } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/authService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const MultiStepForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, userId } = useAuth();

  const handleLogout = async () => {
    await signOutUser();
  };

  // Load user's submissions
  useEffect(() => {
    loadSubmissions();
  }, [userId]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const [submissionsResult, countResult] = await Promise.all([
        getFormSubmissions(),
        getSubmissionCount()
      ]);

      if (submissionsResult.success) {
        // Show only current user's submissions
        const userSubmissions = submissionsResult.data.filter(
          submission => submission.userId === userId
        );
        setSubmissions(userSubmissions);
      } else {
        setError(submissionsResult.message);
      }

      if (countResult.success) {
        setSubmissionCount(countResult.count);
      }
    } catch (err) {
      setError('Failed to load submissions');
      console.error('Error loading submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  // TODO: Implement form validation using Formik and Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    dateOfBirth: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required('Date of birth is required'),
    gender: Yup.string().oneOf(['Male', 'Female', 'Other'], 'Invalid gender').required('Gender is required'),
  });

{/* <form onSubmit={handleSubmit}>
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

              <label hmtFor="subject">Interests</label>
              <select name="subject" id="subject" onChange={(e) => handleChanges(e)}>
                <option value="aiml">Artificial Intelligence (AIML)</option>
                <option value="exch">Cultural Exchange (EXCH)</option>
                <option value="econ">Economics (ECON)</option>
                <option value="gpol">Global Policy (GPOL)</option>
                <option value="hlth">Healthcare (HLTH)</option>
                <option value="acad">Research and Academia (ACAD)</option>
                <option value="sust">Sustainability (SUST)</option>
                <option value="tech">Technology (TECH)</option>
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
                
            </form> */}


  // TODO: Implement form data handling

  return (
    <div className="container">
      <div className="form-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Personal Information Form</h1>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            Logout
          </button>
        </div>
        <p>Please provide your basic personal details.</p>
        
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Logged in as:</strong> {user.email}
        </div>
        
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setIsSubmitting(true);
            setSubmitMessage('');

            try {
              const submissionData = {
                ...values,
                userId: userId
              };

              const result = await submitForm(submissionData);

              if (result.success) {
                setSubmitMessage('Form submitted successfully!');
                resetForm();
                loadSubmissions();
              } else {
                setSubmitMessage(result.message);
              }
            } catch (error) {
              setSubmitMessage('An error occurred. Please try again.');
              console.error('Submit error:', error);
            } finally {
              setIsSubmitting(false);
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, handleBlur }) => (
            <Form>
              <PersonalInfoStep
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />

              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('successfully') ? 'success' : 'error'}`}>
                  {submitMessage}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>


        {/* Admin Panel - User's Submissions */}
        <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #e0e0e0' }}>
          <h2>Your Form Submissions</h2>
          <p>View all your submitted forms below.</p>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <p><strong>Logged in as:</strong> {user.email}</p>
            <p><strong>Total submissions:</strong> {submissionCount}</p>
            <p><strong>Your submissions:</strong> {submissions.length}</p>
          </div>

          {error && (
            <div className="submit-message error">
              {error}
            </div>
          )}

          <button 
            onClick={loadSubmissions} 
            className="btn btn-primary"
            style={{ marginBottom: '20px' }}
          >
            Refresh
          </button>

          {loading ? (
            <p>Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <p>No submissions yet. Fill out the form above to get started!</p>
          ) : (
            <div className="submissions-list">
              {submissions.map((submission) => (
                <div key={submission.id} className="submission-item">
                  <div className="submission-header">
                    <h3>Submission #{submission.id.slice(-8)}</h3>
                    <span className="submission-date">
                      {formatDate(submission.submittedAt)}
                    </span>
                  </div>
              <div className="submission-details">
                <p><strong>Name:</strong> {submission.firstName} {submission.lastName}</p>
                <p><strong>Date of Birth:</strong> {submission.dateOfBirth}</p>
                <p><strong>Gender:</strong> {submission.gender}</p>
              </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleString();
};

export default MultiStepForm;

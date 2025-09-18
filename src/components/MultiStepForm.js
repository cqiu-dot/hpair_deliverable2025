import React, { useState, useEffect } from 'react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import { submitForm, getFormSubmissions, getSubmissionCount } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/authService';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import jsPDF from 'jspdf';

const MultiStepForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage('');
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [submitMessage]);
  const [submissions, setSubmissions] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedData, setSavedData] = useState(() => {
  const saved = localStorage.getItem('formData');
    return saved ? JSON.parse(saved) : null;
  });
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
    fullname: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    dateOfBirth: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required('Date of birth is required'),
    gender: Yup.string()
      .oneOf(['Male', 'Female', 'Other', 'Prefer not to say'], 'Invalid gender')
      .required('Gender is required'),
    phonenumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Full address is required'),
    nationality: Yup.string().required('Nationality is required'),
    cv: Yup.mixed()
      // .required('CV is required')
      .nullable() // <-- This allows null values
      .test('fileSize', 'File too large', value => {
        if (!value) return true; // no file is okay, pass validation
        return value && value.size <= 2 * 1024 * 1024; // 2MB limit (optional)
      })
      .test('fileType', 'Unsupported file format', value => {
        if (!value) return true; // no file is okay, pass validation
        return value && ['application/pdf'].includes(value.type); // Only PDF allowed (optional)
      }),
  });

  // TODO: Implement form data handling

  const AutoSave = () => {
    const { values } = useFormikContext();

    useEffect(() => {
      // Exclude the 'cv' field (file) because it can't be serialized
      const { cv, ...valuesToSave } = values;
      localStorage.setItem('formData', JSON.stringify(valuesToSave));
    }, [values]);

    return null;
  };

  const initialValues = {
    firstName: savedData?.firstName || '',
    lastName: savedData?.lastName || '',
    fullname: savedData?.fullname || '',
    email: savedData?.email || '',
    dateOfBirth: savedData?.dateOfBirth || '',
    gender: savedData?.gender || '',
    phonenumber: savedData?.phonenumber || '',
    address: savedData?.address || '',
    nationality: savedData?.nationality || '',
    language: savedData?.language || '',
    subject: savedData?.subject || '',
    cv: null,
    linkedin: savedData?.linkedin || '',
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Submission Summary", 20, 20);

    doc.setFontSize(12);
    let y = 30;

    const addLine = (label, value) => {
      doc.text(`${label}: ${value || 'N/A'}`, 20, y);
      y += 10;
    };

    addLine("Full Name", data.fullname);
    addLine("Email", data.email);
    addLine("Date of Birth", data.dateOfBirth);
    addLine("Gender", data.gender);
    addLine("Phone Number", data.phonenumber);
    addLine("Address", data.address);
    addLine("Nationality", data.nationality);
    addLine("Preferred Language", data.language);
    addLine("Main Interest", data.subject);
    addLine("LinkedIn", data.linkedin);

    // Save the PDF
    doc.save('submission-summary.pdf');
  };

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
          enableReinitialize
          initialValues={initialValues}

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
                localStorage.removeItem('formData');   // Clear storage first
                setSavedData(null);                    // Clear saved data state
                resetForm();                           // Then reset Formik to the new empty values
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
              <AutoSave />
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

                {!isSubmitting && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                    onClick={() => generatePDF(values)}
                  >
                    Download PDF Summary
                  </button>
                )}
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
                <p><strong>Email:</strong> {submission.email}</p>
                <p><strong>Phone Number:</strong> {submission.phonenumber}</p>
                <p><strong>Full Address:</strong> {submission.address}</p>
                <p><strong>Nationality:</strong> {submission.nationality}</p>
                <p><strong>Preferred Language:</strong> {submission.language}</p>
                <p><strong>Main Interest:</strong> {submission.subject}</p>
                <p><strong>LinkedIn:</strong> {submission.linkedin}</p>
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

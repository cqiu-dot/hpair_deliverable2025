import React from 'react';
import { Field, ErrorMessage } from 'formik';

const PersonalInfoStep = () => {
  return (
    <div>
      <h2>Personal Information</h2>
      <p>Please provide your basic personal details.</p>
      
      <div className="form-group">
        <label htmlFor="firstName">First Name *</label>
        <Field
          type="text"
          id="firstName"
          name="firstName"
          className="form-input"
        />
        <ErrorMessage name="firstName" component="div" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name *</label>
        <Field
          type="text"
          id="lastName"
          name="lastName"
          className="form-input"
        />
        <ErrorMessage name="lastName" component="div" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="dateOfBirth">Date of Birth *</label>
        <Field
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          className="form-input"
        />
        <ErrorMessage name="dateOfBirth" component="div" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="gender">Gender *</label>
        <Field as="select" id="gender" name="gender" className="form-input">
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </Field>
        <ErrorMessage name="gender" component="div" className="error" />
      </div>
    </div>
  );
};

export default PersonalInfoStep;

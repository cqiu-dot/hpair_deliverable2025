import React from 'react';
import { Field, ErrorMessage } from 'formik';

const PersonalInfoStep = () => {
  const fileInputRef = useRef(null);
  const { values } = useFormikContext();

  // Clear file input when Formik cv value is reset to null
  useEffect(() => {
    if (values.cv === null && fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }, [values.cv]);
  
  return (
    <div>
      <h2>Personal Information</h2>
      <p>Please provide your basic personal details.</p>

      <div className="form-group">
        <label htmlFor="fullname">Full Name *</label>
        <Field
          type="text"
          id="fullname"
          name="fullname"
          className="form-input"
          placeholder="Your full name"
        />
        <ErrorMessage name="fullname" component="div" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <Field
          type="email"
          id="email"
          name="email"
          className="form-input"
          placeholder="Your email"
        />
        <ErrorMessage name="email" component="div" className="error" />
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
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </Field>
        <ErrorMessage name="gender" component="div" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="phonenumber">Phone Number *</label>
        <Field
          type="text"
          id="phonenumber"
          name="phonenumber"
          className="form-input"
          placeholder="Your phone number"
        />
        <ErrorMessage name="phonenumber" component="div" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="address">Full Address *</label>
        <Field
          type="text"
          id="address"
          name="address"
          className="form-input"
          placeholder="Your address"
        />
        <ErrorMessage name="address" component="div" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="nationality">Nationality *</label>
        <Field
          type="text"
          id="nationality"
          name="nationality"
          className="form-input"
          placeholder="Your nationality"
        />
        <ErrorMessage name="nationality" component="div" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="language">Preferred Language</label>
        <Field
          type="text"
          id="language"
          name="language"
          className="form-input"
          placeholder="Preferred language"
        />
        <ErrorMessage name="language" component="div" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="subject">Main Interest</label>
        <Field as="select" id="subject" name="subject" className="form-input">
          <option value="N/A">Select option</option>
          <option value="Artificial Intelligence (AIML)">Artificial Intelligence (AIML)</option>
          <option value="Cultural Exchange (EXCH)">Cultural Exchange (EXCH)</option>
          <option value="Economics (ECON)">Economics (ECON)</option>
          <option value="Global Policy (GPOL)">Global Policy (GPOL)</option>
          <option value="Healthcare (HLTH)">Healthcare (HLTH)</option>
          <option value="Research and Academia (ACAD)">Research and Academia (ACAD)</option>
          <option value="Sustainability (SUST)">Sustainability (SUST)</option>
          <option value="Technology (TECH)">Technology (TECH)</option>
          <option value="Other">Other</option>
        </Field>
        <ErrorMessage name="subject" component="div" className="error" />
      </div>


      <div className="form-group">
        <label htmlFor="cv">PDF Resume (maximum 2MB)</label>
        <Field name="cv">
          {({ form }) => (
            <input
              type="file"
              id="cv"
              name="cv"
              className="form-input"
              ref={fileInputRef}
              accept=".pdf"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                form.setFieldValue('cv', file || null);
              }}
            />
          )}
        </Field>
        <ErrorMessage name="cv" component="div" className="error" />
      </div>

      <div className="form-group">
        <label htmlFor="linkedin">LinkedIn URL</label>
        <Field
          type="text"
          id="linkedin"
          name="linkedin"
          className="form-input"
          placeholder="LinkedIn profile URL"
        />
        <ErrorMessage name="linkedin" component="div" className="error" />
      </div>
    </div>
  );
};

export default PersonalInfoStep;

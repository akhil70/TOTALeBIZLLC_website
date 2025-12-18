import React, { useState } from "react";
import "./JobApplicationModal.css";
import { applyJob } from "../Utils/ApiService";

const JobApplicationModal = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    experience: "",
    ctc: "",
    expectedCTC: "",
    location: "",
    relocate: "",
    noticePeriod: "",
    referralId: "",
    resume: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let resumePayload = null;

      if (formData.resume) {
        const base64Data = await fileToBase64(formData.resume);
        resumePayload = {
          fileName: formData.resume.name,
          fileSize: formData.resume.size,
          fileType: formData.resume.type,
          data: base64Data,
        };
      }

      const payload = {
        jobId: job.id,
        emailId: formData.email,
        firstName: formData.fullName.split(" ")[0] || formData.fullName,
        lastName: formData.fullName.split(" ")[1] || "",
        address: formData.address,
        phoneNumber: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        totalExperience: Number(formData.experience),
        currentCtc: Number(formData.ctc),
        expectedCtc: Number(formData.expectedCTC),
        currentLoc: formData.location,
        willingToRelocate: formData.relocate === "Yes",
        noticePeriod: formData.noticePeriod,
        resume: resumePayload,
        coverLetter: "",
      };

      // ✅ Call centralized API
      const response = await applyJob(payload);

      console.log("Application submitted:", response);
      alert("Application submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h3>Apply for {job.jobTitle}</h3>
        <form onSubmit={handleSubmit} className="job-form">
          <div className="upload-box">
            <label htmlFor="resume">
              <div className="upload-placeholder">
                <span>📤 Upload your resume here</span>
                <small>browse file from device</small>
              </div>
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleChange}
              hidden
            />
          </div>

          <div className="form-grid">
            <input name="fullName" placeholder="Full Name *" onChange={handleChange} required />
            <input name="address" placeholder="Address *" onChange={handleChange} required />
            <input name="email" placeholder="Email *" onChange={handleChange} required />
            <input name="phone" placeholder="Phone No *" onChange={handleChange} required />
            <select name="gender" onChange={handleChange} required>
              <option value="">Gender *</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input name="dob" type="date" placeholder="DOB *" onChange={handleChange} required />
            <input name="experience" placeholder="Total Experience *" onChange={handleChange} required />
            <input name="ctc" placeholder="CTC *" onChange={handleChange} required />
            <input name="expectedCTC" placeholder="Expected CTC *" onChange={handleChange} required />
            <input name="location" placeholder="Location *" onChange={handleChange} required />
            <select name="relocate" onChange={handleChange} required>
              <option value="">Willing to Relocate? *</option>
              <option>Yes</option>
              <option>No</option>
            </select>
            <select name="noticePeriod" onChange={handleChange} required>
              <option value="">Notice Period *</option>
              <option>1 Month</option>
              <option>2 Month</option>
              <option>3 Month</option>
              <option>4 Month</option>
            </select>
            <input name="referralId" placeholder="Employee Referral Id" onChange={handleChange} />
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;

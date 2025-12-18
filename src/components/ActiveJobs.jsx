import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import JobApplicationModal from "./JobApplicationModal";
import { fetchActiveJobs } from "../Utils/ApiService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./activejob.css";

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow next-arrow" onClick={onClick}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 4l8 8-8 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev-arrow" onClick={onClick}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M16 4l-8 8 8 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export const ActiveJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);
  useEffect(() => {
    fetchActiveJobs().then(setJobs);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div id="jobs" className="jobs-section">
      <div className="container">
        <div className="section-title">
          <h2>🚀 Active Job Openings</h2>
          <p>Join our team and build your future with us.</p>
        </div>

        {jobs && jobs.length > 0 ? (
          <Slider {...settings}>
            {jobs.map((job, index) => (
              <div className="job-card" key={index}>
                <div className="job-card-header">
                  <h3>{job.jobTitle}</h3>
                </div>
                <div className="job-card-body">
                  <p style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span><b>Department:</b> {job.departmentName}</span>
                    <i
                      title="View details"
                      className="fa fa-info-circle"
                      style={{ cursor: "pointer", color: "#20cce3", fontSize: "12px" }}
                      onClick={() => setViewJob(job)}
                    ></i>
                  </p>
                  <p><b>Location:</b> {job.location}</p>

                </div>
                <div className="job-card-footer">
                  <button
                    className="apply-btn"
                    onClick={() => setSelectedJob(job)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-muted">No active job openings right now.</p>
        )}
      </div>

      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* Inline Modal Box for Job Details */}
      {viewJob && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "15px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "linear-gradient(135deg, #ff7f50, #ff4500)",
                color: "#fff",
                padding: "15px 20px",
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
              }}
            >
              <h5 style={{ margin: 0 }}>{viewJob.jobTitle}</h5>
              <button
                onClick={() => setViewJob(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: "20px", textAlign: "left" }}>
              <p><b>Department:</b> {viewJob.departmentName}</p>
              <p><b>Location:</b> {viewJob.location}</p>
              <p><b>Experience Required:</b> {viewJob.experienceRequired}</p>
              <p><b>Skills:</b> {viewJob.skills}</p>
              <p><b>Vacancies:</b> {viewJob.vacancyCount}</p>
              <p><b>Salary Range:</b> {viewJob.salaryRange}</p>
              <p><b>Job Type:</b> {viewJob.jobType}</p>
              <p><b>Expiry Date:</b> {new Date(viewJob.expiryDate).toLocaleDateString()}</p>
              <hr style={{
                border: "none",
                borderTop: "1px solid #ccc",
                width: "100%",
                margin: "10px 0",
                backgroundColor: "transparent"
              }} />
              <p><b>Description:</b></p>
              <p>{viewJob.jobDescription}</p>
            </div>

            <div style={{ padding: "10px 20px", textAlign: "right" }}>
              <button
                onClick={() => setViewJob(null)}
                style={{
                  background: "#6372ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Resume.css";

export default function Resume() {
  const [imageError, setImageError] = useState(false);
  
  // Files from public folder
  const resumePdf = "/Mern-resume.pdf";
  const resumeImage = "/Mern-resume.jpeg";

  const handleDownload = () => {
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = resumePdf;
    link.download = "God'sHand-Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = resumeImage;
    link.download = "God'sHand-Resume-Preview.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="resume-page">
      <div className="resume-header">
        <h1>Resume</h1>
        <p>Download my latest resume below</p>
      </div>

      <div className="resume-preview-container">
        {!imageError ? (
          <img
            src={resumeImage}
            alt="Resume Preview"
            className="resume-preview"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="fallback-message">
            <p>Preview not available</p>
            <button onClick={handleDownload} className="btn btn-primary">
              Download PDF Instead
            </button>
          </div>
        )}
      </div>

      <div className="resume-actions">
        <button onClick={handleDownload} className="btn btn-primary download-btn">
          ⬇ Download PDF Resume
        </button>
        
        <button onClick={handleDownloadImage} className="btn btn-secondary">
           Download Image Preview
        </button>

        <Link to="/" className="btn btn-secondary">
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}
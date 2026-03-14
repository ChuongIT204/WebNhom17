import React, { useState } from "react";
import { useParams } from "react-router-dom";

const jobDetails = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    logo: "/company1-logo.png",
    description: "We are looking for a skilled Frontend Developer to join our team.",
    requirements: "Proficient in React, JavaScript, and CSS.",
    benefits: "Health insurance, remote work options, and annual bonuses.",
    location: "Hanoi, Vietnam",
    applicationMethod: "Send your CV to hr@techcorp.com",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CodeBase",
    logo: "/company2-logo.png",
    description: "Join our backend team to build scalable applications.",
    requirements: "Experience with Node.js, MongoDB, and REST APIs.",
    benefits: "Flexible working hours, health insurance, and training programs.",
    location: "Ho Chi Minh City, Vietnam",
    applicationMethod: "Apply online at codebase.com/careers",
  },
];

const JobDetail = () => {
  const { id } = useParams();
  const job = jobDetails.find((job) => job.id === parseInt(id));

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    phone: "",
    address: "",
    cv: null,
    coverLetter: "",
  });

  if (!job) return <p className="text-center mt-10">Job not found</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFile = (e) => {
    setFormData({ ...formData, cv: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.dob ||
      !formData.phone ||
      !formData.address ||
      !formData.cv ||
      !formData.coverLetter
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.cv.size > 5 * 1024 * 1024) {
      alert("File must be smaller than 5MB");
      return;
    }

    alert("Application submitted!");
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Job Detail */}
      <div className="bg-white shadow-lg rounded-xl p-6">

        <div className="flex items-center gap-4 mb-4">
          <img
            src={job.logo}
            alt="logo"
            className="w-16 h-16 object-contain"
          />

          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-600">{job.company}</p>
          </div>
        </div>

        <p className="mb-4">{job.description}</p>

        <h2 className="font-semibold text-lg">Requirements</h2>
        <p className="mb-3">{job.requirements}</p>

        <h2 className="font-semibold text-lg">Benefits</h2>
        <p className="mb-3">{job.benefits}</p>

        <h2 className="font-semibold text-lg">Location</h2>
        <p className="mb-3">{job.location}</p>

        <h2 className="font-semibold text-lg">How to Apply</h2>
        <p className="mb-6">{job.applicationMethod}</p>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Apply Now
        </button>
      </div>

      {/* POPUP FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-[500px] p-6">

            <h2 className="text-xl font-bold mb-4 text-center">
              Application Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={handleFile}
                className="w-full"
              />

              <textarea
                name="coverLetter"
                placeholder="Cover Letter"
                value={formData.coverLetter}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows="4"
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>

              </div>
            </form>

          </div>

        </div>
      )}
    </div>
  );
};

export default JobDetail;
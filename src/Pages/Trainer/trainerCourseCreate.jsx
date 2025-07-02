
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const CreateCourse = () => {
  const [trainerId, setTrainerId] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [createdCourseId, setCreatedCourseId] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    course_title: '',
    course_price: '',
    course_rating: '',
    course_description: '',
    about_course: '',
    course_specification: '',
    preknowledge: '',
    why_this_course: '',
    course_image: null,
  });
  const [sectionFormData, setSectionFormData] = useState({
    section_title: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Fetch trainer_id
  useEffect(() => {
    const id = localStorage.getItem('vendorId') || '5';
    console.log('Trainer ID:', id); // Debug
    if (!id) {
      setError('Trainer ID not found. Please log in.');
      navigate('/login', { replace: true });
    } else {
      setTrainerId(id);
    }
  }, [navigate]);

  // Handle course form input changes
  const handleCourseInputChange = (e) => {
    const { name, value, files } = e.target;
    setCourseFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle section form input changes
  const handleSectionInputChange = (e) => {
    const { name, value } = e.target;
    setSectionFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle course submission
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validate course fields
    const requiredFields = [
      'course_title',
      'course_price',
      'course_rating',
      'course_description',
      'about_course',
      'course_specification',
      'preknowledge',
      'why_this_course',
    ];
    for (const field of requiredFields) {
      if (!courseFormData[field]) {
        setError(`${field.replace('_', ' ').replace('course ', '')} is required.`);
        setIsLoading(false);
        return;
      }
    }

    // Validate course_price
    if (courseFormData.course_price < 0) {
      setError('Price cannot be negative.');
      setIsLoading(false);
      return;
    }

    // Validate course_rating
    const rating = parseFloat(courseFormData.course_rating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      setError('Rating must be a number between 0 and 5.');
      setIsLoading(false);
      return;
    }

    // Validate course_image
    if (courseFormData.course_image) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(courseFormData.course_image.type)) {
        setError('Course image must be a JPEG, PNG, or GIF file.');
        setIsLoading(false);
        return;
      }
      if (courseFormData.course_image.size > 5 * 1024 * 1024) {
        setError('Course image size must be less than 5MB.');
        setIsLoading(false);
        return;
      }
    }

    // Prepare FormData
    const data = new FormData();
    Object.entries(courseFormData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        data.append(key, value);
      }
    });

    // Debug: Log FormData
    console.log('Course FormData Contents:');
    for (const [key, value] of data.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    try {
      const response = await fetch(`http://localhost:8000/trainer_gmt/courses/create/?trainer_id=${trainerId}`, {
        method: 'POST',
        body: data,
      });

      // Debug: Log raw response status and text
      console.log('Course Creation Response Status:', response.status);
      const responseText = await response.text();
      console.log('Course Creation Raw Response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      console.log('Course Creation Parsed Response:', responseData); // Debug

      if (!response.ok) {
        let errorMessage = 'Failed to create course.';
        if (responseData.error) {
          errorMessage = responseData.error;
        } else if (typeof responseData === 'object') {
          errorMessage = Object.entries(responseData)
            .map(([field, errors]) => `${field.replace('_', ' ')}: ${errors.join(', ')}`)
            .join('; ');
        }
        throw new Error(errorMessage);
      }

      // Capture course_id
      const courseId = responseData.course_id || responseData.id || responseData.courseid || responseData.pk;
      if (!courseId) {
        throw new Error(`Course ID not returned in response. Response: ${JSON.stringify(responseData)}`);
      }

      setCreatedCourseId(courseId);
      setSuccess(`Course "${responseData.course_title || 'Untitled'}" created successfully!`);
      setCourseFormData({
        course_title: '',
        course_price: '',
        course_rating: '',
        course_description: '',
        about_course: '',
        course_specification: '',
        preknowledge: '',
        why_this_course: '',
        course_image: null,
      });
      setActiveTab('section');
    } catch (err) {
      console.error('Course API Error:', err.message); // Debug
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle section submission
  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validate section_title
    if (!sectionFormData.section_title) {
      setError('Section title is required.');
      setIsLoading(false);
      return;
    }

    // Validate createdCourseId
    if (!createdCourseId || isNaN(createdCourseId)) {
      setError('Invalid course ID. Please create a course first.');
      setActiveTab('basic');
      setIsLoading(false);
      return;
    }

    // Prepare request body
    const data = {
      section_title: sectionFormData.section_title,
    };

    // Debug: Log request data
    console.log('Section Request Data:', {
      course_id: createdCourseId,
      section_title: sectionFormData.section_title,
    });

    try {
      const response = await fetch(`http://localhost:8000/trainer_gmt/courses/sections/?course_id=${createdCourseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('Section Creation Response:', responseData); // Debug

      if (!response.ok) {
        let errorMessage = 'Failed to add section.';
        if (responseData.error) {
          errorMessage = responseData.error;
        } else if (typeof responseData === 'object') {
          errorMessage = Object.entries(responseData)
            .map(([field, errors]) => `${field.replace('_', ' ')}: ${errors.join(', ')}`)
            .join('; ');
        }
        throw new Error(errorMessage);
      }

      setSuccess(`Section "${responseData.section_title}" added successfully to course ID ${createdCourseId}!`);
      setSectionFormData({
        section_title: '',
      });
    } catch (err) {
      console.error('Section API Error:', err.message); // Debug
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Create New Course</h1>

      {/* Error and Success Messages */}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-6 text-center">{success}</div>}

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mx-2 rounded ${activeTab === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Information
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${activeTab === 'section' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} ${!createdCourseId || isNaN(createdCourseId) ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={() => createdCourseId && !isNaN(createdCourseId) && setActiveTab('section')}
          disabled={!createdCourseId || isNaN(createdCourseId)}
        >
          Section Info
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded bg-gray-200 text-gray-700 cursor-not-allowed opacity-50`}
          disabled
        >
          Lecture Info
        </button>
      </div>

      {/* Course Creation Form */}
      {activeTab === 'basic' && (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <form onSubmit={handleCourseSubmit} className="space-y-6">
            <div>
              <label htmlFor="course_title" className="block text-sm font-medium text-gray-600">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="course_title"
                name="course_title"
                value={courseFormData.course_title}
                onChange={handleCourseInputChange}
                className="mt-1 p-3 w-full border rounded focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Course Title"
                maxLength="255"
              />
            </div>

            <div>
              <label htmlFor="course_price" className="block text-sm font-medium text-gray-600">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="course_price"
                name="course_price"
                value={courseFormData.course_price}
                onChange={handleCourseInputChange}
                className="mt-1 p-3 w-full border rounded focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
                aria-label="Course Price"
              />
            </div>

            <div>
              <label htmlFor="course_rating" className="block text-sm font-medium text-gray-600">
                Rating (0-5) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="course_rating"
                name="course_rating"
                value={courseFormData.course_rating}
                onChange={handleCourseInputChange}
                className="mt-1 p-3 w-full border rounded focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                max="5"
                step="0.1"
                aria-label="Course Rating"
              />
            </div>

            <div>
              <label htmlFor="course_description" className="block text-sm font-medium text-gray-600">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="course_description"
                name="course_description"
                value={courseFormData.course_description}
                onChange={handleCourseInputChange}
                className="mt-1 p-3 w-full border rounded focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
                aria-label="Course Description"
              />
            </div>

            <div>
              <label htmlFor="about_course" className="block text-sm font-medium text-gray-600">
                About This Course <span className="text-red-500">*</span>
              </label>
              <textarea
                id="about_course"
                name="about_course"
                value={courseFormData.about_course}
                onChange={handleCourseInputChange}
                className="mt-1 p-3 w-full border rounded focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
                aria-label="About This Course"
              />
            </div>

            <div>
              <label htmlFor="course_specification" className="block text-sm font-medium text-gray-600">
                Course Specification <span className="text-red-500">*</span>
              </label>
              <textarea
                id="course_specification"
                name="course_specification"
                value={courseFormData.course_specification}
                onChange={handleCourseInputChange}
                className="mt-1 p-3 w-full border rounded focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
                aria-label="Course Specification"
              />
            </div>

            <div>
              <label htmlFor="preknowledge" className="block text-sm font-medium text-gray-600">
                Preknowledge Required <span className="text-red-500">*</span>
              </label>
              <textarea
                id="preknowledge"
                name="preknowledge"
                value={courseFormData.preknowledge}
                onChange={handleCourseInputChange}
                className="mt-1 p-3 w-full border rounded focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
                aria-label="Preknowledge Required"
              />
            </div>

            <div>
              <label htmlFor="why_this_course" className="block text-sm font-medium text-gray-600">
                Why Take This Course <span className="text-red-500">*</span>
              </label>
              <textarea
                id="why_this_course"
                name="why_this_course"
                value={courseFormData.why_this_course}
                onChange={handleCourseInputChange}
                className="mt-1 p-3 w-full border rounded focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
                aria-label="Why Take This Course"
              />
            </div>

            <div>
              <label htmlFor="course_image" className="block text-sm font-medium text-gray-600">
                Course Image (Optional)
              </label>
              <input
                type="file"
                id="course_image"
                name="course_image"
                onChange={handleCourseInputChange}
                className="mt-1 p-3 w-full border rounded"
                accept="image/jpeg,image/png,image/gif"
                aria-label="Course Image"
              />
              {courseFormData.course_image && (
                <img
                  src={URL.createObjectURL(courseFormData.course_image)}
                  alt="Preview"
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => navigate('/dashboard/trainer')}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isLoading ? 'Creating Course...' : 'Save & Next'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section Creation Form */}
      {activeTab === 'section' && (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Section for Course ID: {createdCourseId}</h2>
          <form onSubmit={handleSectionSubmit} className="space-y-6">
            <div>
              <label htmlFor="section_title" className="block text-sm font-medium text-gray-600">
                Section Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="section_title"
                name="section_title"
                value={sectionFormData.section_title}
                onChange={handleSectionInputChange}
                className="mt-1 p-3 w-full border rounded focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Section Title"
                maxLength="255"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setActiveTab('basic')}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isLoading ? 'Adding Section...' : 'Add Section'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lecture Info Placeholder */}
      {activeTab === 'lecture' && (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Lecture Info</h2>
          <p className="text-gray-600">Lecture creation will be implemented here.</p>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;

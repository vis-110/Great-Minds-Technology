
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Footer from "../../components/Footer/Footer";
// import "./CourseDetails.css";
// import axios from "axios";

// const CourseDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`http://localhost:8000/api/courses/${id}/`)
//       .then((res) => setCourse(res.data))
//       .catch((err) => console.error("Error fetching course:", err));
//   }, [id]);

//   const handleEnroll = () => {
//     navigate(`/course/${id}/video`);
//   };

//   if (!course) return <p>Loading...</p>;

//   return (
//     <div className="course-details">
//       <main className="main-container">
//         <div className="left-panel">
//           <h1 className="course-title">{course.course_title}</h1>
//           <p className="course-subtitle">{course.about_course}</p>
//           <p className="rating">
//             ⭐ {course.course_rating} · {course.total_students_enrolled}{" "}
//             students ·
//             <span className="instructor">
//               {" "}
//               Course by {course.course_author}
//             </span>
//           </p>

//           <section className="course-structure">
//             <h2>Course Structure</h2>
//             {course.course_content.split("\n").map((item, index) => (
//               <p key={index}>• {item}</p>
//             ))}
//           </section>

//           <section className="requirements">
//             <h2>Specifications</h2>
//             <p>{course.course_specification}</p>
//           </section>

//           <section className="description">
//             <h2>Course Description</h2>
//             <p>{course.course_description}</p>
//           </section>
//         </div>

//         <aside className="right-card">
//           <img
//             className="preview-image"
//             src={course.course_image}
//             alt="Course Preview"
//           />
//           <p className="offer">Limited time offer!</p>
//           <div className="price-tag">
//             <span className="discount-price">₹{course.course_price}</span>
//             <span className="original-price">
//               ₹{parseInt(course.course_price) * 2}
//             </span>
//             <span className="offer-tag">50% off</span>
//           </div>
//           <button className="enroll-btn" onClick={handleEnroll}>
//             Enroll Now
//           </button>

//           <div className="features">
//             <p>✅ Life time access with free updates</p>
//             <p>✅ Step-by-step, hands-on project guidance</p>
//             <p>✅ Project-based hands-on learning</p>
//             <p>✅ Downloadable resources</p>
//             <p>✅ Certificate of completion</p>
//           </div>
//         </aside>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default CourseDetails;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import "./CourseDetails.css";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/course_gmt/course/details/?course_id=${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error("Error fetching course:", err));
  }, [id]);

  const handleEnroll = () => {
    navigate(`/dashboard/course/${id}/video`);
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-details">
      <main className="main-container">
        <div className="left-panel">
          <h1 className="course-title">{course.course_title}</h1>
          <p className="course-subtitle">{course.about_course}</p>
          <p className="rating">
            <span className="stars">⭐ {course.course_rating}</span> ({course.total_students_enrolled} ratings) ·{" "}
            {course.total_students_enrolled} students ·{" "}
            <span className="instructor">by {course.course_author || "Admin"}</span>
          </p>

          <section className="course-structure">
            <h2>Course Structure</h2>
            <p className="structure-meta">
              22 sections • 54 lectures • 27h 30m total duration
            </p>
            {course.sections && course.sections.length > 0 ? (
              course.sections.map((section, sIndex) => (
                <div key={section.id} className="section-block">
                  <h3>
                    <span className="section-icon">🔵</span> {section.section_title}
                    <span className="lecture-count">
                      {section.lectures.length} lectures • {section.duration || "0m"}
                    </span>
                  </h3>
                  {section.lectures.length > 0 ? (
                    <ul className="lecture-list">
                      {section.lectures.map((lecture) => (
                        <li key={lecture.id}>
                          <span className="lecture-icon">📜</span> {lecture.title} —{" "}
                          <em>{lecture.duration}</em>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No lectures available.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No course sections available.</p>
            )}
          </section>

          <section className="description">
            <h2>Course Description</h2>
            <p>{course.course_description}</p>
          </section>
        </div>

        <aside className="right-card">
          <img
            className="preview-image"
            src={course.course_image}
            alt="Course Preview"
          />
          <p className="offer">5 days left at this price!</p>
          <div className="price-tag">
            <span className="discount-price">₹{parseFloat(course.course_price)}</span>
            <span className="original-price">
              ₹{parseFloat(course.course_price) * 20}
            </span>
            <span className="offer-tag">90% off</span>
          </div>
          <p className="course-meta">
            <span className="meta-icon">⭐</span> 4.5 <span className="meta-icon">⏱️</span> 30 hours{" "}
            <span className="meta-icon">📚</span> 54 lessons
          </p>
          <button className="enroll-btn" onClick={handleEnroll}>
            Enroll Now
          </button>

          <div className="features">
            <h3>What's in the course?</h3>
                <p>✅ Life time access with free updates</p>
         <p>✅ Step-by-step, hands-on project guidance</p>
             <p>✅ Project-based hands-on learning</p>
            <p>✅ Downloadable resources</p>
             <p>✅ Certificate of completion</p>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetails;
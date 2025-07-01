// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./CourseVideoPage.css";

// const CourseVideoPage = () => {
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("Overview");
//   const [activeLectureInfo, setActiveLectureInfo] = useState({
//     sectionTitle: "",
//     lectureTitle: "",
//     video: "",
//   });
//   const [expandedSections, setExpandedSections] = useState({});
//   const [completionPercentage, setCompletionPercentage] = useState(0);
//   const [sections, setSections] = useState([]);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/courses/");
//         const courses = response.data;
//         const selectedCourse = courses.find((c) => c.course_id === 1); // Select course with course_id: 1
//         if (!selectedCourse) {
//           throw new Error("Course not found");
//         }

//         // Parse course_content into sections and simulate lectures
//         const parsedSections = selectedCourse.course_content
//           .split("\n")
//           .map((section, index) => {
//             // Simulate lectures for each section (since API doesn't provide them)
//             const simulatedLectures = [
//               {
//                 title: `${section} - Part 1`,
//                 video: selectedCourse.course_video,
//                 duration: "05:00",
//                 completed: false,
//                 active: index === 0,
//               },
//               {
//                 title: `${section} - Part 2`,
//                 video: selectedCourse.course_video,
//                 duration: "05:00",
//                 completed: false,
//                 active: false,
//               },
//             ];
//             return {
//               section,
//               lectures: simulatedLectures,
//             };
//           });

//         setSections(parsedSections);
//         setCourse(selectedCourse);

//         // Initialize expanded sections
//         const initialExpanded = parsedSections.reduce((acc, _, index) => {
//           acc[index] = false;
//           return acc;
//         }, {});
//         setExpandedSections(initialExpanded);

//         // Set initial active lecture
//         const initialActive = parsedSections[0].lectures.find(
//           (lecture) => lecture.active
//         );
//         setActiveLectureInfo({
//           sectionTitle: parsedSections[0].section,
//           lectureTitle: initialActive.title,
//           video: initialActive.video,
//         });

//         // Calculate initial completion percentage
//         calculateCompletionPercentage(parsedSections);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch course data");
//         setLoading(false);
//       }
//     };
//     fetchCourse();
//   }, []);

//   // Calculate completion percentage
//   const calculateCompletionPercentage = (sectionsData) => {
//     const totalLectures = sectionsData.reduce(
//       (total, section) => total + section.lectures.length,
//       0
//     );
//     const completedLectures = sectionsData.reduce(
//       (total, section) =>
//         total + section.lectures.filter((lecture) => lecture.completed).length,
//       0
//     );
//     const percentage =
//       totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
//     setCompletionPercentage(Math.round(percentage));
//   };

//   // Toggle section collapse/expand
//   const toggleSection = (sectionIndex) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionIndex]: !prev[sectionIndex],
//     }));
//   };

//   // Handle lecture click
//   const handleLectureClick = (section, lecture) => {
//     setActiveLectureInfo({
//       sectionTitle: section.section,
//       lectureTitle: lecture.title,
//       video: lecture.video,
//     });

//     // Update active state
//     const updatedSections = sections.map((s) => ({
//       ...s,
//       lectures: s.lectures.map((l) => ({
//         ...l,
//         active: l === lecture,
//       })),
//     }));
//     setSections(updatedSections);

//     // Mark lecture as completed (for demo; should be a backend update in production)
//     lecture.completed = true;
//     calculateCompletionPercentage(updatedSections);
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">{error}</div>;
//   if (!course) return null;

//   const tabs = ["Overview", "Lectures Notes", "Attach File", "Announcements"];

//   return (
//     <div className="container">
//       {/* Course Info */}
//       <div className="course-header">
//         <div className="course-info">
//           <div className="play-icon">
//             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeWidth="2"
//                 d="M14.5 3H9.5l-2 7h9l-2-7zM7 10l-4 11h18l-4-11H7z"
//               />
//             </svg>
//           </div>
//           <div className="course-details">
//             <h1>{course.course_title}</h1>
//             <div className="meta">
//               <div className="meta-item">
//                 <svg fill="none" stroke="#f97316" viewBox="0 0 24 24">
//                   <path
//                     strokeWidth="1.3"
//                     d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2"
//                   />
//                 </svg>
//                 <span>{course.course_specification.split("|")[0].trim()}</span>
//               </div>
//               <div className="meta-item">
//                 <svg fill="none" stroke="#4f46e5" viewBox="0 0 24 24">
//                   <path strokeWidth="1.3" d="M12 4v16m-8-8h16" />
//                 </svg>
//                 <span>
//                   {sections.reduce((total, s) => total + s.lectures.length, 0)}{" "}
//                   lectures
//                 </span>
//               </div>
//               <div className="meta-item">
//                 <svg fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
//                   <path strokeWidth="1.3" d="M12 2v10l4 2" />
//                 </svg>
//                 <span>
//                   {course.course_specification
//                     .split("|")[0]
//                     .trim()
//                     .replace("Duration: ", "")}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="actions">
//           <button className="review-btn">Write a Review</button>
//           <button className="next-btn">Next Lecture</button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         {/* Video and Description */}
//         <div className="content-left">
//           {/* Video Player */}
//           <div className="video-container">
//             <video
//               className="video-player"
//               src={activeLectureInfo.video || course.course_video}
//               controls
//               poster={course.course_image}
//             />
//           </div>

//           {/* Lecture Info */}
//           <div className="lecture-info">
//             <h2>{activeLectureInfo.sectionTitle}</h2>
//             <h3>{activeLectureInfo.lectureTitle}</h3>
//             <div className="lecture-meta">
//               <div className="author">
//                 <img src="https://placehold.co/32x32" alt="Author" />
//                 <div>
//                   <div className="by">by</div>
//                   <div className="author-name">{course.course_author}</div>
//                   <div className="rating">
//                     {[...Array(5)].map((_, i) => (
//                       <svg
//                         key={i}
//                         className={
//                           i < Math.floor(course.course_rating || 0)
//                             ? "star-filled"
//                             : "star-empty"
//                         }
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M10 15l-5.5 3 1-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-3.5 4.5 1 5.5z" />
//                       </svg>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="updated">Last updated: Oct 26, 2020</div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="tabs">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 className={activeTab === tab ? "tab active" : "tab"}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab}
//                 {tab === "Attach File" && (
//                   <span className="file-count">01</span>
//                 )}
//               </button>
//             ))}
//           </div>
// {activeTab === "Attach File" && (
//   <div className="tab-content">
//     <h3>Attached Files</h3>
//     <div className="file-item">
//       <svg
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//         className="file-icon"
//         style={{ width: "31px", height: "31px", color: "#f97316" }}
//       >
//         <path
//           strokeWidth="1.5"
//           d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
//         />
//         <path strokeWidth="1.5" d="M14 2v6h6" />
//       </svg>
//       <span>Course Material.pdf</span>
//       <button
//         className="download-btn"
//         onClick={async () => {
//           try {
//             const fileUrl = "https://res.cloudinary.com/dt3xvmjfb/raw/upload/94f19dad9773367a966a78012d9bf679.pdf";
//             // Verify the URL is accessible
//             const response = await fetch(fileUrl, { method: "HEAD" });
//             if (!response.ok) {
//               throw new Error("File not found or inaccessible");
//             }

//             const link = document.createElement("a");
//             link.href = fileUrl;
//             link.download = "Course Material.pdf";
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//           } catch (error) {
//             alert("Failed to download the file. It may not exist or is restricted.");
//             console.error(error);
//           }
//         }}
//       >
//         Download File
//       </button>
//     </div>
//   </div>
// )}
//           {activeTab === "Announcements" && (
//             <div className="tab-content">
//               <h3>Announcements</h3>
//               <p>No announcements available.</p>
//             </div>
//           )}
//         </div>

//         {/* Course Contents Sidebar */}
//         <div className="sidebar">
//           <div className="progress">
//             <div className="progress-header">
//               <h3>Course Contents</h3>
//               <span className="progress-text">
//                 {completionPercentage}% Completed
//               </span>
//             </div>
//             <div className="progress-bar">
//               <div
//                 className="progress-filled"
//                 style={{ width: `${completionPercentage}%` }}
//               ></div>
//             </div>
//           </div>
//           <div className="contents">
//             {sections.map((section, index) => {
//               const lectureCount = section.lectures.length;
//               const totalDuration = section.lectures.reduce(
//                 (total, lecture) => {
//                   const [minutes, seconds] = lecture.duration
//                     .split(":")
//                     .map(Number);
//                   return total + minutes * 60 + seconds;
//                 },
//                 0
//               );
//               const durationMinutes = Math.floor(totalDuration / 60);
//               const durationSeconds = totalDuration % 60;
//               const formattedDuration = `${durationMinutes}m ${durationSeconds}s`;

//               return (
//                 <div key={index} className="section">
//                   <div
//                     className="section-header"
//                     onClick={() => toggleSection(index)}
//                   >
//                     <div className="section-title">
//                       <svg
//                         fill="none"
//                         stroke="#f97316"
//                         viewBox="0 0 24 24"
//                         className={expandedSections[index] ? "rotate-90" : ""}
//                       >
//                         <path strokeWidth="1.5" d="M9 5l7 7-7 7" />
//                       </svg>
//                       <span>{section.section}</span>
//                     </div>
//                     <div className="section-meta">
//                       <div className="meta-item">
//                         <svg fill="none" stroke="#4f46e5" viewBox="0 0 24 24">
//                           <path strokeWidth="1.3" d="M12 4v16m-8-8h16" />
//                         </svg>
//                         <span>{lectureCount} lectures</span>
//                       </div>
//                       <div className="meta-item">
//                         <svg fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
//                           <path strokeWidth="1.3" d="M12 2v10l4 2" />
//                         </svg>
//                         <span>{formattedDuration}</span>
//                       </div>
//                     </div>
//                   </div>
//                   {expandedSections[index] && (
//                     <div className="lectures">
//                       {section.lectures.map((lecture, i) => (
//                         <div
//                           key={i}
//                           className={`lecture ${lecture.active ? "active" : ""}`}
//                           onClick={() => handleLectureClick(section, lecture)}
//                         >
//                           <div className="lecture-info">
//                             <div
//                               className={`status ${
//                                 lecture.completed
//                                   ? "completed"
//                                   : lecture.active
//                                     ? "active"
//                                     : ""
//                               }`}
//                             >
//                               {lecture.completed && (
//                                 <svg
//                                   fill="none"
//                                   stroke="white"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path strokeWidth="1.5" d="M5 13l4 4L19 7" />
//                                 </svg>
//                               )}
//                             </div>
//                             <span>{lecture.title}</span>
//                           </div>
//                           <div className="lecture-time">
//                             <svg fill="currentColor" viewBox="0 0 24 24">
//                               <path d="M8 5v14l11-7z" />
//                             </svg>
//                             <span>{lecture.duration}</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseVideoPage;
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "./CourseVideoPage.css";

// const CourseVideo = () => {
//   const { id } = useParams(); // Course ID from URL
//   const [course, setCourse] = useState(null);
//   const [currentLecture, setCurrentLecture] = useState(null);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("description");

//   useEffect(() => {
//     // Fetch course data from the backend
//     axios
//       .get(`http://localhost:8000/course_gmt/course/details/?course_id=${id}`)
//       .then((res) => {
//         console.log("API Response:", res.data);
//         setCourse(res.data);
//         // Set the first lecture as the current lecture by default
//         const firstSection = res.data.sections?.[0];
//         const firstLecture = firstSection?.lectures?.[0];
//         setCurrentLecture(firstLecture || null);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error("Error fetching course:", err);
//         setError("Failed to load course details. Please try again later.");
//       });
//   }, [id]);

//   // Calculate total sections, lectures, and duration
//   const totalSections = course?.sections?.length || 0;
//   const totalLectures = course?.sections?.reduce(
//     (acc, section) => acc + (section.lectures?.length || 0),
//     0
//   ) || 0;
//   const totalDuration = course?.sections?.reduce(
//     (acc, section) =>
//       acc +
//       (section.lectures?.reduce(
//         (sum, lecture) => sum + parseInt(lecture.duration) || 0,
//         0
//       ) || 0),
//     0
//   ) || 0;

//   const handleLectureClick = (lecture) => {
//     setCurrentLecture(lecture);
//   };

//   if (error) return <p className="error">{error}</p>;
//   if (!course) return <p>Loading...</p>;

//   return (
//     <div className="course-video-container">
//       {/* Header */}
//       <header className="course-header">
//         <h1>{course.course_title}</h1>
//         <div className="course-stats">
//           <span>{totalSections} sections</span>
//           <span>{totalLectures} lectures</span>
//           <span>{totalDuration}m</span>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="main-content">
//         {/* Left Panel: Video and Lecture Info */}
//         <div className="left-panel">
//           {/* Video Player Placeholder */}
//           <div className="video-player">
//             <div className="video-placeholder">
//               <p>Video Player Placeholder (Lecture: {currentLecture?.title})</p>
//             </div>
//           </div>

//           {/* Lecture Info */}
//           <div className="lecture-info">
//             <h2>{currentLecture?.title || "No Lecture Selected"}</h2>
//             <p className="instructor">
//               by {course.course_author || "Unknown Instructor"}
//             </p>
//             <p className="last-updated">Last updated: Oct 26, 2020</p>
//           </div>

//           {/* Tabs for Overview and Notes */}
//           <div className="tabs">
//             <button
//               className={activeTab === "description" ? "active" : ""}
//               onClick={() => setActiveTab("description")}
//             >
//               Overview
//             </button>
//             <button
//               className={activeTab === "notes" ? "active" : ""}
//               onClick={() => setActiveTab("notes")}
//             >
//               Lecture Notes
//             </button>
//           </div>

//           {/* Tab Content */}
//           <div className="tab-content">
//             {activeTab === "description" && (
//               <div className="lecture-description">
//                 <h3>Lecture Description</h3>
//                 <p>
//                   {currentLecture?.description ||
//                     "We cover everything you need to build your first website. From creating your first page through to uploading your website to the internet. We use the world’s most popular (and free) web design tool called Visual Studio Code. There are exercise files you can download and then work along with. At the end of each video we have a downloadable version of where we are in the process so that you can compare your project with ours. This will enable you to see easily where you are going wrong if you get stuck. We cover all the good stuff such as how to create your very own mobile menu from scratch learning some basic JavaScript and jQuery. If that all sounds a little too fancy – don’t worry, this course is aimed at people new to web design and who have never coded before. We’ll start right at the beginning and work our way through step by step."}
//                 </p>
//               </div>
//             )}
//             {activeTab === "notes" && (
//               <div className="lecture-notes">
//                 <h3>Lecture Notes</h3>
//                 <p>
//                   {currentLecture?.notes ||
//                     "In ut aliquet curabitur. Curabitur mollis tincidunt turpis, sed eu diam mauris finibus. Praesent eget mi in maximus eget ipsum, justo libero pulvinar pellentesque. Sed id arcu in ultricies condimentum nisl diam, ut id arcu tortor, nisi rhoncus lorem, eu eget sagittis purus, sit amet sapien. Maecenas tristique magna massa, a venenatis et tempor aliquam. Aliquam vel lectus lacinia, posuere suscipit ague. Praesent eget mi in maximus eget ipsum, justo libero pulvinar pellentesque. Sed id arcu in ultricies condimentum nisl diam, ut id arcu tortor, nisi rhoncus lorem, eu eget sagittis purus, sit amet sapien. Maecenas tristique magna massa, a venenatis et tempor aliquam. Aliquam vel lectus lacinia, posuere suscipit ague. Praesent eget mi in maximus eget ipsum, justo libero pulvinar pellentesque. Sed id arcu in ultricies condimentum nisl diam, ut id arcu tortor, nisi rhoncus lorem, eu eget sagittis purus, sit amet sapien."}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Panel: Course Content */}
//         <aside className="right-panel">
//           <h2>Course Content</h2>
//           <div className="progress">
//             <span>15% completed</span>
//           </div>
//           {course.sections && course.sections.length > 0 ? (
//             course.sections.map((section, index) => (
//               <div key={index} className="section">
//                 <h3>
//                   <span className="section-title">{section.section_title}</span>
//                   <span className="section-meta">
//                     {section.lectures?.length || 0} lectures •{" "}
//                     {section.lectures?.reduce(
//                       (sum, lecture) => sum + parseInt(lecture.duration) || 0,
//                       0
//                     ) || 0}
//                     m
//                   </span>
//                 </h3>
//                 {section.lectures && section.lectures.length > 0 ? (
//                   <ul>
//                     {section.lectures.map((lecture) => (
//                       <li
//                         key={lecture.id}
//                         className={
//                           currentLecture?.id === lecture.id ? "active" : ""
//                         }
//                         onClick={() => handleLectureClick(lecture)}
//                       >
//                         <span>{lecture.title}</span>
//                         <span>{lecture.duration}m</span>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No lectures available</p>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>No sections available</p>
//           )}
//         </aside>
//       </main>
//     </div>
//   );
// };

// export default CourseVideo;
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "./CourseVideoPage.css";

// const CourseVideo = () => {
//   const { id } = useParams(); // Course ID from URL
//   const [course, setCourse] = useState(null);
//   const [currentLecture, setCurrentLecture] = useState(null);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("description");

//   useEffect(() => {
//     // Fetch course data from the backend
//     axios
//       .get(`http://localhost:8000/course_gmt/course/details/?course_id=${id}`)
//       .then((res) => {
//         console.log("API Response:", res.data);
//         setCourse(res.data);
//         // Set the first lecture as the current lecture by default
//         const firstSection = res.data.sections?.[0];
//         const firstLecture = firstSection?.lectures?.[0];
//         setCurrentLecture(firstLecture || null);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error("Error fetching course:", err);
//         setError("Failed to load course details. Please try again later.");
//       });
//   }, [id]);

//   // Calculate total sections, lectures, and duration
//   const totalSections = course?.sections?.length || 0;
//   const totalLectures = course?.sections?.reduce(
//     (acc, section) => acc + (section.lectures?.length || 0),
//     0
//   ) || 0;
//   const totalDuration = course?.sections?.reduce(
//     (acc, section) =>
//       acc +
//       (section.lectures?.reduce(
//         (sum, lecture) => sum + parseInt(lecture.duration) || 0,
//         0
//       ) || 0),
//     0
//   ) || 0;

//   const handleLectureClick = (lecture) => {
//     setCurrentLecture(lecture);
//   };

//   if (error) return <p className="error">{error}</p>;
//   if (!course) return <p>Loading...</p>;

//   return (
//     <div className="course-video-container">
//       {/* Header */}
//       <header className="course-header">
//         <h1>{course.course_title}</h1>
//         <p className="course-subtitle">{course.about_course}</p>
//         <div className="course-meta">
//           <span className="rating">⭐ {course.course_rating} (122 ratings)</span>
//           <span>{course.total_students_enrolled} students</span>
//         </div>
//         <p className="structure-meta">
//           {totalSections} sections • {totalLectures} lectures • {totalDuration}m total duration
//         </p>
//       </header>

//       {/* Main Content */}
//       <main className="main-content">
//         {/* Left Panel: Video and Lecture Info */}
//         <div className="left-panel">
//           {/* Video Player Placeholder */}
//           <div className="video-player">
//             <div className="video-placeholder">
//               <p>Video Player Placeholder (Lecture: {currentLecture?.title})</p>
//             </div>
//           </div>

//           {/* Lecture Info */}
//           <div className="lecture-info">
//             <h2>{currentLecture?.title || "No Lecture Selected"}</h2>
//             <p className="instructor">
//               by {course.course_author || "Unknown Instructor"}
//             </p>
//             <p className="last-updated">Last updated: Oct 26, 2020</p>
//           </div>

//           {/* Tabs for Overview and Notes */}
//           <div className="tabs">
//             <button
//               className={activeTab === "description" ? "active" : ""}
//               onClick={() => setActiveTab("description")}
//             >
//               Overview
//             </button>
//             <button
//               className={activeTab === "notes" ? "active" : ""}
//               onClick={() => setActiveTab("notes")}
//             >
//               Lecture Notes
//             </button>
//           </div>

//           {/* Tab Content */}
//           <div className="tab-content">
//             {activeTab === "description" && (
//               <div className="lecture-description">
//                 <h3>Lecture Description</h3>
//                 <p>
//                   {currentLecture?.description ||
//                     "We cover everything you need to build your first website. From creating your first page through to uploading your website to the internet. We use the world’s most popular (and free) web design tool called Visual Studio Code. There are exercise files you can download and then work along with. At the end of each video we have a downloadable version of where we are in the process so that you can compare your project with ours. This will enable you to see easily where you are going wrong if you get stuck. We cover all the good stuff such as how to create your very own mobile menu from scratch learning some basic JavaScript and jQuery. If that all sounds a little too fancy – don’t worry, this course is aimed at people new to web design and who have never coded before. We’ll start right at the beginning and work our way through step by step."}
//                 </p>
//               </div>
//             )}
//             {activeTab === "notes" && (
//               <div className="lecture-notes">
//                 <h3>Lecture Notes</h3>
//                 <p>
//                   {currentLecture?.notes ||
//                     "In ut aliquet curabitur. Curabitur mollis tincidunt turpis, sed eu diam mauris finibus. Praesent eget mi in maximus eget ipsum, justo libero pulvinar pellentesque. Sed id arcu in ultricies condimentum nisl diam, ut id arcu tortor, nisi rhoncus lorem, eu eget sagittis purus, sit amet sapien. Maecenas tristique magna massa, a venenatis et tempor aliquam. Aliquam vel lectus lacinia, posuere suscipit ague."}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Panel: Course Content */}
//         <aside className="right-panel">
//           <h2>Course Content</h2>
//           <div className="progress">
//             <span>15% completed</span>
//           </div>
//           {course.sections && course.sections.length > 0 ? (
//             course.sections.map((section, index) => (
//               <div key={index} className="section">
//                 <h3>
//                   <span className="section-title">{section.section_title}</span>
//                   <span className="section-meta">
//                     {section.lectures?.length || 0} lectures •{" "}
//                     {section.lectures?.reduce(
//                       (sum, lecture) => sum + parseInt(lecture.duration) || 0,
//                       0
//                     ) || 0}
//                     m
//                   </span>
//                 </h3>
//                 {section.lectures && section.lectures.length > 0 ? (
//                   <ul>
//                     {section.lectures.map((lecture) => (
//                       <li
//                         key={lecture.id}
//                         className={
//                           currentLecture?.id === lecture.id ? "active" : ""
//                         }
//                         onClick={() => handleLectureClick(lecture)}
//                       >
//                         <span>{lecture.title}</span>
//                         <span>{lecture.duration}m</span>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No lectures available</p>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>No sections available</p>
//           )}
//         </aside>
//       </main>
//     </div>
//   );
// };

// export default CourseVideo;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseVideoPage.css";

const CourseVideoPage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeLectureInfo, setActiveLectureInfo] = useState({
    sectionTitle: "",
    lectureTitle: "",
    video: "",
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [sections, setSections] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/course_gmt/course/details/?course_id=${id}`
        );
        const fetchedCourse = res.data;
        setCourse(fetchedCourse);

        const parsedSections = fetchedCourse.sections || [];
        setSections(parsedSections);

        const initialExpanded = parsedSections.reduce((acc, _, index) => {
          acc[index] = false;
          return acc;
        }, {});
        setExpandedSections(initialExpanded);

        const firstSectionWithLectures = parsedSections.find(
          (s) => s.lectures && s.lectures.length > 0
        );
        const initialActive = firstSectionWithLectures?.lectures[0] || {};
        setActiveLectureInfo({
          sectionTitle: firstSectionWithLectures?.section_title || "",
          lectureTitle: initialActive.title || "",
          video: initialActive.video_file || "",
        });

        const updatedSections = parsedSections.map((s) => ({
          ...s,
          lectures: s.lectures.map((l, i) => ({
            ...l,
            active: i === 0 && s.id === firstSectionWithLectures?.id,
          })),
        }));
        setSections(updatedSections);

        calculateCompletionPercentage(updatedSections);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch course data");
        setLoading(false);
        console.error("Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [id]);

  const calculateCompletionPercentage = (sectionsData) => {
    const totalLectures = sectionsData.reduce(
      (total, section) => total + section.lectures.length,
      0
    );
    const completedLectures = sectionsData.reduce(
      (total, section) =>
        total + section.lectures.filter((lecture) => lecture.completed).length,
      0
    );
    const percentage =
      totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
    setCompletionPercentage(Math.round(percentage));
  };

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  const handleLectureClick = (section, lecture) => {
    setActiveLectureInfo({
      sectionTitle: section.section_title,
      lectureTitle: lecture.title,
      video: lecture.video_file,
    });

    const updatedSections = sections.map((s) => ({
      ...s,
      lectures: s.lectures.map((l) => ({
        ...l,
        active: l.id === lecture.id,
        completed: l.id === lecture.id ? true : l.completed,
      })),
    }));
    setSections(updatedSections);
    calculateCompletionPercentage(updatedSections);
  };

  // const handleEnroll = () => {
  //   // Corrected route to match App.jsx
  //   navigate(`/dashboard/course/${id}/video`);
  // };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const tabs = ["Overview", "Lectures Notes", "Attach File", "Announcements"];

  return (
    <div className="container">
      {/* Course Header */}
      <div className="course-header">
        <div className="course-info">
          <div className="play-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeWidth="2"
                d="M14.5 3H9.5l-2 7h9l-2-7zM7 10l-4 11h18l-4-11H7z"
              />
            </svg>
          </div>
          <div className="course-details">
            <h1>{course.course_title}</h1>
            <div className="meta">
              <div className="meta-item">
                <svg fill="none" stroke="#f97316" viewBox="0 0 24 24">
                  <path
                    strokeWidth="1.3"
                    d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2"
                  />
                </svg>
                <span>{course.course_specification}</span>
              </div>
              <div className="meta-item">
                <svg fill="none" stroke="#4f46e5" viewBox="0 0 24 24">
                  <path strokeWidth="1.3" d="M12 4v16m-8-8h16" />
                </svg>
                <span>
                  {sections.reduce((total, s) => total + s.lectures.length, 0)}{" "}
                  lectures
                </span>
              </div>
              <div className="meta-item">
                <svg fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
                  <path strokeWidth="1.3" d="M12 2v10l4 2" />
                </svg>
                <span>{course.course_specification.split(",")[0].trim()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="actions">
          <button className="review-btn">Write a Review</button>
          <button className="next-btn">Next Lecture</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Video and Description */}
        <div className="content-left">
          {/* Video Player */}
          <div className="video-container">
            <video
              className="video-player"
              src={activeLectureInfo.video}
              controls
              poster={course.course_image}
            />
          </div>

          {/* Lecture Info */}
          <div className="lecture-info">
            <h2>{activeLectureInfo.lectureTitle}</h2>
            <div className="lecture-meta">
              <div className="author">
                <img src="https://placehold.co/32x32" alt="Author" />
                <div>
                  <div className="by">by</div>
                  <div className="author-name">{course.author || "JDK"}</div>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={
                          i < Math.floor(course.course_rating || 0)
                            ? "star-filled"
                            : "star-empty"
                        }
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.5 3 1-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-3.5 4.5 1 5.5z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="updated">Last updated: Oct 26, 2020</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "tab active" : "tab"}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tab === "Attach File" && (
                  <span className="file-count">01</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "Overview" && (
            <div className="tab-content">
              <h3>Overview</h3>
              <p>{course.course_description || "Master Java from basic to advanced..."}</p>
            </div>
          )}
          {activeTab === "Lectures Notes" && (
            <div className="tab-content">
              <h3>Lectures Notes</h3>
              <p>No lecture notes available.</p>
            </div>
          )}
          {activeTab === "Attach File" && (
            <div className="tab-content">
              <h3>Attach File</h3>
              <div className="file-item">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="file-icon"
                  style={{ width: "31px", height: "31px", color: "#f97316" }}
                >
                  <path
                    strokeWidth="1.5"
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                  />
                  <path strokeWidth="1.5" d="M14 2v6h6" />
                </svg>
                <span>Course Material.pdf</span>
                <button className="download-btn">Download File</button>
              </div>
            </div>
          )}
          {activeTab === "Announcements" && (
            <div className="tab-content">
              <h3>Announcements</h3>
              <p>No announcements available.</p>
            </div>
          )}
        </div>

        {/* Course Contents Sidebar */}
        <div className="sidebar">
          <div className="progress">
            <div className="progress-header">
              <h3>Contents</h3>
              <span className="progress-text">Completed</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-filled"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="contents">
            {sections.map((section, index) => {
              const lectureCount = section.lectures.length;
              const totalDuration = section.lectures.reduce(
                (total, lecture) => {
                  const [hours, minutes, seconds] = lecture.duration
                    .split(":")
                    .map(Number);
                  return total + hours * 3600 + minutes * 60 + seconds;
                },
                0
              );
              const durationMinutes = Math.floor(totalDuration / 60);
              const durationSeconds = totalDuration % 60;
              const formattedDuration = `${durationMinutes}m ${durationSeconds}s`;

              return (
                <div key={section.id} className="section">
                  <div
                    className="section-header"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="section-title">
                      <svg
                        fill="none"
                        stroke="#f97316"
                        viewBox="0 0 24 24"
                        className={expandedSections[index] ? "rotate-90" : ""}
                      >
                        <path strokeWidth="1.5" d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{section.section_title}</span>
                    </div>
                    <div className="section-meta">
                      <div className="meta-item">
                        <svg fill="none" stroke="#4f46e5" viewBox="0 0 24 24">
                          <path strokeWidth="1.3" d="M12 4v16m-8-8h16" />
                        </svg>
                        <span>{lectureCount} lectures</span>
                      </div>
                      <div className="meta-item">
                        <svg fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
                          <path strokeWidth="1.3" d="M12 2v10l4 2" />
                        </svg>
                        <span>{formattedDuration}</span>
                      </div>
                    </div>
                  </div>
                  {expandedSections[index] && (
                    <div className="lectures">
                      {section.lectures.map((lecture) => (
                        <div
                          key={lecture.id}
                          className={`lecture ${lecture.active ? "active" : ""}`}
                          onClick={() => handleLectureClick(section, lecture)}
                        >
                          <div className="lecture-info">
                            <div
                              className={`status ${
                                lecture.completed
                                  ? "completed"
                                  : lecture.active
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {lecture.completed && (
                                <svg
                                  fill="none"
                                  stroke="white"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeWidth="1.5" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span>{lecture.title}</span>
                          </div>
                          <div className="lecture-time">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>{lecture.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoPage;
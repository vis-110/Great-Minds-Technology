
import React,{ useState, useEffect } from "react";
import { useNavigate ,useParams} from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import CourseCard from "../../components/CourseCard/CourseCard";
import axios from "axios";
import "./CourseList.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { query } = useParams();
  const isAdmin = location.pathname.includes("/admin");
  const isSAdmin = location.pathname.includes("/sadmin");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/student_gmt/all-courses/");
        setCourses(response.data.courses || []);
        console.log('Fetched courses courseLList:', response.data.courses);

      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]); // Ensure courses remains an array on error
      }
    };

    fetchCourses();
  }, []);
  useEffect(() => {
    if (query) {
      setSearchText(query); // If there's a query parameter (e.g., from trainer route), use it for filtering
    }
  }, [query]);

  const filteredCourses = courses.filter((course) =>
    course.course_title.toLowerCase().includes(searchText.toLowerCase())
  );
const handleCourseClick = (courseId) => {
    if(!isAdmin && !isSAdmin) {
      navigate(`/dashboard/course/${courseId}`);
    }
  };
  return (
    <div className="course-list-container">
      <h1>
        <span>Course List</span>
      </h1>
      <p className="text-gray-500">
        <span
          className="text-blue-600 cursor-pointer"
          onClick={
            () => {
              if(!isAdmin && !isSAdmin) {
                navigate("/dashboard/");
              }
            }
          }
        >
          Home /
        </span>
        <span> Course List</span>
      </p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="course-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.course_id} onClick={() => handleCourseClick(course.course_id)}>
            <CourseCard
              key={course.course_id}
              course={{
                id: course.course_id,
                title: course.course_title,
                price: course.course_price,
                image: course.course_image,
                description: course.course_description,
                rating: course.course_rating,
              }}
            />
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CourseList;
import { Link } from "react-router-dom";

function StudentDashboard() {
    return (
        <main className="dashboard-page">
            <h1>Student Dashboard</h1>
            <p>Continue exploring classes and share your learning experience.</p>
            <div className="dashboard-actions">
                <Link to="/classes" className="primary-btn">Browse Classes</Link>
                <Link to="/profile" className="secondary-btn">View Profile</Link>
            </div>
        </main>
    );
}

export default StudentDashboard;

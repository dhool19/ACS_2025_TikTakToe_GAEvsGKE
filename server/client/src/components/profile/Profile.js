import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Profile.css'; 
import Chart from './ChartProfile';

function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); 

  const handleEditProfile = () => {
    navigate('/editprofile'); 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch('/api/user/getUser', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user.username })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  const getRoleFromScore = (score) => {
    if (score < 500) return 'Noob';
    if (score < 1000) return 'Beginner';
    if (score < 1500) return 'Intermediate';
    if (score < 2000) return 'Advanced';
    return 'Expert';
  };

  return (
    <div className='profile'>
      <div className="profile-container">
        <div className="profile-card">
          <div className="close-icon">
            {/* <i className="fas fa-times"></i> */}
          </div>
          <div className="profile-picture">
            <img src="https://randomuser.me/api/portraits/lego/6.jpg" alt="Profile" />
          </div>
          <div className="profile-details">
            <div className="profile-info">
              <h1>{userData?.username.toUpperCase() || "Loading..."}</h1>
              <p>Role: {getRoleFromScore(userData?.score) || "Loading..."}</p>
              <div className="score">Player Score: {userData?.score || "Loading..."}</div>
            </div>
            <button className="edit-button" onClick={handleEditProfile}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          </div>
        </div>

        {userData && (
          <div className="Chart">
            <Chart won={userData.won} lost={userData.lost} draw={userData.draw} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

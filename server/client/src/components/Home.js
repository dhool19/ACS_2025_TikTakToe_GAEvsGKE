import React from "react";
import xo from '../img/xo.png';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <img src={xo} alt="XO" />
            <div className="text-container">
                <h1>Dominate the XO Board – Start Playing Now!</h1>
                <h3>Your favorite classic, now online and better than ever</h3>

                <button className="play-online" onClick={() => window.location.href = "/gameonline"}><i className="fas fa-users"></i> Play Online</button>
                <button className="play-computer" onClick={() => window.location.href = "/gamesolo"}><i className="fas fa-desktop"></i> Play Computer</button>
            </div>
            <div className="footer">
                <p>ACS Project © 2025. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Home;


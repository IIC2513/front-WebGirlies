import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = ({ gameId }) => {
    const [playerStats, setPlayerStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/game/${gameId}/stats`
                );
                setPlayerStats(response.data.characters);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener estadísticas:", error);
            }
        };
        fetchStats();
    }, [gameId]);

    if (loading) {
        return <p>Loading statistics...</p>;
    }

    return (
    <div className="dashboard-container">
        <h2>Estadísticas del Juego</h2>
        <table className="stats-table">
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Character</th>
                    <th>Points</th>
                    <th>Turn</th>
                </tr>
            </thead>
            <tbody>
                {playerStats.map((stat) => (
                    <tr key={stat.characterId}>
                        <td>{stat.User.username}</td>
                        <td>{stat.name}</td>
                        <td>{stat.UserGameCharacter?.score || 0}</td>
                        <td>{stat.UserGameCharacter?.turn ? "Yes" : "No"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default Dashboard;
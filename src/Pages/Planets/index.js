import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import PlanetModal from "../components/PlantModel";
import { CircularProgress } from "@mui/material";

const Planets = () => {
  const [planets, setPlanets] = useState([]);
  const [residentsData, setResidentsData] = useState([]);
  const [showResidents, setShowResidents] = useState({});
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlanets = async () => {
    try {
      const response = await axios.get("https://swapi.dev/api/planets/");
      setPlanets(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching planets:", error);
      setLoading(false);
    }
  };

  const handleNextPage = async () => {
    try {
      const response = await axios.get(nextPage);
      setPlanets(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Error fetching next page:", error);
    }
  };

  const handlePrevPage = async () => {
    try {
      const response = await axios.get(prevPage);
      setPlanets(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Error fetching previous page:", error);
    }
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  const fetchResidents = async (planet) => {
    try {
      const response = await Promise.all(
        planet.residents.map((residentURL) => axios.get(residentURL))
      );
      setResidentsData({ ...residentsData, [planet.name]: response });
      setShowResidents({ ...showResidents, [planet.name]: true });
      setSelectedPlanet(planet);
    } catch (error) {
      console.error("Error fetching residents:", error);
    }
  };

  const hideResidents = (planetName) => {
    setShowResidents({ ...showResidents, [planetName]: false });
  };

  if (loading) {
    return (
      <div className="loading">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="planets-container">
      <div className="pagination-container">
        {prevPage && (
          <button className="pagination" onClick={handlePrevPage}>
            Previous Page
          </button>
        )}
        <h3 className="title">Planets Directory</h3>

        {nextPage && (
          <button className="pagination" onClick={handleNextPage}>
            Next Page
          </button>
        )}
      </div>
      <div className="planet-list">
        {planets.map((planet) => {
          return (
            <div key={planet.url} className="planet-card">
              <h2>{planet.name}</h2>
              <p>
                <strong>Climate:</strong> {planet.climate}
              </p>
              <p>
                <strong>Population:</strong> {planet.population}
              </p>
              <p>
                <strong>Terrain:</strong> {planet.terrain}
              </p>
              {planet.residents.length > 0 ? (
                <button
                  className="show-residents-button"
                  onClick={() => {
                    if (showResidents[planet.name]) {
                      hideResidents(planet.name);
                    } else {
                      fetchResidents(planet);
                    }
                  }}
                >
                  {showResidents[planet.name]
                    ? "Hide Residents"
                    : "Show Residents"}
                </button>
              ) : (
                <button className="no-residents-button">No Residents</button>
              )}
            </div>
          );
        })}
      </div>
      <PlanetModal
        open={selectedPlanet !== null && showResidents[selectedPlanet.name]}
        onClose={() => {
          setSelectedPlanet(null);
          hideResidents(selectedPlanet.name);
        }}
        planet={selectedPlanet}
        residentsData={residentsData}
      />
    </div>
  );
};

export default Planets;

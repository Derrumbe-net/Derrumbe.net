import React, { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://derrumbe-test.derrumbe.net/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Proyectos</h1>
      <p>Aquí se demostrarán los proyectos llevados a cabo por la oficina.</p>

      {loading && <p>Cargando proyectos...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p>No hay proyectos disponibles.</p>
      )}

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h3>{project.name}</h3>
            {project.description && <p>{project.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;


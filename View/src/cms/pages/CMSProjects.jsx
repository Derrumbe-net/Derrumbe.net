import { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import "../../cms/styles/CMSProjects.css";

export default function CMSProjects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleOpenForm = (project = null) => {
    setEditProject(project);
    setShowForm(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditProject(null);
  };

  return (
    <div className="cms-projects">
      <h1>Proyectos</h1>

      {/* TABLE */}
      <table className="cms-table">
        <thead>
          <tr>
            <th></th>
            <th>Título</th>
            <th>Año de Inicio</th>
            <th>Año de Fin</th>
            <th>Estatus</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProjects.map((p) => (
            <tr key={p.project_id}>
              <td>
                <button className="edit-btn" onClick={() => handleOpenForm(p)}>
                  <FaEdit />
                </button>
              </td>
              <td>{p.title}</td>
              <td>{p.start_year}</td>
              <td>{p.end_year}</td>
              <td>{p.project_status}</td>
              <td>{p.description?.slice(0, 40)}...</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ◀
        </button>

        <span>Página {currentPage} de {totalPages}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          ▶
        </button>
      </div>

      {/* ADD BUTTON */}
      <div className="add-btn-container">
        <button className="add-btn" onClick={() => handleOpenForm()}>
          <FaPlus />
        </button>
      </div>

      {/* INLINE FORM */}
      {showForm && (
        <div className="inline-form-container">
          <ProjectForm
            project={editProject}
            onClose={handleCloseForm}
            refreshProjects={fetchProjects}
          />
        </div>
      )}
    </div>
  );
}

/* FORM COMPONENT */
function ProjectForm({ project, onClose, refreshProjects }) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    start_year: project?.start_year || "",
    end_year: project?.end_year || "",
    project_status: project?.project_status || "active",
    description: project?.description || "",
  });

  const isEdit = !!project;

  // ⬅️ FIX: Ensure form loads the selected project's data
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        start_year: project.start_year,
        end_year: project.end_year,
        project_status: project.project_status,
        description: project.description,
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `http://localhost:8080/api/projects/${project.project_id}`
      : "http://localhost:8080/api/projects";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      refreshProjects();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form className="cms-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Editar Proyecto" : "Añadir Proyecto"}</h2>

      <label>Título:</label>
      <input name="title" value={formData.title} onChange={handleChange} required />

      <label>Año de Inicio:</label>
      <input
        type="number"
        name="start_year"
        value={formData.start_year}
        onChange={handleChange}
        required
      />

      <label>Año de Fin:</label>
      <input
        type="number"
        name="end_year"
        value={formData.end_year}
        onChange={handleChange}
        required
      />

      <label>Estatus:</label>
      <select
        name="project_status"
        value={formData.project_status}
        onChange={handleChange}
      >
        <option value="completed">Proyecto Pasado</option>
        <option value="active">Proyecto Actual</option>
      </select>

      <label>Descripción:</label>
      <textarea
        name="description"
        rows="4"
        value={formData.description}
        onChange={handleChange}
      />

      {/* BUTTONS FIXED — Cancel left, Submit right */}
      <div className="cms-form__actions">
        <button type="button" className="cancel-btn" onClick={onClose}>
          Cancelar
        </button>

        <button type="submit" className="submit-btn">
          {isEdit ? "Guardar Cambios" : "Añadir Proyecto"}
        </button>
      </div>
    </form>
  );
}

import { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import "../../cms/styles/CMSPublications.css";

export default function CMSPublicaciones() {
  const [publications, setPublications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editPublication, setEditPublication] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(publications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = publications.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/publications");
      const data = await response.json();
      setPublications(data);
    } catch (error) {
      console.error("Error fetching publications:", error);
    }
  };

  const handleOpenForm = (pub = null) => {
    setEditPublication(pub);
    setShowForm(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditPublication(null);
  };

  return (
    <div className="cms-publications">
      <h1>Publicaciones</h1>

      <table className="cms-table">
        <thead>
          <tr>
            <th></th>
            <th>Título</th>
            <th>Link</th>
            <th>Descripción</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((pub) => (
            <tr key={pub.publication_id}>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleOpenForm(pub)}
                >
                  <FaEdit />
                </button>
              </td>

              <td>{pub.title}</td>

              <td>
                <a href={pub.publication_url} target="_blank" rel="noopener noreferrer">
                  {pub.publication_url.slice(0, 40)}...
                </a>
              </td>

              <td>{pub.description?.slice(0, 40)}...</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ◀
        </button>

        <span>Página {currentPage} de {totalPages}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          ▶
        </button>
      </div>

      {/* Add button */}
      <div className="add-btn-container">
        <button className="add-btn" onClick={() => handleOpenForm()}>
          <FaPlus />
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="inline-form-container">
          <PublicationForm
            publication={editPublication}
            onClose={handleCloseForm}
            refreshPublications={fetchPublications}
          />
        </div>
      )}
    </div>
  );
}

/* ----------------------- FORM COMPONENT ----------------------- */
function PublicationForm({ publication, onClose, refreshPublications }) {
  const [formData, setFormData] = useState({
    title: publication?.title || "",
    publication_url: publication?.publication_url || "",
    description: publication?.description || "",
  });

  const isEdit = !!publication;

  // Sync form with selected publication
  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title,
        publication_url: publication.publication_url,
        description: publication.description,
      });
    }
  }, [publication]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `http://localhost:8080/api/publications/${publication.publication_id}`
      : "http://localhost:8080/api/publications";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      refreshPublications();
      onClose();
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  return (
    <form className="cms-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Editar Publicación" : "Añadir Publicación"}</h2>

      <label>Título:</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label>Link (URL):</label>
      <input
        name="publication_url"
        value={formData.publication_url}
        onChange={handleChange}
        required
      />

      <label>Descripción:</label>
      <textarea
        name="description"
        rows="4"
        value={formData.description}
        onChange={handleChange}
      />

      <div className="cms-form__actions">
        <button type="button" className="cancel-btn" onClick={onClose}>
          Cancelar
        </button>

        <button type="submit" className="submit-btn">
          {isEdit ? "Guardar Cambios" : "Añadir Publicación"}
        </button>
      </div>
    </form>
  );
}

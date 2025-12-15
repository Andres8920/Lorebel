/**
 * Componente de Paginación
 * Controles para navegar entre páginas y cambiar items por página
 */

import '../styles/Pagination.css';

const Pagination = ({ pagination, onPageChange, itemName = 'items' }) => {
  const { current, total, totalItems, perPage } = pagination;

  if (total <= 1) return null;

  /**
   * Genera array de números de página con ellipsis (...)
   * Muestra máximo 5 páginas visibles para UI limpia
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (total <= maxVisible) {
      // Mostrar todas si son pocas
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Lógica con ellipsis para muchas páginas
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }
    
    return pages;
  };

  const startItem = (current - 1) * perPage + 1;
  const endItem = Math.min(current * perPage, totalItems);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Mostrando {startItem} - {endItem} de {totalItems} {itemName}
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
        >
          ← Anterior
        </button>

        <div className="pagination-pages">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination-page ${page === current ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="pagination-btn"
          onClick={() => onPageChange(current + 1)}
          disabled={current === total}
        >
          Siguiente →
        </button>
      </div>

      <div className="pagination-size">
        <label>
          Mostrar:
          <select
            value={perPage}
            onChange={(e) => onPageChange(1, Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          por página
        </label>
      </div>
    </div>
  );
};

export default Pagination;

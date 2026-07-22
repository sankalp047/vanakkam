import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableBannerRow({ banner, onToggleActive, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td>
        <button type="button" className="banner-drag-handle" {...attributes} {...listeners} aria-label="Drag to reorder">
          ⠿
        </button>
      </td>
      <td>
        <img src={banner.image16x9?.url} alt="" className="banner-thumb" />
      </td>
      <td>{banner.title}</td>
      <td>
        <a href={banner.linkUrl} target="_blank" rel="noreferrer">
          {banner.linkUrl}
        </a>
      </td>
      <td>
        <label className="banner-toggle">
          <input type="checkbox" checked={banner.active} onChange={() => onToggleActive(banner)} />
          <span>{banner.active ? 'Active' : 'Hidden'}</span>
        </label>
      </td>
      <td>
        <button type="button" className="banner-delete" onClick={() => onDelete(banner)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

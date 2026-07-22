import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useBanners } from '../../hooks/useBanners';
import { useAuthContext } from '../../context/AuthContext';
import { db, storage } from '../../firebase';
import { checkAspectRatio, RATIO_16_9, RATIO_9_16 } from '../../lib/aspectRatio';
import { SortableBannerRow } from '../../components/admin/SortableBannerRow';
import './admin-shared.css';
import './AdminBannersPage.css';

const initialForm = { title: '', linkUrl: '', file16x9: null, file9x16: null };

export function AdminBannersPage() {
  const { banners } = useBanners();
  const { user } = useAuthContext();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleFileChange = async (e, key, targetRatio, label) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await checkAspectRatio(file, targetRatio);
      if (!result.ok) {
        setError(`${label} image is ${result.width}×${result.height} — that isn't close enough to the required aspect ratio.`);
        e.target.value = '';
        return;
      }
      setError('');
      setForm((f) => ({ ...f, [key]: file }));
    } catch {
      setError(`Couldn't read the ${label} image.`);
    }
  };

  const uploadBanner = async () => {
    if (!form.title.trim() || !form.linkUrl.trim() || !form.file16x9 || !form.file9x16) {
      setError('Title, link, and both images (16:9 and 9:16) are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const docRef = await addDoc(collection(db, 'banners'), {
        title: form.title.trim(),
        linkUrl: form.linkUrl.trim(),
        image16x9: null,
        image9x16: null,
        order: banners.length,
        active: true,
        startAt: null,
        endAt: null,
        createdBy: user?.uid || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const ext16 = form.file16x9.name.split('.').pop() || 'jpg';
      const ext9 = form.file9x16.name.split('.').pop() || 'jpg';
      const ref16 = ref(storage, `banner-images/${docRef.id}/16x9.${ext16}`);
      const ref9 = ref(storage, `banner-images/${docRef.id}/9x16.${ext9}`);

      await uploadBytes(ref16, form.file16x9);
      await uploadBytes(ref9, form.file9x16);

      const [url16, url9] = await Promise.all([getDownloadURL(ref16), getDownloadURL(ref9)]);

      await updateDoc(docRef, {
        image16x9: { path: ref16.fullPath, url: url16 },
        image9x16: { path: ref9.fullPath, url: url9 },
      });

      setForm(initialForm);
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (banner) => {
    await updateDoc(doc(db, 'banners', banner.id), { active: !banner.active, updatedAt: serverTimestamp() });
  };

  const handleDelete = async (banner) => {
    if (!confirm(`Delete banner "${banner.title}"? This can't be undone.`)) return;
    await deleteDoc(doc(db, 'banners', banner.id));
    try {
      if (banner.image16x9?.path) await deleteObject(ref(storage, banner.image16x9.path));
      if (banner.image9x16?.path) await deleteObject(ref(storage, banner.image9x16.path));
    } catch {
      // Storage object already gone or unreachable — Firestore doc is deleted either way.
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = banners.findIndex((b) => b.id === active.id);
    const newIndex = banners.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(banners, oldIndex, newIndex);

    const batch = writeBatch(db);
    reordered.forEach((banner, index) => {
      batch.update(doc(db, 'banners', banner.id), { order: index });
    });
    await batch.commit();
  };

  return (
    <div>
      <h1 className="admin-page__title">Sponsor Banners</h1>

      <div className="admin-card banner-form">
        <h2>Add Banner</h2>
        {error && <p className="banner-form__error">{error}</p>}

        <label>
          Title (internal label)
          <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </label>

        <label>
          Link URL
          <input type="url" value={form.linkUrl} onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))} placeholder="https://…" />
        </label>

        <div className="banner-form__uploads">
          <label>
            Desktop image (16:9)
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'file16x9', RATIO_16_9, '16:9')} />
          </label>
          <label>
            Mobile image (9:16)
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'file9x16', RATIO_9_16, '9:16')} />
          </label>
        </div>

        <button type="button" className="btn btn-primary" onClick={uploadBanner} disabled={submitting}>
          {submitting ? 'Uploading…' : 'Add Banner'}
        </button>
      </div>

      <h2 style={{ margin: 'var(--space-xl) 0 var(--space-sm)' }}>Current Banners</h2>
      {banners.length === 0 ? (
        <p className="admin-empty">No banners yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Preview</th>
                <th>Title</th>
                <th>Link</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={banners.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                <tbody>
                  {banners.map((banner) => (
                    <SortableBannerRow
                      key={banner.id}
                      banner={banner}
                      onToggleActive={handleToggleActive}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>
      )}
    </div>
  );
}

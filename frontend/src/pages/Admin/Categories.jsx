import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  FolderKanban,
  Image as ImageIcon,
  Pencil,
  Plus,
  Power,
  X,
} from 'lucide-react';
import api from '@/services/api';
import { T } from '@/utils/vendorTheme';
import useBreakpoint from '@/utils/useBreakpoint';
import {
  ActionButton,
  EmptyTable,
  FilterButton,
  ManagementHeader,
  Pagination,
  StatusBadge,
  surface,
} from '@/components/admin/ManagementPrimitives';

const emptyForm = { name: '', slug: '', description: '', image: '' };
const makeSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
};

const CategoryModal = ({ category, onClose, onSaved }) => {
  const [form, setForm] = useState(
    category
      ? {
          name: category.name || '',
          slug: category.slug || '',
          description: category.description || '',
          image: category.image || '',
        }
      : emptyForm
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const change = (field, value) =>
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'name' && !slugTouched ? { slug: makeSlug(value) } : {}),
    }));
  const save = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        image: form.image,
      };
      const response = category
        ? await api.put(`/admin/categories/${category._id}`, payload)
        : await api.post('/admin/categories', payload);
      onSaved(response.data.data);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          'The category could not be saved.'
      );
    } finally {
      setSaving(false);
    }
  };
  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    border: `1px solid ${T.border}`,
    borderRadius: 9,
    padding: '10px 11px',
    outline: 'none',
    color: T.slate,
    fontSize: 12,
    fontFamily: 'inherit',
  };
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 100,
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        padding: 16,
        background: 'rgba(9,20,38,.55)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <form
        onSubmit={save}
        style={{
          width: 530,
          maxWidth: '100%',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          background: T.white,
          borderRadius: 18,
          boxShadow: '0 28px 65px rgba(9,20,38,.25)',
        }}
      >
        <div
          style={{
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div>
            <h2
              style={{
                color: T.slate,
                margin: 0,
                fontSize: 17,
                fontWeight: 750,
              }}
            >
              {category ? 'Edit category' : 'New category'}
            </h2>
            <p style={{ color: T.slateGray, margin: '4px 0 0', fontSize: 11 }}>
              {category
                ? 'Update catalogue information.'
                : 'Add a service category for vendors.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 0,
              cursor: 'pointer',
              background: 'transparent',
              color: T.slateGray,
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div
          style={{
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {error && (
            <div
              style={{
                color: T.red,
                background: T.redDim,
                borderRadius: 8,
                padding: '9px 10px',
                fontSize: 11,
              }}
            >
              {error}
            </div>
          )}
          <label style={{ color: T.slate, fontSize: 11, fontWeight: 700 }}>
            Category name
            <input
              autoFocus
              required
              value={form.name}
              onChange={(event) => change('name', event.target.value)}
              placeholder="e.g. Electrical repairs"
              style={{ ...inputStyle, marginTop: 6 }}
            />
          </label>
          <label style={{ color: T.slate, fontSize: 11, fontWeight: 700 }}>
            Slug
            <input
              required
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);
                change('slug', event.target.value);
              }}
              placeholder="electrical-repairs"
              style={{ ...inputStyle, marginTop: 6 }}
            />
          </label>
          <label style={{ color: T.slate, fontSize: 11, fontWeight: 700 }}>
            Description
            <textarea
              value={form.description}
              onChange={(event) => change('description', event.target.value)}
              placeholder="Describe the category for vendors."
              rows={3}
              style={{ ...inputStyle, marginTop: 6, resize: 'vertical' }}
            />
          </label>
          <label style={{ color: T.slate, fontSize: 11, fontWeight: 700 }}>
            Image URL{' '}
            <span style={{ color: T.slateGray, fontWeight: 500 }}>
              (optional)
            </span>
            <input
              value={form.image}
              onChange={(event) => change('image', event.target.value)}
              placeholder="https://…"
              style={{ ...inputStyle, marginTop: 6 }}
            />
          </label>
          {form.image && (
            <img
              src={form.image}
              alt="Category preview"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
              style={{
                height: 90,
                width: '100%',
                objectFit: 'cover',
                borderRadius: 10,
                border: `1px solid ${T.border}`,
              }}
            />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 9,
            padding: '15px 20px',
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 9,
              padding: '9px 13px',
              background: T.white,
              color: T.slate,
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              border: 0,
              borderRadius: 9,
              padding: '9px 13px',
              background: T.slate,
              color: T.white,
              cursor: saving ? 'wait' : 'pointer',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {saving ? 'Saving…' : category ? 'Save changes' : 'Create category'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Categories = () => {
  const { isMobile } = useBreakpoint();
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(undefined);
  const [statusUpdating, setStatusUpdating] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/categories', {
        params: { page, limit: 10, status, search },
      });
      setCategories(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || 'Could not load categories.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);
  useEffect(() => {
    const timeout = setTimeout(loadCategories, 250);
    return () => clearTimeout(timeout);
  }, [loadCategories]);
  const activeCount = useMemo(
    () => categories.filter((category) => category.isActive).length,
    [categories]
  );
  const toggleStatus = async (category) => {
    try {
      setStatusUpdating(category._id);
      setError('');
      await api.patch(`/admin/categories/${category._id}/status`, {
        isActive: !category.isActive,
      });
      loadCategories();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          'The category status could not be updated.'
      );
    } finally {
      setStatusUpdating('');
    }
  };
  return (
    <main
      style={{
        padding: isMobile
          ? '18px 14px 36px'
          : '28px clamp(20px, 3vw, 48px) 48px',
        minHeight: '100%',
        background: T.ivory,
      }}
    >
      <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
      <div
        style={{
          maxWidth: 1500,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <ManagementHeader
          eyebrow="Catalogue management"
          title="Categories"
          description="Maintain the active service categories available to vendors."
          search={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="Search name, slug, or description"
          refreshing={loading}
          onRefresh={loadCategories}
        >
          {['all', 'active', 'inactive'].map((item) => (
            <FilterButton
              key={item}
              active={status === item}
              onClick={() => {
                setStatus(item);
                setPage(1);
              }}
            >
              {item}
            </FilterButton>
          ))}
          <button
            type="button"
            onClick={() => setEditing(null)}
            style={{
              border: 0,
              borderRadius: 9,
              padding: '8px 11px',
              background: T.slate,
              color: T.white,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 10,
              fontWeight: 750,
            }}
          >
            <Plus size={14} />
            New category
          </button>
        </ManagementHeader>
        {error && (
          <div
            style={{
              border: `1px solid rgba(239,68,68,.25)`,
              background: T.redDim,
              borderRadius: 10,
              padding: '11px 13px',
              color: T.red,
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
          }}
        >
          <div style={{ ...surface, padding: 15 }}>
            <div
              style={{
                color: T.slateGray,
                fontSize: 10,
                fontWeight: 750,
                textTransform: 'uppercase',
                letterSpacing: '.07em',
              }}
            >
              Visible results
            </div>
            <div
              style={{
                marginTop: 7,
                color: T.slate,
                fontSize: 22,
                fontWeight: 750,
              }}
            >
              {categories.length}
            </div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div
              style={{
                color: T.slateGray,
                fontSize: 10,
                fontWeight: 750,
                textTransform: 'uppercase',
                letterSpacing: '.07em',
              }}
            >
              Active on this page
            </div>
            <div
              style={{
                marginTop: 7,
                color: T.green,
                fontSize: 22,
                fontWeight: 750,
              }}
            >
              {activeCount}
            </div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div
              style={{
                color: T.slateGray,
                fontSize: 10,
                fontWeight: 750,
                textTransform: 'uppercase',
                letterSpacing: '.07em',
              }}
            >
              Total catalogue
            </div>
            <div
              style={{
                marginTop: 7,
                color: T.bronze,
                fontSize: 22,
                fontWeight: 750,
              }}
            >
              {pagination?.total || 0}
            </div>
          </div>
        </section>
        <section style={{ ...surface, overflow: 'hidden' }}>
          <div
            style={{
              padding: '15px 17px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: T.slate,
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              <FolderKanban size={16} color={T.bronze} />
              Service category catalogue
            </div>
            <span style={{ color: T.slateGray, fontSize: 11 }}>
              {pagination?.total || 0} categories
            </span>
          </div>
          {loading ? (
            <div
              style={{
                padding: 56,
                color: T.slateGray,
                textAlign: 'center',
                fontSize: 12,
              }}
            >
              Loading categories…
            </div>
          ) : categories.length ? (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  borderCollapse: 'collapse',
                  width: '100%',
                  minWidth: 800,
                }}
              >
                <thead>
                  <tr>
                    {[
                      'Category',
                      'Slug',
                      'Description',
                      'Status',
                      'Updated',
                      'Actions',
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: '11px 16px',
                          color: T.slateGray,
                          background: T.surfaceLow,
                          borderBottom: `1px solid ${T.border}`,
                          textAlign: 'left',
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: '.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td
                        style={{
                          padding: '13px 16px',
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 9,
                          }}
                        >
                          {category.image ? (
                            <img
                              src={category.image}
                              alt=""
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                objectFit: 'cover',
                                background: T.surfaceLow,
                              }}
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                width: 32,
                                height: 32,
                                display: 'grid',
                                placeItems: 'center',
                                borderRadius: 8,
                                background: 'rgba(168,138,100,.12)',
                                color: T.bronze,
                              }}
                            >
                              <ImageIcon size={15} />
                            </span>
                          )}
                          <span
                            style={{
                              color: T.slate,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          borderBottom: `1px solid ${T.border}`,
                          color: T.slateGray,
                          fontSize: 11,
                        }}
                      >
                        {category.slug}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          borderBottom: `1px solid ${T.border}`,
                          maxWidth: 250,
                          color: T.slateGray,
                          fontSize: 11,
                        }}
                      >
                        {category.description || '—'}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <StatusBadge
                          value={category.isActive ? 'active' : 'inactive'}
                        />
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          borderBottom: `1px solid ${T.border}`,
                          color: T.slateGray,
                          fontSize: 11,
                        }}
                      >
                        {new Intl.DateTimeFormat('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }).format(new Date(category.updatedAt))}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 10 }}>
                          <ActionButton onClick={() => setEditing(category)}>
                            <Pencil
                              size={13}
                              style={{ verticalAlign: '-2px', marginRight: 3 }}
                            />
                            Edit
                          </ActionButton>
                          <ActionButton
                            tone={category.isActive ? 'danger' : 'success'}
                            disabled={statusUpdating === category._id}
                            onClick={() => toggleStatus(category)}
                          >
                            <Power
                              size={13}
                              style={{ verticalAlign: '-2px', marginRight: 3 }}
                            />
                            {statusUpdating === category._id
                              ? 'Saving…'
                              : category.isActive
                                ? 'Deactivate'
                                : 'Activate'}
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyTable label="No categories match the selected filters." />
          )}
          <Pagination pagination={pagination} onPageChange={setPage} />
        </section>
      </div>
      {editing !== undefined && (
        <CategoryModal
          category={editing}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            loadCategories();
          }}
        />
      )}
    </main>
  );
};

export default Categories;

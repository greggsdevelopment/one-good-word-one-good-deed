import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, Plus, Pencil, X, Check, ToggleLeft, ToggleRight, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const INITIAL_FORM = { name: '', description: '', price: '', image: '', sizes: 'S,M,L,XL,2XL', active: true };

export default function MarketplaceTab() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); // product id or 'new'
  const [form, setForm] = useState(INITIAL_FORM);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const allProducts = await base44.entities.Product.list('-created_date', 500);
      return allProducts || [];
    },
  });

  const saveProduct = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        price: parseFloat(data.price) || 0,
        sizes: data.sizes ? data.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      return editing === 'new'
        ? base44.entities.Product.create(payload)
        : base44.entities.Product.update(editing, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setEditing(null);
      setForm(INITIAL_FORM);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, active }) => base44.entities.Product.update(id, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const startEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      image: product.image || '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(',') : (product.sizes || 'S,M,L,XL,2XL'),
      active: product.active !== false,
    });
  };

  const startNew = () => {
    setEditing('new');
    setForm(INITIAL_FORM);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(INITIAL_FORM);
  };

  if (isLoading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      {/* Add new button */}
      {editing !== 'new' && (
        <div className="flex justify-end">
          <Button onClick={startNew} className="bg-ink text-cream hover:bg-ink/80 font-barlow-condensed uppercase tracking-wider text-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Add Product
          </Button>
        </div>
      )}

      {/* New product form */}
      {editing === 'new' && (
        <ProductForm
          form={form}
          setForm={setForm}
          onSave={() => saveProduct.mutate(form)}
          onCancel={cancelEdit}
          saving={saveProduct.isPending}
          isNew
        />
      )}

      {/* Product list */}
      {products.length === 0 && editing !== 'new' && (
        <p className="font-barlow text-ash text-center py-12">No products yet. Add your first product above.</p>
      )}

      {products.map((p) => (
        <div key={p.id}>
          {editing === p.id ? (
            <ProductForm
              form={form}
              setForm={setForm}
              onSave={() => saveProduct.mutate(form)}
              onCancel={cancelEdit}
              saving={saveProduct.isPending}
            />
          ) : (
            <div className={`bg-white rounded-sm border p-4 flex gap-4 ${p.active !== false ? 'border-ink/5' : 'border-ink/5 opacity-60'}`}>
              {/* Image preview */}
              <div className="w-16 h-16 rounded-sm overflow-hidden bg-cream/60 shrink-0 flex items-center justify-center">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-6 h-6 text-ash" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap mb-1">
                  <span className="font-barlow font-bold text-ink">{p.name}</span>
                  <span className="font-barlow-condensed text-gold-dark font-bold">${p.price}</span>
                  <Badge variant={p.active !== false ? 'default' : 'secondary'} className="text-xs">
                    {p.active !== false ? 'Active' : 'Hidden'}
                  </Badge>
                </div>
                {p.description && (
                  <p className="font-barlow text-ash text-sm leading-snug truncate">{p.description}</p>
                )}
                {p.sizes?.length > 0 && (
                  <p className="font-barlow text-ash text-xs mt-1">Sizes: {Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" title={p.active !== false ? 'Hide' : 'Show'}
                  onClick={() => toggleActive.mutate({ id: p.id, active: !(p.active !== false) })}
                  className="text-ash hover:text-ink"
                >
                  {p.active !== false ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="text-ash hover:text-ink">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteProduct.mutate(p.id)} className="text-ash hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProductForm({ form, setForm, onSave, onCancel, saving, isNew }) {
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="bg-cream/40 border-2 border-gold/30 rounded-sm p-5 space-y-4">
      <h3 className="font-barlow-condensed text-ink font-bold text-sm uppercase tracking-wider">
        {isNew ? 'New Product' : 'Edit Product'}
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-barlow text-xs text-ash mb-1 uppercase tracking-wider">Product Name *</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Black Hoodie"
            className="w-full border border-ink/10 rounded-sm px-3 py-2 text-sm font-barlow focus:outline-none focus:border-gold-dark/50"
          />
        </div>
        <div>
          <label className="block font-barlow text-xs text-ash mb-1 uppercase tracking-wider">Price (USD) *</label>
          <input
            type="number" min="0" step="0.01"
            value={form.price}
            onChange={e => set('price', e.target.value)}
            placeholder="25.00"
            className="w-full border border-ink/10 rounded-sm px-3 py-2 text-sm font-barlow focus:outline-none focus:border-gold-dark/50"
          />
        </div>
      </div>
      <div>
        <label className="block font-barlow text-xs text-ash mb-1 uppercase tracking-wider">Description</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={2}
          placeholder="Short product description..."
          className="w-full border border-ink/10 rounded-sm px-3 py-2 text-sm font-barlow focus:outline-none focus:border-gold-dark/50 resize-none"
        />
      </div>
      <div>
        <label className="block font-barlow text-xs text-ash mb-1 uppercase tracking-wider">Image URL</label>
        <input
          value={form.image}
          onChange={e => set('image', e.target.value)}
          placeholder="https://..."
          className="w-full border border-ink/10 rounded-sm px-3 py-2 text-sm font-barlow focus:outline-none focus:border-gold-dark/50"
        />
      </div>
      <div>
        <label className="block font-barlow text-xs text-ash mb-1 uppercase tracking-wider">Sizes (comma-separated, leave blank if none)</label>
        <input
          value={form.sizes}
          onChange={e => set('sizes', e.target.value)}
          placeholder="S,M,L,XL,2XL"
          className="w-full border border-ink/10 rounded-sm px-3 py-2 text-sm font-barlow focus:outline-none focus:border-gold-dark/50"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox" id="active-toggle"
          checked={form.active}
          onChange={e => set('active', e.target.checked)}
          className="w-4 h-4 accent-gold-dark"
        />
        <label htmlFor="active-toggle" className="font-barlow text-sm text-ink">Visible in shop</label>
      </div>
      <div className="flex gap-3">
        <Button onClick={onSave} disabled={saving || !form.name || !form.price}
          className="bg-ink text-cream hover:bg-ink/80 font-barlow-condensed uppercase tracking-wider text-sm">
          <Check className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save Product'}
        </Button>
        <Button variant="ghost" onClick={onCancel} className="font-barlow-condensed uppercase tracking-wider text-sm">
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
}
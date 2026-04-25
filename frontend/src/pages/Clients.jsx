import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, User, Phone, MapPin, Search, ChevronRight, X } from 'lucide-react';
import { clients as clientsApi } from '../api';

function AddClientModal({ onClose, onSave }) {
  const [form, setForm] = useState({ nom: '', prenom: '', prefix: '+212', tel: '', adresse: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.nom.trim())   e.nom    = 'Requis';
    if (!form.prenom.trim()) e.prenom = 'Requis';
    if (form.tel.replace(/\D/g, '').length < 7) e.tel = 'Numéro invalide (min 7 chiffres)';
    if (!form.adresse.trim()) e.adresse = 'Requise';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    setApiError('');
    try {
      await onSave({
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        phone: `${form.prefix} ${form.tel.trim()}`,
        adresse: form.adresse.trim(),
      });
      onClose();
    } catch (err) {
      setApiError(err.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#f0e8f4,#e8dff0)', color: '#9b6b7a' }}>
              <User size={18} />
            </div>
            <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>Nouveau client</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {apiError && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{apiError}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Nom *</label>
              <input
                value={form.nom}
                onChange={e => set('nom', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-[#9E8A9C] ${errors.nom ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}
              />
              {errors.nom && <p className="text-xs text-red-500 mt-0.5">{errors.nom}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Prénom *</label>
              <input
                value={form.prenom}
                onChange={e => set('prenom', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-[#9E8A9C] ${errors.prenom ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}
              />
              {errors.prenom && <p className="text-xs text-red-500 mt-0.5">{errors.prenom}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Numéro Téléphonique *</label>
            <div className="flex gap-2">
              <select
                value={form.prefix}
                onChange={e => set('prefix', e.target.value)}
                className="border border-gray-200 rounded-xl px-2 py-2.5 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]"
              >
                <option value="+212">🇲🇦 +212</option>
                <option value="+213">🇩🇿 +213</option>
                <option value="+216">🇹🇳 +216</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input
                type="tel"
                value={form.tel}
                onChange={e => set('tel', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                className={`flex-1 border rounded-xl px-3 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-[#9E8A9C] ${errors.tel ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}
              />
            </div>
            {errors.tel && <p className="text-xs text-red-500 mt-0.5">{errors.tel}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Adresse *</label>
            <input
              value={form.adresse}
              onChange={e => set('adresse', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-[#9E8A9C] ${errors.adresse ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}
            />
            {errors.adresse && <p className="text-xs text-red-500 mt-0.5">{errors.adresse}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold transition hover:bg-gray-50"
            style={{ color: '#5e4d4d' }}
          >
            Annuler
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-bold transition"
            style={{ background: 'linear-gradient(135deg,#9b6b7a,#b07585)', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Ajout…' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadClients = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clientsApi.list();
      setClients(data);
    } catch (e) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClients(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter(c =>
      `${c.prenom} ${c.nom} ${c.phone} ${c.adresse}`.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const handleAdd = async (data) => {
    const created = await clientsApi.create(data);
    setClients(prev => [created, ...prev]);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-8 bg-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1
          className="font-bold"
          style={{ fontSize: 28, color: '#1a1212', fontFamily: "'DM Serif Display', serif" }}
        >
          Clients
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#9b6b7a,#b07585)', boxShadow: '0 4px 12px rgba(155,107,122,.28)' }}
        >
          <Plus size={16} />
          Ajouter un client
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6 max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c4b0aa' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un client…"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]"
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Contenu */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm" style={{ color: '#9a8585' }}>Chargement…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <User size={48} strokeWidth={1} style={{ color: '#d4c5be' }} />
          <p className="text-sm font-semibold" style={{ color: '#9a8585' }}>
            {search ? 'Aucun client trouvé' : 'Aucun client pour l\'instant'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(client => (
            <div
              key={client.id}
              onClick={() => navigate(`/clients/${client.id}`)}
              className="group flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md hover:border-[#c49aaa]"
            >
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#f0e8f4,#e8dff0)', color: '#9b6b7a' }}
              >
                <User size={24} />
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base truncate mb-1.5" style={{ color: '#1a1212' }}>
                  {client.prenom} {client.nom}
                </p>
                <div className="flex items-center gap-1.5 mb-1">
                  <Phone size={12} style={{ color: '#c49aaa', flexShrink: 0 }} />
                  <span className="text-xs truncate" style={{ color: '#5e4d4d' }}>{client.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} style={{ color: '#c49aaa', flexShrink: 0 }} />
                  <span className="text-xs truncate" style={{ color: '#5e4d4d' }}>{client.adresse}</span>
                </div>
              </div>

              <ChevronRight size={16} className="flex-shrink-0 transition" style={{ color: '#d4c5be' }} />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddClientModal onClose={() => setShowModal(false)} onSave={handleAdd} />
      )}
    </div>
  );
}

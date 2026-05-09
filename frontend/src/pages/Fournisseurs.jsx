import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Truck, Phone, MapPin, Search, ChevronRight, X, Mail, Building2 } from 'lucide-react';
import { fournisseurs as api } from '../api';

const font = { fontFamily: "'DM Sans', sans-serif" };
const accent = '#5a7a9b';

function FournisseurModal({ onClose, onSave }) {
  const [form, setForm] = useState({ nom: '', prenom: '', societe: '', prefix: '+212', tel: '', email: '', adresse: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const submit = async () => {
    const e = {};
    if (!form.nom.trim())   e.nom    = 'Requis';
    if (!form.prenom.trim()) e.prenom = 'Requis';
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true); setApiError('');
    try {
      await onSave({
        nom:     form.nom.trim(),
        prenom:  form.prenom.trim(),
        societe: form.societe.trim(),
        phone:   form.tel.trim() ? `${form.prefix} ${form.tel.trim()}` : '',
        email:   form.email.trim(),
        adresse: form.adresse.trim(),
      });
      onClose();
    } catch (err) { setApiError(err.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={font} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#e8f0f8,#dce8f4)', color: accent }}>
              <Truck size={18} />
            </div>
            <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>Nouveau fournisseur</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {apiError && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{apiError}</p>}

          <div className="grid grid-cols-2 gap-4">
            {[['nom', 'Nom *'], ['prenom', 'Prénom *']].map(([k, lbl]) => (
              <div key={k}>
                <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>{lbl}</label>
                <input value={form[k]} onChange={e => set(k, e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C] ${errors[k] ? 'border-red-400' : 'border-gray-200'}`} />
                {errors[k] && <p className="text-xs text-red-500 mt-0.5">{errors[k]}</p>}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Société</label>
            <input value={form.societe} onChange={e => set('societe', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]" />
          </div>

          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Téléphone</label>
            <div className="flex gap-2">
              <select value={form.prefix} onChange={e => set('prefix', e.target.value)}
                className="border border-gray-200 rounded-xl px-2 py-2.5 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]">
                <option value="+212">🇲🇦 +212</option>
                <option value="+213">🇩🇿 +213</option>
                <option value="+216">🇹🇳 +216</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+1">🇺🇸 +1</option>
              </select>
              <input type="tel" value={form.tel} onChange={e => set('tel', e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]" />
          </div>

          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Adresse</label>
            <input value={form.adresse} onChange={e => set('adresse', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]" />
          </div>
        </div>

        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50" style={{ color: '#5e4d4d' }}>Annuler</button>
          <button onClick={submit} disabled={saving} className="px-5 py-2.5 rounded-xl text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#5a7a9b,#7a9ab5)', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Ajout…' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Fournisseurs() {
  const navigate = useNavigate();
  const [list,      setList]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [search,    setSearch]    = useState('');
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try { 
      const res = await api.list(); 
      if (res.length > 0) {
        navigate(`/fournisseurs/${res[0]._id}`, { replace: true });
        return;
      } else {
        // Create the unique supplier if it doesn't exist
        const f = await api.create({
          nom: 'Principal', prenom: 'Fournisseur', societe: 'Fournisseur Unique'
        });
        navigate(`/fournisseurs/${f._id}`, { replace: true });
        return;
      }
    }
    catch (e) { setError(e.message || 'Erreur de chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(f => `${f.prenom} ${f.nom} ${f.societe} ${f.phone}`.toLowerCase().includes(q));
  }, [list, search]);

  const handleAdd = async data => {
    const f = await api.create(data);
    setList(prev => [f, ...prev]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-white" style={font}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-bold" style={{ fontSize: 28, color: '#1a1212', fontFamily: "'DM Serif Display', serif" }}>Fournisseurs</h1>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c4b0aa' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un fournisseur…"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]" />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center h-64"><p className="text-sm" style={{ color: '#9a8585' }}>Chargement…</p></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Truck size={48} strokeWidth={1} style={{ color: '#d4c5be' }} />
          <p className="text-sm font-semibold" style={{ color: '#9a8585' }}>{search ? 'Aucun fournisseur trouvé' : 'Aucun fournisseur pour l\'instant'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(f => (
            <div key={f._id} onClick={() => navigate(`/fournisseurs/${f._id}`)}
              className="group flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-[#7a9ab5] transition-all">
              <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#e8f0f8,#dce8f4)', color: accent }}>
                <Truck size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base truncate mb-1" style={{ color: '#1a1212' }}>{f.prenom} {f.nom}</p>
                {f.societe && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Building2 size={12} style={{ color: '#7a9ab5', flexShrink: 0 }} />
                    <span className="text-xs truncate" style={{ color: '#5e4d4d' }}>{f.societe}</span>
                  </div>
                )}
                {f.phone && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Phone size={12} style={{ color: '#7a9ab5', flexShrink: 0 }} />
                    <span className="text-xs truncate" style={{ color: '#5e4d4d' }}>{f.phone}</span>
                  </div>
                )}
                {f.adresse && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} style={{ color: '#7a9ab5', flexShrink: 0 }} />
                    <span className="text-xs truncate" style={{ color: '#5e4d4d' }}>{f.adresse}</span>
                  </div>
                )}
              </div>
              <ChevronRight size={16} className="flex-shrink-0" style={{ color: '#d4c5be' }} />
            </div>
          ))}
        </div>
      )}

      {showModal && <FournisseurModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
    </div>
  );
}

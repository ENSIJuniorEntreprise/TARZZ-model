import { useEffect, useState } from 'react';
import { Plus, User, Phone, MapPin, Check } from 'lucide-react';
import { clients as clientsApi } from '../api';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [currentView, setCurrentView] = useState('list');
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nom: '', prenom: '', tel: '', prefix: '+216', adresse: '',
  });

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      setApiError('');
      try {
        const data = await clientsApi.list();
        setClients(data.map(c => ({
          id: c.id,
          nom: c.nom,
          prenom: c.prenom,
          phone: c.phone,
          adresse: c.adresse,
        })));
      } catch (error) {
        setApiError(error.message || 'Erreur lors du chargement des clients');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const handleAddClient = () => {
    setFormData({ nom: '', prenom: '', tel: '', prefix: '+216', adresse: '' });
    setErrors({});
    setCurrentView('form');
  };

  const handleBackToList = () => setCurrentView('list');

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = { fieldNom: 'nom', fieldPrenom: 'prenom', fieldTel: 'tel', fieldPrefix: 'prefix', fieldAdresse: 'adresse' };
    setFormData(prev => ({ ...prev, [fieldMap[id] || id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: false }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.nom.trim()) e.fieldNom = true;
    if (!formData.prenom.trim()) e.fieldPrenom = true;
    if (formData.tel.replace(/\s/g, '').length < 7) e.fieldTel = true;
    if (!formData.adresse.trim()) e.fieldAdresse = true;
    return e;
  };

  const handleSaveClient = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setApiError('');
    try {
      const created = await clientsApi.create({
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        phone: `${formData.prefix} ${formData.tel}`.trim(),
        adresse: formData.adresse.trim(),
      });

      setClients(prev => [{
        id: created.id,
        nom: created.nom,
        prenom: created.prenom,
        phone: created.phone,
        adresse: created.adresse,
      }, ...prev]);

      setCurrentView('list');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3200);
    } catch (error) {
      setApiError(error.message || 'Erreur lors de la creation du client');
    }
  };

  return (
    <>
      <style>{`
        .client-card { transition: box-shadow 0.2s, transform 0.18s, border-color 0.2s; }
        .client-card:hover { box-shadow: 0 8px 28px rgba(155,107,122,0.13); transform: translateY(-2px); border-color: #c49aaa; }
        .client-card:hover .left-border { opacity: 1; }
        .left-border { opacity: 0; transition: opacity 0.2s; }
        .btn-hover-rose { background-color: #9b6b7a; transition: background-color 0.18s, transform 0.15s, box-shadow 0.15s; box-shadow: 0 4px 12px rgba(155,107,122,0.28); }
        .btn-hover-rose:hover { background-color: #7a4d5d; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(155,107,122,0.38); }
        .btn-cancel-hover { transition: background-color 0.18s, color 0.18s; }
        .btn-cancel-hover:hover { background-color: #f4f4f5; color: #1a1212; }
        @keyframes slideUp {
          from { transform: translateY(80px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .toast-show { animation: slideUp 0.32s cubic-bezier(.22,1,.36,1); }
        input[type="text"], input[type="tel"] { border: 1.5px solid #e0d5cf; background-color: #ffffff; color: #1a1212; font-size: 15px; }
        select { border: 1.5px solid #e0d5cf; background-color: #ffffff; color: #1a1212; font-size: 15px; }
        input.error, select.error { border-color: #d94f4f !important; }
      `}</style>

      {/* LIST VIEW */}
      {currentView === 'list' && (
        <main className="flex-1 p-8 flex flex-col bg-white">
          <div className="flex items-center justify-between mb-8">
            <h1
              className="font-serif-custom font-bold"
              style={{ fontSize: "42px", color: "#1a1212", letterSpacing: "0.01em" }}
            >
              Clients
            </h1>
            <button
              onClick={handleAddClient}
              className="btn-hover-rose flex items-center gap-2.5 px-6 py-3 text-white rounded-xl border-none font-sans-custom font-bold"
              style={{ fontSize: "15px" }}
            >
              <Plus size={17} />
              Ajouter un client
            </button>
          </div>

          {apiError && (
            <p className="font-sans-custom text-sm mb-4" style={{ color: '#b91c1c' }}>{apiError}</p>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <p className="font-sans-custom font-semibold" style={{ fontSize: '16px', color: '#9a8585' }}>
                Chargement des clients...
              </p>
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <User size={56} strokeWidth={1} style={{ color: "#d4c5be" }} />
              <p className="font-sans-custom font-semibold" style={{ fontSize: "16px", color: "#9a8585" }}>
                Aucun client pour l'instant
              </p>
              <p className="font-sans-custom" style={{ fontSize: "14px", color: "#b4a0a0" }}>
                Cliquez sur "Ajouter un client" pour commencer
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {clients.map((client, idx) => (
                <div
                  key={idx}
                  className="client-card bg-white rounded-2xl p-6 flex gap-4 border relative overflow-hidden"
                  style={{ borderColor: '#e0d5cf' }}
                >
                  <div className="left-border absolute left-0 top-0 w-1 h-full" style={{ backgroundColor: '#9b6b7a' }} />
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f4f4f5', color: '#9b6b7a' }}>
                    <User size={26} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-serif-custom font-bold mb-2 truncate"
                      style={{ fontSize: "20px", color: '#1a1212', letterSpacing: '0.01em' }}
                    >
                      {client.prenom} {client.nom}
                    </h3>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Phone size={14} style={{ color: '#c49aaa', flexShrink: 0 }} />
                      <span className="font-sans-custom truncate" style={{ fontSize: "14px", color: "#5e4d4d" }}>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} style={{ color: '#c49aaa', flexShrink: 0 }} />
                      <span className="font-sans-custom truncate" style={{ fontSize: "14px", color: "#5e4d4d" }}>{client.adresse}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* FORM VIEW */}
      {currentView === 'form' && (
        <div className="flex-1 p-8 flex flex-col bg-white">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-7 font-sans-custom font-semibold" style={{ fontSize: "14px", color: "#7a6060" }}>
            <button
              onClick={handleBackToList}
              className="border-none bg-transparent cursor-pointer font-sans-custom font-semibold"
              style={{ fontSize: "14px", color: '#9b6b7a' }}
            >
              Clients
            </button>
            <span style={{ color: "#c4b0aa" }}>/</span>
            <span>Nouveau client</span>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl border" style={{ borderColor: '#e0d5cf' }}>
            {/* Form header */}
            <div className="p-7 border-b flex items-center gap-4" style={{ borderColor: '#e0d5cf' }}>
              <div className="w-13 h-13 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f4f4f5', color: '#9b6b7a', width: 52, height: 52 }}>
                <User size={26} />
              </div>
              <div>
                <h2
                  className="font-serif-custom font-bold"
                  style={{ fontSize: "28px", color: '#1a1212', letterSpacing: '0.01em' }}
                >
                  Nouveau Client
                </h2>
                <p
                  className="font-sans-custom mt-1"
                  style={{ fontSize: "14px", color: '#7a6060' }}
                >
                  Remplissez les informations du client ci-dessous
                </p>
              </div>
            </div>

            {/* Form body */}
            <div className="p-8 flex flex-col gap-6">
              {apiError && (
                <p className="font-sans-custom text-sm" style={{ color: '#b91c1c' }}>{apiError}</p>
              )}

              <div className="grid grid-cols-2 gap-5">
                {/* Nom */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-sans-custom font-bold uppercase"
                    style={{ fontSize: "11px", color: "#5e4d4d", letterSpacing: "0.14em" }}
                  >
                    Nom
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c49aaa' }} />
                    <input
                      type="text" id="fieldNom" placeholder="Ex : Benali"
                      value={formData.nom} onChange={handleFormChange}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl font-sans-custom outline-none transition ${errors.fieldNom ? 'error' : ''}`}
                    />
                  </div>
                  {errors.fieldNom && <span className="font-sans-custom font-semibold" style={{ fontSize: "13px", color: '#d94f4f' }}>Le nom est requis</span>}
                </div>

                {/* Prénom */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-sans-custom font-bold uppercase"
                    style={{ fontSize: "11px", color: "#5e4d4d", letterSpacing: "0.14em" }}
                  >
                    Prénom
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c49aaa' }} />
                    <input
                      type="text" id="fieldPrenom" placeholder="Ex : Fatima Zahra"
                      value={formData.prenom} onChange={handleFormChange}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl font-sans-custom outline-none transition ${errors.fieldPrenom ? 'error' : ''}`}
                    />
                  </div>
                  {errors.fieldPrenom && <span className="font-sans-custom font-semibold" style={{ fontSize: "13px", color: '#d94f4f' }}>Le prénom est requis</span>}
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-sans-custom font-bold uppercase"
                  style={{ fontSize: "11px", color: "#5e4d4d", letterSpacing: "0.14em" }}
                >
                  Numéro Téléphonique
                </label>
                <div className="flex">
                  <select
                    id="fieldPrefix" value={formData.prefix} onChange={handleFormChange}
                    className="flex-shrink-0 w-28 px-2 py-3 rounded-l-xl font-sans-custom outline-none transition appearance-none cursor-pointer"
                    style={{ borderRight: 'none' }}
                  >
                    <option value="+212">🇲🇦 +212</option>
                    <option value="+213">🇩🇿 +213</option>
                    <option value="+216">🇹🇳 +216</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <input
                    type="tel" id="fieldTel" placeholder="6 00 123 456"
                    value={formData.tel} onChange={handleFormChange}
                    className={`flex-1 px-3.5 py-3 rounded-r-xl font-sans-custom outline-none transition ${errors.fieldTel ? 'error' : ''}`}
                  />
                </div>
                {errors.fieldTel && <span className="font-sans-custom font-semibold" style={{ fontSize: "13px", color: '#d94f4f' }}>Numéro invalide (min 7 chiffres)</span>}
              </div>

              {/* Adresse */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-sans-custom font-bold uppercase"
                  style={{ fontSize: "11px", color: "#5e4d4d", letterSpacing: "0.14em" }}
                >
                  Adresse
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c49aaa' }} />
                  <input
                    type="text" id="fieldAdresse" placeholder="Ex : 12 Rue Hassan II, Casablanca"
                    value={formData.adresse} onChange={handleFormChange}
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl font-sans-custom outline-none transition ${errors.fieldAdresse ? 'error' : ''}`}
                  />
                </div>
                {errors.fieldAdresse && <span className="font-sans-custom font-semibold" style={{ fontSize: "13px", color: '#d94f4f' }}>L'adresse est requise</span>}
              </div>
            </div>

            {/* Form footer */}
            <div className="px-8 py-5 border-t flex gap-3 justify-end" style={{ borderColor: '#e0d5cf' }}>
              <button
                onClick={handleBackToList}
                className="btn-cancel-hover px-6 py-3 rounded-xl font-sans-custom font-semibold border"
                style={{ fontSize: "15px", borderColor: '#e0d5cf', backgroundColor: '#ffffff', color: '#5e4d4d' }}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveClient}
                className="btn-hover-rose flex items-center gap-2.5 px-6 py-3 text-white rounded-xl border-none font-sans-custom font-bold"
                style={{ fontSize: "15px" }}
              >
                <Check size={17} />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div
          className="toast-show fixed bottom-7 right-7 text-white px-6 py-4 rounded-xl flex items-center gap-3 z-50 shadow-2xl font-sans-custom font-bold"
          style={{ fontSize: "15px", backgroundColor: '#1a1212' }}
        >
          <Check size={18} style={{ color: '#7ecc88', flexShrink: 0 }} />
          Client ajouté avec succès !
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import { Plus, LogOut, Search, Settings, Users, LayoutGrid, Package, List, User, Phone, MapPin, Check } from 'lucide-react';

export default function HajtajebModel() {
  const [clients, setClients] = useState();
  const [currentView, setCurrentView] = useState('list');
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    tel: '',
    prefix: '+216',
    adresse: '',
  });

  const handleAddClient = () => {
    setFormData({ nom: '', prenom: '', tel: '', prefix: '+21', adresse: '' });
    setErrors({});
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      'fieldNom': 'nom',
      'fieldPrenom': 'prenom',
      'fieldTel': 'tel',
      'fieldPrefix': 'prefix',
      'fieldAdresse': 'adresse',
    };
    
    setFormData(prev => ({
      ...prev,
      [fieldMap[id] || id]: value
    }));
    
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.fieldNom = true;
    if (!formData.prenom.trim()) newErrors.fieldPrenom = true;
    if (formData.tel.replace(/\s/g, '').length < 7) newErrors.fieldTel = true;
    if (!formData.adresse.trim()) newErrors.fieldAdresse = true;
    return newErrors;
  };

  const handleSaveClient = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newClient = {
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      phone: `${formData.prefix} ${formData.tel}`,
      adresse: formData.adresse.trim(),
    };

    setClients(prev => [newClient, ...prev]);
    setCurrentView('list');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3200);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#fffff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        
        /* Custom Tailwind colors */
        .cream { background-color: #ffffff; }
        .parchment { background-color: #f2ece4; }
        .rose-primary { background-color: #9b6b7a; color: #ffffff; }
        .rose-mid-bg { background-color: #c49aaa; }
        .rose-deep-bg { background-color: #7a4d5d; }
        .charcoal { color: #2e2626; }
        .muted { color: #8a7878; }
        .border-custom { border-color: #e0d5cf; }
        
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans-custom { font-family: 'DM Sans', sans-serif; }
        
        input::placeholder { color: #8a7878; opacity: 0.7; }
        input:focus { border-color: #9b6b7a !important; box-shadow: 0 0 0 3px rgba(155,107,122,0.12) !important; background-color: #ffffff !important; }
        select:focus { border-color: #9b6b7a !important; box-shadow: 0 0 0 3px rgba(155,107,122,0.12) !important; }
        
        .nav-item { transition: background-color 0.18s, color 0.18s; }
        .nav-item:hover { background-color: #f2ece4; color: #2e2626; }
        .nav-item.active { background-color: #9b6b7a; color: #ffffff; }
        
        .btn-hover-rose:hover { background-color: #7a4d5d; transform: translateY(-1px); }
        .btn-logout:hover { background-color: #fdf0f0; color: #b34343; }
        .btn-cancel-hover:hover { background-color: #f2ece4; color: #2e2626; }
        .icon-btn-hover:hover { background-color: #f2ece4; }
        
        .client-card { transition: box-shadow 0.2s, transform 0.18s, border-color 0.2s; }
        .client-card:hover { box-shadow: 0 8px 28px rgba(155,107,122,0.13); transform: translateY(-2px); border-color: #c49aaa; }
        .client-card:hover .left-border { opacity: 1; }
        
        .left-border { opacity: 0; transition: opacity 0.2s; }
        
        @keyframes slideUp {
          from { transform: translateY(80px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .toast-show { animation: slideUp 0.32s cubic-bezier(.22,1,.36,1); }
        
        input[type="text"], input[type="tel"] {
          border: 1.5px solid #e0d5cf;
          background-color: #faf7f4;
          color: #2e2626;
        }
        
        select {
          border: 1.5px solid #e0d5cf;
          background-color: #f2ece4;
          color: #2e2626;
        }
        
        input.error, select.error {
          border-color: #d94f4f !important;
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-56 h-screen bg-white border-r" style={{ borderColor: '#e0d5cf' }}>
        {/* Logo */}
        <div className="px-5 py-6 border-b" style={{ borderColor: '#e0d5cf' }}>
          <div className="font-serif text-2xl font-bold mb-0.5" style={{ color: '#2e2626', letterSpacing: '0.03em' }}>
            HAJTAIEB<span style={{ color: '#9b6b7a' }}> Model</span>
          </div>
          <div className="text-xs muted" style={{ letterSpacing: '0.12em' }}>Tapis &amp; Kilim · Jewelry · Modèles</div>
        </div>

        {/* Nav Label */}
        <div className="px-5 py-5 text-xs font-medium muted" style={{ letterSpacing: '0.14em' }}>Gestion Interne</div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
          <button href ="Accueil.jsx" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm muted font-sans-custom border-none bg-transparent">
            <LayoutGrid size={16} />
            Dashboard
          </button>
          <button href="ProduitsCategories.jsx" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm muted font-sans-custom border-none bg-transparent">
            <List size={16} />
            Catégories et Stock
          </button>
 
          <button href="Clients.jsx"className="nav-item active flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium font-sans-custom border-none">
            <Users size={16} />
            Clients
          </button>
        </nav>

        {/* Footer */}
        <div className="border-t p-3" style={{ borderColor: '#fffff' }}>
          <button href ="login.jsx" className="btn-logout flex items-center gap-2.5 px-3 py-2.5 w-full text-sm muted rounded-lg border-none bg-transparent font-sans-custom">
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b sticky top-0 z-50 flex items-center gap-4 px-8" style={{ borderColor: '#e0d5cf' }}>
          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 muted pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un client …"
              className="w-full pl-10 pr-4 py-2 rounded-full text-sm font-sans-custom border"
              style={{ backgroundColor: '#f2ece4', borderColor: '#e0d5cf' }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button className="icon-btn-hover w-9 h-9 rounded-full flex items-center justify-center muted border-none bg-transparent" title="Paramètres">
              <Settings size={17} />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold font-serif ml-1.5" style={{ backgroundColor: '#9b6b7a', border: '2px solid #c49aaa' }} title="Mon compte">
              HM
            </div>
          </div>
        </header>

        {/* LIST VIEW */}
        {currentView === 'list' && (
          <main className="flex-1 p-9 flex flex-col cream">
            <div className="flex items-center justify-between mb-7">
              <h1 className="font-serif text-4xl font-bold" style={{ color: '#2e2626', letterSpacing: '0.01em' }}>Client</h1>
              <button
                onClick={handleAddClient}
                className="btn-hover-rose flex items-center gap-2 px-5 py-2.5 text-white rounded-lg text-sm font-medium border-none font-sans-custom transition shadow-lg"
                style={{ backgroundColor: '#9b6b7a' }}
              >
                <Plus size={15} />
                Ajouter un client
              </button>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {clients.map((client, idx) => (
                <div
                  key={idx}
                  className="client-card bg-white rounded-2xl p-6 flex gap-4 border relative overflow-hidden"
                  style={{ borderColor: '#e0d5cf' }}
                >
                  {/* Left border accent */}
                  <div className="left-border absolute left-0 top-0 w-1 h-full" style={{ backgroundColor: '#9b6b7a' }} />

                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border-none" style={{ backgroundColor: '#f2ece4', color: '#9b6b7a' }}>
                    <User size={26} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl font-bold mb-2 truncate" style={{ color: '#2e2626', letterSpacing: '0.01em' }}>
                      {client.prenom} {client.nom}
                    </h3>
                    <div className="flex items-center gap-2 text-xs mb-1 muted">
                      <Phone size={13} style={{ color: '#c49aaa', flexShrink: 0 }} />
                      <span className="truncate">{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs muted">
                      <MapPin size={13} style={{ color: '#c49aaa', flexShrink: 0 }} />
                      <span className="truncate">{client.adresse}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* FORM VIEW */}
        {currentView === 'form' && (
          <div className="flex-1 p-9 flex flex-col cream">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs muted mb-7">
              <button onClick={handleBackToList} className="border-none bg-transparent" style={{ color: '#9b6b7a' }}>
                Clients
              </button>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>Nouveau client</span>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl overflow-hidden max-w-2xl border" style={{ borderColor: '#e0d5cf' }}>
              {/* Form Header */}
              <div className="p-7 border-b flex items-center gap-4" style={{ borderColor: '#e0d5cf' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2ece4', color: '#9b6b7a' }}>
                  <User size={24} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold" style={{ color: '#fffff', letterSpacing: '0.01em' }}>Nouveau Client</h2>
                  <p className="text-xs muted mt-0.5">Remplissez les informations du client ci-dessous</p>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-8 flex flex-col gap-5.5">
                {/* Nom & Prénom */}
                <div className="grid grid-cols-2 gap-4.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium muted font-sans-custom" style={{ letterSpacing: '0.08em' }}>Nom</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c49aaa' }} />
                      <input
                        type="text"
                        id="fieldNom"
                        placeholder="Ex : Benali"
                        value={formData.nom}
                        onChange={handleFormChange}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl font-sans-custom text-sm outline-none transition ${errors.fieldNom ? 'error' : ''}`}
                      />
                    </div>
                    {errors.fieldNom && <span className="text-xs" style={{ color: '#d94f4f' }}>Le nom est requis</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium muted font-sans-custom" style={{ letterSpacing: '0.08em' }}>Prénom</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c49aaa' }} />
                      <input
                        type="text"
                        id="fieldPrenom"
                        placeholder="Ex : Fatima Zahra"
                        value={formData.prenom}
                        onChange={handleFormChange}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl font-sans-custom text-sm outline-none transition ${errors.fieldPrenom ? 'error' : ''}`}
                      />
                    </div>
                    {errors.fieldPrenom && <span className="text-xs" style={{ color: '#d94f4f' }}>Le prénom est requis</span>}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium muted font-sans-custom" style={{ letterSpacing: '0.08em' }}>Numéro Téléphonique</label>
                  <div className="flex gap-0">
                    <select
                      id="fieldPrefix"
                      value={formData.prefix}
                      onChange={handleFormChange}
                      className="flex-shrink-0 w-28 px-2 py-2.5 rounded-l-xl text-sm font-sans-custom outline-none transition appearance-none cursor-pointer"
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
                      type="tel"
                      id="fieldTel"
                      placeholder="6 00 123 456"
                      value={formData.tel}
                      onChange={handleFormChange}
                      className={`flex-1 px-3.5 py-2.5 rounded-r-xl font-sans-custom text-sm outline-none transition ${errors.fieldTel ? 'error' : ''}`}
                    />
                  </div>
                  {errors.fieldTel && <span className="text-xs" style={{ color: '#d94f4f' }}>Numéro invalide (min 7 chiffres)</span>}
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium muted font-sans-custom" style={{ letterSpacing: '0.08em' }}>Adresse</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c49aaa' }} />
                    <input
                      type="text"
                      id="fieldAdresse"
                      placeholder="Ex : 12 Rue Hassan II, Casablanca"
                      value={formData.adresse}
                      onChange={handleFormChange}
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl font-sans-custom text-sm outline-none transition ${errors.fieldAdresse ? 'error' : ''}`}
                    />
                  </div>
                  {errors.fieldAdresse && <span className="text-xs" style={{ color: '#d94f4f' }}>L'adresse est requise</span>}
                </div>
              </div>

              {/* Form Footer */}
              <div className="p-5 border-t flex gap-3 justify-end" style={{ borderColor: '#e0d5cf' }}>
                <button
                  onClick={handleBackToList}
                  className="btn-cancel-hover px-6 py-2.5 rounded-lg text-sm font-sans-custom border transition"
                  style={{ borderColor: '#e0d5cf', backgroundColor: '#ffffff', color: '#8a7878' }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveClient}
                  className="btn-hover-rose flex items-center gap-2 px-6 py-2.5 text-white rounded-lg text-sm font-medium border-none font-sans-custom transition shadow-lg"
                  style={{ backgroundColor: '#9b6b7a' }}
                >
                  <Check size={15} />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="toast-show fixed bottom-7 right-7 text-white px-5.5 py-3.5 rounded-xl text-sm flex items-center gap-2.5 z-999 shadow-2xl" style={{ backgroundColor: '#2e2626' }}>
          <Check size={16} style={{ color: '#7ecc88', flexShrink: 0 }} />
          Client ajouté avec succès !
        </div>
      )}
    </div>
  );
}
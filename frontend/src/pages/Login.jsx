import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    setError('')
    setLoading(true)
    try {
      await login(email.trim().toLowerCase(), password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .login-input { font-family:'DM Sans',sans-serif; font-size:15px; color:#1a1212; border:1.5px solid #e0d5cf; background:#fff; width:100%; padding:14px 14px 14px 44px; border-radius:12px; outline:none; transition:border-color .18s,box-shadow .18s; }
        .login-input:focus { border-color:#9b6b7a; box-shadow:0 0 0 3px rgba(155,107,122,.14); }
        .login-input::placeholder { color:#9a8585; font-size:14px; }
        .login-input.error { border-color:#d94f4f; }
        .btn-login { background:linear-gradient(135deg,#9b6b7a,#b07585); color:#fff; border:none; border-radius:12px; padding:14px; width:100%; font-family:'DM Sans',sans-serif; font-size:16px; font-weight:700; cursor:pointer; transition:background .2s,transform .15s,box-shadow .2s; box-shadow:0 4px 14px rgba(155,107,122,.3); }
        .btn-login:hover:not(:disabled) { background:linear-gradient(135deg,#7a4d5d,#9b6b7a); transform:translateY(-1px); box-shadow:0 6px 20px rgba(155,107,122,.4); }
        .btn-login:disabled { opacity:.7; cursor:not-allowed; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
        {/* Logo */}
        <div className="text-center mb-10">
          <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:700, color:'#1a1212', letterSpacing:'0.03em', lineHeight:1 }}>
            HAJTAYEB<span style={{ color:'#9b6b7a' }}> Model</span>
          </div>
          <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'#9b8095', letterSpacing:'0.14em', marginTop:8, fontWeight:500 }}>
            TABLEAU DE BORD ADMINISTRATEUR
          </div>
          <div style={{ width:40, height:2, background:'linear-gradient(90deg,#9b6b7a,#c49aaa)', borderRadius:4, margin:'16px auto 0' }} />
        </div>

        {/* Card */}
        <div style={{ background:'#fff', borderRadius:20, border:'1px solid #ede5df', padding:36, boxShadow:'0 8px 32px rgba(46,38,38,0.08)' }}>
          <h2 style={{ fontFamily:'DM Sans,sans-serif', fontSize:20, fontWeight:700, color:'#1a1212', marginBottom:6 }}>
            Connexion
          </h2>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'#7a6060', marginBottom:28 }}>
            Accédez à votre espace de gestion
          </p>

          {error && (
            <div style={{ background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:10, padding:'12px 14px', marginBottom:20, fontFamily:'DM Sans,sans-serif', fontSize:14, color:'#b91c1c', fontWeight:500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:700, color:'#5e4d4d', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:8 }}>
                Adresse e-mail
              </label>
              <div style={{ position:'relative' }}>
                <Mail size={17} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#c49aaa', pointerEvents:'none' }} />
                <input
                  type="email"
                  className={`login-input${error ? ' error' : ''}`}
                  placeholder=""
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom:28 }}>
              <label style={{ display:'block', fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:700, color:'#5e4d4d', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:8 }}>
                Mot de passe
              </label>
              <div style={{ position:'relative' }}>
                <Lock size={17} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#c49aaa', pointerEvents:'none' }} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  className={`login-input${error ? ' error' : ''}`}
                  placeholder=""
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  style={{ paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9a8585', padding:0 }}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', fontFamily:'DM Sans,sans-serif', fontSize:13, color:'#b4a0a0', marginTop:24 }}>
          Accès réservé à l'administrateur
        </p>
      </div>
    </div>
  )
}

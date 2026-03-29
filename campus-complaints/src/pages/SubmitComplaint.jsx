import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitComplaint } from '../services/api';
import { useAuth } from '../components/AuthContext';

const CATEGORIES = ['WiFi', 'Hostel', 'Equipment', 'Library'];

const SubmitComplaint = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ title: '', description: '', category: 'WiFi', location: '' });
  const [fileName, setFileName] = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = e => {
    const f = e.target.files[0];
    if (f) setFileName(f.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.title.trim())       return setError('Title is required');
    if (!form.description.trim()) return setError('Description is required');
    if (!form.location.trim())    return setError('Location is required');

    setLoading(true);
    try {
      const result = await submitComplaint({ ...form, userId: user?.id, imageUrl: fileName || null });
      console.log('[Submit] Complaint created:', result);
      setSuccess('Complaint submitted successfully! Redirecting to your complaints…');
      setForm({ title: '', description: '', category: 'WiFi', location: '' });
      setFileName('');
      setTimeout(() => navigate('/my-complaints'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content page-animate">
      <div className="page-header">
        <h1>Submit a Complaint</h1>
        <p>Report a campus issue and we'll address it promptly</p>
      </div>

      <div className="form-card">
        {error   && <div className="alert error">⚠️ {error}</div>}
        {success && <div className="alert success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Complaint Title *</label>
            <input
              type="text" name="title" className="form-input"
              placeholder="Brief summary of the issue"
              value={form.title} onChange={handle}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description" className="form-textarea"
              placeholder="Describe the issue in detail — when it started, how it affects you, etc."
              value={form.description} onChange={handle}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-select" value={form.category} onChange={handle}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text" name="location" className="form-input"
                placeholder="e.g. Block A, Room 204"
                value={form.location} onChange={handle}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Attach Image (optional)</label>
            <label className="file-upload-area">
              <input type="file" accept="image/*" onChange={handleFile} />
              <div className="file-upload-icon">📎</div>
              <p>Click to upload a photo of the issue</p>
              {fileName && <div className="file-name">✅ {fileName}</div>}
            </label>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⏳ Submitting…' : '🚀 Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;

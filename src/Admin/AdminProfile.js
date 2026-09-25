import React from 'react';

export default function AdminProfile() {
  const adminData = JSON.parse(localStorage.getItem('admin') || '{}');

  return (
    <main className="profile-page">
      <section className="profile-card profile-card-modern">
        <div className="profile-icon admin-avatar">A</div>
        <p className="eyebrow">Administrator profile</p>
        <h2>{adminData.username || 'System administrator'}</h2>
        <div className="profile-info">
          <p><span>Access:</span> Full administration</p>
          <p><span>Workspace:</span> Soul Medic Hospital</p>
          <p><span>Status:</span> Active</p>
        </div>
      </section>
    </main>
  );
}
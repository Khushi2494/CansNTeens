// Simple verification modal - works without Firebase dependency
(function () {
  const verifiedKey = 'cansnteens_verified_user';
  const stored = localStorage.getItem(verifiedKey);
  
  // If already verified, don't show modal
  if (stored) {
    return;
  }

  // Create and inject modal into DOM
  const modal = document.createElement('div');
  modal.id = 'verification-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4';
  modal.innerHTML = `
    <div class="w-full max-w-md bg-gray-900 rounded-2xl p-6">
      <h2 class="text-2xl font-extrabold gradient-text mb-3">Verify PIN</h2>
      <div id="verification-msg" class="mb-3"></div>

      <form id="verify-pin-form" class="space-y-3">
        <input id="request-id" class="form-input p-3 rounded" placeholder="Request ID" />
        <input id="pin-input" class="form-input p-3 rounded" placeholder="6-digit PIN" />
        <button type="submit" class="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded font-bold">Verify PIN</button>
      </form>
      <button id="skip-verify-btn" class="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded">Skip for Now</button>
    </div>
  `;

  document.body.appendChild(modal);

  function showMessage(msg, color = 'text-teal-300') {
    const el = modal.querySelector('#verification-msg');
    if (el) el.innerHTML = `<div class="p-3 rounded bg-gray-800 ${color}">${msg}</div>`;
  }

  // Form submit handler
  modal.querySelector('#verify-pin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const requestId = modal.querySelector('#request-id').value.trim();
    const pin = modal.querySelector('#pin-input').value.trim();
    
    if (!requestId || !pin) {
      showMessage('Enter both Request ID and PIN', 'text-red-400');
      return;
    }

    try {
      // Check if firebase config is available
      if (typeof window.firebaseConfig === 'undefined' || !window.firebaseConfig.projectId) {
        showMessage('Firebase not configured. Contact admin.', 'text-red-400');
        return;
      }

      const projectId = window.firebaseConfig.projectId;
      const region = window.firebaseConfig.functionsRegion || 'us-central1';
      const url = `https://${region}-${projectId}.cloudfunctions.net/verifyPin`;

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, pin })
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data?.error || 'Verification failed');
      }

      // Success - store verification
      localStorage.setItem(verifiedKey, JSON.stringify({ userId: data.userId, requestId }));
      showMessage('✓ Verified! Welcome!', 'text-teal-300');
      setTimeout(() => {
        modal.remove();
        location.reload();
      }, 800);

    } catch (err) {
      console.error('Verification error:', err);
      showMessage(err.message || 'Verification failed', 'text-red-400');
    }
  });

  // Skip button
  modal.querySelector('#skip-verify-btn').addEventListener('click', () => {
    modal.remove();
  });

})();

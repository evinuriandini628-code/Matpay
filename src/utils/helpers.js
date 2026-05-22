export function formatRupiah(amount) {
  return 'Rp' + new Intl.NumberFormat('id-ID').format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getStatusColor(status) {
  switch (status) {
    case 'success': return 'bg-emerald-50 text-emerald-600';
    case 'pending': return 'bg-amber-50 text-amber-600';
    case 'failed': return 'bg-red-50 text-red-600';
    case 'expired': return 'bg-slate-100 text-slate-500';
    case 'active': return 'bg-emerald-50 text-emerald-600';
    case 'inactive': return 'bg-slate-100 text-slate-500';
    default: return 'bg-slate-100 text-slate-500';
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'success': return 'Berhasil';
    case 'pending': return 'Pending';
    case 'failed': return 'Gagal';
    case 'expired': return 'Expired';
    case 'active': return 'Active';
    case 'inactive': return 'Inactive';
    default: return status;
  }
}

export function timeAgo(dateStr) {
  if (!dateStr) return 'Belum pernah';
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return formatDateShort(dateStr);
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

export function generateOrderId() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${dateStr}-${rand}`;
}

/**
 * Maji Flow - Main JavaScript
 * Flask static file: /static/js/main.js
 *
 * Provides shared utilities used across all pages.
 * Page-specific JS is in the {% block scripts %} of each template.
 */

'use strict';

// ============================================================
// Toast notification system
// ============================================================
function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.mf-toast').forEach(t => t.remove());

    const icons = { success: '\u2705', error: '\u274c', info: '\u2139\ufe0f', warning: '\u26a0\ufe0f' };
    const toast = document.createElement('div');
    toast.className = 'flash flash-' + type + ' mf-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;min-width:280px;';
    toast.innerHTML = `
        <span>${icons[type] || ''} ${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ============================================================
// Loading spinner helper
// ============================================================
function setLoading(buttonId, loading, originalText) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    if (loading) {
        btn.disabled = true;
        btn.dataset.original = btn.textContent;
        btn.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.6s linear infinite;vertical-align:middle;margin-right:6px;"></span>' + (originalText || 'Loading...');
    } else {
        btn.disabled = false;
        btn.textContent = btn.dataset.original || originalText || 'Submit';
    }
}

// ============================================================
// Format currency (ZMW)
// ============================================================
function formatZMW(amount) {
    return 'ZMW ' + parseFloat(amount).toFixed(2);
}

// ============================================================
// Format date/time
// ============================================================
function formatDateTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleString('en-ZM', { dateStyle: 'medium', timeStyle: 'short' });
}

// ============================================================
// API helper with error handling
// ============================================================
async function apiCall(url, method = 'GET', body = null) {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);

    try {
        const res = await fetch(url, opts);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
    } catch (err) {
        console.error(`API Error [${method} ${url}]:`, err.message);
        throw err;
    }
}

// ============================================================
// Bar chart renderer (for usage history)
// ============================================================
function renderBarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const maxVal = Math.max(...data.map(d => d.value));
    container.innerHTML = `
        <div style="display:flex;align-items:flex-end;gap:8px;height:120px;padding:8px 0;">
            ${data.map(d => `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                    <div style="font-size:10px;color:#6b8fad;">${d.value}</div>
                    <div style="
                        width:100%;
                        height:${(d.value / maxVal) * 100}%;
                        background:linear-gradient(180deg,rgba(14,165,233,0.7),rgba(6,182,212,0.3));
                        border-radius:4px 4px 0 0;
                        min-height:4px;
                        transition:height 0.5s ease;
                    " title="${d.label}: ${d.value}L"></div>
                    <div style="font-size:10px;color:#6b8fad;">${d.label}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ============================================================
// Auto-render usage chart if element exists
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    const chartEl = document.getElementById('usageChart');
    if (chartEl) {
        renderBarChart('usageChart', [
            { label: 'Mon', value: 120 },
            { label: 'Tue', value: 95 },
            { label: 'Wed', value: 140 },
            { label: 'Thu', value: 110 },
            { label: 'Fri', value: 160 },
            { label: 'Sat', value: 200 },
            { label: 'Sun', value: 180 },
        ]);
    }

    // Auto-dismiss flash messages after 5 seconds
    document.querySelectorAll('.flash').forEach(f => {
        setTimeout(() => f.remove(), 5000);
    });

    console.log('[Maji Flow] main.js loaded \u2713');
});

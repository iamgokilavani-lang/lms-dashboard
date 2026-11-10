/**
 * Toast Notification System
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!this.container && typeof document !== 'undefined') {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4';
      document.body.appendChild(this.container);
    }
  }

  show({ title, message, type = 'info', duration = 3500 }) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto transform transition-all duration-300 ease-out translate-y-4 opacity-0 p-4 rounded-xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${this.getTypeStyles(type)}`;

    const icon = this.getIcon(type);

    toast.innerHTML = `
      <div class="flex-shrink-0 mt-0.5">${icon}</div>
      <div class="flex-1">
        ${title ? `<h4 class="font-semibold text-sm leading-tight text-gray-900">${title}</h4>` : ''}
        <p class="text-xs text-gray-600 mt-0.5 leading-relaxed">${message}</p>
      </div>
      <button class="text-gray-400 hover:text-gray-600 text-sm ml-2 transition-colors">&times;</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => this.dismiss(toast));

    this.container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }
  }

  dismiss(toast) {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  getTypeStyles(type) {
    switch (type) {
      case 'success':
        return 'bg-emerald-50/95 border-emerald-200 text-emerald-950 shadow-emerald-500/10';
      case 'error':
        return 'bg-rose-50/95 border-rose-200 text-rose-950 shadow-rose-500/10';
      case 'celebrate':
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-950 shadow-amber-500/20';
      default:
        return 'bg-indigo-50/95 border-indigo-200 text-indigo-950 shadow-indigo-500/10';
    }
  }

  getIcon(type) {
    switch (type) {
      case 'success':
        return `<span class="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-600 font-bold text-xs">✓</span>`;
      case 'error':
        return `<span class="inline-flex p-1 rounded-full bg-rose-100 text-rose-600 font-bold text-xs">✕</span>`;
      case 'celebrate':
        return `<span class="text-lg">🎉</span>`;
      default:
        return `<span class="inline-flex p-1 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs">ℹ</span>`;
    }
  }

  success(message, title = 'Success') {
    this.show({ message, title, type: 'success' });
  }

  error(message, title = 'Error') {
    this.show({ message, title, type: 'error' });
  }

  info(message, title = 'Notice') {
    this.show({ message, title, type: 'info' });
  }

  celebrate(message, title = 'Congratulations!') {
    this.show({ message, title, type: 'celebrate', duration: 4500 });
  }
}

export const toast = new ToastManager();


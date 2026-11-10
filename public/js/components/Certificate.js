/**
 * Certificate Generator & Modal
 * Produces an elegant, high-resolution certificate of completion
 */
import { Icons } from './Icons.js';
import { state } from '../state.js';

export class CertificateModal {
  static show(course, score = 100) {
    const profile = state.getProfile();
    const enrollment = state.getEnrollment(course.id);
    const dateStr = enrollment?.quizCompletedAt 
      ? new Date(enrollment.quizCompletedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const certId = `CERT-${course.id.substring(7, 13).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const modal = document.createElement('div');
    modal.id = 'certificate-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in';

    modal.innerHTML = `
      <div class="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]">
        <!-- Modal Action Bar -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <span class="inline-flex p-1.5 rounded-lg bg-amber-100 text-amber-700">${Icons.trophy('w-4 h-4')}</span>
            <span class="font-semibold text-gray-900">Official Certificate of Achievement</span>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-print-cert" class="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              ${Icons.download('w-3.5 h-3.5')} Print / Save PDF
            </button>
            <button id="btn-close-cert" class="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              ${Icons.x('w-5 h-5')}
            </button>
          </div>
        </div>

        <!-- Certificate Printable Sheet -->
        <div class="overflow-y-auto p-6 md:p-8 flex justify-center bg-slate-100">
          <div id="printable-certificate" class="relative w-full max-w-3xl aspect-[1.414/1] bg-white p-8 md:p-12 border-8 border-double border-indigo-900/20 rounded-xl shadow-lg flex flex-col justify-between text-center font-serif text-slate-800 select-none overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-indigo-50/20 to-white">
            
            <!-- Watermark / Background Accent -->
            <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute inset-4 border border-indigo-200 pointer-events-none"></div>

            <!-- Top Header -->
            <div class="relative z-10 pt-2">
              <div class="inline-flex items-center justify-center gap-2 mb-2">
                <span class="text-2xl">🎓</span>
                <span class="font-sans text-xs tracking-widest uppercase font-bold text-indigo-700">MOON LIGHT ACADEMY</span>
              </div>
              <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 font-serif">Certificate of Completion</h1>
              <p class="text-xs md:text-sm text-gray-500 font-sans mt-1">This verifies that the named scholar has successfully mastered all curriculum units and passed the capstone examination.</p>
            </div>

            <!-- Recipient Name -->
            <div class="relative z-10 my-4 md:my-6">
              <p class="font-sans text-xs text-indigo-600 uppercase tracking-widest font-semibold mb-1">PROUDLY PRESENTED TO</p>
              <div class="text-2xl md:text-4xl font-bold text-gray-900 underline decoration-indigo-300 decoration-2 underline-offset-8">
                ${profile.name}
              </div>
              <p class="text-xs text-gray-500 font-sans mt-2">Student ID: ${profile.studentId}</p>
            </div>

            <!-- Course Details -->
            <div class="relative z-10">
              <p class="font-sans text-xs text-gray-600 mb-1">FOR SUCCESSFULLY COMPLETING THE COMPREHENSIVE COURSE</p>
              <h2 class="text-lg md:text-2xl font-bold text-indigo-950 font-sans max-w-xl mx-auto leading-snug">
                ${course.title}
              </h2>
              <div class="font-sans text-xs text-emerald-700 font-medium mt-1">
                Assessment Score: ${score}% • Grade: Distinction
              </div>
            </div>

            <!-- Signatures & Verification -->
            <div class="relative z-10 grid grid-cols-3 gap-4 items-end pt-6 border-t border-indigo-100 font-sans">
              <div class="text-left">
                <p class="text-xs text-gray-400 font-mono">Issued On</p>
                <p class="text-xs font-semibold text-gray-800">${dateStr}</p>
              </div>

              <div class="text-center">
                <div class="w-16 h-16 mx-auto rounded-full bg-amber-50 border-2 border-amber-300 flex flex-col items-center justify-center text-amber-700 shadow-sm">
                  <span class="text-lg">🏆</span>
                  <span class="text-[9px] font-bold uppercase tracking-tighter">VERIFIED</span>
                </div>
              </div>

              <div class="text-right">
                <div class="inline-block text-center border-b border-gray-400 pb-1 px-4 mb-1">
                  <span class="font-serif italic text-sm text-gray-800">${course.instructor.name}</span>
                </div>
                <p class="text-[10px] text-gray-400 uppercase tracking-wider">Course Instructor</p>
              </div>
            </div>

            <!-- Footer Meta -->
            <div class="relative z-10 pt-2 flex items-center justify-between text-[9px] text-gray-400 font-mono">
              <span>Verification Token: ${certId}</span>
              <span>LMS Learning Portal • 2026 Academic Verification</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#btn-close-cert');
    const printBtn = modal.querySelector('#btn-print-cert');

    const closeModal = () => {
      modal.classList.add('animate-fade-out');
      setTimeout(() => {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
      }, 200);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}


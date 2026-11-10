/**
 * Module 6: Quiz Interface
 * Answer selection, dynamic score calculation, pass/fail thresholds, detailed explanations,
 * localStorage score tracking, and certificate generation trigger.
 */
import { Icons } from '../components/Icons.js';
import { state } from '../state.js';
import { toast } from '../components/Toast.js';
import { CertificateModal } from '../components/Certificate.js';

export function renderQuizView(courseId) {
  const container = document.createElement('div');
  container.className = 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in';

  const course = state.getCourseById(courseId);

  if (!course || !course.quiz) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-gray-100 shadow-sm">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
        <p class="text-xs text-gray-500 mb-6">No assessment has been configured for this course yet.</p>
        <a href="#catalogue" class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700">
          Back to Catalogue
        </a>
      </div>
    `;
    return container;
  }

  const quiz = course.quiz;
  const questions = quiz.questions || [];
  const passingScore = quiz.passingScore || 70;

  // Check if student already has a previous submission
  const previousResult = state.getQuizResult(courseId);

  // User's selections state: { [qId]: selectedOptionIndex }
  let selectedAnswers = {};
  let isSubmitted = false;

  // If previous result exists, pre-fill
  if (previousResult && previousResult.answers) {
    selectedAnswers = { ...previousResult.answers };
  }

  function renderQuizUI() {
    container.innerHTML = '';

    // If submitted, show result screen
    if (isSubmitted) {
      renderResultsUI();
      return;
    }

    // Active Quiz View
    const answeredCount = Object.keys(selectedAnswers).length;
    const progressPercent = Math.round((answeredCount / questions.length) * 100);

    const quizWrapper = document.createElement('div');
    quizWrapper.className = 'space-y-6';

    quizWrapper.innerHTML = `
      <!-- Quiz Header Card -->
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
              ${Icons.trophy('w-3.5 h-3.5')}
              <span>Course Capstone Assessment</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900">${quiz.title}</h1>
            <p class="text-xs text-gray-500 mt-1">${course.title} • Passing Threshold: ${passingScore}%</p>
          </div>

          <a href="#course/${course.id}" class="text-xs font-semibold text-gray-500 hover:text-indigo-600 self-start sm:self-auto flex items-center gap-1">
            ${Icons.arrowLeft('w-3.5 h-3.5')} Back to Course
          </a>
        </div>

        <!-- Progress Tracker Bar -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-gray-700">Questions Answered</span>
            <span class="font-extrabold text-indigo-600">${answeredCount} of ${questions.length} (${progressPercent}%)</span>
          </div>
          <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div class="bg-indigo-600 h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        ${previousResult ? `
          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span>Previous Attempt Score: <strong>${previousResult.score}%</strong> (${previousResult.passed ? 'Passed ✓' : 'Did not pass'})</span>
            <span class="text-[11px] text-amber-700">You may retake this quiz anytime</span>
          </div>
        ` : ''}
      </div>

      <!-- Question Cards List -->
      <div class="space-y-6">
        ${questions.map((q, idx) => {
          const selectedIdx = selectedAnswers[q.id];
          return `
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4" id="card-${q.id}">
              <div class="flex items-start justify-between gap-4">
                <span class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-xs">
                  Question ${idx + 1}
                </span>
                <span class="text-xs text-gray-400 font-medium">1 point</span>
              </div>

              <h3 class="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                ${q.question}
              </h3>

              <!-- Options List -->
              <div class="space-y-2.5 pt-2">
                ${q.options.map((opt, optIdx) => {
                  const isChecked = selectedIdx === optIdx;
                  return `
                    <label 
                      data-qid="${q.id}" 
                      data-oidx="${optIdx}" 
                      class="option-label flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${isChecked ? 'bg-indigo-50/80 border-indigo-500 shadow-xs ring-2 ring-indigo-500/10' : 'bg-gray-50/60 border-gray-200 hover:bg-gray-100/70 hover:border-gray-300'}"
                    >
                      <input 
                        type="radio" 
                        name="q-${q.id}" 
                        value="${optIdx}" 
                        ${isChecked ? 'checked' : ''} 
                        class="hidden" 
                      />
                      <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isChecked ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-600'}">
                        ${String.fromCharCode(65 + optIdx)}
                      </span>
                      <span class="text-xs sm:text-sm font-medium ${isChecked ? 'text-indigo-950 font-semibold' : 'text-gray-800'}">
                        ${opt}
                      </span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Submit Footer -->
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-xs text-gray-500 text-center sm:text-left">
          <span>Make sure you have reviewed all answers before submitting.</span>
        </div>
        <button 
          id="btn-submit-quiz" 
          class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          ${Icons.checkCircle('w-5 h-5')}
          Submit Answers for Grading
        </button>
      </div>
    `;

    container.appendChild(quizWrapper);

    // Option selection listeners
    const optionLabels = quizWrapper.querySelectorAll('.option-label');
    optionLabels.forEach(label => {
      label.addEventListener('click', () => {
        const qid = label.dataset.qid;
        const oidx = parseInt(label.dataset.oidx, 10);
        selectedAnswers[qid] = oidx;
        renderQuizUI();
      });
    });

    // Submit listener
    const submitBtn = quizWrapper.querySelector('#btn-submit-quiz');
    submitBtn.addEventListener('click', () => {
      const answered = Object.keys(selectedAnswers).length;
      if (answered < questions.length) {
        if (!confirm(`You have only answered ${answered} of ${questions.length} questions. Are you sure you want to submit? Unanswered questions will be scored as 0.`)) {
          return;
        }
      }

      // Calculate score
      let correctCount = 0;
      questions.forEach(q => {
        if (selectedAnswers[q.id] === q.correctIndex) {
          correctCount++;
        }
      });

      const scorePercent = Math.round((correctCount / questions.length) * 100);
      const passed = scorePercent >= passingScore;

      // Save to state
      state.saveQuizResult(course.id, scorePercent, selectedAnswers, passed);

      if (passed) {
        toast.celebrate(`Congratulations! You passed the quiz with ${scorePercent}%!`, 'Assessment Passed!');
      } else {
        toast.error(`You scored ${scorePercent}%. You need ${passingScore}% to pass. You can retake it anytime!`, 'Keep Trying');
      }

      isSubmitted = true;
      renderQuizUI();
    });
  }

  function renderResultsUI() {
    const questionsList = quiz.questions;
    let correctCount = 0;
    questionsList.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questionsList.length) * 100);
    const passed = score >= passingScore;

    const resultWrapper = document.createElement('div');
    resultWrapper.className = 'space-y-6';

    resultWrapper.innerHTML = `
      <!-- Result Score Hero -->
      <div class="relative overflow-hidden bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl text-center space-y-6">
        <div class="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-md ${passed ? 'bg-emerald-50 border-4 border-emerald-200' : 'bg-rose-50 border-4 border-rose-200'}">
          ${passed ? '🎉' : '📖'}
        </div>

        <div>
          <span class="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} mb-2">
            ${passed ? 'Assessment Passed' : 'Assessment Incomplete'}
          </span>
          <h1 class="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">${score}%</h1>
          <p class="text-sm font-semibold text-gray-600 mt-1">
            ${correctCount} of ${questionsList.length} Questions Answered Correctly
          </p>
          <p class="text-xs text-gray-400 mt-0.5">Passing requirement: ${passingScore}%</p>
        </div>

        <!-- Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          ${passed ? `
            <button 
              id="btn-claim-certificate" 
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
            >
              ${Icons.trophy('w-5 h-5')} View & Download Certificate
            </button>
          ` : ''}

          <button 
            id="btn-retake-quiz" 
            class="px-5 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-colors flex items-center gap-2"
          >
            Retake Quiz
          </button>

          <a 
            href="#course/${course.id}" 
            class="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors"
          >
            Back to Course
          </a>
        </div>
      </div>

      <!-- Question By Question Review -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-gray-900">Detailed Answer Review</h3>

        <div class="space-y-4">
          ${questionsList.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctIndex;

            return `
              <div class="bg-white p-6 rounded-3xl border ${isCorrect ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-200 bg-rose-50/10'} shadow-xs space-y-4">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                      ${isCorrect ? '✓' : '✕'}
                    </span>
                    <span class="text-xs font-bold text-gray-500">Question ${idx + 1}</span>
                  </div>
                  <span class="text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}">
                    ${isCorrect ? '+1 Point' : '0 Points'}
                  </span>
                </div>

                <h4 class="font-bold text-sm text-gray-900 leading-snug">${q.question}</h4>

                <!-- Options status -->
                <div class="space-y-2">
                  ${q.options.map((opt, optIdx) => {
                    const isUserPick = userChoice === optIdx;
                    const isRightAnswer = q.correctIndex === optIdx;

                    let optStyle = 'border-gray-200 bg-gray-50/60 text-gray-700';
                    if (isRightAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    } else if (isUserPick && !isRightAnswer) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-medium';
                    }

                    return `
                      <div class="p-3 rounded-xl border text-xs flex items-center justify-between ${optStyle}">
                        <div class="flex items-center gap-2.5">
                          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${isRightAnswer ? 'bg-emerald-600 text-white' : (isUserPick ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-600')}">
                            ${String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>${opt}</span>
                        </div>
                        ${isRightAnswer ? '<span class="text-emerald-700 font-bold text-[11px]">Correct Answer</span>' : ''}
                        ${isUserPick && !isRightAnswer ? '<span class="text-rose-700 font-bold text-[11px]">Your Choice</span>' : ''}
                      </div>
                    `;
                  }).join('')}
                </div>

                <!-- Explanation Box -->
                <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 leading-relaxed">
                  <strong class="font-bold text-gray-800">Explanation:</strong> ${q.explanation}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.appendChild(resultWrapper);

    const retakeBtn = resultWrapper.querySelector('#btn-retake-quiz');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        selectedAnswers = {};
        isSubmitted = false;
        renderQuizUI();
      });
    }

    const claimCertBtn = resultWrapper.querySelector('#btn-claim-certificate');
    if (claimCertBtn) {
      claimCertBtn.addEventListener('click', () => {
        CertificateModal.show(course, score);
      });
    }
  }

  // Initial render
  renderQuizUI();

  return container;
}


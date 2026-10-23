/**
 * Web Audio Sound Synthesizer for Code Execution Events
 * Zero dependencies, pure Web Audio API synthesis.
 */

let audioCtx = null;
let masterGain = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.18, audioCtx.currentTime); // Gentle default volume
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioSupported() {
  return typeof window !== 'undefined' && !!(window.AudioContext || window.webkitAudioContext);
}

/**
 * Play a synthesized tone or multi-tone event
 */
function playTone({
  type = 'sine',
  freq = 440,
  duration = 0.08,
  volume = 1,
  rampToFreq = null,
  harmonic = null,
}) {
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(20, freq), now);

  if (rampToFreq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, rampToFreq), now + duration);
  }

  // Smooth attack and decay envelope to eliminate audio popping
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.15 * volume, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + duration);

  // Optional subtle harmonic overtone for richer sound (e.g. marimba / bell)
  if (harmonic) {
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = harmonic.type || 'sine';
    osc2.frequency.setValueAtTime(freq * (harmonic.ratio || 2), now);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.exponentialRampToValueAtTime(0.08 * (harmonic.volume || 0.5), now + 0.004);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + (harmonic.duration || duration * 0.8));

    osc2.connect(gain2);
    gain2.connect(masterGain);

    osc2.start(now);
    osc2.stop(now + (harmonic.duration || duration * 0.8));
  }
}

/**
 * Play distinct sound based on code line event type
 */
export function playExecutionSound(eventType, details = {}) {
  const ctx = getAudioContext();
  if (!ctx) return;

  switch (eventType) {
    case 'output': {
      // Crisp typewriter strike / terminal write
      const isNewline = details.isNewline;
      playTone({
        type: 'triangle',
        freq: isNewline ? 640 : 1100 + Math.random() * 80,
        rampToFreq: isNewline ? 520 : 880,
        duration: isNewline ? 0.09 : 0.045,
        volume: 0.9,
        harmonic: { ratio: 2.2, duration: 0.03, volume: 0.4 },
      });
      break;
    }

    case 'condition-true': {
      // Bright, ascending chime (Condition passed -> enters loop / if)
      playTone({
        type: 'sine',
        freq: 523.25, // C5
        duration: 0.05,
        volume: 0.7,
        harmonic: { ratio: 2, duration: 0.04, volume: 0.3 },
      });
      setTimeout(() => {
        playTone({
          type: 'triangle',
          freq: 659.25, // E5
          duration: 0.07,
          volume: 0.8,
        });
      }, 35);
      break;
    }

    case 'condition-false': {
      // Soft descending blip (Condition failed -> exits loop / skips branch)
      playTone({
        type: 'sine',
        freq: 587.33, // D5
        rampToFreq: 392.0, // G4
        duration: 0.09,
        volume: 0.65,
      });
      break;
    }

    case 'mutation': {
      // Marimba pop for variable increment/decrement / math ($i++, $space++, etc.)
      const baseFreq = 480 + ((details.stepIndex || 0) % 8) * 35;
      playTone({
        type: 'triangle',
        freq: baseFreq,
        duration: 0.055,
        volume: 0.75,
        harmonic: { ratio: 2.76, duration: 0.035, volume: 0.45 },
      });
      break;
    }

    case 'assignment': {
      // Soft clean pluck for variable definition ($n = 4, $value = 1)
      playTone({
        type: 'sine',
        freq: 392.0, // G4
        duration: 0.07,
        volume: 0.6,
        harmonic: { ratio: 2, duration: 0.04, volume: 0.25 },
      });
      break;
    }

    case 'iteration': {
      // Light wooden ratchet click for foreach / next iteration
      playTone({
        type: 'triangle',
        freq: 780,
        rampToFreq: 600,
        duration: 0.035,
        volume: 0.6,
      });
      break;
    }

    case 'block-end': {
      // Muted woodblock tap for block completion (closing brace '}')
      playTone({
        type: 'sine',
        freq: 260,
        duration: 0.04,
        volume: 0.5,
      });
      break;
    }

    case 'else': {
      // Mid harmonic tone for else branch
      playTone({
        type: 'sine',
        freq: 440,
        duration: 0.06,
        volume: 0.6,
      });
      break;
    }

    case 'complete': {
      // Celebratory arpeggiated success chime when all steps finish
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      chord.forEach((note, i) => {
        setTimeout(() => {
          playTone({
            type: 'sine',
            freq: note,
            duration: 0.16,
            volume: 0.85,
            harmonic: { ratio: 2, duration: 0.12, volume: 0.3 },
          });
        }, i * 65);
      });
      break;
    }

    case 'error': {
      // Subtle warning thud
      playTone({
        type: 'sawtooth',
        freq: 160,
        rampToFreq: 90,
        duration: 0.14,
        volume: 0.8,
      });
      break;
    }

    default: {
      // Neutral subtle statement click
      playTone({
        type: 'sine',
        freq: 440,
        duration: 0.04,
        volume: 0.45,
      });
      break;
    }
  }
}

/**
 * Determine event type from frame and code line
 */
export function classifyFrameEvent(frame, code, previousFrame, stepIndex, totalSteps) {
  if (!frame) return 'statement';

  // Completion check
  if (totalSteps > 0 && stepIndex === totalSteps - 1) {
    return 'complete';
  }

  const lines = code ? code.split('\n') : [];
  const line = (lines[frame.line - 1] || '').trim();

  // Output statement or output changed
  const hasOutputChanged = previousFrame && frame.output !== previousFrame.output;
  if (/^(echo|print|var_dump|print_r)\b/.test(line) || hasOutputChanged) {
    const isNewline = /PHP_EOL|\\n/.test(line);
    return { type: 'output', isNewline };
  }

  // Condition evaluation (if, for-loop test)
  if (frame.phase === 'condition') {
    return frame.condition ? 'condition-true' : 'condition-false';
  }

  // Loop iteration
  if (frame.phase === 'iteration') {
    return 'iteration';
  }

  // Else branch
  if (frame.phase === 'else') {
    return 'else';
  }

  // Block close
  if (frame.phase === 'block' || line === '}') {
    return 'block-end';
  }

  // Variable mutations: $i++, $space--, $sum += ...
  if (/\+\+|--|\+=|-=|\*=|\/=|%=/.test(line)) {
    return { type: 'mutation', stepIndex };
  }

  // Variable assignments: $n = 4;
  if (/^\$[a-zA-Z_]\w*\s*=\s*/.test(line)) {
    return 'assignment';
  }

  return 'statement';
}

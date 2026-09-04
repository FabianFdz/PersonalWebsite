import { useCallback, useEffect, useRef, useState } from "react";
import type { InstallStep } from "../../i18n";

const FEEDBACK_MS = 2000;

type CopyOutcome = "idle" | "copied" | "failed";

type TerminalBlockProps = {
  title: string;
  steps: readonly InstallStep[];
  copy: {
    label: string;
    copiedLabel: string;
    failedLabel: string;
    accessibilityLabel: string;
  };
};

// The async Clipboard API is unavailable outside a secure context and can be
// denied by permission policy, so fall back to a selection-based copy.
async function writeToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Handled by the fallback below.
  }

  const source = document.createElement("textarea");
  source.value = text;
  source.setAttribute("readonly", "");
  source.style.position = "fixed";
  source.style.opacity = "0";
  document.body.append(source);
  source.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    source.remove();
  }
}

export function TerminalBlock({ title, steps, copy }: TerminalBlockProps) {
  const [outcome, setOutcome] = useState<CopyOutcome>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copyCommands = useCallback(async () => {
    const commands = steps.map((step) => step.command).join("\n");
    const succeeded = await writeToClipboard(commands);

    setOutcome(succeeded ? "copied" : "failed");
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setOutcome("idle"), FEEDBACK_MS);
  }, [steps]);

  const feedback = {
    idle: copy.label,
    copied: copy.copiedLabel,
    failed: copy.failedLabel,
  }[outcome];

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="terminal-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="terminal-title">{title}</span>
        <button
          type="button"
          className="terminal-copy"
          data-outcome={outcome}
          aria-label={copy.accessibilityLabel}
          onClick={copyCommands}
        >
          <span aria-hidden="true">{feedback}</span>
        </button>
      </div>
      <div className="terminal-body">
        {steps.map((step) => (
          <p key={step.command}>
            <span className="terminal-comment"># {step.description}</span>
            <code>{step.command}</code>
          </p>
        ))}
      </div>
      <span role="status" className="visually-hidden">
        {outcome === "idle" ? "" : feedback}
      </span>
    </div>
  );
}

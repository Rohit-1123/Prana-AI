interface PromptChipProps {
  questions: string[];
  onClickQuestion: (q: string) => void;
}

export function PromptChip({ questions, onClickQuestion }: PromptChipProps) {
  return (
    <div className="flex gap-2 flex-wrap items-center animate-in fade-in duration-200">
      {questions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onClickQuestion(q)}
          className="bg-card hover:bg-muted/10 border border-border px-3 py-1.5 rounded-xl text-[10px] font-bold text-muted hover:text-foreground transition-all cursor-pointer select-none"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

import type { Question } from "../IQuestion";

interface Props {
    question: Question;
}
export function Clue({ question }: Props) {
    return (
        <section className="clue">
            {question.word.split("").map((l, index) => {
                const isFirst = index === 0;
                const isLast = index === question.word.length - 1;
                if (l === "'")
                    return <span key={`char-${index}`}>'</span>;
                if (l === " ")
                    return <span key={`char-${index}`}>&nbsp;&nbsp;&nbsp;</span>;
                if (isFirst || isLast) return l.toUpperCase() + " ";
                if (/[a-zA-Z]/.test(l)) return "_ ";
            })}
        </section>
    );
};
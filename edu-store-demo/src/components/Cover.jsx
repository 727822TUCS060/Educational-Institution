import { BookOpen, ClipboardList, FileText, GraduationCap, PenLine } from 'lucide-react';

const GRADIENTS = [
  'linear-gradient(135deg,#1e3a8a,#3b82f6)',
  'linear-gradient(135deg,#065f46,#10b981)',
  'linear-gradient(135deg,#7c2d12,#f59e0b)',
  'linear-gradient(135deg,#581c87,#a855f7)',
  'linear-gradient(135deg,#9f1239,#f43f5e)',
  'linear-gradient(135deg,#134e4a,#06b6d4)',
];

const ICONS = {
  Textbook: BookOpen,
  'Study Material': FileText,
  Workbook: PenLine,
  'Exam Guide': ClipboardList,
  Course: GraduationCap,
};

const hash = (s) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

// Shows the uploaded image if there is one, otherwise a generated gradient cover.
export default function Cover({ item, kind, height = 190 }) {
  if (item.image) {
    return <img src={item.image} alt={item.title} className="cover-img" style={{ height }} />;
  }
  const Icon = ICONS[kind || item.category] || BookOpen;
  return (
    <div className="cover" style={{ height, background: GRADIENTS[hash(item.title) % GRADIENTS.length] }}>
      <Icon size={44} strokeWidth={1.6} />
      <span>{item.title}</span>
    </div>
  );
}

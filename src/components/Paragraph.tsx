import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface ParagraphProps {
  id: string;
  content: string;
  onChange: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

const Paragraph = ({ id, content, onChange, onDelete }: ParagraphProps) => {
  return (
    <div className="group relative animate-fade-in">
      <Textarea
        value={content}
        onChange={(e) => onChange(id, e.target.value)}
        className="min-h-[100px] w-full p-4 text-lg font-serif leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
        placeholder="Comece a escrever seu parágrafo..."
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Paragraph;

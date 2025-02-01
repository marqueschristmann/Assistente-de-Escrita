import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Paragraph from "./Paragraph";
import { Button } from "./ui/button";
import { Plus, Save, Wand2, FileDown } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Card } from "./ui/card";
import jsPDF from "jspdf";

interface ParagraphType {
  id: string;
  content: string;
}

interface SavedDraftType {
  id: string;
  paragraphs: ParagraphType[];
  date: string;
}

const DraftEditor = () => {
  const [paragraphs, setParagraphs] = useState<ParagraphType[]>([
    { id: uuidv4(), content: "" },
  ]);
  const [savedDrafts, setSavedDrafts] = useState<SavedDraftType[]>([]);
  const { toast } = useToast();

  const addParagraph = () => {
    setParagraphs([...paragraphs, { id: uuidv4(), content: "" }]);
  };

  const updateParagraph = (id: string, content: string) => {
    setParagraphs(paragraphs.map((p) => (p.id === id ? { ...p, content } : p)));
  };

  const deleteParagraph = (id: string) => {
    if (paragraphs.length > 1) {
      setParagraphs(paragraphs.filter((p) => p.id !== id));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    paragraphs.forEach((paragraph) => {
      const lines = doc.splitTextToSize(paragraph.content, 180);
      doc.text(lines, 15, yPosition);
      yPosition += 10 * lines.length;

      if (yPosition >= 280) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save("meu-texto.pdf");
  };

  const saveDraft = () => {
    const newDraft: SavedDraftType = {
      id: uuidv4(),
      paragraphs: [...paragraphs],
      date: new Date().toLocaleString(),
    };

    setSavedDrafts([...savedDrafts, newDraft]);
    generatePDF();

    toast({
      title: "Rascunho salvo com sucesso!",
      description: "Seu trabalho foi salvo e o PDF foi gerado.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-800">
            Assistente de Escrita
          </h1>
          <div className="space-x-2">
            <Button onClick={saveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Rascunho
            </Button>
          </div>
        </div>

        <Card className="bg-white p-6 shadow-sm">
          {paragraphs.map((paragraph) => (
            <Paragraph
              key={paragraph.id}
              id={paragraph.id}
              content={paragraph.content}
              onChange={updateParagraph}
              onDelete={deleteParagraph}
            />
          ))}

          <Button
            variant="ghost"
            className="w-full mt-4 border-2 border-dashed border-gray-200 hover:border-gray-300"
            onClick={addParagraph}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Parágrafo
          </Button>
        </Card>

        <div className="mt-8">
          <h2 className="text-xl font-serif font-semibold text-gray-800 mb-4">
            Visualização
          </h2>
          <Card className="bg-white p-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.id}
                className="text-lg font-serif leading-relaxed mb-4"
              >
                {paragraph.content || (
                  <span className="text-gray-400 italic">
                    Comece a escrever o parágrafo {index + 1}...
                  </span>
                )}
              </p>
            ))}
          </Card>
        </div>

        {savedDrafts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-serif font-semibold text-gray-800 mb-4">
              Textos Salvos
            </h2>
            {savedDrafts.map((draft) => (
              <Card key={draft.id} className="bg-white p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">{draft.date}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setParagraphs(draft.paragraphs);
                      toast({
                        title: "Rascunho carregado",
                        description: "O texto foi carregado para edição.",
                      });
                    }}
                  >
                    Carregar
                  </Button>
                </div>
                {draft.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.id}
                    className="text-lg font-serif leading-relaxed mb-4"
                  >
                    {paragraph.content}
                  </p>
                ))}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftEditor;

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Send, Save, Upload, ArrowLeft } from "lucide-react";
import { mockHolidays, mockPeople, mockOrganizations } from "@/data/mockData";

export default function EditorPage() {
  const { holidayId } = useParams();
  const navigate = useNavigate();

  const holiday = mockHolidays.find((h) => h.id === holidayId);
  const person = holiday?.personId ? mockPeople.find((p) => p.id === holiday.personId) : null;
  const org = holiday?.organizationId ? mockOrganizations.find((o) => o.id === holiday.organizationId) : null;

  const entityName = person
    ? `${person.lastName} ${person.firstName} ${person.middleName}`
    : org
    ? org.name
    : "Неизвестно";

  const entityEmail = person?.emails || org?.emails || "";

  const [subject, setSubject] = useState(`Поздравление: ${holiday?.description || ""}`);
  const [cardText, setCardText] = useState(`Уважаемый(ая) ${entityName}!\n\nПоздравляем Вас с ${holiday?.description || "праздником"}!\n\nС наилучшими пожеланиями!`);
  const [email, setEmail] = useState(entityEmail);
  const [fontSize, setFontSize] = useState("16");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [textAlign, setTextAlign] = useState("center");
  const [format, setFormat] = useState("A4");
  const [paddingTop, setPaddingTop] = useState("40");
  const [paddingLeft, setPaddingLeft] = useState("40");
  const [paddingRight, setPaddingRight] = useState("40");
  const [paddingBottom, setPaddingBottom] = useState("40");

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="page-title">Редактор открытки</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Preview */}
        <div className="space-y-4">
          <div
            className="bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center relative"
            style={{
              aspectRatio: format === "A4" ? "210/297" : "297/420",
              maxHeight: "600px",
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
              }}
            >
              <p
                style={{
                  fontSize: `${fontSize}px`,
                  fontFamily,
                  textAlign: textAlign as any,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
                className="text-foreground"
              >
                {cardText}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="space-y-6">
          {/* Header info */}
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Праздник</div>
            <div className="font-semibold">{holiday?.description || "—"}</div>
            <div className="text-sm text-muted-foreground mt-2 mb-1">Объект поздравления</div>
            <div className="font-semibold">{entityName}</div>
          </div>

          {/* Subject & text */}
          <div className="space-y-4">
            <div>
              <Label>Тема письма</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <Label>Текст на открытке</Label>
              <Textarea value={cardText} onChange={(e) => setCardText(e.target.value)} rows={5} />
            </div>
            <div>
              <Label>Email для отправки</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {/* Text styling */}
          <div className="bg-card rounded-lg border p-4 space-y-4">
            <h3 className="text-sm font-semibold">Стили текста</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Размер шрифта</Label>
                <Input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Шрифт</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Выравнивание</Label>
                <Select value={textAlign} onValueChange={setTextAlign}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Слева</SelectItem>
                    <SelectItem value="center">По центру</SelectItem>
                    <SelectItem value="right">Справа</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Формат</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="A3">A3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Paddings */}
          <div className="bg-card rounded-lg border p-4 space-y-3">
            <h3 className="text-sm font-semibold">Отступы (px)</h3>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">Сверху</Label>
                <Input type="number" value={paddingTop} onChange={(e) => setPaddingTop(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Справа</Label>
                <Input type="number" value={paddingRight} onChange={(e) => setPaddingRight(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Снизу</Label>
                <Input type="number" value={paddingBottom} onChange={(e) => setPaddingBottom(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Слева</Label>
                <Input type="number" value={paddingLeft} onChange={(e) => setPaddingLeft(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Buffer controls */}
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 flex-1">
              <Save className="w-4 h-4" />
              Сохранить настройки в буфер
            </Button>
            <Button variant="outline" className="gap-2 flex-1">
              <Upload className="w-4 h-4" />
              Загрузить из буфера
            </Button>
          </div>

          {/* Action bar */}
          <div className="flex gap-3 sticky bottom-0 bg-background py-3 border-t -mx-6 px-6">
            <Button variant="outline" className="gap-2 flex-1">
              <Download className="w-4 h-4" />
              Скачать PDF
            </Button>
            <Button variant="success" className="gap-2 flex-1">
              <Send className="w-4 h-4" />
              Подтвердить и отправить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

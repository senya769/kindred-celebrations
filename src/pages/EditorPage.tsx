import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Send, Save, Upload, ArrowLeft, Mail, Printer, FileText, MapPin } from "lucide-react";
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
  const entityAddress = person?.address || org?.address || "";

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

  // Two-page PDF: active page
  const [activePage, setActivePage] = useState<"cover" | "inner">("cover");
  const [coverText, setCoverText] = useState(`С праздником!\n${holiday?.description || ""}`);
  const [innerText, setInnerText] = useState(cardText);

  // Envelope
  const [senderAddress, setSenderAddress] = useState("г. Москва, ул. Центральная, д. 1, ОАО «Авиалинии»");
  const [recipientAddress, setRecipientAddress] = useState(entityAddress);

  // Preview tab
  const [previewTab, setPreviewTab] = useState("card");

  const currentText = activePage === "cover" ? coverText : innerText;
  const setCurrentText = activePage === "cover" ? setCoverText : setInnerText;

  const renderCardPreview = () => (
    <div className="space-y-4">
      {/* Page selector */}
      <div className="flex gap-2">
        <Button
          variant={activePage === "cover" ? "default" : "outline"}
          size="sm"
          onClick={() => setActivePage("cover")}
          className="gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          Обложка
        </Button>
        <Button
          variant={activePage === "inner" ? "default" : "outline"}
          size="sm"
          onClick={() => setActivePage("inner")}
          className="gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          Внутренняя страница
        </Button>
      </div>

      <div
        className="bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center relative"
        style={{
          aspectRatio: format === "A4" ? "210/297" : "297/420",
          maxHeight: "500px",
        }}
      >
        {activePage === "cover" && (
          <div className="absolute top-3 left-3 bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded">
            Обложка
          </div>
        )}
        {activePage === "inner" && (
          <div className="absolute top-3 left-3 bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5 rounded">
            Внутренняя страница
          </div>
        )}
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
            {currentText}
          </p>
        </div>
      </div>

      {/* Page indicator */}
      <div className="flex justify-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${activePage === "cover" ? "bg-primary" : "bg-muted-foreground/30"}`} />
        <div className={`w-2.5 h-2.5 rounded-full ${activePage === "inner" ? "bg-primary" : "bg-muted-foreground/30"}`} />
      </div>
    </div>
  );

  const renderEnvelopePreview = () => (
    <div className="space-y-4">
      <div
        className="bg-muted rounded-lg border-2 border-dashed border-border relative"
        style={{ aspectRatio: "16/10", maxHeight: "400px" }}
      >
        {/* Sender (top-left) */}
        <div className="absolute top-6 left-6 max-w-[45%]">
          <div className="text-[10px] text-muted-foreground mb-1 font-semibold uppercase tracking-wide">От кого:</div>
          <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{senderAddress}</p>
        </div>

        {/* Stamp placeholder */}
        <div className="absolute top-5 right-5 w-16 h-20 border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
          <span className="text-[9px] text-muted-foreground">Марка</span>
        </div>

        {/* Recipient (center-right) */}
        <div className="absolute bottom-8 right-8 max-w-[55%] text-right">
          <div className="text-[10px] text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Кому:</div>
          <p className="text-sm font-medium text-foreground">{entityName}</p>
          <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap mt-1">{recipientAddress}</p>
        </div>

        {/* Decorative lines */}
        <div className="absolute bottom-[45%] left-[35%] right-8 space-y-2">
          <div className="border-b border-muted-foreground/20" />
          <div className="border-b border-muted-foreground/20" />
          <div className="border-b border-muted-foreground/20 w-3/4" />
        </div>
      </div>
    </div>
  );

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
          <Tabs value={previewTab} onValueChange={setPreviewTab}>
            <TabsList className="w-full">
              <TabsTrigger value="card" className="flex-1 gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Открытка (2 стр.)
              </TabsTrigger>
              <TabsTrigger value="envelope" className="flex-1 gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Конверт
              </TabsTrigger>
            </TabsList>
            <TabsContent value="card" className="mt-4">
              {renderCardPreview()}
            </TabsContent>
            <TabsContent value="envelope" className="mt-4">
              {renderEnvelopePreview()}
            </TabsContent>
          </Tabs>
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

          {/* Subject & text — contextual based on preview tab */}
          {previewTab === "card" && (
            <div className="space-y-4">
              <div>
                <Label>Тема письма</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div>
                <Label>{activePage === "cover" ? "Текст обложки" : "Текст внутренней страницы"}</Label>
                <Textarea
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  rows={5}
                />
              </div>
              <div>
                <Label>Email для отправки</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          )}

          {previewTab === "envelope" && (
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Адрес отправителя
                </Label>
                <Textarea
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Адрес получателя
                </Label>
                <Textarea
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="bg-muted/50 rounded-md p-3 text-xs text-muted-foreground">
                Адрес получателя подтягивается автоматически из карточки объекта поздравления.
              </div>
            </div>
          )}

          {/* Text styling (for card only) */}
          {previewTab === "card" && (
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
          )}

          {/* Paddings (card only) */}
          {previewTab === "card" && (
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
          )}

          {/* Buffer controls */}
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 flex-1">
              <Save className="w-4 h-4" />
              Сохранить в буфер
            </Button>
            <Button variant="outline" className="gap-2 flex-1">
              <Upload className="w-4 h-4" />
              Загрузить из буфера
            </Button>
          </div>

          {/* Action bar — separate buttons for electronic vs print */}
          <div className="sticky bottom-0 bg-background py-3 border-t -mx-6 px-6 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Электронное поздравление</div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 flex-1">
                <Download className="w-4 h-4" />
                Скачать PDF
              </Button>
              <Button variant="success" className="gap-2 flex-1">
                <Send className="w-4 h-4" />
                Отправить по email
              </Button>
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-4">Печатное поздравление</div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 flex-1">
                <Printer className="w-4 h-4" />
                Печать открытки (2 стр.)
              </Button>
              <Button variant="outline" className="gap-2 flex-1">
                <Mail className="w-4 h-4" />
                Печать конверта
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

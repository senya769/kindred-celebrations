import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Search, Users } from "lucide-react";
import { mockHolidays, mockPeople, mockOrganizations, mockCurators, type Holiday } from "@/data/mockData";

const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [filtered, setFiltered] = useState<Holiday[]>(mockHolidays);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [curatorDialogOpen, setCuratorDialogOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDay, setFilterDay] = useState("");

  const [form, setForm] = useState({ date: "", description: "", type: "other" as Holiday["type"], personMessage: "", orgMessage: "" });

  const handleSearch = () => {
    setFiltered(
      holidays.filter((h) => {
        const d = new Date(h.date);
        const monthMatch = !filterMonth || String(d.getMonth() + 1) === filterMonth;
        const dayMatch = !filterDay || String(d.getDate()) === filterDay;
        const nameMatch = !filterName || h.description.toLowerCase().includes(filterName.toLowerCase());
        return monthMatch && dayMatch && nameMatch;
      })
    );
  };

  const handleAdd = () => {
    const newH: Holiday = {
      id: String(Date.now()),
      date: form.date,
      description: form.description,
      type: form.type,
      messageTemplate: form.personMessage,
    };
    const updated = [...holidays, newH];
    setHolidays(updated);
    setFiltered(updated);
    setDialogOpen(false);
    setForm({ date: "", description: "", type: "other", personMessage: "", orgMessage: "" });
  };

  const getEntityName = (h: Holiday) => {
    if (h.personId) {
      const p = mockPeople.find((p) => p.id === h.personId);
      return p ? `${p.lastName} ${p.firstName}` : "—";
    }
    if (h.organizationId) {
      const o = mockOrganizations.find((o) => o.id === h.organizationId);
      return o ? o.name : "—";
    }
    return "—";
  };

  const typeLabel = (t: Holiday["type"]) => {
    switch (t) {
      case "birthday": return "День рождения";
      case "foundation": return "День основания";
      default: return "Прочее";
    }
  };

  const getCuratorsForHoliday = (h: Holiday) => {
    if (!h.curatorIds || h.curatorIds.length === 0) return [];
    return h.curatorIds.map((id) => mockCurators.find((c) => c.id === id)).filter(Boolean);
  };

  const openCuratorDialog = (h: Holiday) => {
    setSelectedHoliday(h);
    setCuratorDialogOpen(true);
  };

  const toggleCurator = (curatorId: string) => {
    if (!selectedHoliday) return;
    const current = selectedHoliday.curatorIds || [];
    const updated = current.includes(curatorId)
      ? current.filter((id) => id !== curatorId)
      : [...current, curatorId];
    
    const updatedHoliday = { ...selectedHoliday, curatorIds: updated };
    setSelectedHoliday(updatedHoliday);
    
    const updatedHolidays = holidays.map((h) => h.id === selectedHoliday.id ? updatedHoliday : h);
    setHolidays(updatedHolidays);
    setFiltered(updatedHolidays);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Праздники</h1>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить праздник
        </Button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex-1 min-w-[200px]">
          <Label className="text-xs text-muted-foreground">Описание</Label>
          <Input placeholder="Поиск..." value={filterName} onChange={(e) => setFilterName(e.target.value)} />
        </div>
        <div className="w-[140px]">
          <Label className="text-xs text-muted-foreground">Месяц</Label>
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger><SelectValue placeholder="Все" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              {months.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[100px]">
          <Label className="text-xs text-muted-foreground">День</Label>
          <Input type="number" min={1} max={31} placeholder="День" value={filterDay} onChange={(e) => setFilterDay(e.target.value)} />
        </div>
        <Button onClick={handleSearch} className="gap-2">
          <Search className="w-4 h-4" />
          Найти
        </Button>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Объект</TableHead>
              <TableHead>Кураторы</TableHead>
              <TableHead className="w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((h) => {
              const curators = getCuratorsForHoliday(h);
              return (
                <TableRow key={h.id} className="hover:bg-muted/50">
                  <TableCell>{h.date}</TableCell>
                  <TableCell className="font-medium">{h.description}</TableCell>
                  <TableCell>{typeLabel(h.type)}</TableCell>
                  <TableCell>{getEntityName(h)}</TableCell>
                  <TableCell>
                    {curators.length > 0 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-muted-foreground" />
                              <div className="flex gap-1 flex-wrap">
                                {curators.map((c) => (
                                  <Badge key={c!.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {c!.name.split(" ")[0]}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">
                            {curators.map((c) => (
                              <div key={c!.id}>{c!.name} — {c!.email}</div>
                            ))}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" title="Кураторы" onClick={() => openCuratorDialog(h)}>
                      <Users className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Нет результатов</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Holiday Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Добавить праздник</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Дата</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <Label>Краткое описание</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label>Тип</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Holiday["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">День рождения</SelectItem>
                  <SelectItem value="foundation">День основания</SelectItem>
                  <SelectItem value="other">Прочее</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Текст сообщения для человека</Label>
              <Textarea value={form.personMessage} onChange={(e) => setForm({ ...form, personMessage: e.target.value })} rows={3} />
            </div>
            <div>
              <Label>Текст сообщения для организации</Label>
              <Textarea value={form.orgMessage} onChange={(e) => setForm({ ...form, orgMessage: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleAdd}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Curator Management Dialog */}
      <Dialog open={curatorDialogOpen} onOpenChange={setCuratorDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Кураторы праздника</DialogTitle>
          </DialogHeader>
          {selectedHoliday && (
            <div className="space-y-4 py-4">
              <div className="text-sm text-muted-foreground">
                {selectedHoliday.description} — {selectedHoliday.date}
              </div>
              <div className="space-y-2">
                {mockCurators.map((c) => {
                  const isAssigned = selectedHoliday.curatorIds?.includes(c.id) || false;
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors ${
                        isAssigned ? "bg-primary/5 border-primary/30" : "bg-background hover:bg-muted/50"
                      }`}
                      onClick={() => toggleCurator(c.id)}
                    >
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </div>
                      {isAssigned && (
                        <Badge variant="default" className="text-[10px]">Назначен</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setCuratorDialogOpen(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

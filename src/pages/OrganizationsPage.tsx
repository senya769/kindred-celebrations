import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, CalendarDays } from "lucide-react";
import { mockOrganizations, fields, type Organization } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<Organization[]>(mockOrganizations);
  const [filtered, setFiltered] = useState<Organization[]>(mockOrganizations);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterField, setFilterField] = useState("");

  const [form, setForm] = useState<Omit<Organization, "id">>({
    name: "", foundedDate: "", description: "", emails: "", phone: "", field: "",
  });

  const handleSearch = () => {
    setFiltered(
      orgs.filter((o) => {
        const nameMatch = !filterName || o.name.toLowerCase().includes(filterName.toLowerCase());
        const fieldMatch = !filterField || o.field === filterField;
        return nameMatch && fieldMatch;
      })
    );
  };

  const openAdd = () => {
    setEditingOrg(null);
    setForm({ name: "", foundedDate: "", description: "", emails: "", phone: "", field: "" });
    setDialogOpen(true);
  };

  const openEdit = (o: Organization) => {
    setEditingOrg(o);
    setForm({ ...o });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingOrg) {
      const updated = orgs.map((o) => o.id === editingOrg.id ? { ...o, ...form } : o);
      setOrgs(updated);
      setFiltered(updated);
    } else {
      const newOrg: Organization = { id: String(Date.now()), ...form };
      const updated = [...orgs, newOrg];
      setOrgs(updated);
      setFiltered(updated);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = orgs.filter((o) => o.id !== id);
    setOrgs(updated);
    setFiltered(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Организации</h1>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить организацию
        </Button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex-1 min-w-[200px]">
          <Label className="text-xs text-muted-foreground">Название</Label>
          <Input placeholder="Поиск по названию..." value={filterName} onChange={(e) => setFilterName(e.target.value)} />
        </div>
        <div className="w-[180px]">
          <Label className="text-xs text-muted-foreground">Сфера деятельности</Label>
          <Select value={filterField} onValueChange={setFilterField}>
            <SelectTrigger><SelectValue placeholder="Все" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              {fields.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
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
              <TableHead>Название</TableHead>
              <TableHead>Дата основания</TableHead>
              <TableHead>Сфера</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead className="w-[180px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{o.name}</TableCell>
                <TableCell>{o.foundedDate}</TableCell>
                <TableCell>{o.field}</TableCell>
                <TableCell>{o.emails}</TableCell>
                <TableCell>{o.phone}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(o)} title="Редактировать">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/holidays?orgId=${o.id}`)} title="Праздники">
                      <CalendarDays className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(o.id)} title="Удалить">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Нет результатов</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOrg ? "Редактировать" : "Добавить организацию"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Название</Label>
              <Input maxLength={500} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Дата основания</Label>
              <Input type="date" value={form.foundedDate} onChange={(e) => setForm({ ...form, foundedDate: e.target.value })} />
            </div>
            <div>
              <Label>Сфера деятельности</Label>
              <Select value={form.field} onValueChange={(v) => setForm({ ...form, field: v })}>
                <SelectTrigger><SelectValue placeholder="Выберите..." /></SelectTrigger>
                <SelectContent>
                  {fields.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea maxLength={5000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div>
              <Label>Email-адреса (через запятую)</Label>
              <Input value={form.emails} onChange={(e) => setForm({ ...form, emails: e.target.value })} />
            </div>
            <div>
              <Label>Телефон</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSave}>{editingOrg ? "Сохранить" : "Создать"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, CalendarDays } from "lucide-react";
import { mockPeople, fields, type Person } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export default function PeoplePage() {
  const navigate = useNavigate();
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [filtered, setFiltered] = useState<Person[]>(mockPeople);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

  // Form
  const [form, setForm] = useState<Omit<Person, "id">>({
    lastName: "", firstName: "", middleName: "", birthDate: "",
    position: "", emails: "", phone: "", gender: "male", field: "",
  });

  const handleSearch = () => {
    setFiltered(
      people.filter((p) => {
        const nameMatch = !filterName || `${p.lastName} ${p.firstName} ${p.middleName}`.toLowerCase().includes(filterName.toLowerCase());
        const genderMatch = !filterGender || p.gender === filterGender;
        const fieldMatch = !filterField || p.field === filterField;
        const emailMatch = !filterEmail || p.emails.toLowerCase().includes(filterEmail.toLowerCase());
        return nameMatch && genderMatch && fieldMatch && emailMatch;
      })
    );
  };

  const openAdd = () => {
    setEditingPerson(null);
    setForm({ lastName: "", firstName: "", middleName: "", birthDate: "", position: "", emails: "", phone: "", gender: "male", field: "" });
    setDialogOpen(true);
  };

  const openEdit = (p: Person) => {
    setEditingPerson(p);
    setForm({ ...p });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingPerson) {
      const updated = people.map((p) => p.id === editingPerson.id ? { ...p, ...form } : p);
      setPeople(updated);
      setFiltered(updated);
    } else {
      const newPerson: Person = { id: String(Date.now()), ...form };
      const updated = [...people, newPerson];
      setPeople(updated);
      setFiltered(updated);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = people.filter((p) => p.id !== id);
    setPeople(updated);
    setFiltered(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Люди</h1>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить человека
        </Button>
      </div>

      {/* Filters */}
      <div className="filter-bar mb-6">
        <div className="flex-1 min-w-[180px]">
          <Label className="text-xs text-muted-foreground">Имя</Label>
          <Input placeholder="Поиск по имени..." value={filterName} onChange={(e) => setFilterName(e.target.value)} />
        </div>
        <div className="w-[140px]">
          <Label className="text-xs text-muted-foreground">Пол</Label>
          <Select value={filterGender} onValueChange={setFilterGender}>
            <SelectTrigger><SelectValue placeholder="Все" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="male">Мужской</SelectItem>
              <SelectItem value="female">Женский</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="flex-1 min-w-[180px]">
          <Label className="text-xs text-muted-foreground">Email</Label>
          <Input placeholder="Поиск по email..." value={filterEmail} onChange={(e) => setFilterEmail(e.target.value)} />
        </div>
        <Button onClick={handleSearch} className="gap-2">
          <Search className="w-4 h-4" />
          Найти
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ФИО</TableHead>
              <TableHead>Дата рождения</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead>Сфера</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[180px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{p.lastName} {p.firstName} {p.middleName}</TableCell>
                <TableCell>{p.birthDate}</TableCell>
                <TableCell className="max-w-[200px] truncate">{p.position}</TableCell>
                <TableCell>{p.field}</TableCell>
                <TableCell>{p.emails}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)} title="Редактировать">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/holidays?personId=${p.id}`)} title="Праздники">
                      <CalendarDays className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} title="Удалить">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Нет результатов
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPerson ? "Редактировать" : "Добавить человека"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 sm:col-span-1">
              <Label>Фамилия</Label>
              <Input maxLength={50} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Имя</Label>
              <Input maxLength={50} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Отчество</Label>
              <Input maxLength={50} value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Дата рождения</Label>
              <Input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Пол</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as 'male' | 'female' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Мужской</SelectItem>
                  <SelectItem value="female">Женский</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Сфера деятельности</Label>
              <Select value={form.field} onValueChange={(v) => setForm({ ...form, field: v })}>
                <SelectTrigger><SelectValue placeholder="Выберите..." /></SelectTrigger>
                <SelectContent>
                  {fields.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Должность</Label>
              <Input maxLength={500} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Email-адреса (через запятую)</Label>
              <Input value={form.emails} onChange={(e) => setForm({ ...form, emails: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Телефон</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSave}>{editingPerson ? "Сохранить" : "Создать"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

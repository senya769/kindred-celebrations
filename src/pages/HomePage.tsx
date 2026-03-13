import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Gift, Cake, Building2, Star, Bell } from "lucide-react";
import { mockPeople, mockOrganizations, mockHolidays } from "@/data/mockData";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  const holidaysForDate = useMemo(() => {
    return mockHolidays.filter((h) =>
      isSameDay(parseISO(h.date), selectedDate)
    );
  }, [selectedDate]);

  const birthdays = holidaysForDate.filter((h) => h.type === "birthday");
  const foundations = holidaysForDate.filter((h) => h.type === "foundation");
  const otherHolidays = holidaysForDate.filter((h) => h.type === "other");

  const holidayDates = useMemo(() => {
    return mockHolidays.map((h) => parseISO(h.date));
  }, []);

  const getPersonName = (personId: string) => {
    const p = mockPeople.find((p) => p.id === personId);
    return p ? `${p.lastName} ${p.firstName} ${p.middleName}` : "Неизвестно";
  };

  const getOrgName = (orgId: string) => {
    const o = mockOrganizations.find((o) => o.id === orgId);
    return o ? o.name : "Неизвестно";
  };

  const handleCongratulate = (holidayId: string) => {
    navigate(`/editor/${holidayId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Главная</h1>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="w-4 h-4" />
          Оповестить ответственных
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Calendar + Stats */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-lg border p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              locale={ru}
              className="pointer-events-auto"
              modifiers={{ holiday: holidayDates }}
              modifiersClassNames={{ holiday: "bg-primary/10 text-primary font-bold" }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="stat-card">
              <div className="text-2xl font-bold text-primary">{holidaysForDate.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Праздников</div>
            </div>
            <div className="stat-card">
              <div className="text-2xl font-bold text-primary">{birthdays.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Дней рождения</div>
            </div>
            <div className="stat-card">
              <div className="text-2xl font-bold text-primary">{foundations.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Дат основания</div>
            </div>
          </div>
        </div>

        {/* Right: Holiday list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border p-5">
            <h2 className="text-lg font-semibold mb-1">
              Праздники на {format(selectedDate, "d MMMM yyyy", { locale: ru })}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Выберите дату в календаре для просмотра праздников
            </p>

            {holidaysForDate.length === 0 && (
              <p className="text-muted-foreground text-sm py-8 text-center">
                Нет праздников на выбранную дату
              </p>
            )}

            {/* Birthdays */}
            {birthdays.length > 0 && (
              <div className="mb-6">
                <div className="category-header flex items-center gap-2">
                  <Cake className="w-4 h-4" />
                  Дни рождения
                </div>
                <div className="space-y-2">
                  {birthdays.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Cake className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {h.personId ? getPersonName(h.personId) : "—"}
                          </div>
                          <div className="text-xs text-muted-foreground">{h.description}</div>
                        </div>
                      </div>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleCongratulate(h.id)}
                        className="gap-1.5"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        Поздравить
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Foundations */}
            {foundations.length > 0 && (
              <div className="mb-6">
                <div className="category-header flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Дни основания
                </div>
                <div className="space-y-2">
                  {foundations.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {h.organizationId ? getOrgName(h.organizationId) : "—"}
                          </div>
                          <div className="text-xs text-muted-foreground">{h.description}</div>
                        </div>
                      </div>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleCongratulate(h.id)}
                        className="gap-1.5"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        Поздравить
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other */}
            {otherHolidays.length > 0 && (
              <div>
                <div className="category-header flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Прочие праздники
                </div>
                <div className="space-y-2">
                  {otherHolidays.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center">
                          <Star className="w-4 h-4 text-warning" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{h.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(parseISO(h.date), "d MMMM", { locale: ru })}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleCongratulate(h.id)}
                        className="gap-1.5"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        Поздравить
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

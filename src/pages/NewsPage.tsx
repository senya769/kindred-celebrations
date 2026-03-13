import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Save, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";

const mockNews = [
  { id: "1", title: "Заместитель министра Иванов Иван стал Министром", source: "БЕЛТА", date: "2026-03-12", content: "Как изменится политика при министре Иванове? Присутствуем на заседании и выясняем.", matches: 2 },
  { id: "2", title: "ОАО Авиалинии открывает новый рейс в Дубай", source: "Aviation Weekly", date: "2026-03-11", content: "Крупнейшая авиакомпания страны расширяет маршрутную сеть.", matches: 1 },
  { id: "3", title: "Козлова Елена выступила на конференции IT-Summit", source: "TechNews", date: "2026-03-10", content: "Менеджер проектов представила доклад о цифровой трансформации.", matches: 1 },
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [threshold, setThreshold] = useState(1);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filteredNews = mockNews.filter((n) => {
    const matchesQuery = !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery && n.matches >= threshold;
  });

  const handleSave = (id: string) => {
    setSaved((prev) => new Set(prev).add(id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Новости</h1>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Обновить
        </Button>
      </div>

      <div className="filter-bar mb-6">
        <div className="flex-1 min-w-[250px]">
          <Label className="text-xs text-muted-foreground">Поиск</Label>
          <Input placeholder="Поиск по заголовку и содержанию..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="w-[120px]">
          <Label className="text-xs text-muted-foreground">Порог совпадений</Label>
          <Input type="number" min={1} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
        </div>
        <Button className="gap-2">
          <Search className="w-4 h-4" />
          Найти
        </Button>
      </div>

      <div className="space-y-3">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="bg-card rounded-lg border p-4 hover:shadow-sm transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">{news.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{news.content}</p>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>{news.date}</span>
                  <span>Совпадений: {news.matches}</span>
                </div>
              </div>
              <Button
                variant={saved.has(news.id) ? "secondary" : "outline"}
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity gap-1.5 ml-4 shrink-0"
                onClick={() => handleSave(news.id)}
                disabled={saved.has(news.id)}
              >
                <Save className="w-3.5 h-3.5" />
                {saved.has(news.id) ? "Сохранено" : "Сохранить"}
              </Button>
            </div>
          </div>
        ))}
        {filteredNews.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Нет новостей по заданным критериям</div>
        )}
      </div>
    </div>
  );
}

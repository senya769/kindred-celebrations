export interface Person {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  position: string;
  emails: string;
  phone: string;
  gender: 'male' | 'female';
  field: string;
}

export interface Organization {
  id: string;
  name: string;
  foundedDate: string;
  description: string;
  emails: string;
  phone: string;
  field: string;
}

export interface Holiday {
  id: string;
  date: string;
  description: string;
  type: 'birthday' | 'foundation' | 'other';
  personId?: string;
  organizationId?: string;
  messageTemplate?: string;
}

export const mockPeople: Person[] = [
  { id: '1', lastName: 'Иванов', firstName: 'Иван', middleName: 'Иванович', birthDate: '2026-03-13', position: 'Генеральный директор', emails: 'ivanov@example.com', phone: '+7 (999) 123-45-67', gender: 'male', field: 'Авиация' },
  { id: '2', lastName: 'Петрова', firstName: 'Мария', middleName: 'Сергеевна', birthDate: '2026-03-15', position: 'Финансовый директор', emails: 'petrova@example.com', phone: '+7 (999) 234-56-78', gender: 'female', field: 'Финансы' },
  { id: '3', lastName: 'Сидоров', firstName: 'Алексей', middleName: 'Петрович', birthDate: '2026-03-20', position: 'Начальник отдела', emails: 'sidorov@example.com', phone: '+7 (999) 345-67-89', gender: 'male', field: 'Логистика' },
  { id: '4', lastName: 'Козлова', firstName: 'Елена', middleName: 'Андреевна', birthDate: '2026-04-05', position: 'Менеджер проектов', emails: 'kozlova@example.com', phone: '+7 (999) 456-78-90', gender: 'female', field: 'IT' },
  { id: '5', lastName: 'Морозов', firstName: 'Дмитрий', middleName: 'Викторович', birthDate: '2026-03-13', position: 'Пилот', emails: 'morozov@example.com', phone: '+7 (999) 567-89-01', gender: 'male', field: 'Авиация' },
];

export const mockOrganizations: Organization[] = [
  { id: '1', name: 'ОАО "Авиалинии"', foundedDate: '2026-03-13', description: 'Крупнейшая авиакомпания страны', emails: 'info@airlines.com', phone: '+7 (495) 111-22-33', field: 'Авиация' },
  { id: '2', name: 'ЗАО "ТехноСервис"', foundedDate: '2026-03-20', description: 'Техническое обслуживание воздушных судов', emails: 'info@techservice.com', phone: '+7 (495) 222-33-44', field: 'Техника' },
  { id: '3', name: 'ООО "СкайКарго"', foundedDate: '2026-04-10', description: 'Грузовые авиаперевозки', emails: 'info@skycargo.com', phone: '+7 (495) 333-44-55', field: 'Логистика' },
];

export const mockHolidays: Holiday[] = [
  { id: '1', date: '2026-03-13', description: 'День рождения', type: 'birthday', personId: '1' },
  { id: '2', date: '2026-03-13', description: 'День рождения', type: 'birthday', personId: '5' },
  { id: '3', date: '2026-03-13', description: 'День основания', type: 'foundation', organizationId: '1' },
  { id: '4', date: '2026-03-13', description: 'Международный день авиации', type: 'other' },
  { id: '5', date: '2026-03-15', description: 'День рождения', type: 'birthday', personId: '2' },
  { id: '6', date: '2026-03-20', description: 'День рождения', type: 'birthday', personId: '3' },
  { id: '7', date: '2026-03-20', description: 'День основания', type: 'foundation', organizationId: '2' },
  { id: '8', date: '2026-03-08', description: 'Международный женский день', type: 'other' },
  { id: '9', date: '2026-04-05', description: 'День рождения', type: 'birthday', personId: '4' },
  { id: '10', date: '2026-04-10', description: 'День основания', type: 'foundation', organizationId: '3' },
];

export const fields = ['Авиация', 'Финансы', 'Логистика', 'IT', 'Техника', 'Маркетинг', 'HR'];

import { List, Datagrid, TextField, DateField, ChipField } from 'react-admin';

const statusChoices = [
  { id: 'TRIALING', name: 'Триал' },
  { id: 'ACTIVE', name: 'Активна' },
  { id: 'PAST_DUE', name: 'Просрочена' },
  { id: 'CANCELED', name: 'Отменена' },
  { id: 'PAUSED', name: 'Приостановлена' },
];

export const SubscriptionList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="customer.name" label="Клиент" />
      <TextField source="plan.name" label="Тариф" />
      <ChipField source="status" label="Статус" />
      <DateField source="currentPeriodStart" label="Начало периода" />
      <DateField source="currentPeriodEnd" label="Конец периода" />
      <DateField source="createdAt" label="Создана" />
    </Datagrid>
  </List>
);

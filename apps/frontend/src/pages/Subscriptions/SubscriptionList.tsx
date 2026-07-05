import {
  List,
  Datagrid,
  TextField,
  DateField,
  ChipField,
} from 'react-admin';

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

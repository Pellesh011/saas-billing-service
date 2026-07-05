import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ChipField,
} from 'react-admin';

export const InvoiceList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="number" label="Номер" />
      <TextField source="customer.name" label="Клиент" />
      <ChipField source="status" label="Статус" />
      <NumberField source="amount" label="Сумма" options={{ style: 'currency', currency: 'RUB' }} />
      <NumberField source="amountDue" label="К оплате" options={{ style: 'currency', currency: 'RUB' }} />
      <DateField source="dueDate" label="Срок оплаты" />
      <DateField source="paidAt" label="Оплачен" />
    </Datagrid>
  </List>
);

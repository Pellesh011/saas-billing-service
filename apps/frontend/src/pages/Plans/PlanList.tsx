import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  EditButton,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  required,
} from 'react-admin';

const currencyChoices = [
  { id: 'RUB', name: 'Рубли (₽)' },
  { id: 'USD', name: 'Доллары ($)' },
  { id: 'EUR', name: 'Евро (€)' },
];

const intervalChoices = [
  { id: 'DAY', name: 'День' },
  { id: 'WEEK', name: 'Неделя' },
  { id: 'MONTH', name: 'Месяц' },
  { id: 'YEAR', name: 'Год' },
];

export const PlanList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Название" />
      <TextField source="description" label="Описание" />
      <NumberField source="price" label="Цена" options={{ style: 'currency', currency: 'RUB' }} />
      <TextField source="currency" label="Валюта" />
      <TextField source="interval" label="Период" />
      <NumberField source="trialDays" label="Дней триала" />
      <BooleanField source="isActive" label="Активен" />
      <EditButton />
    </Datagrid>
  </List>
);

export const PlanCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Название" validate={required()} />
      <TextInput source="description" label="Описание" multiline />
      <NumberInput source="price" label="Цена" validate={required()} />
      <SelectInput source="currency" label="Валюта" choices={currencyChoices} defaultValue="RUB" />
      <SelectInput source="interval" label="Период" choices={intervalChoices} defaultValue="MONTH" />
      <NumberInput source="trialDays" label="Дней триала" defaultValue={0} />
      <NumberInput source="sortOrder" label="Порядок сортировки" defaultValue={0} />
      <BooleanInput source="isActive" label="Активен" defaultValue={true} />
    </SimpleForm>
  </Create>
);

export const PlanEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Название" validate={required()} />
      <TextInput source="description" label="Описание" multiline />
      <NumberInput source="price" label="Цена" validate={required()} />
      <SelectInput source="currency" label="Валюта" choices={currencyChoices} />
      <SelectInput source="interval" label="Период" choices={intervalChoices} />
      <NumberInput source="trialDays" label="Дней триала" />
      <NumberInput source="sortOrder" label="Порядок сортировки" />
      <BooleanInput source="isActive" label="Активен" />
    </SimpleForm>
  </Edit>
);

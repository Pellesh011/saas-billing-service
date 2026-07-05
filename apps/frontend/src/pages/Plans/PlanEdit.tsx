import { Edit, SimpleForm, TextInput, NumberInput, BooleanInput, SelectInput, required } from 'react-admin';

const PlanEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Название" validate={required()} />
      <TextInput source="description" label="Описание" multiline />
      <NumberInput source="price" label="Цена" validate={required()} />
      <SelectInput
        source="currency"
        label="Валюта"
        choices={[
          { id: 'RUB', name: 'Рубли (₽)' },
          { id: 'USD', name: 'Доллары ($)' },
          { id: 'EUR', name: 'Евро (€)' },
        ]}
      />
      <SelectInput
        source="interval"
        label="Период"
        choices={[
          { id: 'DAY', name: 'День' },
          { id: 'WEEK', name: 'Неделя' },
          { id: 'MONTH', name: 'Месяц' },
          { id: 'YEAR', name: 'Год' },
        ]}
      />
      <NumberInput source="trialDays" label="Дней триала" />
      <BooleanInput source="isActive" label="Активен" />
    </SimpleForm>
  </Edit>
);

export default PlanEdit;

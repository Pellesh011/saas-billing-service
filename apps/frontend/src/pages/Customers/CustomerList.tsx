import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  EditButton,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  required,
  email,
} from 'react-admin';

export const CustomerList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Имя" />
      <EmailField source="email" label="Email" />
      <TextField source="company" label="Компания" />
      <TextField source="phone" label="Телефон" />
      <DateField source="createdAt" label="Создан" />
      <EditButton />
    </Datagrid>
  </List>
);

export const CustomerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Имя" />
      <TextInput source="email" label="Email" validate={[required(), email()]} />
      <TextInput source="company" label="Компания" />
      <TextInput source="phone" label="Телефон" />
    </SimpleForm>
  </Create>
);

export const CustomerEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Имя" />
      <TextInput source="email" label="Email" validate={[required(), email()]} />
      <TextInput source="company" label="Компания" />
      <TextInput source="phone" label="Телефон" />
      <TextInput source="taxId" label="ИНН" />
    </SimpleForm>
  </Edit>
);

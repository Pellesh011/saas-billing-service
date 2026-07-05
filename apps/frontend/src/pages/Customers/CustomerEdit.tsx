import { Edit, SimpleForm, TextInput, required, email } from 'react-admin';

const CustomerEdit = () => (
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

export default CustomerEdit;

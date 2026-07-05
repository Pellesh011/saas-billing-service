import { Create, SimpleForm, TextInput, EmailField, required, email } from 'react-admin';

const CustomerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Имя" />
      <TextInput source="email" label="Email" validate={[required(), email()]} />
      <TextInput source="company" label="Компания" />
      <TextInput source="phone" label="Телефон" />
    </SimpleForm>
  </Create>
);

export default CustomerCreate;

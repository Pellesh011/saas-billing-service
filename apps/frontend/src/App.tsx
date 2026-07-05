import { Admin, Resource } from 'react-admin';
import { dataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import Dashboard from './pages/Dashboard/Dashboard';
import { PlanList, PlanCreate, PlanEdit } from './pages/Plans/PlanList';
import { CustomerList, CustomerCreate, CustomerEdit } from './pages/Customers/CustomerList';
import { SubscriptionList } from './pages/Subscriptions/SubscriptionList';
import { InvoiceList } from './pages/Invoices/InvoiceList';
import Login from './routes/Login';

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
    loginPage={Login}
    title="SaaS Billing"
  >
    <Resource
      name="plans"
      list={PlanList}
      create={PlanCreate}
      edit={PlanEdit}
      options={{ label: 'Тарифные планы' }}
    />
    <Resource
      name="customers"
      list={CustomerList}
      create={CustomerCreate}
      edit={CustomerEdit}
      options={{ label: 'Клиенты' }}
    />
    <Resource
      name="subscriptions"
      list={SubscriptionList}
      options={{ label: 'Подписки' }}
    />
    <Resource
      name="invoices"
      list={InvoiceList}
      options={{ label: 'Счета' }}
    />
  </Admin>
);

export default App;

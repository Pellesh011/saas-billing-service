import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { dataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import { store } from './store';
import Dashboard from './pages/Dashboard/Dashboard';
import PlanList from './pages/Plans/PlanList';
import PlanCreate from './pages/Plans/PlanCreate';
import PlanEdit from './pages/Plans/PlanEdit';
import CustomerList from './pages/Customers/CustomerList';
import CustomerCreate from './pages/Customers/CustomerCreate';
import CustomerEdit from './pages/Customers/CustomerEdit';
import SubscriptionList from './pages/Subscriptions/SubscriptionList';
import InvoiceList from './pages/Invoices/InvoiceList';
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

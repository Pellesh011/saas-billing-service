import { Card, CardContent, Typography, Grid } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Dashboard = () => {
  return (
    <div className="p-6">
      <Typography variant="h4" gutterBottom>
        Дашборд
      </Typography>
      <Grid container spacing={3}>
        {[
          { title: 'MRR', value: '₽0', icon: AttachMoneyIcon, color: '#3b82f6' },
          { title: 'Активные подписки', value: '0', icon: CreditCardIcon, color: '#22c55e' },
          { title: 'Клиенты', value: '0', icon: PeopleIcon, color: '#f59e0b' },
          { title: 'Конверсия', value: '0%', icon: TrendingUpIcon, color: '#8b5cf6' },
        ].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Typography color="textSecondary" variant="body2">
                      {item.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {item.value}
                    </Typography>
                  </div>
                  <item.icon sx={{ fontSize: 32, color: item.color }} />
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;

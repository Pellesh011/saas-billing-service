import { Typography, Card, CardContent, Grid } from '@mui/material';
import {
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <Typography variant="h4" gutterBottom>
        Дашборд
      </Typography>
      <Grid container spacing={3}>
        {[
          { title: 'MRR', value: '₽0', icon: DollarSign, color: '#3b82f6' },
          { title: 'Активные подписки', value: '0', icon: CreditCard, color: '#22c55e' },
          { title: 'Клиенты', value: '0', icon: Users, color: '#f59e0b' },
          { title: 'Конверсия', value: '0%', icon: TrendingUp, color: '#8b5cf6' },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
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
                  <item.icon size={32} color={item.color} />
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

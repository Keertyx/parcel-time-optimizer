
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Parcel } from '@/context/ParcelContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DeliveryPerformanceProps {
  parcels: Parcel[];
}

const DeliveryPerformance: React.FC<DeliveryPerformanceProps> = ({ parcels }) => {
  // Calculate status counts
  const statusCounts = parcels.reduce(
    (acc, parcel) => {
      acc[parcel.status]++;
      return acc;
    },
    { pending: 0, 'in-transit': 0, delivered: 0 } as Record<Parcel['status'], number>
  );
  
  const statusData = [
    { name: 'Pending', value: statusCounts.pending, color: 'hsl(var(--pending))' },
    { name: 'In Transit', value: statusCounts['in-transit'], color: 'hsl(var(--in-transit))' },
    { name: 'Delivered', value: statusCounts.delivered, color: 'hsl(var(--delivered))' },
  ];
  
  // Calculate daily deliveries (last 7 days)
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - i));
    return {
      date,
      name: dayNames[date.getDay()],
      delivered: 0,
    };
  });
  
  // Count deliveries by day
  parcels.forEach((parcel) => {
    if (parcel.status === 'delivered') {
      const deliveryDate = new Date(parcel.createdAt);
      const dayIndex = last7Days.findIndex((day) => {
        return day.date.toDateString() === deliveryDate.toDateString();
      });
      
      if (dayIndex !== -1) {
        last7Days[dayIndex].delivered++;
      }
    }
  });
  
  // If there are no parcels yet, show a message
  if (parcels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            No delivery data available yet.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution Chart */}
          <div className="h-80">
            <h3 className="font-medium mb-2">Parcel Status Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Daily Deliveries Chart */}
          <div className="h-80">
            <h3 className="font-medium mb-2">Daily Deliveries (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="delivered" fill="hsl(var(--delivered))" name="Delivered Parcels" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Performance Stats */}
          <div className="lg:col-span-2">
            <h3 className="font-medium mb-2">Performance Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-md text-center">
                <div className="text-3xl font-bold">{statusCounts.pending}</div>
                <div className="text-muted-foreground">Pending</div>
              </div>
              <div className="p-4 bg-muted rounded-md text-center">
                <div className="text-3xl font-bold">{statusCounts['in-transit']}</div>
                <div className="text-muted-foreground">In Transit</div>
              </div>
              <div className="p-4 bg-muted rounded-md text-center">
                <div className="text-3xl font-bold">{statusCounts.delivered}</div>
                <div className="text-muted-foreground">Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryPerformance;

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from "recharts";
import { History } from "lucide-react";

interface ComparisonChartProps {
  data: any[];
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-6">
      
      <div>
        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
          <History className="w-4.5 h-4.5 text-primary" /> Historical & Predicted Comparison
        </h4>
        <span className="text-[10px] text-muted mt-1 block">Overlapping timelines tracking yesterday's actual actuals vs today's forecast trends</span>
      </div>

      <div className="h-[250px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAqiYesterday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--muted)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--muted)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAqiToday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="hour" stroke="var(--muted)" fontSize={10} />
            <YAxis stroke="var(--muted)" fontSize={10} />
            <ChartTooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', fontSize: '10px' }} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            
            <Area 
              type="monotone" 
              name="Yesterday (Actual)" 
              dataKey="yesterday" 
              stroke="var(--muted)" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorAqiYesterday)" 
            />
            
            <Area 
              type="monotone" 
              name="Today (Forecast)" 
              dataKey="today" 
              stroke="var(--primary)" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorAqiToday)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

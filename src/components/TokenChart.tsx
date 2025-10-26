import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TokenChartProps {
  currentPrice: number;
  onPriceChange?: (newPrice: number, newMarketCap: number) => void;
  tokenSymbol: string;
  tokenId: string;
  totalSupply: number;
}

interface ChartDataPoint {
  time: string;
  price: number;
  timestamp: number;
}

export const TokenChart: React.FC<TokenChartProps> = ({ 
  currentPrice, 
  onPriceChange, 
  tokenSymbol,
  totalSupply
}) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Initialize chart with mock price history
  useEffect(() => {
    const now = Date.now();
    const mockHistory: ChartDataPoint[] = [];
    
    for (let i = 99; i >= 0; i--) {
      const timestamp = now - (i * 60 * 1000); // 1 minute intervals
      const randomVariation = (Math.random() - 0.5) * 0.1; // ±10% variation
      const price = currentPrice * (1 + randomVariation * (i / 100));
      
      mockHistory.push({
        time: new Date(timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        price: Math.max(price, 0.00001),
        timestamp: timestamp
      });
    }

    setChartData(mockHistory);
  }, [currentPrice]);

  // Update chart when price changes
  useEffect(() => {
    if (!chartData.length) return;

    const now = Date.now();
    const lastDataPoint = chartData[chartData.length - 1];
    
    // Only add new point if price has changed significantly or enough time has passed
    const priceChanged = Math.abs(lastDataPoint.price - currentPrice) / lastDataPoint.price > 0.001;
    const timeElapsed = now - lastDataPoint.timestamp > 10000; // 10 seconds
    
    if (priceChanged || timeElapsed) {
      const newDataPoint: ChartDataPoint = {
        time: new Date(now).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        price: currentPrice,
        timestamp: now
      };

      setChartData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-100); // Keep last 100 points
      });
    }
  }, [currentPrice, chartData]);

  if (!chartData.length) {
    return (
      <div className="h-80 bg-gradient-to-br from-secondary/5 to-background rounded-lg border flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  const latestPrice = chartData[chartData.length - 1]?.price || currentPrice;
  const previousPrice = chartData.length > 1 ? chartData[chartData.length - 2]?.price : latestPrice;
  const priceChange = latestPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? ((priceChange / previousPrice) * 100).toFixed(2) : '0.00';
  const isPositive = priceChange >= 0;

  // Calculate 24h high/low from chart data
  const prices = chartData.map(d => d.price);
  const high24h = Math.max(...prices);
  const low24h = Math.min(...prices);

  return (
    <div className="relative">
      {/* Price Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-bold font-mono">
              ${latestPrice < 0.01 ? latestPrice.toFixed(8) : latestPrice.toFixed(6)}
            </div>
            <div className="text-sm text-muted-foreground">
              {tokenSymbol} Price
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'bg-green-500/10 text-green-500' 
              : 'bg-red-500/10 text-red-500'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {isPositive ? '+' : ''}{priceChangePercent}%
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80 bg-gradient-to-br from-secondary/5 to-background rounded-lg border overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['dataMin * 0.99', 'dataMax * 1.01']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => {
                if (value < 0.01) return `$${value.toFixed(8)}`;
                return `$${value.toFixed(6)}`;
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div className="p-3 bg-secondary/20 rounded-lg">
          <div className="text-lg font-bold text-green-500">
            ${high24h < 0.01 ? high24h.toFixed(8) : high24h.toFixed(6)}
          </div>
          <div className="text-xs text-muted-foreground">24H High</div>
        </div>
        <div className="p-3 bg-secondary/20 rounded-lg">
          <div className="text-lg font-bold text-red-500">
            ${low24h < 0.01 ? low24h.toFixed(8) : low24h.toFixed(6)}
          </div>
          <div className="text-xs text-muted-foreground">24H Low</div>
        </div>
        <div className="p-3 bg-secondary/20 rounded-lg">
          <div className="text-lg font-bold text-primary">
            {Math.floor(chartData.length * 2.3)}
          </div>
          <div className="text-xs text-muted-foreground">Total Swaps</div>
        </div>
      </div>
    </div>
  );
};
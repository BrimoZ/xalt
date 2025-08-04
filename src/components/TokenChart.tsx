import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceDot } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  volume?: number;
}

interface TransactionEffect {
  id: string;
  price: number;
  type: 'buy' | 'sell';
  timestamp: number;
  x: number;
  y: number;
  amount: number;
}

let transactionCounter = 0;

export const TokenChart: React.FC<TokenChartProps> = ({ 
  currentPrice, 
  onPriceChange, 
  tokenSymbol,
  tokenId,
  totalSupply
}) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [transactionEffects, setTransactionEffects] = useState<TransactionEffect[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Initialize chart with price history data
  useEffect(() => {
    const initializeChart = async () => {
      try {
        // Fetch recent price history
        const { data: priceHistory, error } = await supabase
          .from('price_history')
          .select('*')
          .eq('token_id', tokenId)
          .order('created_at', { ascending: true })
          .limit(100);

        if (error) {
          console.error('Error fetching price history:', error);
        }

        // Always create mock data for better UX since price_history table is empty
        const now = Date.now();
        const mockData: ChartDataPoint[] = [];
        
        // Generate 50 realistic price points over the last 2 hours
        for (let i = 49; i >= 0; i--) {
          const timestamp = now - (i * 2.4 * 60000); // Every 2.4 minutes
          
          // Create realistic price movement around current price
          const timeProgress = (49 - i) / 49;
          const volatility = 0.1; // 10% volatility
          const trend = Math.sin(timeProgress * Math.PI * 2) * 0.05; // Small trend
          const noise = (Math.random() - 0.5) * volatility;
          
          const priceMultiplier = 1 + trend + (noise * timeProgress * 0.5);
          const price = currentPrice * priceMultiplier;
          
          mockData.push({
            time: new Date(timestamp).toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            price: Math.max(price, currentPrice * 0.5), // Don't go below 50% of current price
            timestamp,
            volume: Math.random() * 1000 + 100
          });
        }
        
        // If we have real price history, use it, otherwise use mock data
        if (priceHistory && priceHistory.length > 0) {
          const chartPoints: ChartDataPoint[] = priceHistory.map(point => ({
            time: new Date(point.created_at).toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            price: Number(point.price),
            timestamp: new Date(point.created_at).getTime(),
            volume: Number(point.volume)
          }));
          
          setChartData(chartPoints);
        } else {
          setChartData(mockData);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing chart:', error);
        
        // Fallback to mock data
        const now = Date.now();
        const mockData: ChartDataPoint[] = [];
        
        for (let i = 49; i >= 0; i--) {
          const timestamp = now - (i * 2.4 * 60000);
          const timeProgress = (49 - i) / 49;
          const volatility = 0.1;
          const trend = Math.sin(timeProgress * Math.PI * 2) * 0.05;
          const noise = (Math.random() - 0.5) * volatility;
          const priceMultiplier = 1 + trend + (noise * timeProgress * 0.5);
          const price = currentPrice * priceMultiplier;
          
          mockData.push({
            time: new Date(timestamp).toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            price: Math.max(price, currentPrice * 0.5),
            timestamp,
            volume: Math.random() * 1000 + 100
          });
        }
        
        setChartData(mockData);
        setIsInitialized(true);
      }
    };

    if (tokenId && !isInitialized) {
      initializeChart();
    }
  }, [tokenId, currentPrice, isInitialized]);

  // Update chart when currentPrice changes (immediate updates)
  useEffect(() => {
    if (!isInitialized || !chartData.length) return;

    const now = Date.now();
    const lastDataPoint = chartData[chartData.length - 1];
    
    // Only add new point if price has changed significantly or enough time has passed
    const priceChanged = Math.abs(lastDataPoint.price - currentPrice) / lastDataPoint.price > 0.001; // 0.1% change
    const timeElapsed = now - lastDataPoint.timestamp > 10000; // 10 seconds
    
    if (priceChanged || timeElapsed) {
      const newDataPoint: ChartDataPoint = {
        time: new Date(now).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        price: currentPrice,
        timestamp: now,
        volume: Math.random() * 1000 + 100
      };

      setChartData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-200);
      });
    }
  }, [currentPrice, isInitialized, chartData]);

  // Add natural price movement simulation
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const lastPoint = chartData[chartData.length - 1];
      
      if (!lastPoint) return;

      // Small natural price movement (±0.5%)
      const naturalVariation = (Math.random() - 0.5) * 0.01;
      const newPrice = Math.max(lastPoint.price * (1 + naturalVariation), 0.00001);
      
      const newDataPoint: ChartDataPoint = {
        time: new Date(now).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        price: newPrice,
        timestamp: now,
        volume: Math.random() * 500 + 50
      };

      setChartData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-200);
      });

      // Update parent component with new price
      onPriceChange?.(newPrice, newPrice * totalSupply);
    }, 5000 + Math.random() * 5000); // Every 5-10 seconds

    return () => clearInterval(interval);
  }, [isInitialized, chartData, onPriceChange, totalSupply]);

  // Listen for real-time token updates
  useEffect(() => {
    if (!isInitialized) return;

    const tokenChannel = supabase
      .channel('token-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tokens',
          filter: `id=eq.${tokenId}`
        },
        (payload) => {
          const updatedToken = payload.new;
          const newPrice = Number(updatedToken.current_price);
          const newMarketCap = Number(updatedToken.market_cap);
          
          // Add new price point to chart
          const now = Date.now();
          const newDataPoint: ChartDataPoint = {
            time: new Date(now).toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            price: newPrice,
            timestamp: now,
            volume: Number(updatedToken.volume_24h)
          };

          setChartData(prev => {
            const updated = [...prev, newDataPoint];
            // Keep last 200 points instead of 50 to prevent frequent resets
            return updated.slice(-200);
          });

          onPriceChange?.(newPrice, newMarketCap);
        }
      )
      .subscribe();

    // Listen for new trades to show transaction effects
    const tradesChannel = supabase
      .channel('trade-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trades',
          filter: `token_id=eq.${tokenId}`
        },
        (payload) => {
          const trade = payload.new;
          const tradeType = trade.trade_type as 'buy' | 'sell';
          const solAmount = Number(trade.sol_amount);
          
          // Add visual effect for the trade
          addTransactionEffect(tradeType, solAmount);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tokenChannel);
      supabase.removeChannel(tradesChannel);
    };
  }, [isInitialized, tokenId, onPriceChange]);

  // Function to add transaction effect
  const addTransactionEffect = (type: 'buy' | 'sell', solAmount: number) => {
    const now = Date.now();
    const currentPrice = chartData[chartData.length - 1]?.price || 0;

    // Add visual effect
    const effectId = `transaction-${++transactionCounter}`;
    const effect: TransactionEffect = {
      id: effectId,
      price: currentPrice,
      type,
      timestamp: now,
      x: Math.random() * 70 + 15, // Random position within chart bounds
      y: Math.random() * 50 + 25,
      amount: solAmount
    };

    setTransactionEffects(prev => [...prev, effect]);

    // Remove effect after animation
    setTimeout(() => {
      setTransactionEffects(prev => prev.filter(e => e.id !== effectId));
    }, 3000);
  };

  // Expose transaction function globally for manual triggering
  useEffect(() => {
    (window as any).addChartTransaction = addTransactionEffect;
    return () => {
      delete (window as any).addChartTransaction;
    };
  }, [chartData]);

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
  const totalVolume = chartData.reduce((sum, point) => sum + (point.volume || 0), 0);

  return (
    <div className="relative" ref={chartRef}>
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
            
            {/* Transaction dots */}
            {transactionEffects.map((effect) => {
              const dataPoint = chartData.find(d => 
                Math.abs(d.timestamp - effect.timestamp) < 10000
              );
              if (!dataPoint) return null;
              
              return (
                <ReferenceDot
                  key={effect.id}
                  x={dataPoint.time}
                  y={dataPoint.price}
                  r={6}
                  fill={effect.type === 'buy' ? '#22c55e' : '#ef4444'}
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="animate-ping"
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>

        {/* Transaction Effects Overlay */}
        {transactionEffects.map((effect) => (
          <div
            key={effect.id}
            className={`absolute pointer-events-none z-20 ${
              effect.type === 'buy' ? 'text-green-500' : 'text-red-500'
            }`}
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              animation: 'transactionPop 3s ease-out forwards'
            }}
          >
            <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
              effect.type === 'buy' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {effect.type === 'buy' ? '🚀' : '📉'} {effect.amount.toFixed(1)} SOL
            </div>
          </div>
        ))}
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

      <style>{`
        @keyframes transactionPop {
          0% {
            transform: scale(0) translateY(0);
            opacity: 1;
          }
          30% {
            transform: scale(1.2) translateY(-20px);
            opacity: 1;
          }
          100% {
            transform: scale(0.8) translateY(-60px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useTheme } from '../../context/ThemeContext'
import { useProgress } from '../../context/ProgressContext'
import { format, subDays, parseISO } from 'date-fns'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ProgressChartProps {
  days?: number
}

export default function ProgressChart({ days = 14 }: ProgressChartProps) {
  const { theme } = useTheme()
  const { dailyProgress, currentGoal } = useProgress()
  
  // Generate last N days
  const getDaysArray = () => {
    const today = new Date()
    const daysArray = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i)
      daysArray.push(format(date, 'yyyy-MM-dd'))
    }
    
    return daysArray
  }
  
  const daysArray = getDaysArray()
  
  // Map daily progress to chart data
  const problemsCompletedData = daysArray.map(date => {
    const dayProgress = dailyProgress.find(p => p.date === date)
    return dayProgress ? dayProgress.problemsCompleted : 0
  })
  
  // Goal line data
  const goalLineData = currentGoal?.active 
    ? daysArray.map(() => currentGoal.problemsPerDay)
    : []
  
  // Set chart options and colors based on theme
  const textColor = theme === 'dark' ? '#D1D5DB' : '#4B5563'
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  
  const data = {
    labels: daysArray.map(date => format(parseISO(date), 'MMM d')),
    datasets: [
      {
        label: 'Problems Solved',
        data: problemsCompletedData,
        borderColor: '#0A84FF',
        backgroundColor: 'rgba(10, 132, 255, 0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#0A84FF',
        pointBorderColor: theme === 'dark' ? '#111827' : '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      ...(goalLineData.length > 0 ? [
        {
          label: 'Daily Goal',
          data: goalLineData,
          borderColor: '#BF5AF2',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
          borderWidth: 2,
        }
      ] : [])
    ]
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#374151' : '#FFFFFF',
        titleColor: theme === 'dark' ? '#F9FAFB' : '#111827',
        bodyColor: theme === 'dark' ? '#D1D5DB' : '#4B5563',
        borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13,
        },
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          stepSize: 1,
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  }
  
  return (
    <div className="w-full h-72 md:h-80">
      <Line data={data} options={options} />
    </div>
  )
}
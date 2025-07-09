import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBarChart3, FiTrendingUp, FiEye } = FiIcons;

const ChartDisplay = ({ data }) => {
  const [selectedChart, setSelectedChart] = useState('evolution');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const evolutionOption = {
    title: {
      text: 'Evolução do Patrimônio',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const year = params[0].axisValue;
        let result = `<strong>Ano ${year}</strong><br/>`;
        params.forEach(param => {
          result += `${param.seriesName}: ${formatCurrency(param.value)}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Valor Nominal', 'Valor Real', 'Total Investido'],
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.year),
      name: 'Anos',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: 'Valor (R$)',
      nameLocation: 'middle',
      nameGap: 50,
      axisLabel: {
        formatter: function(value) {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K';
          }
          return value;
        }
      }
    },
    series: [
      {
        name: 'Valor Nominal',
        type: 'line',
        data: data.map(d => d.nominalValue),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#10B981'
        },
        areaStyle: {
          opacity: 0.1,
          color: '#10B981'
        }
      },
      {
        name: 'Valor Real',
        type: 'line',
        data: data.map(d => d.realValue),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#3B82F6'
        },
        areaStyle: {
          opacity: 0.1,
          color: '#3B82F6'
        }
      },
      {
        name: 'Total Investido',
        type: 'line',
        data: data.map(d => d.totalContributed),
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#8B5CF6',
          type: 'dashed'
        }
      }
    ]
  };

  const gainsOption = {
    title: {
      text: 'Evolução dos Ganhos',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const year = params[0].axisValue;
        const gains = params[0].value;
        const contributed = data.find(d => d.year == year).totalContributed;
        const percentage = ((gains / contributed) * 100).toFixed(1);
        return `<strong>Ano ${year}</strong><br/>
                Ganhos: ${formatCurrency(gains)}<br/>
                Retorno: ${percentage}%`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.year),
      name: 'Anos',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: 'Ganhos (R$)',
      nameLocation: 'middle',
      nameGap: 50,
      axisLabel: {
        formatter: function(value) {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K';
          }
          return value;
        }
      }
    },
    series: [
      {
        name: 'Ganhos',
        type: 'bar',
        data: data.map(d => d.gains),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#F59E0B' },
              { offset: 1, color: '#D97706' }
            ]
          }
        }
      }
    ]
  };

  const chartOptions = {
    evolution: evolutionOption,
    gains: gainsOption
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SafeIcon icon={FiBarChart3} className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Análise Gráfica</h2>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedChart('evolution')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectedChart === 'evolution'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <SafeIcon icon={FiTrendingUp} className="text-sm" />
            Evolução
          </button>
          <button
            onClick={() => setSelectedChart('gains')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectedChart === 'gains'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <SafeIcon icon={FiEye} className="text-sm" />
            Ganhos
          </button>
        </div>
      </div>

      <div className="h-96">
        <ReactECharts 
          option={chartOptions[selectedChart]} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-1">💚 Valor Nominal</h4>
          <p className="text-green-700">Valor futuro sem descontar a inflação</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-1">💙 Valor Real</h4>
          <p className="text-blue-700">Poder de compra atual (descontando inflação)</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-1">🧡 Ganhos</h4>
          <p className="text-orange-700">Diferença entre valor final e total investido</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChartDisplay;
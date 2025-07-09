import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiDollarSign, FiTarget, FiPieChart } = FiIcons;

const ResultsDisplay = ({ results }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const resultCards = [
    {
      title: 'Valor Final (Nominal)',
      value: formatCurrency(results.finalNominalValue),
      icon: FiDollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Valor Final (Real)',
      value: formatCurrency(results.finalRealValue),
      icon: FiTarget,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Investido',
      value: formatCurrency(results.totalContributed),
      icon: FiPieChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Ganhos Totais',
      value: formatCurrency(results.totalGains),
      icon: FiTrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Resultados da Simulação</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {resultCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-100`}
          >
            <div className="flex items-center justify-between mb-3">
              <SafeIcon icon={card.icon} className={`text-2xl ${card.color}`} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          💰 Renda Mensal na Aposentadoria (Regra dos 4%)
        </h3>
        <p className="text-3xl font-bold text-blue-600 mb-2">
          {formatCurrency(results.monthlyRetirementIncome)}
        </p>
        <p className="text-sm text-gray-600">
          Baseado no valor real (descontando inflação) e regra de saque de 4% ao ano
        </p>
      </div>
    </motion.div>
  );
};

export default ResultsDisplay;
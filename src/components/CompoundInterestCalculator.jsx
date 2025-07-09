import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InputField from './InputField';
import ResultsDisplay from './ResultsDisplay';
import ChartDisplay from './ChartDisplay';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCalculator, FiTrendingUp, FiDollarSign, FiTrash2, FiPlay } = FiIcons;

// Dados iniciais do formulário
const initialFormData = {
  initialValue: 10000,
  monthlyContribution: 1000,
  realInterestRate: 10,
  inflationRate: 4,
  yearsToRetirement: 30,
  intermediateContributions: []
};

const CompoundInterestCalculator = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addIntermediateContribution = () => {
    setFormData(prev => ({
      ...prev,
      intermediateContributions: [
        ...prev.intermediateContributions,
        { year: 1, amount: 0 }
      ]
    }));
  };

  const updateIntermediateContribution = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      intermediateContributions: prev.intermediateContributions.map((contrib, i) =>
        i === index ? { ...contrib, [field]: value } : contrib
      )
    }));
  };

  const removeIntermediateContribution = (index) => {
    setFormData(prev => ({
      ...prev,
      intermediateContributions: prev.intermediateContributions.filter((_, i) => i !== index)
    }));
  };

  const resetCalculator = () => {
    // Cria uma cópia fresca do objeto initialFormData para garantir reset completo
    setFormData({
      initialValue: initialFormData.initialValue,
      monthlyContribution: initialFormData.monthlyContribution,
      realInterestRate: initialFormData.realInterestRate,
      inflationRate: initialFormData.inflationRate,
      yearsToRetirement: initialFormData.yearsToRetirement,
      intermediateContributions: []  // Limpa todos os aportes intermediários
    });
    
    // Limpa os resultados e esconde as seções de resultado
    setResults(null);
    setChartData([]);
    setShowResults(false);
  };

  const calculateCompoundInterest = () => {
    const {
      initialValue,
      monthlyContribution,
      realInterestRate,
      inflationRate,
      yearsToRetirement,
      intermediateContributions
    } = formData;

    const monthlyRate = realInterestRate / 100 / 12;
    const yearlyData = [];
    let currentValue = initialValue;
    let totalContributed = initialValue;

    // Criar mapa de aportes intermediários por ano
    const intermediateMap = {};
    intermediateContributions.forEach(contrib => {
      if (contrib.year <= yearsToRetirement && contrib.amount > 0) {
        intermediateMap[contrib.year] = contrib.amount;
      }
    });

    for (let year = 1; year <= yearsToRetirement; year++) {
      const startValue = currentValue;
      
      // Adicionar aporte intermediário no início do ano
      if (intermediateMap[year]) {
        currentValue += intermediateMap[year];
        totalContributed += intermediateMap[year];
      }

      // Calcular 12 meses de aportes mensais e juros
      for (let month = 1; month <= 12; month++) {
        currentValue = currentValue * (1 + monthlyRate) + monthlyContribution;
        totalContributed += monthlyContribution;
      }

      // Calcular valor real (descontando inflação)
      const inflationAdjustedValue = currentValue / Math.pow(1 + inflationRate / 100, year);
      
      yearlyData.push({
        year,
        nominalValue: currentValue,
        realValue: inflationAdjustedValue,
        totalContributed,
        gains: currentValue - totalContributed
      });
    }

    const finalResults = {
      finalNominalValue: currentValue,
      finalRealValue: currentValue / Math.pow(1 + inflationRate / 100, yearsToRetirement),
      totalContributed,
      totalGains: currentValue - totalContributed,
      monthlyRetirementIncome: (currentValue / Math.pow(1 + inflationRate / 100, yearsToRetirement)) * 0.04 / 12
    };

    setResults(finalResults);
    setChartData(yearlyData);
    setShowResults(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiCalculator} className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Parâmetros de Cálculo</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetCalculator}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <SafeIcon icon={FiTrash2} className="text-sm" />
              Limpar
            </button>
            <button
              onClick={calculateCompoundInterest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <SafeIcon icon={FiPlay} className="text-sm" />
              Calcular
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField
            label="Valor Inicial (R$)"
            value={formData.initialValue}
            onChange={(value) => handleInputChange('initialValue', value)}
            type="currency"
          />
          
          <InputField
            label="Aporte Mensal (R$)"
            value={formData.monthlyContribution}
            onChange={(value) => handleInputChange('monthlyContribution', value)}
            type="currency"
          />
          
          <InputField
            label="Taxa de Juros Real (%)"
            value={formData.realInterestRate}
            onChange={(value) => handleInputChange('realInterestRate', value)}
            type="percentage"
          />
          
          <InputField
            label="Inflação Média (%)"
            value={formData.inflationRate}
            onChange={(value) => handleInputChange('inflationRate', value)}
            type="percentage"
          />
          
          <InputField
            label="Anos para Aposentadoria"
            value={formData.yearsToRetirement}
            onChange={(value) => handleInputChange('yearsToRetirement', value)}
            type="number"
          />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Aportes Intermediários</h3>
            <button
              onClick={addIntermediateContribution}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <SafeIcon icon={FiIcons.FiPlus} className="text-sm" />
              Adicionar Aporte
            </button>
          </div>

          <div className="space-y-3">
            {formData.intermediateContributions.map((contrib, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <InputField
                    label="Ano"
                    value={contrib.year}
                    onChange={(value) => updateIntermediateContribution(index, 'year', value)}
                    type="number"
                    min={1}
                    max={formData.yearsToRetirement}
                  />
                </div>
                <div className="flex-2">
                  <InputField
                    label="Valor (R$)"
                    value={contrib.amount}
                    onChange={(value) => updateIntermediateContribution(index, 'amount', value)}
                    type="currency"
                  />
                </div>
                <button
                  onClick={() => removeIntermediateContribution(index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiIcons.FiTrash2} className="text-lg" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {showResults && results && (
        <>
          <ResultsDisplay results={results} />
          <ChartDisplay data={chartData} />
        </>
      )}
    </div>
  );
};

export default CompoundInterestCalculator;
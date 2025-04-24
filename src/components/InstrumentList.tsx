import React, { useState } from 'react';
import { FileText, MoreVertical, Eye, Info } from 'lucide-react';
import type { Instrument } from '../types/account';
import { useAccountInstruments } from '../hooks/useAccounts';

interface InstrumentListProps {
  accountId: string;
  onInstrumentClick: (instrument: Instrument) => void;
  type: 'AUTOMATED_INVESTMENT' | 'MARKET_HUB';
  onInstrumentAction?: (action: string, instrument: Instrument) => void;
}

export function InstrumentList({ 
  accountId,
  onInstrumentClick, 
  type,
  onInstrumentAction 
}: InstrumentListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { data: instruments = [] } = useAccountInstruments(accountId);
  const isMarketHub = type === 'MARKET_HUB';

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {instruments.map((instrument) => (
        <div 
          key={instrument.symbol}
          className="py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
          onClick={() => onInstrumentClick(instrument)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {isMarketHub ? (
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {instrument.logoUrl ? (
                    <img 
                      src={instrument.logoUrl}
                      alt={instrument.symbol}
                      className="w-full h-full object-contain p-1"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      {instrument.symbol.substring(0, 2)}
                    </span>
                  )}
                </div>
              ) : (
                <div 
                  className="w-1 h-8 rounded-sm"
                  style={{ backgroundColor: instrument.color }}
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {instrument.symbol}
                  </span>
                  {isMarketHub && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {instrument.quantity} {instrument.quantity === 1 ? 'Acción' : 'Acciones'}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                  {instrument.name}
                </div>
                {isMarketHub && instrument.sector && (
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {instrument.sector}
                  </div>
                )}
                {!isMarketHub && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Cant. {instrument.quantity}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-right">
                <div className="text-base font-medium text-gray-900 dark:text-white">
                  ${instrument.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium">
                  {isMarketHub ? (
                    <span className={`${
                      instrument.performance >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {instrument.performance >= 0 ? '+' : ''}
                      ${Math.abs(instrument.performance).toLocaleString()}
                    </span>
                  ) : (
                    <>
                      <span className="text-theme-primary dark:text-theme-accent">
                        {instrument.percentage.toFixed(2)}%
                      </span>
                      <span className={`block text-xs ${
                        instrument.performance >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        PERF. ${Math.abs(instrument.performance).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {isMarketHub ? (
                <div className="relative">
                  <button
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === instrument.symbol ? null : instrument.symbol);
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  {activeMenu === instrument.symbol && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(null);
                        }}
                      />
                      <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                        <div className="py-1">
                          <button
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onInstrumentAction?.('view', instrument);
                              setActiveMenu(null);
                            }}
                          >
                            <Info className="w-4 h-4 mr-2" />
                            Ver detalle
                          </button>
                          <button
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onInstrumentAction?.('add-to-watchlist', instrument);
                              setActiveMenu(null);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Añadir a watchlist
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button 
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/api/instruments/${instrument.symbol}/factsheet`, '_blank');
                  }}
                  title="Download factsheet"
                >
                  <FileText className="w-4 h-4 text-gray-400 hover:text-theme-primary dark:hover:text-theme-accent" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Gift, Trash2, Plus, Share2, CheckCircle2, Search, Calculator, User, Briefcase, Users } from 'lucide-react';
import { PRODUTOS_BD, Produto } from './products';

/**
 * BONIFICAÇÃO HF - v11.1
 * CRIADO POR YURI LIMA
 * REGRAS: Design Intocado | Arredondamento 0.52 | Base de Produtos Atualizada
 */

interface BlocoRes {
  saldo: number;
  bonus: number;
  decimal: number;
}

interface Bloco {
  uid: number;
  vendaCod: string;
  vendaQtd: string;
  vendaPNota: string;
  bonificaId: string;
  inputBuscaBonifica: string;
  res: BlocoRes;
}

export default function App() {
  // ESTADO DOS DADOS DO CABEÇALHO
  const [headerData, setHeaderData] = useState({
    equipe: "31-COCAIS",
    supervisor: "YURI LIMA",
    cd: "CD 87",
    vendedor: "",
    cliente: ""
  });

  // ESTADO DOS BLOCOS DE CÁLCULO
  const [blocos, setBlocos] = useState<Bloco[]>([
    {
      uid: Date.now(),
      vendaCod: "524052",
      vendaQtd: '',
      vendaPNota: '',
      bonificaId: "2012",
      inputBuscaBonifica: "2012",
      res: { saldo: 0, bonus: 0, decimal: 0 }
    }
  ]);

  const [copiado, setCopiado] = useState(false);

  const formatarMoeda = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  // LÓGICA DE CÁLCULO E ARREDONDAMENTO 0.52
  useEffect(() => {
    const novosBlocos = blocos.map(bloco => {
      const prodVenda = PRODUTOS_BD.find(p => p.id === bloco.vendaCod.trim());
      const prodBonifica = PRODUTOS_BD.find(p => p.id === bloco.bonificaId);
      
      const precoTabelaVenda = prodVenda ? prodVenda.preco : 0;
      const precoNotaVenda = parseFloat(bloco.vendaPNota) || 0;
      const qtdVenda = parseFloat(bloco.vendaQtd) || 0;
      const precoBonifica = prodBonifica ? prodBonifica.preco : 0;

      const totalInvestimento = (precoNotaVenda - precoTabelaVenda) > 0 
        ? (precoNotaVenda - precoTabelaVenda) * qtdVenda 
        : 0;

      const qtdBruta = precoBonifica > 0 ? totalInvestimento / precoBonifica : 0;
      const frac = qtdBruta % 1;
      
      // REGRA DE ARREDONDAMENTO MANTIDA
      const bonusFinal = frac >= 0.52 ? Math.ceil(qtdBruta) : Math.floor(qtdBruta);

      return { ...bloco, res: { saldo: totalInvestimento, bonus: bonusFinal, decimal: frac } };
    });

    if (JSON.stringify(novosBlocos.map(b => b.res)) !== JSON.stringify(blocos.map(b => b.res))) {
      setBlocos(novosBlocos);
    }
  }, [blocos]);

  const addBloco = () => {
    setBlocos([...blocos, {
      uid: Date.now() + Math.random(),
      vendaCod: "524052",
      vendaQtd: '',
      vendaPNota: '',
      bonificaId: "2012",
      inputBuscaBonifica: "2012",
      res: { saldo: 0, bonus: 0, decimal: 0 }
    }]);
  };

  const removeBloco = (uid: number) => {
    if (blocos.length > 1) setBlocos(blocos.filter(b => b.uid !== uid));
  };

  const updateBloco = (uid: number, fields: Partial<Bloco>) => {
    setBlocos(blocos.map(b => {
      if (b.uid === uid) {
        let updated = { ...b, ...fields };
        if (fields.inputBuscaBonifica !== undefined) {
          const match = PRODUTOS_BD.find(p => p.id === fields.inputBuscaBonifica?.trim());
          if (match) updated.bonificaId = match.id;
        }
        return updated;
      }
      return b;
    }));
  };

  // EXPORTAÇÃO EXATA CONFORME SOLICITADO
  const copiarGeral = () => {
    let msg = `${headerData.equipe}\n`;
    msg += `${headerData.supervisor}\n`;
    msg += `${headerData.cd}\n`;
    msg += `${headerData.vendedor}\n`;
    msg += `${headerData.cliente}\n`;
    
    blocos.forEach((b) => {
      if (b.res.bonus > 0) {
        msg += `${b.bonificaId}-${b.res.bonus}\n`;
      }
    });

    const el = document.createElement('textarea');
    el.value = msg.trim();
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* TÍTULO E DESIGN MANTIDOS INTEGRALMENTE */}
      <header className="bg-[#001E62] text-white p-5 sticky top-0 z-50 shadow-xl border-b-4 border-yellow-400">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black italic uppercase leading-none tracking-tighter">BONIFICAÇÃO HF</h1>
            <p className="text-[9px] font-bold text-yellow-400 tracking-[0.2em] uppercase mt-1">CRIADO POR YURI LIMA</p>
          </div>
          <button 
            onClick={copiarGeral} 
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg border-b-4 border-green-800"
          >
            {copiado ? <CheckCircle2 size={16}/> : <Share2 size={16}/>}
            {copiado ? "COPIADO!" : "ENVIAR TUDO"}
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto p-4 space-y-6">
        
        {/* CABEÇALHO INTEGRADO */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-2">
            <Users size={16} className="text-blue-800"/>
            <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Identificação do Envio</h2>
          </div>
          <div className="p-6 space-y-4">
             <div className="grid grid-cols-3 gap-2">
               <div className="space-y-1">
                 <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Equipe</label>
                 <input className="w-full text-[11px] font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200" value={headerData.equipe} onChange={e => setHeaderData({...headerData, equipe: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Supervisor</label>
                 <input className="w-full text-[11px] font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200" value={headerData.supervisor} onChange={e => setHeaderData({...headerData, supervisor: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[8px] font-black text-slate-400 uppercase ml-1">C.D.</label>
                 <input className="w-full text-[11px] font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200" value={headerData.cd} onChange={e => setHeaderData({...headerData, cd: e.target.value})} />
               </div>
             </div>
             
             <div className="space-y-1">
               <label className="text-[9px] font-black text-blue-800 uppercase ml-1 flex items-center gap-1"><Briefcase size={10}/> Vendedor (Código e Nome)</label>
               <input 
                className="w-full text-xs font-bold p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 outline-none focus:ring-2 ring-blue-500/20" 
                placeholder="Ex: 37508 DEONILCA"
                value={headerData.vendedor} 
                onChange={e => setHeaderData({...headerData, vendedor: e.target.value})} 
               />
             </div>

             <div className="space-y-1">
               <label className="text-[9px] font-black text-blue-800 uppercase ml-1 flex items-center gap-1"><User size={10}/> Cliente (Código e Nome)</label>
               <input 
                className="w-full text-xs font-bold p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 outline-none focus:ring-2 ring-blue-500/20" 
                placeholder="Ex: 48920 MERCADO CENTRAL"
                value={headerData.cliente} 
                onChange={e => setHeaderData({...headerData, cliente: e.target.value})} 
               />
             </div>
          </div>
        </section>

        {/* QUADROS DE BONIFICAÇÃO */}
        {blocos.map((bloco, index) => (
          <div key={bloco.uid} className="relative animate-in fade-in zoom-in duration-300">
            <div className="absolute -top-3 left-8 z-10 bg-yellow-400 text-blue-900 px-5 py-1 rounded-full text-[10px] font-black shadow-md border-2 border-white uppercase tracking-tighter">
              Quadro #{index + 1}
            </div>

            <div className="bg-white rounded-[2.8rem] shadow-xl overflow-hidden border border-slate-200">
              {/* VENDA */}
              <div className="p-7 pb-5 bg-slate-50 border-b border-dashed border-slate-200">
                <div className="flex justify-between items-center mb-5">
                   <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                     <ShoppingCart size={15} className="text-blue-600"/> Dados da Venda
                   </h3>
                   {blocos.length > 1 && (
                     <button onClick={() => removeBloco(bloco.uid)} className="bg-red-50 text-red-400 hover:text-red-600 p-2 rounded-full transition-colors">
                       <Trash2 size={16}/>
                     </button>
                   )}
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-slate-300" size={16}/>
                    <input 
                      type="text"
                      className="w-full bg-white border border-slate-200 text-xs font-black rounded-2xl p-3.5 pl-11 outline-none focus:ring-4 ring-blue-500/5 uppercase"
                      placeholder="CÓDIGO DO PRODUTO VENDIDO"
                      value={bloco.vendaCod}
                      onChange={(e) => updateBloco(bloco.uid, { vendaCod: e.target.value })}
                    />
                  </div>
                  <div className="px-1">
                    <p className="text-[10px] font-black text-blue-600/60 uppercase italic leading-tight">
                      {PRODUTOS_BD.find(p => p.id === bloco.vendaCod.trim())?.nome || "PRODUTO NÃO LOCALIZADO"}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                      Preço Tabela: {formatarMoeda(PRODUTOS_BD.find(p => p.id === bloco.vendaCod.trim())?.preco || 0)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Preço em Nota</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-blue-400 font-bold text-xs">R$</span>
                        <input 
                          type="number" 
                          className="w-full text-xl font-black text-blue-700 bg-white border-2 border-slate-100 rounded-2xl p-3 pl-9 outline-none focus:border-blue-500 transition-all shadow-inner" 
                          value={bloco.vendaPNota} 
                          placeholder="0,00" 
                          onChange={(e) => updateBloco(bloco.uid, { vendaPNota: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 text-right">
                      <label className="text-[9px] font-black text-slate-400 uppercase mr-1 tracking-widest">Qtd Vendida</label>
                      <input 
                        type="number" 
                        className="w-full text-center text-xl font-black text-slate-800 bg-white border-2 border-slate-100 rounded-2xl p-3 outline-none focus:border-blue-500 transition-all shadow-inner" 
                        value={bloco.vendaQtd} 
                        placeholder="0" 
                        onChange={(e) => updateBloco(bloco.uid, { vendaQtd: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ÁREA DA BONIFICAÇÃO */}
              <div className="p-7 bg-[#001E62] text-white border-t-4 border-yellow-400">
                <h3 className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                   <Gift size={15}/> Bonificação
                </h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-white/30" size={16}/>
                    <input 
                      type="text"
                      className="w-full bg-blue-900/40 border border-blue-800 text-xs font-black text-white rounded-2xl p-3.5 pl-11 outline-none focus:ring-2 ring-yellow-400/50"
                      placeholder="BUSCAR CÓDIGO"
                      value={bloco.inputBuscaBonifica}
                      onChange={(e) => updateBloco(bloco.uid, { inputBuscaBonifica: e.target.value })}
                    />
                  </div>

                  <select 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-[11px] font-black text-slate-800 outline-none cursor-pointer"
                    value={bloco.bonificaId}
                    onChange={(e) => updateBloco(bloco.uid, { bonificaId: e.target.value, inputBuscaBonifica: e.target.value })}
                  >
                    {PRODUTOS_BD.map(p => (
                      <option key={p.id} value={p.id}>{p.id} - {p.nome}</option>
                    ))}
                  </select>
                </div>

                {/* RESULTADO FINAL DO QUADRO */}
                <div className="mt-8 flex items-center justify-between bg-black/20 p-5 rounded-[2rem] border border-white/5 shadow-inner">
                   <div className="text-left">
                     <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1">Investimento</p>
                     <p className="text-xl font-black text-white">{formatarMoeda(bloco.res.saldo)}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-black text-yellow-400 uppercase tracking-widest mb-1">Bonificação</p>
                     <div className="flex items-center gap-2 justify-end">
                       <span className="text-4xl font-black text-white leading-none">{bloco.res.bonus}</span>
                       <div className="flex flex-col items-start leading-none">
                         <span className="text-[9px] font-bold text-yellow-400 uppercase">Unid</span>
                         <span className="text-[8px] font-medium text-white/40">({bloco.res.decimal.toFixed(2)})</span>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={addBloco}
          className="w-full py-6 border-4 border-dashed border-slate-300 rounded-[2.8rem] flex items-center justify-center gap-3 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-white transition-all group active:scale-[0.98]"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300"/>
          <span className="font-black uppercase text-[11px] tracking-[0.2em]">Adicionar Novo Quadro</span>
        </button>

      </div>

      {/* FOOTER RESUMO */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t-2 border-slate-200 p-5 shadow-2xl z-40">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="bg-blue-900 p-4 rounded-2xl text-white shadow-xl">
               <Calculator size={22}/>
             </div>
             <div>
               <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">Total Bonificado</p>
               <h4 className="text-2xl font-black text-slate-900 leading-none">
                 {blocos.reduce((acc, b) => acc + b.res.bonus, 0)} <span className="text-xs text-slate-400 font-bold uppercase ml-1">Unidades</span>
               </h4>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">Investimento Total</p>
             <h4 className="text-2xl font-black text-green-600 leading-none">
               {formatarMoeda(blocos.reduce((acc, b) => acc + b.res.saldo, 0))}
             </h4>
          </div>
        </div>
      </footer>
    </div>
  );
}

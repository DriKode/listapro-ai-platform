import React, { useState } from "react";
import { PropertyFormState, GeneratedResult } from "./types";
import PropertyForm from "./components/PropertyForm";
import GeneratedOutput from "./components/GeneratedOutput";
import { Home, Sparkles, Building2, BookOpen, AlertCircle, RefreshCw, Layers } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormState | null>(null);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (data: PropertyFormState) => {
    setIsLoading(true);
    setErrorMsg(null);
    setFormData(data);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.error || "Ocurrió un error inesperado al generar el contenido.");
      }

      setResult(resJson);
    } catch (err: any) {
      console.error("Error generating copywriting:", err);
      setErrorMsg(err.message || "Por favor, configure su clave GEMINI_API_KEY en la pestaña Secrets e intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-200 flex flex-col font-sans">
      
      {/* Branding and Navigation Header */}
      <header className="bg-[#0F1115] border-b border-white/10 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C5A059] flex items-center justify-center font-bold text-[#0A0B0E] rounded">
              LP
            </div>
            <div>
              <h1 className="text-xl tracking-tight font-light text-slate-100 font-serif">
                Lista<span className="font-bold text-[#C5A059]">Pro</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold leading-none">
                Cochabamba Office
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-[#C5A059] border-b border-[#C5A059] pb-1 cursor-default text-xs tracking-wider">Generador</span>
            <span className="opacity-40 hover:opacity-80 transition-opacity cursor-pointer text-xs">Mis Propiedades</span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-[#C5A059]">
              LP
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        
        {/* Welcome message / Pitch banner */}
        {!result && (
          <div className="bg-[#14161C] border-l-4 border-[#C5A059] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl rounded-3xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C5A059]/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="relative z-10 max-w-3xl space-y-3">
              <span className="bg-[#C5A059] text-[#0A0B0E] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">
                Creado para la Llajta
              </span>
              <h2 className="text-2xl md:text-4xl font-serif font-light tracking-tight">
                Crea copias profesionales para inmobiliarias en <span className="text-[#C5A059] font-medium">menos de 10 segundos</span>
              </h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl font-sans">
                Diseñado exclusivamente para agentes inmobiliarios en Cochabamba. Deja de perder horas rellenando plantillas en Word o Canva. Introduce los datos clave del departamento, casa o terreno y recibe fichas técnicas descriptivas para portales inmobiliarios y captions listos para Instagram.
              </p>
            </div>
          </div>
        )}

        {/* Global Error Notice if active */}
        {errorMsg && (
          <div className="bg-red-950/40 border border-red-900 rounded-2xl p-5 flex items-start gap-4">
            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
            <div className="space-y-1 flex-1">
              <h4 className="text-red-300 font-semibold text-sm">Error de Generación de Servicios</h4>
              <p className="text-red-400 text-xs md:text-sm whitespace-pre-line leading-relaxed">
                {errorMsg}
              </p>
              <div className="pt-2 text-xs text-red-500/80 flex flex-col gap-1">
                <span>Por favor asegúrese de lo siguiente:</span>
                <span className="font-medium">• Ingresar a "Settings → Secrets" en la esquina superior de AI Studio.</span>
                <span className="font-medium">• Crear la variable con nombre EXACTO "GEMINI_API_KEY".</span>
                <span className="font-medium">• Pegar su API Key otorgada por Google AI Studio.</span>
              </div>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 cursor-pointer"
            >
              Descartar
            </button>
          </div>
        )}

        {/* Dynamic workspace switches between form or layout result previews */}
        <div className="relative">
          {isLoading && !result && (
            <div className="bg-[#14161C] rounded-3xl border border-white/5 shadow-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[#C5A059]">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-2 max-w-md">
                <h3 className="text-slate-100 font-serif font-medium text-lg">
                  Generando contenido optimizado...
                </h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  ListaPro está analizando de forma inteligente la locación en <span className="font-semibold text-slate-200">{formData?.address}</span>, evaluando las comodidades e integrando los detalles visuales de la fotografía para escribir una ficha de venta verdaderamente persuasiva.
                </p>
              </div>

              {/* Staggered progress info lines */}
              <div className="text-[10px] text-[#C5A059] font-mono bg-[#C5A059]/10 border border-[#C5A059]/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                <span>●</span>
                <span>Llamando a Gemini 3.5 Flash en los servidores de AI Studio</span>
              </div>
            </div>
          )}

          {!isLoading && result && formData ? (
            <GeneratedOutput result={result} formData={formData} onReset={handleReset} />
          ) : (
            <div className={isLoading ? "pointer-events-none opacity-20" : ""}>
              <PropertyForm onSubmit={handleGenerate} isLoading={isLoading} />
            </div>
          )}
        </div>

        {/* App footer FAQ/Information segment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
          <div className="p-5 bg-[#14161C] rounded-2xl border border-white/5 flex gap-4 items-start">
            <div className="bg-[#C5A059]/10 text-[#C5A059] p-2.5 rounded-xl shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-slate-100 font-serif font-medium text-sm">Escritura Persuasiva</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Cada texto se redacta bajo técnicas probadas de copywriting como AIDA (Atención, Interés, Deseo, Acción) para enganchar instantáneamente al comprador cochabambino.
              </p>
            </div>
          </div>

          <div className="p-5 bg-[#14161C] rounded-2xl border border-white/5 flex gap-4 items-start">
            <div className="bg-[#C5A059]/10 text-[#C5A059] p-2.5 rounded-xl shrink-0">
              <Layers size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-slate-100 font-serif font-medium text-sm">Multimodalidad de Fotos</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Si subes una foto de portada, la IA no solo lee los textos, sino que "ve" el estilo arquitectónico, la iluminación o los acabados para agregarlos a la redacción.
              </p>
            </div>
          </div>

          <div className="p-5 bg-[#14161C] rounded-2xl border border-white/5 flex gap-4 items-start">
            <div className="bg-[#C5A059]/10 text-[#C5A059] p-2.5 rounded-xl shrink-0">
              <BookOpen size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-slate-100 font-serif font-medium text-sm">Portales Listos</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Los textos se estructuran de forma limpia, haciendo óptimo su pegado directo en Inmuebles24, UltraCasas, Facebook Marketplace o canales de WhatsApp.
              </p>
            </div>
          </div>
        </div>

      </main>

      <footer className="bg-[#0F1115] border-t border-white/10 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-slate-500">
            © 2026 ListaPro Bolivia. Generador Inteligente para Agencias de Bienes Raíces. Todos los derechos reservados.
          </p>
          <p className="text-[10px] text-slate-600 font-mono">
            Usa el modelo oficial Google Gemini 3.5 Flash para tareas de alta velocidad y copywriting creativo premium.
          </p>
        </div>
      </footer>

    </div>
  );
}

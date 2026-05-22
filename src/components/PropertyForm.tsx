import React, { useRef, useState, useEffect } from "react";
import { PropertyFormState, PropertyType, OperationType } from "../types";
import { Upload, Home, DollarSign, User, ShieldAlert, Check, RefreshCw } from "lucide-react";

interface PropertyFormProps {
  onSubmit: (data: PropertyFormState) => void;
  isLoading: boolean;
}

const AMENITY_OPTIONS = [
  "Piscina / Alberca",
  "Jardín",
  "Seguridad 24h",
  "Gimnasio",
  "Churrasquero / Parrillero",
  "Salón de Eventos",
  "Dependencia de Servicio",
  "Ascensor / Elevador",
  "Garaje Techado",
  "Club House / Áreas Comunes",
  "Aceptan Mascotas",
  "Calefacción / Aire Acondicionado"
];

export default function PropertyForm({ onSubmit, isLoading }: PropertyFormProps) {
  // Restore initial or previous state of form if needed
  const [form, setForm] = useState<PropertyFormState>({
    propertyType: "Departamento",
    operation: "Venta",
    address: "",
    cityState: "Cochabamba, Bolivia",
    priceBob: "",
    priceUsd: "",
    bedrooms: "3",
    bathrooms: "2",
    builtArea: "120",
    plotArea: "200",
    parking: "1",
    amenities: [],
    shortDescription: "",
    coverImage: null,
    extraImages: [],
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    agentPhoto: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const coverInputRef = useRef<HTMLInputElement>(null);
  const extrasInputRef = useRef<HTMLInputElement>(null);
  const agentPhotoInputRef = useRef<HTMLInputElement>(null);

  // If the agent selects "Terreno", we must force Operation to "Venta"
  // and clean/adjust relevant numbers
  useEffect(() => {
    if (form.propertyType === "Terreno") {
      setForm((prev) => ({
        ...prev,
        operation: "Venta",
        bedrooms: "0",
        bathrooms: "0",
        builtArea: "0",
        parking: "0",
      }));
    }
  }, [form.propertyType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setForm((prev) => {
      const updated = checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((a) => a !== amenity);
      return { ...prev, amenities: updated };
    });
  };

  // Convert files to base64 for local previews and multimodal AI analysis!
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, coverImage: "Seleccione un archivo de imagen válido." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        coverImage: reader.result as string,
      }));
      setErrors((prev) => ({ ...prev, coverImage: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleExtrasUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files) as File[];
    let loaded = 0;
    const base64List: string[] = [];

    fileList.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
        base64List.push(reader.result as string);
        loaded++;
        if (loaded === fileList.length) {
          setForm((prev) => ({
            ...prev,
            extraImages: [...prev.extraImages, ...base64List].slice(0, 4), // limit to max 4 extras
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAgentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, agentPhoto: "Seleccione un archivo de imagen válido para el agente." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        agentPhoto: reader.result as string,
      }));
      setErrors((prev) => ({ ...prev, agentPhoto: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropCover = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, coverImage: "Seleccione un archivo de imagen válido." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        coverImage: reader.result as string,
      }));
      setErrors((prev) => ({ ...prev, coverImage: "" }));
    };
    reader.readAsDataURL(file);
  };

  const removeCover = () => {
    setForm((prev) => ({ ...prev, coverImage: null }));
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const removeAgentPhoto = () => {
    setForm((prev) => ({ ...prev, agentPhoto: null }));
    if (agentPhotoInputRef.current) agentPhotoInputRef.current.value = "";
  };

  const removeExtraImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      extraImages: prev.extraImages.filter((_, i) => i !== index),
    }));
  };

  // Preset typical configurations for easier demonstration in 1-click
  const handleLoadDemo = (type: "house" | "apartment" | "land") => {
    if (type === "house") {
      setForm({
        propertyType: "Casa",
        operation: "Venta",
        address: "Av. Melchor Urquidi, Queru Queru",
        cityState: "Cochabamba, Bolivia",
        priceBob: "1736000",
        priceUsd: "250000",
        bedrooms: "4",
        bathrooms: "3",
        builtArea: "280",
        plotArea: "420",
        parking: "2",
        amenities: ["Jardín", "Seguridad 24h", "Churrasquero / Parrillero", "Dependencia de Servicio"],
        shortDescription: "Hermosa casa de 2 plantas con amplia suite master, excelente iluminación natural y churrasquero espectacular ideal para familias.",
        coverImage: null,
        extraImages: [],
        agentName: "Rodrigo Vargas",
        agentPhone: "+591 70712345",
        agentEmail: "rvargas@listapro.bo",
        agentPhoto: null,
      });
    } else if (type === "apartment") {
      setForm({
        propertyType: "Departamento",
        operation: "Renta",
        address: "Calle Aniceto Padilla, Cala Cala",
        cityState: "Cochabamba, Bolivia",
        priceBob: "4200",
        priceUsd: "600",
        bedrooms: "2",
        bathrooms: "2",
        builtArea: "85",
        plotArea: "85",
        parking: "1",
        amenities: ["Piscina / Alberca", "Seguridad 24h", "Gimnasio", "Ascensor / Elevador"],
        shortDescription: "Departamento amoblado premium en piso alto cerca del sombrerito de Cala Cala. Lindas vistas de la ciudad y áreas comunes completas.",
        coverImage: null,
        extraImages: [],
        agentName: "María René Salinas",
        agentPhone: "+591 69400123",
        agentEmail: "msalinas@bienesraices.bo",
        agentPhoto: null,
      });
    } else if (type === "land") {
      setForm({
        propertyType: "Terreno",
        operation: "Venta",
        address: "Av. Circunvalación Norte, Pacata Alta",
        cityState: "Cochabamba, Bolivia",
        priceBob: "903500",
        priceUsd: "130000",
        bedrooms: "0",
        bathrooms: "0",
        builtArea: "0",
        plotArea: "680",
        parking: "0",
        amenities: ["Seguridad 24h"],
        shortDescription: "Terreno regular totalmente amurallado con todos los servicios básicos, asfalto en puerta e ideal para desarrollo residencial multifamiliar.",
        coverImage: null,
        extraImages: [],
        agentName: "Ignacio Justiniano",
        agentPhone: "+591 77244588",
        agentEmail: "ijustiniano@agentescba.com",
        agentPhoto: null,
      });
    }
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.address.trim()) newErrors.address = "La dirección de la propiedad es obligatoria.";
    if (!form.cityState.trim()) newErrors.cityState = "La ciudad y estado son obligatorios.";
    if (!form.priceBob.trim()) newErrors.priceBob = "El precio en Bolivianos es obligatorio.";
    if (!form.priceUsd.trim()) newErrors.priceUsd = "El precio en Dólares es obligatorio.";
    if (!form.agentName.trim()) newErrors.agentName = "El nombre del agente es obligatorio.";
    if (!form.agentPhone.trim()) newErrors.agentPhone = "El teléfono celular del agente es obligatorio.";
    if (!form.agentEmail.trim()) {
      newErrors.agentEmail = "El email del agente es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(form.agentEmail)) {
      newErrors.agentEmail = "Introduzca un formato de email válido.";
    }

    if (!form.coverImage) {
      newErrors.coverImage = "Debe subir al menos la foto de portada principal.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    } else {
      // scroll to error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.getElementsByName(firstError)[0]?.focus();
      }
    }
  };

  const isTerreno = form.propertyType === "Terreno";

  return (
    <div className="bg-[#14161C] rounded-3xl border border-white/5 shadow-2xl overflow-hidden font-sans">
      <div className="bg-[#0F1115] border-b border-white/10 p-6 md:p-8 text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Home size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider font-mono">
              Primer Paso
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-light mt-2 text-slate-100">
              Ficha Técnica <span className="font-bold text-[#C5A059]">del Inmueble</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
              Complete los campos a continuación. Gemini analizará la información estéticamente y redactará sus copias de venta premium.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] text-slate-400 font-mono self-center mr-1">Rellenar plantilla:</span>
            <button
              type="button"
              onClick={() => handleLoadDemo("house")}
              className="bg-white/5 hover:bg-white/10 text-[#C5A059] font-semibold text-xs py-1.5 px-3 rounded border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              Casa Demo
            </button>
            <button
              type="button"
              onClick={() => handleLoadDemo("apartment")}
              className="bg-white/5 hover:bg-white/10 text-[#C5A059] font-semibold text-xs py-1.5 px-3 rounded border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              Dpto Demo
            </button>
            <button
              type="button"
              onClick={() => handleLoadDemo("land")}
              className="bg-white/5 hover:bg-white/10 text-[#C5A059] font-semibold text-xs py-1.5 px-3 rounded border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              Terreno Demo
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 text-slate-300">
        {/* Basic Property classification */}
        <div>
          <h3 className="text-slate-100 font-serif font-medium text-base border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
            <span className="bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded text-xs font-bold">1</span>
            Clasificación del Inmueble
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide uppercase text-slate-400 text-xs block">Tipo de Propiedad</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(["Casa", "Departamento", "Terreno", "Penthouse"] as PropertyType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, propertyType: type }))}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all flex flex-col justify-center items-center gap-1 cursor-pointer ${
                      form.propertyType === type
                        ? "bg-[#C5A059] border-[#C5A059] text-[#0A0B0E]"
                        : "border-white/10 hover:border-white/20 text-slate-400 bg-[#1C1F26]"
                    }`}
                  >
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide uppercase text-slate-400 text-xs block">Operación Comercial</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isTerreno}
                  onClick={() => setForm(f => ({ ...f, operation: "Venta" }))}
                  className={`flex-1 py-3 px-4 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                    form.operation === "Venta"
                      ? "bg-[#C5A059] border-[#C5A059] text-[#0A0B0E]"
                      : "border-white/10 text-slate-400 bg-[#1C1F26]"
                  }`}
                >
                  Venta
                </button>
                <button
                  type="button"
                  disabled={isTerreno}
                  onClick={() => setForm(f => ({ ...f, operation: "Renta" }))}
                  className={`flex-1 py-3 px-4 rounded-xl border text-xs font-semibold transition-all text-center ${
                    isTerreno ? "opacity-30 cursor-not-allowed bg-slate-900 border-white/5" : "cursor-pointer"
                  } ${
                    form.operation === "Renta"
                      ? "bg-[#C5A059] border-[#C5A059] text-[#0A0B0E]"
                      : "border-white/10 text-slate-400 bg-[#1C1F26]"
                  }`}
                >
                  Alquiler / Renta
                </button>
              </div>
              {isTerreno && (
                <span className="text-[11px] text-amber-500/80 flex items-center gap-1">
                  <ShieldAlert size={12} className="shrink-0" />
                  Los terrenos se limitan únicamente a la venta en este módulo.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Location details */}
        <div>
          <h3 className="text-slate-100 font-serif font-medium text-base border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
            <span className="bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded text-xs font-bold">2</span>
            Ubicación y Precio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Dirección Exacta o Zona</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Ej. Calle Tomás Frías, Queru Queru"
                className={`w-full p-3 rounded-xl border bg-[#1C1F26] text-sm text-white placeholder-slate-500 focus:outline-[#C5A059] focus:bg-[#1E222A] transition-all ${
                  errors.address ? "border-red-500 focus:outline-red-500" : "border-white/10"
                }`}
              />
              {errors.address && <p className="text-xs text-red-400 mt-0.5">{errors.address}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Ciudad y Estado</label>
              <input
                type="text"
                name="cityState"
                value={form.cityState}
                onChange={handleChange}
                placeholder="Ej. Cochabamba, Bolivia"
                className={`w-full p-3 rounded-xl border bg-[#1C1F26] text-sm text-white placeholder-slate-500 focus:outline-[#C5A059] focus:bg-[#1E222A] transition-all ${
                  errors.cityState ? "border-red-500 focus:outline-red-500" : "border-white/10"
                }`}
              />
              {errors.cityState && <p className="text-xs text-red-400 mt-0.5">{errors.cityState}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Precio en Bolivianos (BOB)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-xs font-mono">
                  BOB
                </span>
                <input
                  type="number"
                  name="priceBob"
                  value={form.priceBob}
                  onChange={handleChange}
                  placeholder="Ej. 1740000"
                  className={`w-full p-3 pl-12 rounded-xl border bg-[#1C1F26] text-sm text-white placeholder-slate-500 focus:outline-[#C5A059] focus:bg-[#1E222A] transition-all ${
                    errors.priceBob ? "border-red-500 focus:outline-red-500" : "border-white/10"
                  }`}
                />
              </div>
              {errors.priceBob && <p className="text-xs text-red-400 mt-0.5">{errors.priceBob}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Precio en Dólares (USD)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-xs font-mono">
                  USD
                </span>
                <input
                  type="number"
                  name="priceUsd"
                  value={form.priceUsd}
                  onChange={handleChange}
                  placeholder="Ej. 250000"
                  className={`w-full p-3 pl-12 rounded-xl border bg-[#1C1F26] text-sm text-white placeholder-slate-500 focus:outline-[#C5A059] focus:bg-[#1E222A] transition-all ${
                    errors.priceUsd ? "border-red-500 focus:outline-red-500" : "border-white/10"
                  }`}
                />
              </div>
              {errors.priceUsd && <p className="text-xs text-red-400 mt-0.5">{errors.priceUsd}</p>}
            </div>
          </div>
        </div>

        {/* Structural Metrics */}
        <div>
          <h3 className="text-slate-100 font-serif font-medium text-base border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
            <span className="bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded text-xs font-bold">3</span>
            Distribución e Inmueble
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Habitaciones</label>
              <input
                type="number"
                name="bedrooms"
                disabled={isTerreno}
                value={isTerreno ? "0" : form.bedrooms}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-white/10 bg-[#1C1F26] text-sm text-white focus:outline-[#C5A059] disabled:opacity-30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Baños</label>
              <input
                type="number"
                name="bathrooms"
                disabled={isTerreno}
                value={isTerreno ? "0" : form.bathrooms}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-white/10 bg-[#1C1F26] text-sm text-white focus:outline-[#C5A059] disabled:opacity-30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Estacionamientos</label>
              <input
                type="number"
                name="parking"
                disabled={isTerreno}
                value={isTerreno ? "0" : form.parking}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-white/10 bg-[#1C1F26] text-sm text-white focus:outline-[#C5A059] disabled:opacity-30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Construido (m²)</label>
              <input
                type="number"
                name="builtArea"
                disabled={isTerreno}
                value={isTerreno ? "0" : form.builtArea}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-white/10 bg-[#1C1F26] text-sm text-white focus:outline-[#C5A059] disabled:opacity-30"
              />
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Total Terreno (m²)</label>
              <input
                type="number"
                name="plotArea"
                value={form.plotArea}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-white/10 bg-[#1C1F26] text-sm text-white focus:outline-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* Amenities / Extras checkboxes */}
        <div>
          <h3 className="text-slate-100 font-serif font-medium text-base border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
            <span className="bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded text-xs font-bold">4</span>
            Comodidades y Amenidades del Edificio / Casa
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {AMENITY_OPTIONS.map((item) => {
              const isChecked = form.amenities.includes(item);
              return (
                <label
                  key={item}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-[#C5A059]/10 border-[#C5A059] text-white"
                      : "bg-[#1C1F26] border-white/5 hover:border-white/10 text-slate-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleAmenityChange(item, e.target.checked)}
                    className="rounded border-[#C5A059]/30 text-[#C5A059] focus:ring-[#C5A059] h-4 w-4 bg-slate-900"
                  />
                  <span className="text-xs font-medium">{item}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Agent Description highlights */}
        <div>
          <h3 className="text-slate-100 font-serif font-medium text-base border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
            <span className="bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded text-xs font-bold">5</span>
            Lo que Destaca (Breve Descripción de Enfoque)
          </h3>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">
              ¿Qué hace especial a esta propiedad? (Indique 2-3 líneas con lo más vistoso del inmueble)
            </label>
            <textarea
              name="shortDescription"
              rows={3}
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Ej. Tiene una cocina con isla de mármol totalmente nueva, jardines hermosos y amplios ventanales de piso a techo que regalan vistas panorámicas del Cerro Tunari."
              className="w-full p-3 rounded-xl border border-white/10 bg-[#1C1F26] text-sm text-white placeholder-slate-500 focus:outline-[#C5A059] transition-all font-sans"
            />
          </div>
        </div>

        {/* File upload minimum 1 cover picture plus extras */}
        <div>
          <h3 className="text-slate-100 font-serif font-medium text-base border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
            <span className="bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded text-xs font-bold">6</span>
            Galería de Fotos (Mínimo 1 de Portada)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover photo loader */}
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-400 block">Fotografía Principal de Portada (Obligatoria)</span>
              
              {!form.coverImage ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDropCover}
                  onClick={() => coverInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
                    errors.coverImage
                      ? "border-red-500 bg-red-950/10 hover:bg-red-950/20"
                      : "border-white/10 hover:border-[#C5A059] bg-[#1C1F26] hover:bg-[#1C1F26]/80"
                  }`}
                >
                  <Upload size={32} className={`${errors.coverImage ? "text-red-400" : "text-slate-500"} mb-2 animate-bounce`} />
                  <p className="text-xs font-medium text-slate-200">Arrastra y suelta tu foto aquí, o haz clic para subir</p>
                  <p className="text-[10px] text-slate-500 mt-1">Recomendado: Formato horizontal de buena resolución</p>
                  {errors.coverImage && <p className="text-xs text-red-400 mt-2 font-semibold">{errors.coverImage}</p>}
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-white/5 h-[160px] group bg-slate-950">
                  <img
                    src={form.coverImage}
                    alt="Portada de la propiedad"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="bg-[#C5A059] text-[#0A0B0E] hover:opacity-90 text-xs font-semibold py-1.5 px-3 rounded shadow transition-all cursor-pointer"
                    >
                      Reemplazar
                    </button>
                    <button
                      type="button"
                      onClick={removeCover}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 rounded shadow transition-colors cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-[#C5A059] text-[#0A0B0E] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    Foto Portada
                  </span>
                </div>
              )}
              
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
            </div>

            {/* Extra photos loader */}
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-400 block">Fotografías Extras (Hasta 4 imágenes)</span>
              
              <div className="grid grid-cols-2 gap-2 h-[120px]">
                {form.extraImages.map((img, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-white/5 h-[120px] bg-slate-950 group">
                    <img src={img} alt={`Extra ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExtraImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full text-xs shadow transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                {form.extraImages.length < 4 && (
                  <button
                    type="button"
                    onClick={() => extrasInputRef.current?.click()}
                    className="border border-dashed border-white/10 rounded-xl hover:border-[#C5A059] bg-[#1C1F26] hover:bg-[#1C1F26]/80 flex flex-col items-center justify-center h-[120px] cursor-pointer transition-all"
                  >
                    <Upload size={20} className="text-slate-500 mb-1" />
                    <span className="text-[10px] font-medium text-slate-450 text-slate-400">Añadir extra</span>
                  </button>
                )}
              </div>

              <input
                ref={extrasInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleExtrasUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Agent Information */}
        <div>
          <h3 className="text-slate-100 font-serif font-medium text-base border-b border-white/5 pb-2 mb-4 flex items-center gap-2">
            <span className="bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded text-xs font-bold flex items-center justify-center">
              <User size={13} />
            </span>
            Información del Agente de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Agent Photo Upload */}
            <div className="space-y-1.5 flex flex-col items-center">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Foto del Agente</label>
              {!form.agentPhoto ? (
                <div
                  onClick={() => agentPhotoInputRef.current?.click()}
                  className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 bg-[#1C1F26] hover:border-[#C5A059] flex items-center justify-center cursor-pointer transition-colors overflow-hidden"
                >
                  <User size={32} className="text-slate-500" />
                </div>
              ) : (
                <div className="relative w-24 h-24 group">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#C5A059] bg-[#1C1F26]">
                    <img src={form.agentPhoto} alt="Agente" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={removeAgentPhoto}
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-[10px] leading-none px-1">✕</span>
                  </button>
                </div>
              )}
              <input
                ref={agentPhotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleAgentPhotoUpload}
                className="hidden"
              />
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Nombre Completo del Agente</label>
              <input
                type="text"
                name="agentName"
                value={form.agentName}
                onChange={handleChange}
                placeholder="Ej. Carlos Mendoza"
                className={`w-full p-3 rounded-xl border bg-[#1C1F26] text-sm text-white focus:outline-[#C5A059] transition-all ${
                  errors.agentName ? "border-red-500 focus:outline-red-500" : "border-white/10"
                }`}
              />
              {errors.agentName && <p className="text-xs text-red-400 mt-0.5">{errors.agentName}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Teléfono Whatsapp</label>
              <input
                type="text"
                name="agentPhone"
                value={form.agentPhone}
                onChange={handleChange}
                placeholder="Ej. +591 707XXXXX"
                className={`w-full p-3 rounded-xl border bg-[#1C1F26] text-sm text-white focus:outline-[#C5A059] transition-all ${
                  errors.agentPhone ? "border-red-500 focus:outline-red-500" : "border-white/10"
                }`}
              />
              {errors.agentPhone && <p className="text-xs text-red-400 mt-0.5">{errors.agentPhone}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-slate-400">Correo Electrónico</label>
              <input
                type="email"
                name="agentEmail"
                value={form.agentEmail}
                onChange={handleChange}
                placeholder="carlos@tuagenciadreams.com"
                className={`w-full p-3 rounded-xl border bg-[#1C1F26] text-sm text-white focus:outline-[#C5A059] transition-all ${
                  errors.agentEmail ? "border-red-500 focus:outline-red-500" : "border-white/10"
                }`}
              />
              {errors.agentEmail && <p className="text-xs text-red-400 mt-0.5">{errors.agentEmail}</p>}
            </div>
          </div>
          </div>
        </div>

        {/* Submit action */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto bg-[#C5A059] text-[#0A0B0E] hover:opacity-90 py-4 px-8 rounded-xl font-semibold shadow-lg text-xs uppercase tracking-wider transition-all focus:outline-none flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-[#0A0B0E]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generando con Inteligencia Real Estate... (Espera)</span>
              </>
            ) : (
              <>
                <Check size={18} />
                <span>Generar Publicaciones ListaPro</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

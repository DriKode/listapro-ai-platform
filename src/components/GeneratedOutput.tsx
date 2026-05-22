import React, { useState } from "react";
import { GeneratedResult, PropertyFormState } from "../types";
import { Copy, Check, FileText, Instagram, Share2, Phone, Mail, MapPin, Eye, Columns, FileDown, Image as ImageIcon, Film, Sparkles, User, GalleryHorizontalEnd } from "lucide-react";
import { jsPDF } from "jspdf";
import JSZip from "jszip";

interface GeneratedOutputProps {
  result: GeneratedResult;
  formData: PropertyFormState;
  onReset: () => void;
}

export default function GeneratedOutput({ result, formData, onReset }: GeneratedOutputProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"portal" | "instagram" | "flyer">("portal");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoStatusText, setVideoStatusText] = useState("");
  const [isGeneratingCarousel, setIsGeneratingCarousel] = useState(false);
  const [carouselProgress, setCarouselProgress] = useState(0);
  const [carouselStatusText, setCarouselStatusText] = useState("");
  const [carouselPreviews, setCarouselPreviews] = useState<string[]>([]);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  const handleShareWhatsApp = (text: string) => {
    const formattedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${formattedText}`, "_blank");
  };

  const generatePDF = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const goldColor = [197, 160, 89]; // RGB code for #C5A059
      const darkColor = [15, 17, 21];  // RGB code for #0F1115
      const lightGray = [245, 246, 248];

      const cleanTextForPDF = (text: string): string => {
        if (!text) return "";
        let clean = text
          .replace(/[áÁ]/g, "A")
          .replace(/[éÉ]/g, "E")
          .replace(/[íÍ]/g, "I")
          .replace(/[óÓ]/g, "O")
          .replace(/[úÚüÜ]/g, "U")
          .replace(/[ñÑ]/g, "N")
          .replace(/["\n\r\t]/g, " ");
        // Strip non-ASCII characters completely (including emojis like 📍, ✨, etc.)
        clean = clean.replace(/[^\x20-\x7E]/g, "");
        return clean.trim();
      };

      // Helper: Draw Header (Page 1)
      const drawPage1Header = () => {
        // Top solid banner background
        doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.rect(0, 0, 210, 24, "F");

        // Gold decorative accent bottom line of header
        doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.rect(0, 24, 210, 1.5, "F");

        // Brand Text on Left
        doc.setTextColor(255, 255, 255);
        doc.setFont("times", "normal");
        doc.setFontSize(21);
        doc.text("Lista", 12, 16);
        
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setFont("times", "bold");
        doc.text("Pro", 27, 16);

        // Subheader on Right
        doc.setTextColor(180, 180, 180);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("DOSSIER DE PROPIEDAD DIGITAL", 152, 13);
        
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("COCHABAMBA, BOLIVIA", 168, 18);
      };

      // Helper: Draw Header (Page 2)
      const drawPage2Header = () => {
        // Top solid banner background
        doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.rect(0, 0, 210, 16, "F");

        // Gold decorative accent bottom line
        doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.rect(0, 16, 210, 1.2, "F");

        // Mini Brand text on left
        doc.setTextColor(255, 255, 255);
        doc.setFont("times", "normal");
        doc.setFontSize(14);
        doc.text("Lista", 12, 11);
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setFont("times", "bold");
        doc.text("Pro", 23, 11);

        // Right side info label
        doc.setTextColor(180, 180, 180);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("GALERÍA ADICIONAL & AMENIDADES", 148, 10.5);
      };

      // ==================== PAGE 1 ====================
      drawPage1Header();

      // 1. Cover Image Block
      if (formData.coverImage) {
        try {
          doc.addImage(formData.coverImage, "JPEG", 10, 30, 190, 85);
        } catch (e) {
          console.error("Cover image drawing failed in PDF generation", e);
          // Fallback box representation
          doc.setFillColor(235, 235, 238);
          doc.rect(10, 30, 190, 85, "F");
          doc.setTextColor(140, 140, 140);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.text("Fotografía Principal de Portada", 80, 75);
        }
      } else {
        // Shaded fallback empty container
        doc.setFillColor(235, 235, 238);
        doc.rect(10, 30, 190, 85, "F");
        doc.setTextColor(140, 140, 140);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text("Sin Imagen de Portada", 85, 75);
      }

      // 2. Title and Zone Header
      doc.setTextColor(15, 17, 21);
      doc.setFont("times", "bold");
      doc.setFontSize(16);
      const splitTitle = doc.splitTextToSize(result.title || "Propiedad en Cochabamba", 190);
      doc.text(splitTitle, 10, 126);

      let titleRows = splitTitle.length;
      let summaryY = 126 + (titleRows * 6.5);

      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${formData.propertyType.toUpperCase()} EN ${formData.operation.toUpperCase()}`, 10, summaryY);
      
      doc.setTextColor(100, 110, 120);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Ubicación: ${formData.address}, ${formData.cityState}`, 10, summaryY + 4.5);

      const statsY = summaryY + 11;

      // 3. Technical Specs Visual Panel Box
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(10, statsY, 190, 26, "F");
      
      // Gold left visual border bar
      doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.rect(10, statsY, 1.5, 26, "F");

      // Column Labels (caps + small font for pristine layout)
      doc.setFontSize(7.5);
      doc.setTextColor(110, 120, 130);
      doc.setFont("helvetica", "bold");
      doc.text("PRECIO (USD)", 16, statsY + 6);
      doc.text("PRECIO (BOB)", 58, statsY + 6);
      doc.text("DORMITORIOS / BAÑOS", 102, statsY + 6);
      doc.text("SUPERFICIE TOTAL", 152, statsY + 6);

      // Data values
      doc.setFontSize(10.5);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text(`$us ${Number(formData.priceUsd).toLocaleString("es-BO")}`, 16, statsY + 13);
      doc.setTextColor(30, 35, 45);
      doc.setFontSize(10);
      doc.text(`Bs ${Number(formData.priceBob).toLocaleString("es-BO")}`, 58, statsY + 13);

      doc.setFontSize(8.5);
      let distText = `${formData.bedrooms} Dormitorios\n${formData.bathrooms} Baños`;
      if (formData.parking && formData.parking !== "0") {
        distText += `\n${formData.parking} Garaje(s)`;
      }
      doc.text(distText, 102, statsY + 12);

      let areaText = `${formData.plotArea} m² Lote / Terreno`;
      if (formData.builtArea && formData.builtArea !== "0" && formData.propertyType !== "Terreno") {
        areaText = `${formData.builtArea} m² Construidos\n` + areaText;
      }
      doc.text(areaText, 152, statsY + 12);

      // Value statement tag
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 110);
      if (result.estimatedValueTagline) {
        doc.text(`Mensaje Clave: "${result.estimatedValueTagline}"`, 16, statsY + 22.5);
      } else if (formData.shortDescription) {
        const briefDesc = formData.shortDescription.length > 90 ? formData.shortDescription.slice(0, 90) + "..." : formData.shortDescription;
        doc.text(`Highlight: "${briefDesc}"`, 16, statsY + 22.5);
      }

      // 4. Copypaste Professional Description from IA
      const descY = statsY + 34;
      doc.setTextColor(15, 17, 21);
      doc.setFont("times", "italic");
      doc.setFontSize(10.5);
      
      const splitDesc = doc.splitTextToSize(result.description || "Sin descripción disponible.", 184);

      // Highlight blockquote gold vertical line
      doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
      const blockquoteHeight = Math.max(splitDesc.length * 5.2, 25);
      doc.rect(10, descY, 1, blockquoteHeight, "F");

      doc.text(splitDesc, 14, descY + 4);

      // Page footer bar
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text("Dossier de venta generado por ListaPro Bolivia - Inteligencia Artificial para Bienes Raíces", 10, 288);
      doc.text("Página 1 de 2", 188, 288);

      // ==================== PAGE 2 ====================
      doc.addPage();
      drawPage2Header();

      // LEFT COLUMN: AI generated bullet highlights and structural extras
      doc.setTextColor(15, 17, 21);
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("ASPECTOS DESTACADOS DEL INMUEBLE", 10, 27);

      // AI Key highlights printing with gold bullets
      let p2Y = 34;
      if (result.keyHighlights && result.keyHighlights.length > 0) {
        result.keyHighlights.forEach((highlight) => {
          if (p2Y < 240) {
            doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            doc.text("✓", 10, p2Y);

            doc.setTextColor(40, 45, 55);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            const wrappedHigh = doc.splitTextToSize(highlight, 82);
            doc.text(wrappedHigh, 15, p2Y);
            p2Y += (wrappedHigh.length * 4.5) + 3;
          }
        });
      } else {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text("Anclado a especificación técnica estándar.", 10, p2Y);
        p2Y += 10;
      }

      // Selected Checklist Amenities
      p2Y += 4;
      doc.setTextColor(15, 17, 21);
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("AMENIDADES Y ACABADOS", 10, p2Y);
      p2Y += 7;

      if (formData.amenities && formData.amenities.length > 0) {
        formData.amenities.forEach((amenity) => {
          if (p2Y < 165) {
            // Draw neat shaded bullet box background
            doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
            doc.roundedRect(10, p2Y - 3, 84, 6, 1, 1, "F");

            // Bullet icon
            doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
            doc.setFont("helvetica", "bold");
            doc.text("●", 13, p2Y + 1);

            // Text
            doc.setTextColor(50, 55, 65);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.text(amenity, 18, p2Y + 1);
            p2Y += 8;
          }
        });
      } else {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(120, 120, 120);
        doc.text("No se indicaron amenities especiales.", 10, p2Y);
        p2Y += 10;
      }

      // ==================== MAPA DE UBICACIÓN GEOGRÁFICA DE REFERENCIA ====================
      const mapTitleY = 171;
      doc.setTextColor(15, 17, 21);
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("UBICACION GEOGRAFICA", 10, mapTitleY);

      const mapY = mapTitleY + 4;
      const mapW = 84;
      const mapH = 43;

      // 1. Draw light blue-grey map background card
      doc.setFillColor(235, 238, 242);
      doc.roundedRect(10, mapY, mapW, mapH, 1.5, 1.5, "F");
      
      doc.setDrawColor(210, 215, 222);
      doc.setLineWidth(0.2);
      doc.roundedRect(10, mapY, mapW, mapH, 1.5, 1.5, "S");

      // 2. Grid blocks (Buildings / parcels) representing an elegant urban grid layout
      doc.setFillColor(252, 252, 253);
      doc.setDrawColor(218, 222, 229);
      doc.setLineWidth(0.15);

      // Top blocks
      doc.roundedRect(10 + 2, mapY + 2, 24, 10, 0.5, 0.5, "FD");
      doc.roundedRect(10 + 28, mapY + 2, 24, 10, 0.5, 0.5, "FD");
      doc.roundedRect(10 + 54, mapY + 2, 28, 10, 0.5, 0.5, "FD");

      // Middle Block Left a soft light green public park space
      doc.setFillColor(220, 238, 220);
      doc.setDrawColor(190, 215, 190);
      doc.roundedRect(10 + 2, mapY + 14, 24, 11, 0.5, 0.5, "FD");
      
      // Park Label inside the green zone
      doc.setTextColor(100, 130, 100);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5);
      doc.text("PARQUE", 10 + 4, mapY + 18.5);
      doc.text("ZONA VERDE", 10 + 4, mapY + 21);

      // Middle Block Right
      doc.setFillColor(252, 252, 253);
      doc.setDrawColor(218, 222, 229);
      doc.roundedRect(10 + 28, mapY + 14, 24, 11, 0.5, 0.5, "FD");
      doc.roundedRect(10 + 54, mapY + 14, 28, 11, 0.5, 0.5, "FD");

      // Bottom Blocks
      doc.roundedRect(10 + 2, mapY + 27, 24, 8, 0.5, 0.5, "FD");
      doc.roundedRect(10 + 28, mapY + 27, 54, 8, 0.5, 0.5, "FD");

      // 3. Street name annotations inside the roads for maximum cartographic detail
      doc.setTextColor(140, 145, 155);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(4.5);

      // Horizontal Streets in off-white road channels
      doc.text("CALLE ANICETO PADILLA", 10 + 29, mapY + 13.5);
      doc.text("AV. SAN MARTIN", 10 + 34, mapY + 26.5);

      // 4. North Arrow and Design Scale Bar for technical engineering blueprint detailing
      // North Arrow
      doc.setDrawColor(100, 105, 115);
      doc.setLineWidth(0.18);
      doc.line(10 + mapW - 6, mapY + 6, 10 + mapW - 6, mapY + 2); // vertical line
      doc.line(10 + mapW - 7.5, mapY + 4, 10 + mapW - 6, mapY + 2); // left wing
      doc.line(10 + mapW - 4.5, mapY + 4, 10 + mapW - 6, mapY + 2); // right wing
      doc.setFont("helvetica", "bold");
      doc.setFontSize(3.5);
      doc.setTextColor(100, 105, 115);
      doc.text("N", 10 + mapW - 6.7, mapY + 1.2);

      // Architectural Scale Bar
      doc.setDrawColor(120, 125, 135);
      doc.setLineWidth(0.3);
      doc.line(10 + mapW - 13, mapY + 9.5, 10 + mapW - 4, mapY + 9.5); // line
      doc.line(10 + mapW - 13, mapY + 10.2, 10 + mapW - 13, mapY + 8.8); // left tick
      doc.line(10 + mapW - 4, mapY + 10.2, 10 + mapW - 4, mapY + 8.8); // right tick
      doc.setFont("helvetica", "normal");
      doc.setFontSize(3.2);
      doc.setTextColor(120, 125, 135);
      doc.text("100 m", 10 + mapW - 10.5, mapY + 8.2);

      // 5. Focal Property Location concentric rings - mathematically placed on residential block
      const pinX = 10 + 44;
      const pinY = mapY + 19.5;

      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.12);
      // Concentric circles representing target radar point
      doc.circle(pinX, pinY, 4.0, "S");
      doc.circle(pinX, pinY, 2.0, "S");

      // 6. Draw realistic location Pin & pin shadow
      doc.setFillColor(80, 80, 80);
      doc.circle(pinX, pinY + 1.8, 0.35, "F"); // target shadow

      doc.setFillColor(215, 55, 55); // bright deep red
      doc.setDrawColor(165, 30, 30);
      doc.setLineWidth(0.18);
      
      // Pin pointer triangle
      doc.triangle(
        pinX - 1.2, pinY - 0.7,
        pinX + 1.2, pinY - 0.7,
        pinX, pinY + 1.8,
        "FD"
      );

      // Pin circle head
      doc.circle(pinX, pinY - 0.7, 1.2, "FD");

      // White inner ring for professional shine
      doc.setFillColor(255, 255, 255);
      doc.circle(pinX, pinY - 0.8, 0.45, "F");

      // 7. Text Location Label Card inside the map bottom alignment (perfectly rounded)
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(10 + 2, mapY + mapH - 7, mapW - 4, 5.2, 0.8, 0.8, "F");
      doc.setDrawColor(205, 210, 218);
      doc.setLineWidth(0.15);
      doc.roundedRect(10 + 2, mapY + mapH - 7, mapW - 4, 5.2, 0.8, 0.8, "S");

      // Format current property specific address with clean helper (absolutely NO accents or emojis)
      const cleanAddr = cleanTextForPDF(`${formData.address}, ${formData.cityState}`);
      const finalAddr = cleanAddr.length > 55 ? cleanAddr.slice(0, 52) + "..." : cleanAddr;
      
      doc.setTextColor(40, 45, 55);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4.8);
      doc.text(`UBICACION: ${finalAddr}`, 10 + 3.5, mapY + mapH - 3.8);
      
      doc.setTextColor(110, 115, 125);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(3.5);
      doc.text("UBICACION REFERENCIAL PARA FINES DE PRESENTACION COMERCIAL", 10 + 3.5, mapY + mapH - 1.8);

      // RIGHT COLUMN: Extra photographs vertical grid
      doc.setTextColor(15, 17, 21);
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("GALERÍA DE FOTOS ADICIONALES", 110, 27);

      let gridPhotoY = 32;
      const photoX = 110;
      const photoW = 90;
      const photoH = 44;

      if (formData.extraImages && formData.extraImages.length > 0) {
        formData.extraImages.slice(0, 4).forEach((imgBase64, index) => {
          try {
            doc.addImage(imgBase64, "JPEG", photoX, gridPhotoY, photoW, photoH);
            
            // Thin elegant border framing each extra image
            doc.setDrawColor(215, 215, 220);
            doc.setLineWidth(0.2);
            doc.rect(photoX, gridPhotoY, photoW, photoH, "S");
          } catch (e) {
            console.error(`Extra image ${index} drawing failed in PDF`, e);
            // Fallback block
            doc.setFillColor(242, 242, 245);
            doc.rect(photoX, gridPhotoY, photoW, photoH, "F");
            doc.setDrawColor(215, 215, 220);
            doc.rect(photoX, gridPhotoY, photoW, photoH, "S");
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(8.5);
            doc.text(`Fotografía de Detalle ${index + 1}`, photoX + 24, gridPhotoY + 22);
          }
          gridPhotoY += photoH + 4; // Spacing gap
        });
      } else {
        // Fallback for empty photo lists
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.rect(photoX, gridPhotoY, photoW, 80, "F");
        doc.setDrawColor(210, 210, 215);
        doc.rect(photoX, gridPhotoY, photoW, 80, "S");
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(130, 130, 130);
        doc.text("Sin fotografías adicionales.", photoX + 22, gridPhotoY + 40);
      }

      // 5. AGENT CONTACT FOOTER BLOCK (Perfect alignment from Y=222 to Y=276)
      const contactBlockY = 226;
      doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.rect(10, contactBlockY, 190, 48, "F");

      // Top gold border band
      doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.rect(10, contactBlockY, 190, 1.5, "F");

      let textStartX = 16;
      if (formData.agentPhoto) {
        try {
          doc.addImage(formData.agentPhoto, "JPEG", 16, contactBlockY + 6, 25, 25);
          textStartX = 46;
        } catch (e) {
          console.error("PDF agent photo error", e);
        }
      }

      // Inside block labels
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("CONTACTAR AL ASESOR EXCLUSIVO", textStartX, contactBlockY + 8);

      // Full Name
      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(formData.agentName || "ListaPro Bolivia", textStartX, contactBlockY + 16);

      // Thin separator inside block
      doc.setDrawColor(80, 82, 90);
      doc.setLineWidth(0.25);
      doc.line(textStartX, contactBlockY + 21, 194, contactBlockY + 21);

      // Contact variables details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(230, 230, 240);
      
      doc.text(`WhatsApp de Contacto: ${formData.agentPhone || "+591 (No especificado)"}`, textStartX, contactBlockY + 28);
      doc.text(`Email de Contacto: ${formData.agentEmail || "soporte@listapro-bo.com"}`, textStartX, contactBlockY + 34);
      doc.text(`Ubicación Oficial: Cochabamba, Bolivia`, textStartX, contactBlockY + 40);

      // Branding Logo signature on bottom right inside banner
      doc.setFont("times", "italic");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("Lista", 162, contactBlockY + 30);
      doc.setFont("times", "bold");
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("Pro", 172, contactBlockY + 30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(145, 145, 155);
      doc.text("SERVICIOS INMOBILIARIOS", 158, contactBlockY + 34);

      // P2 Footer text
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text("Dossier de venta generado por ListaPro Bolivia - Inteligencia Artificial para Bienes Raíces", 10, 288);
      doc.text("Página 2 de 2", 188, 288);

      const cleanedName = (result.title || "propiedad")
        .substring(0, 30)
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      
      doc.save(`listapro_${cleanedName}.pdf`);
    } catch (err) {
      console.error("PDF generation failed with exception", err);
      alert("Lo sentimos, ocurrió un error temporal al intentar generar el archivo PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const drawSceneFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: number,
    loadedImages: Record<string, HTMLImageElement>
  ) => {
    const sceneFrames = 150;
    const sceneIndex = Math.floor(frame / sceneFrames);
    const localFrame = frame % sceneFrames;

    const drawRoundedRect = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      c.beginPath();
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
    };

    // Solid dark base
    ctx.fillStyle = "#0A0B0E";
    ctx.fillRect(0, 0, width, height);

    if (sceneIndex < 4) {
      let img: HTMLImageElement | null = null;
      if (sceneIndex === 0) {
        img = loadedImages["cover"] || null;
      } else if (sceneIndex === 1) {
        img = loadedImages["extra_0"] || loadedImages["cover"] || null;
      } else if (sceneIndex === 2) {
        img = loadedImages["extra_1"] || loadedImages["cover"] || null;
      } else if (sceneIndex === 3) {
        img = loadedImages["extra_2"] || loadedImages["cover"] || null;
      }

      if (img) {
        let scale = 1.05;
        let transX = 0;
        let transY = 0;

        if (sceneIndex === 0) {
          scale = 1.05 + (0.15 * localFrame) / sceneFrames;
          transY = 0 - (40 * localFrame) / sceneFrames;
        } else if (sceneIndex === 1) {
          scale = 1.02 + (0.18 * localFrame) / sceneFrames;
          transY = -30 + (40 * localFrame) / sceneFrames;
        } else if (sceneIndex === 2) {
          scale = 1.05 + (0.2 * localFrame) / sceneFrames;
          transX = -20 + (40 * localFrame) / sceneFrames;
        } else if (sceneIndex === 3) {
          scale = 1.05 + (0.2 * localFrame) / sceneFrames;
          transX = 20 - (40 * localFrame) / sceneFrames;
        }

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-width / 2, -height / 2);

        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let dWidth = width;
        let dHeight = height;
        let dx = transX;
        let dy = transY;

        if (imgRatio > canvasRatio) {
          dWidth = height * imgRatio;
          dx = (width - dWidth) / 2 + transX;
        } else {
          dHeight = width / imgRatio;
          dy = (height - dHeight) / 2 + transY;
        }

        ctx.drawImage(img, dx, dy, dWidth, dHeight);
        ctx.restore();
      } else {
        ctx.fillStyle = "#15171C";
        ctx.fillRect(0, 0, width, height);
      }

      // Elegant cinematic gradients for typographic legibility
      const bottomGrad = ctx.createLinearGradient(0, height - 900, 0, height);
      bottomGrad.addColorStop(0, "rgba(10, 11, 14, 0.0)");
      bottomGrad.addColorStop(0.3, "rgba(10, 11, 14, 0.45)");
      bottomGrad.addColorStop(0.7, "rgba(10, 11, 14, 0.88)");
      bottomGrad.addColorStop(1.0, "rgba(10, 11, 14, 1.0)");
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, height - 900, width, 900);

      const topGrad = ctx.createLinearGradient(0, 0, 0, 250);
      topGrad.addColorStop(0, "rgba(10, 11, 14, 0.95)");
      topGrad.addColorStop(0.6, "rgba(10, 11, 14, 0.6)");
      topGrad.addColorStop(1.0, "rgba(10, 11, 14, 0.0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, 250);

      // Top brand header
      ctx.save();
      ctx.font = "italic 50px Georgia, serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("Lista", 80, 100);
      const logoW = ctx.measureText("Lista").width;
      ctx.font = "bold 50px Georgia, serif";
      ctx.fillStyle = "#C5A059";
      ctx.fillText("Pro", 80 + logoW, 100);

      ctx.fillStyle = "#C5A059";
      ctx.fillRect(80, 120, 110, 5);

      ctx.fillStyle = "#C5A059";
      ctx.font = "bold 24px Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("COCHABAMBA", width - 80, 95);
      ctx.restore();

      const opacity = localFrame < 15 ? localFrame / 15 : localFrame > 140 ? (150 - localFrame) / 10 : 1;
      ctx.save();
      ctx.globalAlpha = opacity;

      if (sceneIndex === 0) {
        const slideY = localFrame < 25 ? (25 - localFrame) * 3 : 0;
        ctx.save();
        ctx.translate(0, slideY);

        const opText = formData.operation === "Venta" ? "EN VENTA" : "EN ALQUILER";
        ctx.font = "bold 26px Arial, sans-serif";
        const opW = ctx.measureText(opText).width;

        ctx.fillStyle = "#C5A059";
        drawRoundedRect(ctx, 80, height - 520, opW + 40, 48, 10);
        ctx.fill();

        ctx.fillStyle = "#0A0B0E";
        ctx.fillText(opText, 100, height - 487);

        ctx.font = "bold 64px Arial, sans-serif";
        ctx.fillStyle = "#FFFFFF";
        const titleText = result.title || `Prístino ${formData.propertyType}`;
        const splittedTitle = titleText.length > 25 ? [titleText.slice(0, 24) + "-", titleText.slice(24)] : [titleText];

        if (splittedTitle.length === 1) {
          ctx.fillText(splittedTitle[0], 80, height - 390);
        } else {
          ctx.fillText(splittedTitle[0], 80, height - 430);
          ctx.fillText(splittedTitle[1], 80, height - 365);
        }

        ctx.font = "normal 30px Arial, sans-serif";
        ctx.fillStyle = "#D1D5DB";
        ctx.fillText(`📍 ${formData.address}, ${formData.cityState}`, 80, height - 280);
        ctx.restore();

      } else if (sceneIndex === 1) {
        const moveLeft = localFrame < 20 ? (20 - localFrame) * 4 : 0;
        const moveRight = localFrame < 30 ? (30 - localFrame) * -4 : 0;

        ctx.save();
        ctx.font = "bold 26px Arial, sans-serif";
        ctx.fillStyle = "#C5A059";
        ctx.fillText("PRECIOS EXCEPCIONALES", 80, height - 560);

        ctx.save();
        ctx.globalAlpha = opacity * (localFrame < 10 ? 0 : localFrame > 25 ? 1 : (localFrame - 10) / 15);
        ctx.translate(moveLeft, 0);
        ctx.font = "24px Arial, sans-serif";
        ctx.fillStyle = "#94A3B8";
        ctx.fillText("DÓLARES AMERICANOS ($us)", 80, height - 480);
        ctx.font = "bold 78px Arial, sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`$us ${Number(formData.priceUsd).toLocaleString("es-BO")}`, 80, height - 400);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = opacity * (localFrame < 20 ? 0 : localFrame > 35 ? 1 : (localFrame - 20) / 15);
        ctx.translate(moveRight, 0);
        ctx.font = "24px Arial, sans-serif";
        ctx.fillStyle = "#94A3B8";
        ctx.fillText("MONEDA NACIONAL (BOB)", 80, height - 310);
        ctx.font = "bold 56px Arial, sans-serif";
        ctx.fillStyle = "#C5A059";
        ctx.fillText(`Bs ${Number(formData.priceBob).toLocaleString("es-BO")}`, 80, height - 250);
        ctx.restore();
        ctx.restore();

      } else if (sceneIndex === 2) {
        ctx.font = "bold 38px Arial, sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Estructura e Instalaciones", 80, height - 590);

        const gridY = height - 530;
        const cardH = 140;
        const cardW = 440;

        ctx.save();
        ctx.fillStyle = "rgba(10, 11, 14, 0.85)";
        ctx.strokeStyle = "rgba(197, 160, 89, 0.3)";
        ctx.lineWidth = 1.5;

        drawRoundedRect(ctx, 80, gridY, cardW, cardH, 16);
        ctx.fill(); ctx.stroke();
        ctx.font = "34px Arial"; ctx.fillText("🛏️", 110, gridY + 80);
        ctx.font = "bold 26px Arial, sans-serif"; ctx.fillStyle = "#FFFFFF";
        ctx.fillText(formData.propertyType === "Terreno" ? "N/A" : `${formData.bedrooms} Dorms`, 180, gridY + 85);
        ctx.font = "18px Arial, sans-serif"; ctx.fillStyle = "#94A3B8";
        ctx.fillText("DORMITORIOS", 180, gridY + 115);

        ctx.fillStyle = "rgba(10, 11, 14, 0.85)";
        drawRoundedRect(ctx, width - 80 - cardW, gridY, cardW, cardH, 16);
        ctx.fill(); ctx.stroke();
        ctx.fillText("🚿", width - 80 - cardW + 30, gridY + 80);
        ctx.font = "bold 26px Arial, sans-serif"; ctx.fillStyle = "#FFFFFF";
        ctx.fillText(formData.propertyType === "Terreno" ? "N/A" : `${formData.bathrooms} Baños`, width - 80 - cardW + 100, gridY + 85);
        ctx.font = "18px Arial, sans-serif"; ctx.fillStyle = "#94A3B8";
        ctx.fillText("BAÑOS COMPLETOS", width - 80 - cardW + 100, gridY + 115);

        const gridY2 = gridY + 180;
        ctx.fillStyle = "rgba(10, 11, 14, 0.85)";
        drawRoundedRect(ctx, 80, gridY2, cardW, cardH, 16);
        ctx.fill(); ctx.stroke();
        ctx.fillText("📐", 110, gridY2 + 80);
        ctx.font = "bold 24px Arial, sans-serif"; ctx.fillStyle = "#FFFFFF";
        const areaVal = formData.propertyType === "Terreno" ? `${formData.plotArea} m²` : `${formData.builtArea || formData.plotArea} m²`;
        ctx.fillText(areaVal, 180, gridY2 + 85);
        ctx.font = "18px Arial, sans-serif"; ctx.fillStyle = "#94A3B8";
        ctx.fillText(formData.propertyType === "Terreno" ? "SUP. TERRENO" : "ÁREA COSTR.", 180, gridY2 + 115);

        ctx.fillStyle = "rgba(10, 11, 14, 0.85)";
        drawRoundedRect(ctx, width - 80 - cardW, gridY2, cardW, cardH, 16);
        ctx.fill(); ctx.stroke();
        ctx.fillText("🚗", width - 80 - cardW + 30, gridY2 + 80);
        ctx.font = "bold 26px Arial, sans-serif"; ctx.fillStyle = "#FFFFFF";
        ctx.fillText(formData.propertyType === "Terreno" ? "N/A" : `${formData.parking || "0"} Plazas`, width - 80 - cardW + 100, gridY2 + 85);
        ctx.font = "18px Arial, sans-serif"; ctx.fillStyle = "#94A3B8";
        ctx.fillText("ESTACIONAMIENTO", width - 80 - cardW + 100, gridY2 + 115);
        ctx.restore();

      } else if (sceneIndex === 3) {
        ctx.font = "bold 24px Arial, sans-serif";
        ctx.fillStyle = "#C5A059";
        ctx.fillText("COMODIDADES INTERNAS", 80, height - 590);

        ctx.font = "bold 52px Georgia, serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Estilo de Vida Exclusivo", 80, height - 520);

        const displayed = formData.amenities && formData.amenities.length > 0
          ? formData.amenities.slice(0, 3)
          : ["Diseño Arquitectónico", "Gran Plusvalía", "Iluminación Natural"];

        displayed.forEach((item, idx) => {
          const rowStart = 20 + idx * 8;
          ctx.save();
          if (localFrame >= rowStart) {
            const rowProg = Math.min(1, (localFrame - rowStart) / 12);
            ctx.globalAlpha = opacity * rowProg;
            const slideX = -40 * (1 - rowProg);

            const rowY = height - 440 + idx * 105;

            ctx.fillStyle = "rgba(10, 11, 14, 0.75)";
            drawRoundedRect(ctx, 80 + slideX, rowY, width - 160, 80, 12);
            ctx.fill();

            ctx.fillStyle = "#C5A059";
            ctx.fillRect(80 + slideX, rowY, 6, 80);

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 26px Arial, sans-serif";
            ctx.fillText(`⭐  ${item}`, 110 + slideX, rowY + 48);
          }
          ctx.restore();
        });
      }

      ctx.restore();

    } else {
      ctx.fillStyle = "#0A0B0E";
      ctx.fillRect(0, 0, width, height);

      const grad1 = ctx.createRadialGradient(width - 100, 100, 10, width, 0, 500);
      grad1.addColorStop(0, "rgba(197, 160, 89, 0.12)");
      grad1.addColorStop(1, "rgba(10, 11, 14, 0.0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(100, height - 100, 10, 0, height, 500);
      grad2.addColorStop(0, "rgba(197, 160, 89, 0.09)");
      grad2.addColorStop(1, "rgba(10, 11, 14, 0.0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "italic 80px Georgia, serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("Lista", width / 2 - 40, 240);

      const logoCenterW = ctx.measureText("Lista").width;
      ctx.font = "bold 80px Georgia, serif";
      ctx.fillStyle = "#C5A059";
      ctx.fillText("Pro", width / 2 + logoCenterW / 2 + 10, 240);

      ctx.fillStyle = "#C5A059";
      ctx.fillRect(width / 2 - 100, 275, 200, 6);

      ctx.font = "bold 20px Arial, sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText("MÁXIMO GANCHO PUBLICITARIO", width / 2, 320);
      ctx.restore();

      const boxY = height / 2 - 200;
      const boxW = 860;
      const boxH = 680;
      const boxX = (width - boxW) / 2;

      ctx.save();
      ctx.fillStyle = "rgba(15, 17, 21, 0.85)";
      ctx.strokeStyle = "rgba(197, 160, 89, 0.4)";
      ctx.lineWidth = 2.5;
      drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 24);
      ctx.fill(); ctx.stroke();

      const imgAgent = loadedImages["agent"];
      if (imgAgent) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, boxY + 120, 85, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(imgAgent, width / 2 - 85, boxY + 35, 170, 170);
        ctx.restore();
        
        ctx.beginPath();
        ctx.arc(width / 2, boxY + 120, 85, 0, Math.PI * 2);
        ctx.strokeStyle = "#C5A059";
        ctx.lineWidth = 4;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(width / 2, boxY + 120, 85, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(197, 160, 89, 0.15)";
        ctx.strokeStyle = "#C5A059";
        ctx.lineWidth = 2;
        ctx.fill(); ctx.stroke();

        ctx.font = "100px Arial";
        ctx.textAlign = "center";
        ctx.fillText("👔", width / 2, boxY + 155);
      }

      ctx.font = "bold 20px Arial, sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText("ASESOR ASIGNADO", width / 2, boxY + 265);

      ctx.font = "bold 44px Arial, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(formData.agentName || "Asesor Comercial", width / 2, boxY + 330);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(width / 2 - 200, boxY + 365);
      ctx.lineTo(width / 2 + 200, boxY + 365);
      ctx.stroke();

      ctx.font = "bold 42px Arial, sans-serif";
      ctx.fillStyle = "#C5A059";
      ctx.fillText(`📞  ${formData.agentPhone || "+591 700 00000"}`, width / 2, boxY + 440);

      ctx.font = "26px Arial, sans-serif";
      ctx.fillStyle = "#E2E8F0";
      ctx.fillText(`✉️  ${formData.agentEmail || "contacto@listapro.com"}`, width / 2, boxY + 515);

      ctx.font = "bold 22px Arial, sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText("¡CONTÁCTAME PARA AGENDAR UNA VISITA!", width / 2, boxY + 590);
      ctx.restore();

      ctx.font = "20px Arial, sans-serif";
      ctx.fillStyle = "#475569";
      ctx.textAlign = "center";
      ctx.fillText(`© ${new Date().getFullYear()} ListaPro Bolivia. Fabricado con Excelencia Regional.`, width / 2, height - 160);
    }
  };

  const runBrowserVideoGenerator = async () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Su navegador no soporta el lienzo de representación 2D o está bloqueado.");
      }

      const imagesToLoad: { key: string; src: string }[] = [];
      if (formData.coverImage) imagesToLoad.push({ key: "cover", src: formData.coverImage });
      if (formData.agentPhoto) imagesToLoad.push({ key: "agent", src: formData.agentPhoto });
      
      formData.extraImages.forEach((img, idx) => {
        if (img) {
          imagesToLoad.push({ key: `extra_${idx}`, src: img });
        }
      });

      setVideoStatusText("Cargando fotografías en memoria ultrarrápida...");
      setVideoProgress(18);

      const loadedImages: Record<string, HTMLImageElement> = {};
      const loadPromises = imagesToLoad.map((imgObj) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            loadedImages[imgObj.key] = img;
            resolve();
          };
          img.onerror = () => {
            console.warn(`No se pudo decodificar el recurso image: ${imgObj.key}`);
            resolve();
          };
          img.src = imgObj.src;
        });
      });

      await Promise.all(loadPromises);
      setVideoProgress(25);

      let combinedStream: MediaStream | null = null;
      let mediaRecorder: MediaRecorder | null = null;
      let recordedChunks: Blob[] = [];
      let audio: HTMLAudioElement | null = null;
      let audioContext: AudioContext | null = null;

      try {
        setVideoStatusText("Estableciendo mezcla estéreo con pista de jazz elegante...");
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
        audio.crossOrigin = "anonymous";
        
        const source = audioContext.createMediaElementSource(audio);
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);
        source.connect(audioContext.destination);
        
        const canvasStream = canvas.captureStream(30);
        combinedStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...destination.stream.getAudioTracks()
        ]);
        
        audio.play();
      } catch (audioErr) {
        console.warn("Web Audio API omitido o bloqueado por origen/permisos de navegador:", audioErr);
        const canvasStream = canvas.captureStream(30);
        combinedStream = canvasStream;
      }

      let mimeType = "video/webm;codecs=vp9";
      if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")) {
        mimeType = "video/mp4;codecs=avc1";
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
        mimeType = "video/webm;codecs=vp8";
      } else if (MediaRecorder.isTypeSupported("video/webm")) {
        mimeType = "video/webm";
      }

      console.log("Recording canvas stream encoded under codec:", mimeType);
      mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: 4500000,
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setVideoProgress(100);
        setVideoStatusText("¡Compilación de video finalizada con éxito!");
        
        const actualMime = mediaRecorder?.mimeType || "video/webm";
        const blob = new Blob(recordedChunks, { type: actualMime });
        const videoUrl = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = videoUrl;
        const cleanedTitle = (result.title || "propiedad")
          .substring(0, 20)
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase();

        let extension = "webm";
        if (actualMime.toLowerCase().includes("video/mp4") || actualMime.toLowerCase().includes("mp4")) {
          extension = "mp4";
        }
        
        link.download = `listapro_reel_${cleanedTitle}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        if (audio) {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch (e) {
            // ignore
          }
        }
        
        setIsVideoLoading(false);
      };

      mediaRecorder.start();
      setVideoStatusText("Renderizando fotograma a fotograma (Efecto Ken Burns)...");

      const totalFrames = 750; // 25 seconds at 30 fps
      let currentFrame = 0;

      const drawFrameLoop = () => {
        if (currentFrame >= totalFrames) {
          if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
          return;
        }

        drawSceneFrame(ctx, canvas.width, canvas.height, currentFrame, loadedImages);

        currentFrame++;
        const percent = Math.floor(25 + (currentFrame / totalFrames) * 73);
        setVideoProgress(percent);
        setVideoStatusText(`Componiendo cuadro de reel: ${currentFrame} / ${totalFrames} (${Math.floor((currentFrame / totalFrames) * 100)}%)`);

        setTimeout(() => {
          requestAnimationFrame(drawFrameLoop);
        }, 1000 / 30);
      };

      drawFrameLoop();

    } catch (err: any) {
      console.error("Fallo durante el renderizado local del cliente:", err);
      alert(`Lo sentimos, falló la renderización híbrida: ${err.message || err}`);
      setIsVideoLoading(false);
    }
  };

  const generateVideo = async () => {
    setIsVideoLoading(true);
    setVideoProgress(5);
    setVideoStatusText("Iniciando motor de render Remotion (React)...");

    const requestData = {
      propertyType: formData.propertyType,
      operation: formData.operation,
      address: formData.address,
      cityState: formData.cityState,
      priceBob: formData.priceBob,
      priceUsd: formData.priceUsd,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      builtArea: formData.builtArea,
      plotArea: formData.plotArea,
      parking: formData.parking,
      amenities: formData.amenities,
      shortDescription: formData.shortDescription,
      coverImage: formData.coverImage,
      extraImages: formData.extraImages,
      agentName: formData.agentName,
      agentPhone: formData.agentPhone,
      agentEmail: formData.agentEmail,
      agentPhoto: formData.agentPhoto,
      title: result.title,
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    };

    try {
      setVideoStatusText("Contactando con servidor de procesamiento de video...");
      setVideoProgress(12);

      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("El servicio de video del servidor no se encuentra disponible.");
      }

      const data = await response.json();

      if (data.status === "success" && data.downloadUrl) {
        setVideoProgress(100);
        setVideoStatusText("¡Video listo! Descargando del servidor...");
        
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.download = `listapro_reel_${formData.address.replace(/[^a-zA-Z0-9]/g, "_")}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsVideoLoading(false);
      } else {
        // Fallback to high fidelity browser-side canvas rendering
        setVideoStatusText("Optimizando renderizado de alta definición local (híbrido)...");
        runBrowserVideoGenerator();
      }
    } catch (err: any) {
      console.warn("Fallo de renderizado Remotion en backend, iniciando renderizado en cliente:", err);
      setVideoStatusText("Iniciando renderizador local del navegador (100% de fiabilidad)...");
      runBrowserVideoGenerator();
    }
  };

  const generateCarousel = async () => {
    setIsGeneratingCarousel(true);
    setCarouselPreviews([]);
    setCarouselProgress(10);
    setCarouselStatusText("Analizando imágenes y organizando narrativa visual...");

    try {
      const slides: HTMLCanvasElement[] = [];
      const drawRoundedRect = (
        c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number
      ) => {
        c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
        c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h);
        c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y);
        c.closePath();
      };

      const imagesToLoad: { key: string; src: string }[] = [];
      if (formData.coverImage) imagesToLoad.push({ key: "cover", src: formData.coverImage });
      if (formData.agentPhoto) imagesToLoad.push({ key: "agent", src: formData.agentPhoto });
      formData.extraImages.forEach((img, idx) => {
        if (img) imagesToLoad.push({ key: `extra_${idx}`, src: img });
      });

      const loadedImages: Record<string, HTMLImageElement> = {};
      await Promise.all(imagesToLoad.map((imgObj) => new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => { loadedImages[imgObj.key] = img; resolve(); };
        img.onerror = () => resolve();
        img.src = imgObj.src;
      })));

          const w = 1080;
      const h = 1920;

      const createSlide = () => {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        return { c, ctx: c.getContext("2d")! };
      };

      const drawBgImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | undefined, w: number, h: number) => {
        if (!img) return;
        const ratio = Math.max(w / img.width, h / img.height);
        ctx.drawImage(img, (w - img.width * ratio) / 2, (h - img.height * ratio) / 2, img.width * ratio, img.height * ratio);
      };

      // Slide 1: Portada
      const { c: s1, ctx: ctx1 } = createSlide();
      ctx1.fillStyle = "#0A0B0E"; ctx1.fillRect(0, 0, w, h);
      drawBgImage(ctx1, loadedImages["cover"], w, h);
      
      const grad1 = ctx1.createLinearGradient(0, 0, 0, h);
      grad1.addColorStop(0, "rgba(10, 11, 14, 0.5)"); grad1.addColorStop(0.5, "rgba(10, 11, 14, 0.1)"); grad1.addColorStop(1, "rgba(10, 11, 14, 0.95)");
      ctx1.fillStyle = grad1; ctx1.fillRect(0, 0, w, h);
      
      ctx1.fillStyle = "#C5A059"; ctx1.font = "italic 36px Georgia"; ctx1.fillText("Lista", 80, 200);
      ctx1.font = "bold 36px Georgia"; ctx1.fillText("Pro", 80 + ctx1.measureText("Lista").width, 200);
      
      ctx1.fillStyle = "#FFFFFF"; ctx1.font = "bold 64px 'Helvetica Neue', Arial";
      const titleLines = docTextSplit(ctx1, result.title || "Tu Nuevo Hogar", w - 160);
      titleLines.forEach((line, i) => ctx1.fillText(line, 80, h - 450 + (i * 75)));
      
      ctx1.fillStyle = "#94A3B8"; ctx1.font = "28px 'Helvetica Neue', Arial"; 
      ctx1.fillText(`📍 ${formData.address}, ${formData.cityState}`, 80, h - 250);
      ctx1.fillStyle = "#C5A059"; ctx1.font = "bold 48px 'Helvetica Neue', Arial"; 
      ctx1.fillText(`$us ${Number(formData.priceUsd).toLocaleString("es-BO")}`, 80, h - 180);
      slides.push(s1);

      // Slide 2: Datos Principales
      const { c: s2, ctx: ctx2 } = createSlide();
      ctx2.fillStyle = "#0F1115"; ctx2.fillRect(0, 0, w, h);
      drawBgImage(ctx2, loadedImages["extra_0"] || loadedImages["cover"], w, h);

      const grad2 = ctx2.createLinearGradient(0, 0, 0, h);
      grad2.addColorStop(0, "rgba(10, 11, 14, 0.8)"); 
      grad2.addColorStop(1, "rgba(10, 11, 14, 0.98)");
      ctx2.fillStyle = grad2; ctx2.fillRect(0, 0, w, h);

      ctx2.fillStyle = "#FFFFFF"; ctx2.font = "bold 48px 'Helvetica Neue', Arial"; ctx2.fillText("ESPECIFICACIONES", 80, 300);
      ctx2.fillStyle = "#C5A059"; ctx2.fillRect(80, 330, 80, 3);
      const specs = [
        { icon: "🛏️", val: `${formData.bedrooms} Dorms`, label: "Dormitorios" },
        { icon: "🚿", val: `${formData.bathrooms} Baños`, label: "Baños" },
        { icon: "📐", val: `${formData.builtArea || formData.plotArea} m²`, label: "Superficie" },
        { icon: "🚗", val: `${formData.parking || "0"} Garajes`, label: "Estacionamiento" },
      ];
      specs.forEach((spec, i) => {
        const x = 80 + (i % 2) * 440; const y = 450 + Math.floor(i / 2) * 350;
        ctx2.fillStyle = "rgba(15, 17, 21, 0.75)"; ctx2.strokeStyle = "rgba(197, 160, 89, 0.3)"; ctx2.lineWidth = 1.5;
        drawRoundedRect(ctx2, x, y, 400, 280, 16); ctx2.fill(); ctx2.stroke();
        ctx2.font = "60px Arial"; ctx2.fillText(spec.icon, x + 50, y + 100);
        ctx2.fillStyle = "#FFFFFF"; ctx2.font = "bold 38px 'Helvetica Neue', Arial"; ctx2.fillText(spec.val, x + 50, y + 180);
        ctx2.fillStyle = "#94A3B8"; ctx2.font = "22px 'Helvetica Neue', Arial"; ctx2.fillText(spec.label.toUpperCase(), x + 50, y + 230);
      });
      slides.push(s2);

      // Slide 3: Espacios (Siempre 5 slides)
      const { c: s3, ctx: ctx3 } = createSlide();
      ctx3.fillStyle = "#0A0B0E"; ctx3.fillRect(0, 0, w, h);
      
      const img3a = loadedImages["extra_1"] || loadedImages["extra_0"] || loadedImages["cover"];
      const img3b = loadedImages["extra_2"] || loadedImages["extra_0"] || loadedImages["cover"];
      const img3c = loadedImages["extra_3"] || loadedImages["cover"];

      if (img3a) {
        const ratio = Math.max(w / img3a.width, (h/2) / img3a.height);
        ctx3.save(); ctx3.beginPath(); ctx3.rect(0, 0, w, h/2); ctx3.clip();
        ctx3.drawImage(img3a, (w - img3a.width * ratio) / 2, ((h/2) - img3a.height * ratio) / 2, img3a.width * ratio, img3a.height * ratio);
        ctx3.restore();
      }
      if (img3b) {
        const ratio = Math.max((w/2) / img3b.width, (h/2) / img3b.height);
        ctx3.save(); ctx3.beginPath(); ctx3.rect(0, h/2, w/2, h/2); ctx3.clip();
        ctx3.drawImage(img3b, ((w/2) - img3b.width * ratio) / 2, h/2 + ((h/2) - img3b.height * ratio) / 2, img3b.width * ratio, img3b.height * ratio);
        ctx3.restore();
      }
      if (img3c) {
        const ratio = Math.max((w/2) / img3c.width, (h/2) / img3c.height);
        ctx3.save(); ctx3.beginPath(); ctx3.rect(w/2, h/2, w/2, h/2); ctx3.clip();
        ctx3.drawImage(img3c, w/2 + ((w/2) - img3c.width * ratio) / 2, h/2 + ((h/2) - img3c.height * ratio) / 2, img3c.width * ratio, img3c.height * ratio);
        ctx3.restore();
      }
      
      ctx3.fillStyle = "rgba(10, 11, 14, 0.85)"; ctx3.fillRect(0, h/2 - 60, w, 120);
      ctx3.fillStyle = "#C5A059"; ctx3.fillRect(0, h/2 - 60, w, 2); ctx3.fillRect(0, h/2 + 60, w, 2);
      ctx3.fillStyle = "#FFFFFF"; ctx3.font = "bold 36px 'Helvetica Neue', Arial"; ctx3.textAlign = "center"; 
      ctx3.fillText("ESPACIOS DESTACADOS", w/2, h/2 + 12); ctx3.textAlign = "left";
      slides.push(s3);

      // Slide 4: Beneficios Emocionales
      const { c: s4, ctx: ctx4 } = createSlide();
      ctx4.fillStyle = "#0F1115"; ctx4.fillRect(0, 0, w, h);
      drawBgImage(ctx4, loadedImages["extra_2"] || loadedImages["cover"], w, h);
      
      const bGrad = ctx4.createLinearGradient(0, 0, 0, h);
      bGrad.addColorStop(0, "rgba(10, 11, 14, 0)");
      bGrad.addColorStop(0.5, "rgba(10, 11, 14, 0.2)");
      bGrad.addColorStop(1, "rgba(10, 11, 14, 0.98)");
      ctx4.fillStyle = bGrad; ctx4.fillRect(0, 0, w, h);
      
      const copyLines = result.keyHighlights && result.keyHighlights.length > 0 
        ? result.keyHighlights.slice(0, 3) 
        : ["Diseño Arquitectónico de Alta Gama", "Inversión Segura con Gran Plusvalía", "Espacios Iluminados y Confortables"];
      
      ctx4.font = "22px 'Helvetica Neue', Arial";
      const boxWidth = w - 160; 
      const textMaxWidth = boxWidth - 110; 

      const boxes: { lines: string[], boxHeight: number }[] = [];
      copyLines.forEach(line => {
         const lines = docTextSplit(ctx4, line, textMaxWidth);
         const displayLines = lines.slice(0, 3);
         const boxHeight = 35 + (displayLines.length * 32) + 35; 
         boxes.push({ lines: displayLines, boxHeight });
      });

      const gap = 24;
      const totalBoxesHeight = boxes.reduce((acc, b) => acc + b.boxHeight, 0) + (boxes.length - 1) * gap;
      
      let currentY = h - 250 - totalBoxesHeight;

      ctx4.fillStyle = "#C5A059"; ctx4.font = "bold 52px Georgia"; ctx4.textAlign = "center"; 
      ctx4.fillText("Estilo de Vida", w/2, currentY - 50);

      ctx4.textAlign = "left";

      boxes.forEach((box) => {
        ctx4.fillStyle = "rgba(15, 17, 21, 0.65)"; 
        ctx4.strokeStyle = "rgba(197, 160, 89, 0.4)"; 
        ctx4.lineWidth = 1.5;
        drawRoundedRect(ctx4, 80, currentY, boxWidth, box.boxHeight, 20); 
        ctx4.fill(); ctx4.stroke();
        
        ctx4.fillStyle = "#FFFFFF";
        ctx4.font = "24px Arial";
        ctx4.fillText("✨", 110, currentY + box.boxHeight / 2 + 8);
        
        ctx4.fillStyle = "#FFFFFF";
        ctx4.font = "22px 'Helvetica Neue', Arial";
        
        const startTextY = currentY + (box.boxHeight - (box.lines.length * 32)) / 2 + 24;
        box.lines.forEach((line, lineIndex) => {
           ctx4.fillText(line, 160, startTextY + lineIndex * 32);
        });

        currentY += box.boxHeight + gap;
      });
      slides.push(s4);

      // Slide 5: CTA Final
      const { c: s5, ctx: ctx5 } = createSlide();
      ctx5.fillStyle = "#0A0B0E"; ctx5.fillRect(0, 0, w, h);
      drawBgImage(ctx5, loadedImages["extra_3"] || loadedImages["extra_0"] || loadedImages["cover"], w, h);
      
      const grad5 = ctx5.createLinearGradient(0, 0, 0, h);
      grad5.addColorStop(0, "rgba(10, 11, 14, 0.85)"); grad5.addColorStop(1, "rgba(10, 11, 14, 0.98)");
      ctx5.fillStyle = grad5; ctx5.fillRect(0, 0, w, h);
      
      ctx5.fillStyle = "#FFFFFF"; ctx5.font = "bold 52px 'Helvetica Neue', Arial"; ctx5.textAlign = "center"; ctx5.fillText("¿LISTO PARA VISITAR?", w/2, 350);
      
      if (loadedImages["agent"]) {
        ctx5.save(); ctx5.beginPath(); ctx5.arc(w/2, 650, 180, 0, Math.PI * 2); ctx5.closePath(); ctx5.clip();
        ctx5.drawImage(loadedImages["agent"], w/2 - 180, 470, 360, 360); ctx5.restore();
        ctx5.beginPath(); ctx5.arc(w/2, 650, 180, 0, Math.PI * 2); ctx5.strokeStyle = "#C5A059"; ctx5.lineWidth = 4; ctx5.stroke();
      } else {
        ctx5.fillStyle = "rgba(15, 17, 21, 0.8)"; ctx5.beginPath(); ctx5.arc(w/2, 650, 180, 0, Math.PI * 2); ctx5.fill();
        ctx5.fillStyle = "#C5A059"; ctx5.font = "140px Arial"; ctx5.fillText("👔", w/2, 695);
      }
      
      ctx5.fillStyle = "#C5A059"; ctx5.font = "bold 44px 'Helvetica Neue', Arial"; ctx5.fillText(formData.agentName || "ListaPro", w/2, 950);
      ctx5.fillStyle = "#94A3B8"; ctx5.font = "32px 'Helvetica Neue', Arial"; ctx5.fillText(`📞 ${formData.agentPhone || "+591 XXXXXXXX"}`, w/2, 1030);
      ctx5.fillText(`✉️ ${formData.agentEmail || "contacto@listapro.com"}`, w/2, 1090);
      
      ctx5.fillStyle = "#C5A059";
      drawRoundedRect(ctx5, w/2 - 220, 1350, 440, 110, 55); ctx5.fill();
      ctx5.fillStyle = "#0A0B0E"; ctx5.font = "bold 32px 'Helvetica Neue', Arial"; ctx5.fillText("AGENDA TU VISITA", w/2, 1418);
      ctx5.textAlign = "left";
      slides.push(s5);
      setCarouselProgress(80);
      setCarouselStatusText("Optimizando tipografía y preparando exportación ZIP...");

      const previews = slides.map(c => c.toDataURL("image/jpeg", 0.7));
      setCarouselPreviews(previews);

      const zip = new JSZip();
      slides.forEach((c, i) => {
        const data = c.toDataURL("image/jpeg", 0.9).split(',')[1];
        zip.file(`listapro_slide_0${i+1}.jpg`, data, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      const cleanedTitle = (result.title || "propiedad").substring(0, 20).replace(/[^a-z0-9]/gi, "_").toLowerCase();
      link.download = `listapro_carrusel_${cleanedTitle}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setCarouselProgress(100);
      setCarouselStatusText("¡Carrusel premium listo!");

    } catch (err) {
      console.error(err);
      alert("Error al generar el carrusel.");
    } finally {
      setIsGeneratingCarousel(false);
    }
  };

  // Utility to split text
  const docTextSplit = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const generateInstagramImage = () => {
    setIsGeneratingImg(true);
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("No se pudo iniciar el canvas de dibujo de alta definición.");
      setIsGeneratingImg(false);
      return;
    }

    const drawVisualsAndDownload = (img: HTMLImageElement | null) => {
      try {
        // 1. Background Fill standard dark slate
        ctx.fillStyle = "#0F1115";
        ctx.fillRect(0, 0, 1080, 1080);

        // 2. Draw Cover Image inside
        if (img) {
          const canvasRatio = 1080 / 1080;
          const imgRatio = img.width / img.height;
          let sWidth = img.width;
          let sHeight = img.height;
          let sx = 0;
          let sy = 0;
          if (imgRatio > canvasRatio) {
            sWidth = img.height * canvasRatio;
            sx = (img.width - sWidth) / 2;
          } else {
            sHeight = img.width / canvasRatio;
            sy = (img.height - sHeight) / 2;
          }
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 1080, 1080);
        }

        // 3. Dark gradient overlays for pristine readability (high typography contrast)
        // Bottom Gradient
        const bottomGrad = ctx.createLinearGradient(0, 300, 0, 1080);
        bottomGrad.addColorStop(0, "rgba(10, 11, 14, 0.0)");
        bottomGrad.addColorStop(0.3, "rgba(10, 11, 14, 0.45)");
        bottomGrad.addColorStop(0.65, "rgba(10, 11, 14, 0.85)");
        bottomGrad.addColorStop(1.0, "rgba(10, 11, 14, 1.0)");
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, 300, 1080, 780);

        // Top Gradient for header brand readability
        const topGrad = ctx.createLinearGradient(0, 0, 0, 200);
        topGrad.addColorStop(0, "rgba(10, 11, 14, 0.95)");
        topGrad.addColorStop(0.5, "rgba(10, 11, 14, 0.7)");
        topGrad.addColorStop(1.0, "rgba(10, 11, 14, 0.0)");
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, 1080, 200);

        // 4. Draw Header Branding
        // Brand Name "ListaPro"
        ctx.font = "italic 44px Georgia, 'Times New Roman', serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Lista", 60, 85);
        
        const brandWidth = ctx.measureText("Lista").width;
        ctx.font = "bold 44px Georgia, 'Times New Roman', serif";
        ctx.fillStyle = "#C5A059";
        ctx.fillText("Pro", 60 + brandWidth, 85);

        // Gold bottom bar under logo
        ctx.fillStyle = "#C5A059";
        ctx.fillRect(60, 105, 140, 4);

        // Top Right context
        ctx.font = "bold 20px 'Helvetica Neue', Helvetica, Arial, sans-serif";
        ctx.fillStyle = "#94A3B8";
        ctx.textAlign = "right";
        ctx.fillText("ANUNCIO EXCLUSIVO DE COCHABAMBA", 1020, 75);
        ctx.fillStyle = "#C5A059";
        ctx.font = "bold 16px 'Helvetica Neue', Helvetica, Arial, sans-serif";
        ctx.fillText("BIENES RAÍCES PREMIUM", 1020, 100);

        // Reset text align for main descriptors
        ctx.textAlign = "left";

        // 5. Badges Row (Operation & Property Type)
        // Operation badge back color
        const opLabelText = formData.operation === "Venta" ? "EN VENTA" : "EN ALQUILER";
        ctx.font = "bold 22px 'Helvetica Neue', Arial, sans-serif";
        const opWidth = ctx.measureText(opLabelText).width;
        
        // Draw rounded rectangle for Operation
        ctx.fillStyle = "#C5A059";
        drawRoundedRect(ctx, 60, 715, opWidth + 30, 42, 8);
        ctx.fill();
        // Draw text inside Operation badge
        ctx.fillStyle = "#0A0B0E";
        ctx.fillText(opLabelText, 75, 744);

        // Property type badge
        const propText = formData.propertyType.toUpperCase();
        ctx.font = "bold 22px 'Helvetica Neue', Arial, sans-serif";
        const propWidth = ctx.measureText(propText).width;

        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        drawRoundedRect(ctx, 60 + opWidth + 50, 715, propWidth + 30, 42, 8);
        ctx.fill();
        ctx.stroke();
        // Text inside property type
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(propText, 60 + opWidth + 65, 744);

        // 6. Bold/Highlighted Price Usd and Bob
        ctx.font = "normal 30px Georgia, 'Times New Roman', serif";
        ctx.fillStyle = "#C5A059";
        ctx.fillText("VALOR EXCEPCIONAL CON LISTAPRO", 60, 805);

        ctx.font = "bold 76px 'Helvetica Neue', Arial, sans-serif";
        ctx.fillStyle = "#FFFFFF";
        const formattedUsd = `$us ${Number(formData.priceUsd).toLocaleString("es-BO")}`;
        ctx.fillText(formattedUsd, 60, 885);

        ctx.font = "bold 42px 'Helvetica Neue', Arial, sans-serif";
        ctx.fillStyle = "#D1D5DB";
        const formattedBob = `Bs ${Number(formData.priceBob).toLocaleString("es-BO")}`;
        ctx.fillText(formattedBob, 60, 938);

        // 7. Location details
        // Simple pin icon/text
        ctx.font = "32px Arial";
        ctx.fillText("📍", 60, 1005);

        ctx.font = "normal 28px 'Helvetica Neue', Arial, sans-serif";
        ctx.fillStyle = "#E2E8F0";
        const locText = `${formData.address}, ${formData.cityState}`;
        const truncatedLoc = locText.length > 36 ? locText.slice(0, 36) + "..." : locText;
        ctx.fillText(truncatedLoc, 105, 1002);

        // 8. Core specifications sidebar card (Right panel)
        // card bounds: x=720, y=715, w=300, h=290
        ctx.fillStyle = "rgba(15, 17, 21, 0.82)";
        ctx.strokeStyle = "rgba(197, 160, 89, 0.4)";
        ctx.lineWidth = 2.5;
        drawRoundedRect(ctx, 720, 715, 300, 290, 16);
        ctx.fill();
        ctx.stroke();

        // Card Header Line
        ctx.fillStyle = "#C5A059";
        ctx.font = "bold 16px 'Helvetica Neue', Arial, sans-serif";
        ctx.fillText("ESPECIFICACIONES", 745, 748);
        
        ctx.strokeStyle = "rgba(197, 160, 89, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(745, 762);
        ctx.lineTo(995, 762);
        ctx.stroke();

        // Row 1: Bedrooms
        ctx.fillStyle = "#F1F5F9";
        ctx.font = "24px Arial";
        ctx.fillText("🛏️", 745, 808);
        ctx.font = "bold 20px 'Helvetica Neue', Arial, sans-serif";
        ctx.fillText(`${formData.bedrooms} Dorms`, 795, 803);

        // Row 2: Bathrooms
        ctx.font = "24px Arial";
        ctx.fillText("🚿", 745, 868);
        ctx.font = "bold 20px 'Helvetica Neue', Arial, sans-serif";
        ctx.fillText(`${formData.bathrooms} Baños`, 795, 863);

        // Row 3: Dimensions
        ctx.font = "24px Arial";
        ctx.fillText("📐", 745, 928);
        ctx.font = "bold 18px 'Helvetica Neue', Arial, sans-serif";
        
        let sizeLabel = "";
        if (formData.propertyType === "Terreno") {
          sizeLabel = `${formData.plotArea} m² Terr.`;
        } else {
          sizeLabel = `${formData.builtArea || formData.plotArea} m² Const.`;
        }
        ctx.fillText(sizeLabel, 795, 923);

        // Row 4: Garage or Agent Advisor
        if (formData.parking && formData.parking !== "0") {
          ctx.font = "24px Arial";
          ctx.fillText("🚗", 745, 982);
          ctx.font = "bold 18px 'Helvetica Neue', Arial, sans-serif";
          ctx.fillText(`${formData.parking} Garaje(s)`, 795, 977);
        } else {
          ctx.font = "22px Arial";
          ctx.fillText("☎️", 745, 982);
          ctx.font = "bold 16px 'Helvetica Neue', Arial, sans-serif";
          ctx.fillText(`${formData.agentPhone || "Contacto"}`, 795, 977);
        }

        // Convert Canvas to downloadable file
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        const cleanedTitle = (result.title || "propiedad")
          .substring(0, 30)
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase();
          
        link.download = `listapro_instagram_${cleanedTitle}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Canvas draw failed inside handler.", err);
        alert("Ocurrió un error al diseñar y exportar la imagen.");
      } finally {
        setIsGeneratingImg(false);
      }
    };

    function drawRoundedRect(
      ctxObj: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) {
      ctxObj.beginPath();
      ctxObj.moveTo(x + radius, y);
      ctxObj.lineTo(x + width - radius, y);
      ctxObj.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctxObj.lineTo(x + width, y + height - radius);
      ctxObj.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctxObj.lineTo(x + radius, y + height);
      ctxObj.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctxObj.lineTo(x, y + radius);
      ctxObj.quadraticCurveTo(x, y, x + radius, y);
      ctxObj.closePath();
    }

    if (formData.coverImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        drawVisualsAndDownload(img);
      };
      img.onerror = () => {
        console.warn("Cover image load failed inside Canvas, running fallback.");
        drawVisualsAndDownload(null);
      };
      img.src = formData.coverImage;
    } else {
      drawVisualsAndDownload(null);
    }
  };


  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Fallback Warning Notice if Gemini limits exceeded */}
      {result.isFallback && (
        <div className="bg-amber-950/20 border border-amber-900 rounded-3xl p-5 flex items-start gap-4">
          <div className="bg-amber-900/30 p-2.5 rounded-xl text-amber-400 border border-amber-800/50 shrink-0">
            <Sparkles size={20} className="animate-pulse text-[#C5A059]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-amber-400 font-serif font-medium text-sm">
              Motor Inteligente de Respaldo Local Activo
            </h4>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              La API de Gemini en la nube ha alcanzado su límite de cuota gratuita (Error 429). 
              Para que puedas seguir trabajando sin interrupciones, <strong>ListaPro</strong> ha activado su generador experto local y redactó una excelente ficha técnica con todos tus datos específicos.
            </p>
            <p className="text-[11px] text-[#C5A059] font-medium font-mono uppercase tracking-wider">
              ¡Las descargas de PDF, la imagen 1:1 para Instagram y el renderizado de video reel siguen funcionando al 100%!
            </p>
          </div>
        </div>
      )}

      {/* Quick Summary Header Alert/Notice of Success */}
      <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-emerald-400 font-serif font-medium text-lg flex items-center gap-2">
            ✨ ¡Contenido Generado Exitosamente!
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            ListaPro ha procesado los datos de tu propiedad en <span className="font-semibold text-slate-100">{formData.address}</span>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:justify-end">
          <button
            onClick={generatePDF}
            disabled={isGeneratingPdf}
            className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white disabled:text-slate-400 text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider shrink-0 flex items-center justify-center gap-2"
          >
            <FileDown size={14} className={isGeneratingPdf ? "animate-bounce" : ""} />
            {isGeneratingPdf ? "Descargando..." : "Descargar PDF"}
          </button>
          <button
            onClick={generateInstagramImage}
            disabled={isGeneratingImg}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white disabled:text-slate-400 text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider shrink-0 flex items-center justify-center gap-2"
          >
            <ImageIcon size={14} className={isGeneratingImg ? "animate-pulse" : ""} />
            {isGeneratingImg ? "Generando..." : "Instagram (1:1)"}
          </button>
          <button
            onClick={generateVideo}
            disabled={isVideoLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-400 text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider shrink-0 flex items-center justify-center gap-2"
          >
            <Film size={14} className={isVideoLoading ? "animate-pulse animate-spin" : ""} />
            {isVideoLoading ? "Generando..." : "Video Reel"}
          </button>
          <button
            onClick={onReset}
            className="bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#0A0B0E] text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider shrink-0 text-center"
          >
            Crear Otra Propiedad
          </button>
        </div>
      </div>

      {/* Real-time Cinematic Centered Progress Overlay/Modal */}
      {isVideoLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#1C1F26] border border-[#C5A059]/40 rounded-3xl p-6 md:p-8 max-w-lg w-full text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Ambient luxury light effect */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 via-[#C5A059] to-yellow-400 h-full transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              />
            </div>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="bg-[#C5A059]/10 p-2.5 rounded-xl border border-[#C5A059]/30">
                <Film size={26} className="text-[#C5A059] animate-spin" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold tracking-wide text-slate-100 uppercase">PROCESANDO VIDEO REEL VERTICAL</h3>
                <p className="text-[10px] text-[#C5A059] font-medium font-mono uppercase tracking-wider">COMPILADOR DE AUDIO & VIDEO REELS</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Estado de Rendición</span>
                <span className="font-mono font-bold text-[#C5A059]">{videoProgress}%</span>
              </div>

              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-white/5 relative">
                <div 
                  className="bg-gradient-to-r from-amber-500 via-[#C5A059] to-yellow-500 h-full transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              <div className="p-4 bg-[#13151A] rounded-2xl border border-white/5 min-h-[60px] flex items-center justify-center">
                <p className="text-xs italic text-slate-300 text-center font-serif leading-relaxed">
                  "{videoStatusText}"
                </p>
              </div>

              <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest pt-2">
                Por favor, mantén esta pestaña activa para asegurar una compilación óptima.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section: Generated Content Views (2/3 columns) */}
        <div className="lg:col-span-2 bg-[#14161C] rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
          
          {/* Tab Navigation */}
          <div className="bg-[#0F1115] border-b border-white/10 flex p-2">
            <button
              onClick={() => setActiveTab("portal")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "portal"
                  ? "bg-[#C5A059] text-[#0A0B0E]"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              <FileText size={16} />
              Ficha para Portales y Web
            </button>
            <button
              onClick={() => setActiveTab("instagram")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "instagram"
                  ? "bg-[#C5A059] text-[#0A0B0E]"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              <Instagram size={16} />
              Instagram / Redes sociales
            </button>
            <button
              onClick={() => setActiveTab("flyer")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer lg:hidden ${
                activeTab === "flyer"
                  ? "bg-[#C5A059] text-[#0A0B0E]"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              <Eye size={16} />
              Vista Previa de Flyer
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-[#14161C]">
            {activeTab === "portal" && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center bg-[#1C1F26] p-2.5 rounded-xl border border-white/5">
                  <span className="text-xs text-slate-400 font-mono">Ficha redactada óptimamente para copiar y pegar directame a portales</span>
                  <button
                    onClick={() => copyToClipboard(`${result.title}\n\n${result.description}`, "portal")}
                    className="text-xs bg-white/5 text-[#C5A059] font-medium py-1.5 px-3 rounded-lg border border-white/10 flex items-center gap-1.5 hover:bg-white/10 transition-colors shadow shadow-black cursor-pointer"
                  >
                    {copiedSection === "portal" ? (
                      <>
                        <Check size={14} className="text-emerald-400 animate-scale-up" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copiar Ficha</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4 flex-1">
                  <h4 className="text-slate-100 font-serif font-light text-lg md:text-xl border-l-[3px] border-[#C5A059] pl-3">
                    {result.title}
                  </h4>
                  <div className="bg-[#1C1F26] border border-white/5 p-5 md:p-6 rounded-2xl text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-line font-serif italic">
                    {result.description}
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3 justify-end items-center">
                  <button
                    onClick={generatePDF}
                    disabled={isGeneratingPdf}
                    className="bg-[#C5A059] hover:bg-[#C5A059]/90 disabled:bg-slate-800 text-[#0A0B0E] disabled:text-slate-400 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <FileDown size={14} className={isGeneratingPdf ? "animate-bounce" : ""} />
                    {isGeneratingPdf ? "Generando..." : "Descargar PDF"}
                  </button>
                  <button
                    onClick={generateInstagramImage}
                    disabled={isGeneratingImg}
                    className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white disabled:text-slate-400 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <ImageIcon size={14} className={isGeneratingImg ? "animate-pulse" : ""} />
                    {isGeneratingImg ? "Generando..." : "Descargar Post IG"}
                  </button>
                  <button
                    onClick={generateVideo}
                    disabled={isVideoLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-400 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer animate-pulse-once"
                  >
                    <Film size={14} className={isVideoLoading ? "animate-spin" : ""} />
                    {isVideoLoading ? "Generando..." : "Descargar Video Reel"}
                  </button>
                  <button
                    onClick={() => handleShareWhatsApp(`${result.title}\n\n${result.description}`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Share2 size={14} />
                    Enviar por WhatsApp
                  </button>
                </div>
              </div>
            )}

            {activeTab === "instagram" && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center bg-[#1C1F26] p-2.5 rounded-xl border border-white/5">
                  <span className="text-xs text-slate-400 font-mono">Formato con emojis creativos y hashtags locales de Cochabamba</span>
                  <button
                    onClick={() => copyToClipboard(result.instagramCopy, "instagram")}
                    className="text-xs bg-white/5 text-[#C5A059] font-medium py-1.5 px-3 rounded-lg border border-white/10 flex items-center gap-1.5 hover:bg-white/10 transition-colors shadow shadow-black cursor-pointer"
                  >
                    {copiedSection === "instagram" ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copiar Caption</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 text-slate-300 border border-white/5 p-5 md:p-6 rounded-2xl text-sm leading-relaxed whitespace-pre-line font-sans shadow-inner m-1 flex-1">
                  {result.instagramCopy}
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3 justify-end items-center">
                  <button
                    onClick={generatePDF}
                    disabled={isGeneratingPdf}
                    className="bg-[#C5A059] hover:bg-[#C5A059]/90 disabled:bg-slate-800 text-[#0A0B0E] disabled:text-slate-400 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <FileDown size={13} className={isGeneratingPdf ? "animate-bounce" : ""} />
                    {isGeneratingPdf ? "Generando..." : "Descargar PDF"}
                  </button>
                  <button
                    onClick={generateInstagramImage}
                    disabled={isGeneratingImg}
                    className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white disabled:text-slate-400 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <ImageIcon size={13} className={isGeneratingImg ? "animate-pulse" : ""} />
                    {isGeneratingImg ? "Generando..." : "Descargar Post IG"}
                  </button>
                  <button
                    onClick={generateVideo}
                    disabled={isVideoLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-400 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Film size={13} className={isVideoLoading ? "animate-spin" : ""} />
                    {isVideoLoading ? "Generando..." : "Descargar Video Reel"}
                  </button>
                  <button
                    onClick={generateCarousel}
                    disabled={isGeneratingCarousel}
                    className="bg-gradient-to-r from-[#C5A059] to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-900/20 cursor-pointer hover:-translate-y-0.5"
                  >
                    <GalleryHorizontalEnd size={13} className={isGeneratingCarousel ? "animate-pulse" : ""} />
                    {isGeneratingCarousel ? "Generando..." : "Generar Carrusel IG"}
                  </button>
                  <button
                    onClick={() => handleShareWhatsApp(result.instagramCopy)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Share2 size={13} />
                    Enviar a WhatsApp
                  </button>
                </div>
              </div>
            )}

            {activeTab === "flyer" && (
              <div className="lg:hidden p-4">
                <h4 className="text-slate-400 text-xs font-mono mb-4">Vista en Dispositivo Móvil del Flyer ListaPro</h4>
                <FlyerPreview result={result} formData={formData} />
              </div>
            )}

          </div>
        </div>

        {/* Right Section: Interactive Real Estate Flyer Card (1/3 column) */}
        <div className="hidden lg:block lg:col-span-1 space-y-4">
          <h3 className="text-slate-400 font-mono text-xs tracking-wide uppercase px-1 flex items-center gap-1.5">
            <Columns size={12} />
            Flyer / Volante Digital
          </h3>
          <FlyerPreview result={result} formData={formData} />
        </div>

      </div>

      {/* Carousel Generation Modal */}
      {(isGeneratingCarousel || carouselPreviews.length > 0) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0B0E]/90 backdrop-blur-sm p-4">
          <div className="bg-[#14161C] border border-[#C5A059]/30 p-8 rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col items-center max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif text-[#C5A059] mb-4 flex items-center gap-2">
              <Sparkles size={24} />
              Generador de Carrusel Premium
            </h2>
            
            {isGeneratingCarousel ? (
              <div className="w-full flex flex-col items-center gap-4 py-12">
                <div className="w-full max-w-md bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-[#C5A059] h-full transition-all duration-300 shadow-[0_0_10px_rgba(197,160,89,0.8)]" style={{ width: `${carouselProgress}%` }} />
                </div>
                <p className="text-slate-300 font-mono text-xs animate-pulse text-center max-w-sm">{carouselStatusText}</p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-6">
                <p className="text-slate-300 text-sm">¡Tu carrusel está listo! Se ha descargado un archivo ZIP con tus diseños optimizados para Instagram.</p>
                
                <div className="flex gap-4 overflow-x-auto w-full pb-6 snap-x custom-scrollbar">
                  {carouselPreviews.map((preview, i) => (
                    <div key={i} className="min-w-[240px] aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/10 snap-center shrink-0 shadow-xl relative group">
                      <img src={preview} alt={`Slide ${i+1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-[#C5A059] px-3 py-1 rounded-full">Slide 0{i+1}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={generateCarousel}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2"
                  >
                    Regenerar Diseño
                  </button>
                  <button
                    onClick={() => setCarouselPreviews([])}
                    className="bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#0A0B0E] font-bold py-2.5 px-8 rounded-xl transition-colors shadow-lg"
                  >
                    Aceptar y Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

/* Internal Visual Flyer Preview Component */
function FlyerPreview({ result, formData }: { result: GeneratedResult; formData: PropertyFormState }) {
  return (
    <div className="bg-[#14161C] rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col flex-1 transform transition-transform hover:scale-[1.01]">
      
      {/* Flyer Header Cover Image */}
      <div className="relative h-48 md:h-56 bg-slate-950">
        {formData.coverImage ? (
          <img
            src={formData.coverImage}
            alt="Foto portada de la propiedad"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-950 text-slate-500">
            <MapPin size={40} className="mb-2" />
            <span className="text-xs">No se cargó foto de portada</span>
          </div>
        )}
        
        {/* Badges on picture */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className="bg-[#C5A059] text-[#0A0B0E] text-[9px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
            {formData.propertyType}
          </span>
          <span className="bg-slate-950/80 backdrop-blur text-[#C5A059] border border-[#C5A059]/30 text-[9px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
            EN {formData.operation}
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 bg-[#0F1115]/95 backdrop-blur-md border border-white/10 shadow-xl px-3 py-1.5 rounded-xl text-right">
          <p className="text-[9px] text-slate-450 text-slate-450 uppercase tracking-widest font-mono text-[8px]">Precio Especial</p>
          <p className="text-xs font-mono font-bold text-[#C5A059] leading-none">
            {Number(formData.priceUsd).toLocaleString("es-BO")} USD
          </p>
          <p className="text-[10px] font-mono text-slate-300 leading-none mt-0.5">
            ≈ {Number(formData.priceBob).toLocaleString("es-BO")} BOB
          </p>
        </div>
      </div>

      {/* Flyer details body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-[#14161C]">
        
        {/* Title and location */}
        <div className="space-y-1">
          <p className="text-[10px] text-[#C5A059] font-mono uppercase tracking-widest">{formData.cityState}</p>
          <h4 className="text-slate-100 font-serif font-light text-sm line-clamp-1">
            {result.title || "Propiedad en Cochabamba"}
          </h4>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin size={12} className="text-[#C5A059] shrink-0" />
            <span className="truncate">{formData.address}</span>
          </p>
        </div>

        {/* Highlight points generated by AI */}
        {result.keyHighlights && result.keyHighlights.length > 0 && (
          <div className="bg-[#1C1F26] rounded-2xl p-3 border border-white/5">
            <p className="text-[10px] text-[#C5A059] uppercase tracking-widest font-semibold mb-1.5">
              Destacados Premium:
            </p>
            <ul className="space-y-1.5">
              {result.keyHighlights.slice(0, 3).map((h, index) => (
                <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5 leading-tight font-serif italic">
                  <span className="text-[#C5A059] font-bold shrink-0">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estimated tagline or comment */}
        {result.estimatedValueTagline && (
          <p className="text-[11px] text-[#C5A059] text-center italic bg-[#C5A059]/10 border border-[#C5A059]/20 py-1.5 px-2 rounded-xl">
            "{result.estimatedValueTagline}"
          </p>
        )}

        {/* Structural Metrics mini grid */}
        <div className="grid grid-cols-3 gap-2 border-t border-b border-dashed border-white/10 py-3 text-center">
          <div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide">Área total</p>
            <p className="text-xs font-mono font-bold text-[#C5A059]">{formData.plotArea} m²</p>
          </div>
          {formData.propertyType !== "Terreno" ? (
            <>
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-wide">Dormitorios</p>
                <p className="text-xs font-mono font-bold text-slate-200">{formData.bedrooms} Dorms</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-wide">Construido</p>
                <p className="text-xs font-mono font-bold text-slate-200">{formData.builtArea} m²</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-wide">Ideal para</p>
                <p className="text-xs font-semibold text-slate-200 truncate">Inversión</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-wide">Tipo</p>
                <p className="text-xs font-semibold text-[#C5A059]">Lote</p>
              </div>
            </>
          )}
        </div>

        {/* Extra photos count / preview band */}
        {formData.extraImages && formData.extraImages.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[9px] text-slate-450 uppercase tracking-wider font-mono">Fotografías Adicionales ({formData.extraImages.length})</p>
            <div className="flex gap-1.5">
              {formData.extraImages.map((img, idx) => (
                <div key={idx} className="w-10 h-10 rounded overflow-hidden border border-white/10 bg-slate-950 shrink-0">
                  <img src={img} alt="Mini-preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agent footer badge */}
        <div className="bg-[#0F1115] border border-white/5 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {formData.agentPhoto ? (
              <img src={formData.agentPhoto} alt="Agente" className="w-8 h-8 rounded-full object-cover border border-[#C5A059]" />
            ) : (
              <div className="w-8 h-8 rounded-full border border-[#C5A059] bg-[#1C1F26] flex items-center justify-center">
                <User size={14} className="text-[#C5A059]" />
              </div>
            )}
            <div className="space-y-0.5">
              <p className="text-[8px] text-slate-400 uppercase tracking-widest leading-none">Agente Autorizado</p>
              <p className="text-xs font-bold leading-none text-[#C5A059]">{formData.agentName || "ListaPro"}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <a
              href={`tel:${formData.agentPhone}`}
              title="Llamar"
              className="bg-white/5 hover:bg-white/10 p-2 rounded text-[#C5A059] border border-white/10 transition-colors"
            >
              <Phone size={13} />
            </a>
            <a
              href={`mailto:${formData.agentEmail}`}
              title="Enviar correo"
              className="bg-white/5 hover:bg-white/10 p-2 rounded text-[#C5A059] border border-white/10 transition-colors"
            >
              <Mail size={13} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

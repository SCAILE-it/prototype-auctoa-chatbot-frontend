import React from "react";
import { useFormContext } from "react-hook-form";
import { PropertyFormData } from "@/lib/formSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Star, TrendingUp, FileText, CheckCircle } from "lucide-react";

const NextStepsStep: React.FC = () => {
  const { watch } = useFormContext<PropertyFormData>();
  const formData = watch();

  // Calculate estimated value based on form data
  const getEstimatedValue = () => {
    const space = parseInt(formData.livingSpace || "0");
    const year = parseInt(formData.constructionYear || "2000");
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    let basePrice = 3500; // Base price per m²
    
    // Adjust based on condition
    if (formData.condition === "excellent") basePrice *= 1.2;
    else if (formData.condition === "good") basePrice *= 1.05;
    else if (formData.condition === "poor") basePrice *= 0.8;

    // Adjust based on age
    if (age < 10) basePrice *= 1.1;
    else if (age > 30) basePrice *= 0.9;

    return Math.round(space * basePrice);
  };

  const estimatedValue = getEstimatedValue();
  const pricePerSqm = Math.round(estimatedValue / parseInt(formData.livingSpace || "1"));

  const handleBookExpertCall = () => {
    // Here you would typically redirect to a booking system or open a calendar widget
    console.log("Booking expert call...");
    alert("Weiterleitung zum Terminbuchungssystem...");
  };

  const handleDownloadReport = () => {
    // Here you would generate and download a PDF report
    console.log("Downloading report...");
    alert("Report wird generiert und heruntergeladen...");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Strategische Next Steps</h2>
        <p className="text-gray-600">Ihre Immobilienbewertung ist bereit. Hier sind Ihre nächsten Schritte.</p>
      </div>

      <div className="grid gap-6">
        {/* Bewertungsergebnis */}
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Ihr Bewertungsergebnis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white p-6 rounded-xl shadow-sm border border-amber-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Geschätzter Marktwert</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {estimatedValue.toLocaleString('de-DE')} €
                  </p>
                  <p className="text-sm text-gray-500">
                    {pricePerSqm.toLocaleString('de-DE')} €/m²
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg border border-amber-100">
                <h4 className="font-medium text-gray-900 mb-1">Objekttyp</h4>
                <p className="text-gray-600 text-sm capitalize">{formData.propertyType}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-amber-100">
                <h4 className="font-medium text-gray-900 mb-1">Wohnfläche</h4>
                <p className="text-gray-600 text-sm">{formData.livingSpace} m²</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-amber-100">
                <h4 className="font-medium text-gray-900 mb-1">Zustand</h4>
                <p className="text-gray-600 text-sm capitalize">{formData.condition}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empfohlene Nächste Schritte */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Empfohlene nächste Schritte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">1. Kostenloses Expertengespräch</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    Lassen Sie Ihre Bewertung von einem zertifizierten Immobilienexperten validieren 
                    und erhalten Sie detaillierte Marktanalysen.
                  </p>
                  <Button 
                    onClick={handleBookExpertCall}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Gratis Expertengespräch anfragen
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 mb-1">2. Detaillierter Bewertungsreport</h4>
                  <p className="text-green-700 text-sm mb-3">
                    Erhalten Sie einen umfassenden PDF-Report mit Marktvergleichen, 
                    Preisentwicklungen und Verkaufsempfehlungen.
                  </p>
                  <Button 
                    onClick={handleDownloadReport}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Report herunterladen
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <Star className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-amber-900 mb-1">3. Verkaufsstrategie entwickeln</h4>
                  <p className="text-amber-700 text-sm">
                    Basierend auf Ihrer Bewertung entwickeln wir gemeinsam mit Ihnen 
                    die optimale Verkaufsstrategie für Ihre Immobilie.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warum Auctoa */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Warum Auctoa wählen?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm text-gray-700">Zertifizierte Immobilienexperten</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm text-gray-700">Kostenlose Erstberatung</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm text-gray-700">Transparente Preisgestaltung</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm text-gray-700">Erfolgsgarantie beim Verkauf</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NextStepsStep;

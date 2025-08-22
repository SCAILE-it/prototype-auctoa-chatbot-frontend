import React from "react";
import { useFormContext } from "react-hook-form";
import { PropertyFormData } from "@/lib/formSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, MapPin, Home } from "lucide-react";

const StatusQuoAnalysisStep: React.FC = () => {
  const { watch } = useFormContext<PropertyFormData>();
  const formData = watch();

  // Mock analysis data based on form inputs
  const getMarketAnalysis = () => {
    const space = parseInt(formData.livingSpace || "0");
    const year = parseInt(formData.constructionYear || "2000");
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    return {
      estimatedValue: space * (age < 10 ? 4500 : age < 20 ? 3800 : 3200),
      marketTrend: age < 15 ? "steigend" : "stabil",
      locationScore: 8.2,
      conditionScore: formData.condition === "excellent" ? 9.5 : 
                     formData.condition === "good" ? 7.8 : 
                     formData.condition === "fair" ? 6.2 : 4.5
    };
  };

  const analysis = getMarketAnalysis();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Status Quo Analyse</h2>
        <p className="text-gray-600">Hier ist eine Übersicht der erfassten Daten und erste Markteinschätzungen.</p>
      </div>

      <div className="grid gap-6">
        {/* Objektübersicht */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Home className="w-5 h-5 text-amber-500" />
              Objektübersicht
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Typ</h4>
                <p className="text-gray-600">{formData.propertyType || "Nicht angegeben"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Größe</h4>
                <p className="text-gray-600">{formData.livingSpace || "0"} m²</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Baujahr</h4>
                <p className="text-gray-600">{formData.constructionYear || "Nicht angegeben"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Zimmer</h4>
                <p className="text-gray-600">{formData.numberOfRooms || "Nicht angegeben"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Zustand</h4>
                <p className="text-gray-600">{formData.condition || "Nicht angegeben"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Stockwerk</h4>
                <p className="text-gray-600">{formData.floor || "Nicht angegeben"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Standort */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin className="w-5 h-5 text-amber-500" />
              Standortanalyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Adresse</h4>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Score: {analysis.locationScore}/10
                </Badge>
              </div>
              <p className="text-gray-600">{formData.address || "Nicht angegeben"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Marktanalyse */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              Erste Markteinschätzung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Geschätzter Wert</h4>
                <p className="text-2xl font-bold text-green-600">
                  {analysis.estimatedValue.toLocaleString('de-DE')} €
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Markttrend</h4>
                <p className="text-lg font-semibold text-blue-600 capitalize">
                  {analysis.marketTrend}
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <Home className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Zustandsbewertung</h4>
                <p className="text-lg font-semibold text-amber-600">
                  {analysis.conditionScore}/10
                </p>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2">💡 Hinweis</h4>
              <p className="text-amber-700 text-sm">
                Dies ist eine erste automatisierte Einschätzung basierend auf Ihren Angaben. 
                Für eine detaillierte Bewertung empfehlen wir ein Expertengespräch.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusQuoAnalysisStep;

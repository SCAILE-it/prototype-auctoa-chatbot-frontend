import React from "react";
import { useFormContext } from "react-hook-form";
import { PropertyFormData, propertyTypeOptions, apartmentTypeOptions, conditionOptions, equipmentOptions, renovationOptions } from "@/lib/formSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Home, Wrench, Zap, FileText } from "lucide-react";
import DocumentUpload from "../DocumentUpload";

interface FormFieldProps {
  label: string;
  name: keyof PropertyFormData;
  required?: boolean;
  type?: "text" | "number";
  placeholder?: string;
  children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  name, 
  required = false, 
  type = "text", 
  placeholder,
  children 
}) => {
  const { register, formState: { errors } } = useFormContext<PropertyFormData>();
  const error = errors[name];

  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-[9px] font-medium text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-[9px]">!</span>}
      </Label>
      {children || (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`h-7 text-[11px] ${error ? "border-red-500 focus:ring-red-500" : ""}`}
        />
      )}
      {error && (
        <p className="text-red-500 text-[9px] mt-1">{error.message}</p>
      )}
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  name: keyof PropertyFormData;
  required?: boolean;
  placeholder?: string;
  options: readonly { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ 
  label, 
  name, 
  required = false, 
  placeholder = "Bitte auswählen",
  options 
}) => {
  const { setValue, watch, formState: { errors } } = useFormContext<PropertyFormData>();
  const value = watch(name);
  const error = errors[name];

  return (
    <div className="space-y-1">
      <Label className="text-[9px] font-medium text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-[9px]">!</span>}
      </Label>
      <Select 
        value={value as string || ""} 
        onValueChange={(val) => setValue(name, val)}
      >
        <SelectTrigger className={`h-7 text-[11px] ${error ? "border-red-500 focus:ring-red-500" : ""}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-[11px]">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-[9px] mt-1">{error.message}</p>
      )}
    </div>
  );
};

const DataCollectionStep: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="text-center mb-2">
        <h2 className="text-[18px] leading-[20px] font-bold text-gray-900 mb-1">Datenerfassung</h2>
        <p className="text-[12px] leading-[110%] text-gray-600">Bitte geben Sie die Informationen zu Ihrer Immobilie ein.</p>
      </div>

      <div className="space-y-3">
        {/* Standort Section */}
        <div className="space-y-1">
          <h3 className="flex items-center gap-1 text-[12px] leading-[110%] font-semibold text-gray-900 uppercase">
            <MapPin className="w-4 h-4 text-amber-500" />
            STANDORT
          </h3>
          <FormField
            label="Adresse"
            name="address"
            required
            placeholder="Bitte auswählen"
          />
        </div>

        {/* Objekttyp & Basisdaten Section */}
        <div className="space-y-1">
          <h3 className="flex items-center gap-1 text-[12px] leading-[110%] font-semibold text-gray-900 uppercase">
            <Home className="w-4 h-4 text-amber-500" />
            OBJEKTTYP & BASISDATEN
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <SelectField
              label="Immobilientyp"
              name="propertyType"
              required
              options={propertyTypeOptions}
            />
            
            <SelectField
              label="Wohnungstyp"
              name="apartmentType"
              required
              options={apartmentTypeOptions}
            />
            
            <FormField
              label="Baujahr"
              name="constructionYear"
              required
              placeholder="Bitte auswählen"
            />
            
            <FormField
              label="Gesamtwohnfläche (m²)"
              name="livingSpace"
              required
              placeholder="Bitte auswählen"
            />
            
            <FormField
              label="Anzahl der Zimmer"
              name="numberOfRooms"
              required
              placeholder="Bitte auswählen"
            />
            
            <FormField
              label="Stockwerk"
              name="floor"
              required
              placeholder="Bitte auswählen"
            />
          </div>
        </div>

        {/* Zustand & Ausstattung Section */}
        <div className="space-y-1">
          <h3 className="flex items-center gap-1 text-[12px] leading-[110%] font-semibold text-gray-900 uppercase">
            <Wrench className="w-4 h-4 text-amber-500" />
            ZUSTAND & AUSSTATTUNG
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <SelectField
              label="Zustand"
              name="condition"
              required
              options={conditionOptions}
            />
            
            <SelectField
              label="Ausstattung"
              name="equipment"
              required
              options={equipmentOptions}
            />
            
            <div className="col-span-2">
              <SelectField
                label="Letzte Modernisierung"
                name="lastRenovation"
                required
                options={renovationOptions}
              />
            </div>
          </div>
        </div>

        {/* Energie & Rechtliche Aspekte (Optional) */}
        <div className="space-y-1">
          <h3 className="flex items-center gap-1 text-[12px] leading-[110%] font-semibold text-gray-900 uppercase">
            <Zap className="w-4 h-4 text-amber-500" />
            ENERGIE & RECHTLICHE ASPEKTE (OPTIONAL)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="Energiekennwert (kWh/m²a)"
              name="energyValue"
              placeholder="Bitte auswählen"
            />
            
            <FormField
              label="Ist-Miete (€)"
              name="currentRent"
              placeholder="Bitte auswählen"
            />
            
            <FormField
              label="Soll-Miete (€)"
              name="targetRent"
              placeholder="Bitte auswählen"
            />
            
            <FormField
              label="Rechtliche Hinweise"
              name="legalAspects"
              placeholder="Bitte auswählen"
            />
          </div>
        </div>

        {/* Sonstige Angaben */}
        <div className="space-y-1">
          <h3 className="flex items-center gap-1 text-[12px] leading-[110%] font-semibold text-gray-900 uppercase">
            <FileText className="w-4 h-4 text-amber-500" />
            SONSTIGE ANGABEN (OPTIONAL)
          </h3>
          <div className="space-y-1">
            <Label className="text-[9px] leading-[110%] font-medium text-gray-700">
              Ergänzende Infos
            </Label>
            <Textarea
              {...useFormContext<PropertyFormData>().register("additionalInfo")}
              placeholder=""
              className="min-h-[45px] resize-none text-[11px] leading-[110%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCollectionStep;

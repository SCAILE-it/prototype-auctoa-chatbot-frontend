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
      <Label htmlFor={name} className="text-sm font-medium flex items-center" style={{ color: '#999999' }}>
        {label}
        {required && <span className="ml-1 align-middle text-[12px] font-medium" style={{ color: '#999999' }}>*</span>}
        {required && (
          <span className="ml-1 inline-flex items-center justify-center align-middle text-[10px] font-bold text-[#F97316] bg-[#FDEAD7] rounded-full size-4">!</span>
        )}
      </Label>
      {children || (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`mt-1 block w-full rounded-md bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.22)] placeholder-[#999] text-[#1F2937] focus:ring-2 focus:ring-[#F97316] px-3.5 py-2.5 text-sm ${error ? "border-red-500" : ""}`}
        />
      )}
      {error && (
        <p className="text-xs text-red-600 mt-1">{error.message}</p>
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
      <Label className="text-sm font-medium flex items-center" style={{ color: '#999999' }}>
        {label}
        {required && <span className="ml-1 align-middle text-[12px] font-medium" style={{ color: '#999999' }}>*</span>}
        {required && (
          <span className="ml-1 inline-flex items-center justify-center align-middle text-[10px] font-bold text-[#F97316] bg-[#FDEAD7] rounded-full size-4">!</span>
        )}
      </Label>
      <Select 
        value={value as string || ""} 
        onValueChange={(val) => setValue(name, val)}
      >
        <SelectTrigger className={`mt-1 block w-full rounded-md bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.22)] placeholder-[#999] text-[#1F2937] focus:ring-2 focus:ring-[#F97316] px-3.5 py-2.5 text-sm ${error ? "border-red-500" : ""}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-sm">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error.message}</p>
      )}
    </div>
  );
};

const DataCollectionStep: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-left">
        <h1 className="text-xl md:text-[24px] font-semibold tracking-[.02em] mb-3" style={{ color: '#333', fontFamily: 'Fraunces, ui-serif, Georgia, serif' }}>Datenerfassung</h1>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Standort Section */}
          <section aria-labelledby="standort">
            <h3 id="standort" className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2 mb-3" style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', color: '#333333' }}>
              <MapPin className="w-4 h-4" style={{ color: '#333333' }} />
              STANDORT
            </h3>
            <div>
              <FormField
                label="Adresse"
                name="address"
                required
                placeholder="Bitte auswählen"
              />
            </div>
          </section>

          {/* Objekttyp & Basisdaten Section */}
          <section aria-labelledby="basis">
            <h3 id="basis" className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2 mb-3" style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', color: '#333333' }}>
              <Home className="w-4 h-4" style={{ color: '#333333' }} />
              OBJEKTTYP & BASISDATEN
            </h3>
            <div className="space-y-3">
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
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Zustand & Ausstattung Section */}
          <section aria-labelledby="zustand">
            <h3 id="zustand" className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2 mb-3" style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', color: '#333333' }}>
              <Wrench className="w-4 h-4" style={{ color: '#333333' }} />
              ZUSTAND & AUSSTATTUNG
            </h3>
            <div className="space-y-3">
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
              
              <SelectField
                label="Letzte Modernisierung"
                name="lastRenovation"
                required
                options={renovationOptions}
              />
            </div>
          </section>

          {/* Energie & Rechtliche Aspekte (Optional) */}
          <section aria-labelledby="energie">
            <h3 id="energie" className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2 mb-3" style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', color: '#333333' }}>
              <Zap className="w-4 h-4" style={{ color: '#333333' }} />
              ENERGIE & RECHTLICHE ASPEKTE (OPTIONAL)
            </h3>
            <div className="space-y-3">
              <FormField
                label="Energiekennwert (kWh/m²a)"
                name="energyValue"
                placeholder="Bitte auswählen"
              />
              
              <div className="grid grid-cols-2 gap-3">
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
              </div>
              
              <FormField
                label="Rechtliche Hinweise"
                name="legalAspects"
                placeholder="Bitte auswählen"
              />
            </div>
          </section>

          {/* Sonstige Angaben */}
          <section aria-labelledby="sonstiges">
            <h3 id="sonstiges" className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2 mb-3" style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', color: '#333333' }}>
              <FileText className="w-4 h-4" style={{ color: '#333333' }} />
              SONSTIGE ANGABEN (OPTIONAL)
            </h3>
            <div>
              <label className="block">
                <span className="text-sm font-medium flex items-center" style={{ color: '#999999' }}>Ergänzende Infos</span>
                <Textarea
                  {...useFormContext<PropertyFormData>().register("additionalInfo")}
                  placeholder="Bitte auswählen"
                  rows={3}
                  className="mt-1 block w-full rounded-md bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.22)] placeholder-[#999] text-[#1F2937] focus:ring-2 focus:ring-[#F97316] px-3.5 py-2.5 text-sm"
                />
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataCollectionStep;

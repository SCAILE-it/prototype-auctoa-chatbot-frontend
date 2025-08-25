import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertyFormData, propertyFormSchema } from "@/lib/formSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DataCollectionStep from "./steps/DataCollectionStep";
import StatusQuoAnalysisStep from "./steps/StatusQuoAnalysisStep";
import NextStepsStep from "./steps/NextStepsStep";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  totalSteps, 
  stepTitles 
}) => {
  const steps = [
    { n: 1, label: 'Datenerfassung' },
    { n: 2, label: 'Status Quo Analyse' },
    { n: 3, label: 'Strategische Next Steps' },
  ];
  
  return (
    <nav role="tablist" aria-label="Schritte" className="pb-2">
      <div className="flex w-full items-center gap-3 text-sm bg-[rgba(238,238,238,0.88)] rounded-[3px] px-3 py-2">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-3">
            <button
              role="tab"
              aria-selected={s.n === currentStep}
              className={[
                'flex items-center gap-2 px-2 py-2 rounded-md',
                s.n === currentStep ? 'text-black' : 'text-[#999999]',
              ].join(' ')}
            >
              <span className={[
                'inline-flex items-center justify-center size-6 rounded-full border',
                s.n === currentStep ? 'border-black text-black bg-white' : 'border-black/20 text-[#999999] bg-white'
              ].join(' ')}>{s.n}</span>
              <span className="whitespace-nowrap" style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', fontWeight: 700, color: s.n === currentStep ? '#333333' : '#999999' }}>{s.label}</span>
            </button>
            {i < steps.length - 1 && <span className="text-[#999999]">›</span>}
          </div>
        ))}
      </div>
    </nav>
  );
};

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const stepTitles = ["Datenerfassung", "Status Quo Analyse", "Strategische Next Steps"];

  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    mode: "onChange",
    defaultValues: {
      address: "",
      propertyType: "",
      apartmentType: "",
      constructionYear: "",
      livingSpace: "",
      numberOfRooms: "",
      floor: "",
      condition: "",
      equipment: "",
      lastRenovation: "",
      energyValue: "",
      currentRent: "",
      targetRent: "",
      legalAspects: "",
      additionalInfo: "",
    },
  });

  const { trigger, formState } = methods;

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof PropertyFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "address",
          "propertyType", 
          "apartmentType",
          "constructionYear",
          "livingSpace",
          "numberOfRooms",
          "floor",
          "condition",
          "equipment",
          "lastRenovation"
        ];
        break;
      case 2:
        // Add validation for step 2 if needed
        return true;
      case 3:
        // Add validation for step 3 if needed
        return true;
      default:
        return true;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: PropertyFormData) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DataCollectionStep />;
      case 2:
        return <StatusQuoAnalysisStep />;
      case 3:
        return <NextStepsStep />;
      default:
        return <DataCollectionStep />;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
      // Check if required fields for step 1 have errors
      const step1Fields = [
        "address", "propertyType", "apartmentType", "constructionYear",
        "livingSpace", "numberOfRooms", "floor", "condition", "equipment", "lastRenovation"
      ];
      return step1Fields.some(field => formState.errors[field as keyof PropertyFormData]);
    }
    return false;
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="w-full h-full flex flex-col">
        <Card className="w-full max-w-[920px] h-[800px] bg-[#FDFAF6] rounded-[3px] shadow-[2px_2px_12px_0_rgba(0,0,0,0.2)] border-0 flex flex-col">
          <CardContent className="p-6 md:p-8 flex-1 flex flex-col overflow-hidden">
            {/* Step Indicator */}
            <div className="flex-shrink-0 mb-2">
              <StepIndicator 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
                stepTitles={stepTitles}
              />
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto">
              {renderCurrentStep()}
            </div>

            {/* Bottom section with text and button */}
            <div className="space-y-2 flex-shrink-0">
              <p className="text-[12px] text-[#f97373] mt-2">
                Bitte ergänze fehlende Informationen, um den Immobilienwert berechnen zu lassen.
              </p>
              
              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full rounded-md py-3 font-medium shadow-sm uppercase tracking-[.06em]"
                  style={{ 
                    fontFamily: 'Fraunces, ui-serif, Georgia, serif', 
                    backgroundColor: isNextDisabled() ? '#eeeeee' : '#F97316', 
                    color: isNextDisabled() ? '#999999' : '#ffffff' 
                  }}
                  disabled={isNextDisabled()}
                >
                  Bewertung erhalten
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;

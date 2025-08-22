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
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {stepTitles.map((title, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                index + 1 <= currentStep
                  ? "bg-amber-500 text-white"
                  : index + 1 === currentStep + 1
                  ? "bg-amber-100 text-amber-700 border-2 border-amber-500"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "text-xs mt-2 text-center max-w-[100px]",
                index + 1 <= currentStep
                  ? "text-amber-700 font-medium"
                  : "text-gray-500"
              )}
            >
              {title}
            </span>
          </div>
          {index < totalSteps - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-2 transition-colors",
                index + 1 < currentStep
                  ? "bg-amber-500"
                  : "bg-gray-200"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
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
        <Card className="w-full max-w-[708px] h-[800px] bg-[#FAF4E6] backdrop-blur-[10px] border-0 shadow-xl flex flex-col rounded-[15px]">
          <CardContent className="px-[16px] py-[12px] flex-1 flex flex-col overflow-hidden">
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
            <div className="flex justify-between items-end mt-3 flex-shrink-0">
              <p className="text-[#FF8C42] text-[11px] leading-[120%] max-w-[60%]">
                Bitte ergänze fehlende Informationen, um den Immobilienwert berechnen zu lassen.
              </p>
              <Button
                type="submit"
                className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-[12px] font-medium"
                disabled={isNextDisabled()}
              >
                Bewertung erhalten
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;

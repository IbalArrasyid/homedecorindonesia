"use client";

import { Check } from "lucide-react";

const CheckoutStepper = ({ currentStep }) => {
    const steps = [
        { number: 1, label: "Information" },
        { number: 2, label: "Payment" },
        { number: 3, label: "Finish" }
    ];

    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.number} className="flex items-center">
                            {/* Step Circle */}
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors duration-300
                    ${isCompleted
                                            ? "bg-green-500 border-green-500 text-white"
                                            : isCurrent
                                                ? "bg-black border-black text-white"
                                                : "bg-white border-gray-300 text-gray-400"
                                        }`}
                                >
                                    {isCompleted ? <Check size={16} /> : step.number}
                                </div>

                                {/* Label */}
                                <div
                                    className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors duration-300
                    ${isCurrent ? "text-black" : isCompleted ? "text-green-600" : "text-gray-400"}`}
                                >
                                    {step.label}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {!isLast && (
                                <div
                                    className={`w-12 sm:w-20 h-[2px] mx-2 sm:mx-4 transition-colors duration-300
                    ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckoutStepper;

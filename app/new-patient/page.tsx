"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowLeft,
  ArrowRight,
  Globe,
} from "lucide-react";
import { COPY, DEMO_DATA } from "@/lib/constants";
import Link from "next/link";

type Step = "verify" | "consent" | "coverage" | "history" | "review";

interface IntakeData {
  phone: string;
  otp: string;
  consents: Record<string, boolean>;
  insuranceFront: File | null;
  insuranceBack: File | null;
  answers: Record<string, string>;
  language: "en" | "es";
}

export default function NewPatientIntake() {
  const searchParams = useSearchParams();
  const fromVoice = searchParams?.get('from') === 'voice';

  const [step, setStep] = useState<Step>("verify");
  const [data, setData] = useState<IntakeData>({
    phone: "",
    otp: "",
    consents: {},
    insuranceFront: null,
    insuranceBack: null,
    answers: {},
    language: "en",
  });
  const [eligibility, setEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [voiceDataLoaded, setVoiceDataLoaded] = useState(false);

  // Load data from voice chat if coming from voice demo
  useEffect(() => {
    if (fromVoice && !voiceDataLoaded) {
      try {
        const voiceChatDataStr = sessionStorage.getItem('voiceChatData');
        if (voiceChatDataStr) {
          const voiceChatData = JSON.parse(voiceChatDataStr);

          // Pre-fill data from voice chat
          const updates: Partial<IntakeData> = {
            language: voiceChatData.language || 'en',
          };

          // Pre-fill phone if collected
          if (voiceChatData.phone) {
            updates.phone = voiceChatData.phone;
          }

          // Pre-fill answers with name and DOB
          const answers: Record<string, string> = {};
          if (voiceChatData.firstName || voiceChatData.lastName) {
            const fullName = [voiceChatData.firstName, voiceChatData.lastName]
              .filter(Boolean)
              .join(' ');
            answers['name'] = fullName;
          }
          if (voiceChatData.dateOfBirth) {
            answers['dob'] = voiceChatData.dateOfBirth;
          }

          if (Object.keys(answers).length > 0) {
            updates.answers = { ...data.answers, ...answers };
          }

          updateData(updates);

          // Skip verify step if we have consent
          if (voiceChatData.consentGiven) {
            setStep("consent");
          }

          setVoiceDataLoaded(true);

          // Clear the session storage
          sessionStorage.removeItem('voiceChatData');
        }
      } catch (error) {
        console.error('Error loading voice chat data:', error);
      }
    }
  }, [fromVoice, voiceDataLoaded]);

  const updateData = (updates: Partial<IntakeData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const toggleLanguage = () => {
    updateData({ language: data.language === "en" ? "es" : "en" });
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const handleVerify = async () => {
    setLoading(true);
    // Mock OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setStep("consent");
  };

  const handleConsent = () => {
    const allConsented = COPY.consent.types.every(
      (type) => data.consents[type.id]
    );
    if (allConsented) {
      setStep("coverage");
    }
  };

  const handleCoverageUpload = async () => {
    if (data.insuranceFront && data.insuranceBack) {
      setLoading(true);
      // Mock OCR + eligibility check
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await fetch("/api/mocks/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "demo-session",
          payerId: "BCBS-FL",
          memberId: "ABC123456789",
          dob: DEMO_DATA.patient.dob,
        }),
      });
      const result = await response.json();
      setEligibility(result);
      setLoading(false);
      setStep("history");
    }
  };

  const handleHistoryComplete = () => {
    setStep("review");
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Mock EHR write-back
    await fetch("/api/mocks/ehr-writeback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "demo-session",
        patient: DEMO_DATA.patient,
        coverage: DEMO_DATA.coverage,
        consents: data.consents,
        answers: data.answers,
      }),
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    // In real app, would redirect to confirmation
  };

  return (
    <div className="min-h-screen bg-[--surface-alt]">
      {/* Voice Data Pre-fill Notice */}
      {fromVoice && voiceDataLoaded && (
        <Alert className="mx-auto max-w-4xl mt-4 bg-[--brand-primary]/10 border-[--brand-primary]/30">
          <CheckCircle2 className="w-4 h-4 text-[--brand-primary]" />
          <AlertTitle>Information loaded from voice chat</AlertTitle>
          <AlertDescription className="text-sm">
            We've pre-filled your information from your conversation with Allie. Please review and complete the remaining fields.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <header className="border-b border-[--border] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[--brand-primary] flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 18c-3.5 0-6-2-6-6V6c0-4 2.5-6 6-6s6 2 6 6v6c0 4-2.5 6-6 6z"
                  fill="white"
                />
                <path
                  d="M7 12c1 1.5 4 1.5 5 0"
                  stroke="#0EA5A0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="7.5" cy="9" r="1" fill="#0EA5A0" />
                <circle cx="12.5" cy="9" r="1" fill="#0EA5A0" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[--ink]">IntakePal</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4 mr-2" />
            {data.language === "en" ? "Español" : "English"}
          </Button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-[--border]">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between text-xs">
            <span className={step === "verify" ? "text-[--brand-primary] font-medium" : "text-[--muted-ink]"}>
              Verify
            </span>
            <span className={step === "consent" ? "text-[--brand-primary] font-medium" : "text-[--muted-ink]"}>
              Consent
            </span>
            <span className={step === "coverage" ? "text-[--brand-primary] font-medium" : "text-[--muted-ink]"}>
              Coverage
            </span>
            <span className={step === "history" ? "text-[--brand-primary] font-medium" : "text-[--muted-ink]"}>
              History
            </span>
            <span className={step === "review" ? "text-[--brand-primary] font-medium" : "text-[--muted-ink]"}>
              Review
            </span>
          </div>
          <div className="mt-2 h-1 bg-[--surface-alt] rounded-full overflow-hidden">
            <div
              className="h-full bg-[--brand-primary] transition-all duration-300"
              style={{
                width:
                  step === "verify"
                    ? "20%"
                    : step === "consent"
                    ? "40%"
                    : step === "coverage"
                    ? "60%"
                    : step === "history"
                    ? "80%"
                    : "100%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Verify */}
          {step === "verify" && (
            <motion.div
              key="verify"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {data.language === "en"
                      ? "Welcome to your secure intake"
                      : "Bienvenido a su admisión segura"}
                  </CardTitle>
                  <CardDescription>
                    {data.language === "en"
                      ? "We'll send a verification code to get started."
                      : "Le enviaremos un código de verificación para comenzar."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {data.language === "en" ? "Mobile Number" : "Número de móvil"}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={data.phone}
                      onChange={(e) => updateData({ phone: e.target.value })}
                    />
                  </div>
                  {data.phone && (
                    <div className="space-y-2">
                      <Label htmlFor="otp">
                        {data.language === "en" ? "Verification Code" : "Código de verificación"}
                      </Label>
                      <Input
                        id="otp"
                        placeholder="123456"
                        value={data.otp}
                        onChange={(e) => updateData({ otp: e.target.value })}
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleVerify}
                    disabled={!data.phone || !data.otp || loading}
                    className="w-full"
                  >
                    {loading ? "Verifying..." : data.language === "en" ? "Continue" : "Continuar"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <p className="text-xs text-[--muted-ink] text-center">
                    {data.language === "en"
                      ? "DEMO MODE: Enter any phone and code"
                      : "MODO DEMO: Ingrese cualquier teléfono y código"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Consent */}
          {step === "consent" && (
            <motion.div
              key="consent"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {data.language === "en" ? "Notices & Consents" : "Avisos y Consentimientos"}
                  </CardTitle>
                  <CardDescription>
                    {data.language === "en"
                      ? "Please review and accept the following."
                      : "Por favor revise y acepte lo siguiente."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {COPY.consent.types.map((consent) => (
                    <div key={consent.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={consent.id}
                        checked={data.consents[consent.id] || false}
                        onCheckedChange={(checked) =>
                          updateData({
                            consents: {
                              ...data.consents,
                              [consent.id]: checked === true,
                            },
                          })
                        }
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor={consent.id}
                          className="font-medium cursor-pointer"
                        >
                          {consent.label}
                        </Label>
                        <p className="text-xs text-[--muted-ink]">
                          {consent.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep("verify")}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      {data.language === "en" ? "Back" : "Atrás"}
                    </Button>
                    <Button
                      onClick={handleConsent}
                      disabled={
                        !COPY.consent.types.every((t) => data.consents[t.id])
                      }
                      className="flex-1"
                    >
                      {data.language === "en" ? "I Agree" : "Acepto"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Coverage */}
          {step === "coverage" && (
            <motion.div
              key="coverage"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {data.language === "en" ? "Insurance Coverage" : "Cobertura de Seguro"}
                  </CardTitle>
                  <CardDescription>
                    {data.language === "en"
                      ? "Upload photos of your insurance card (front & back)."
                      : "Sube fotos de tu tarjeta de seguro (frente y reverso)."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="front">
                      {data.language === "en" ? "Card Front" : "Frente de la tarjeta"}
                    </Label>
                    <div className="border-2 border-dashed border-[--border] rounded-2xl p-8 text-center hover:border-[--brand-primary] transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-[--muted-ink]" />
                      <Input
                        id="front"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          updateData({
                            insuranceFront: e.target.files?.[0] || null,
                          })
                        }
                      />
                      <Label
                        htmlFor="front"
                        className="cursor-pointer text-sm text-[--brand-primary] hover:underline"
                      >
                        {data.insuranceFront
                          ? data.insuranceFront.name
                          : data.language === "en"
                          ? "Click to upload"
                          : "Clic para subir"}
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="back">
                      {data.language === "en" ? "Card Back" : "Reverso de la tarjeta"}
                    </Label>
                    <div className="border-2 border-dashed border-[--border] rounded-2xl p-8 text-center hover:border-[--brand-primary] transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-[--muted-ink]" />
                      <Input
                        id="back"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          updateData({
                            insuranceBack: e.target.files?.[0] || null,
                          })
                        }
                      />
                      <Label
                        htmlFor="back"
                        className="cursor-pointer text-sm text-[--brand-primary] hover:underline"
                      >
                        {data.insuranceBack
                          ? data.insuranceBack.name
                          : data.language === "en"
                          ? "Click to upload"
                          : "Clic para subir"}
                      </Label>
                    </div>
                  </div>
                  <p className="text-xs text-[--muted-ink]">
                    {data.language === "en"
                      ? "DEMO: Select any image files to simulate upload"
                      : "DEMO: Seleccione cualquier archivo de imagen para simular"}
                  </p>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep("consent")}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      {data.language === "en" ? "Back" : "Atrás"}
                    </Button>
                    <Button
                      onClick={handleCoverageUpload}
                      disabled={
                        !data.insuranceFront || !data.insuranceBack || loading
                      }
                      className="flex-1"
                    >
                      {loading
                        ? data.language === "en"
                          ? "Checking..."
                          : "Verificando..."
                        : data.language === "en"
                        ? "Verify Coverage"
                        : "Verificar Cobertura"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: History */}
          {step === "history" && (
            <motion.div
              key="history"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {data.language === "en" ? "Medical History" : "Historia Médica"}
                  </CardTitle>
                  <CardDescription>
                    {data.language === "en"
                      ? "A few quick questions to help us prepare for your visit."
                      : "Algunas preguntas rápidas para preparar su visita."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">
                      {data.language === "en"
                        ? "Do you have any allergies?"
                        : "¿Tiene alguna alergia?"}
                    </Label>
                    <Input
                      id="allergies"
                      placeholder={
                        data.language === "en" ? "None, or list them" : "Ninguna, o listarlas"
                      }
                      value={data.answers.allergies || ""}
                      onChange={(e) =>
                        updateData({
                          answers: { ...data.answers, allergies: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications">
                      {data.language === "en"
                        ? "Current medications?"
                        : "¿Medicamentos actuales?"}
                    </Label>
                    <Input
                      id="medications"
                      placeholder={
                        data.language === "en" ? "None, or list them" : "Ninguno, o listarlos"
                      }
                      value={data.answers.medications || ""}
                      onChange={(e) =>
                        updateData({
                          answers: {
                            ...data.answers,
                            medications: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">
                      {data.language === "en"
                        ? "Reason for visit?"
                        : "¿Motivo de la visita?"}
                    </Label>
                    <Input
                      id="reason"
                      placeholder={
                        data.language === "en"
                          ? "Annual checkup, concern, etc."
                          : "Revisión anual, preocupación, etc."
                      }
                      value={data.answers.reason || ""}
                      onChange={(e) =>
                        updateData({
                          answers: { ...data.answers, reason: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep("coverage")}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      {data.language === "en" ? "Back" : "Atrás"}
                    </Button>
                    <Button
                      onClick={handleHistoryComplete}
                      disabled={!data.answers.reason}
                      className="flex-1"
                    >
                      {data.language === "en" ? "Continue" : "Continuar"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Review */}
          {step === "review" && (
            <motion.div
              key="review"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                {/* Eligibility status */}
                {eligibility && (
                  <Alert variant={eligibility.status === "active" ? "success" : "warning"}>
                    {eligibility.status === "active" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {eligibility.status === "active"
                        ? data.language === "en"
                          ? "Coverage Active"
                          : "Cobertura Activa"
                        : data.language === "en"
                        ? "Coverage Issue"
                        : "Problema de Cobertura"}
                    </AlertTitle>
                    <AlertDescription>
                      {eligibility.status === "active"
                        ? data.language === "en"
                          ? `Estimated copay: $${eligibility.copay}. Remaining deductible: $${eligibility.deductible}.`
                          : `Copago estimado: $${eligibility.copay}. Deducible restante: $${eligibility.deductible}.`
                        : data.language === "en"
                        ? "We'll confirm details with your provider before your visit."
                        : "Confirmaremos los detalles con su proveedor antes de su visita."}
                    </AlertDescription>
                  </Alert>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {data.language === "en" ? "Review & Submit" : "Revisar y Enviar"}
                    </CardTitle>
                    <CardDescription>
                      {data.language === "en"
                        ? "Please confirm your information before submitting."
                        : "Por favor confirme su información antes de enviar."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Patient info */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        {data.language === "en" ? "Patient" : "Paciente"}
                      </h4>
                      <div className="text-sm space-y-1 text-[--muted-ink]">
                        <p>
                          {DEMO_DATA.patient.firstName} {DEMO_DATA.patient.lastName}
                        </p>
                        <p>DOB: {DEMO_DATA.patient.dob}</p>
                        <p>{data.phone}</p>
                      </div>
                    </div>

                    {/* Coverage info */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        {data.language === "en" ? "Insurance" : "Seguro"}
                      </h4>
                      <div className="text-sm space-y-1 text-[--muted-ink]">
                        <p>{DEMO_DATA.coverage.payerName}</p>
                        <p>Member ID: {DEMO_DATA.coverage.memberId}</p>
                        <Badge variant="success">
                          {DEMO_DATA.coverage.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* History */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        {data.language === "en" ? "History" : "Historia"}
                      </h4>
                      <div className="text-sm space-y-1 text-[--muted-ink]">
                        <p>
                          <strong>
                            {data.language === "en" ? "Allergies:" : "Alergias:"}
                          </strong>{" "}
                          {data.answers.allergies || "None"}
                        </p>
                        <p>
                          <strong>
                            {data.language === "en" ? "Medications:" : "Medicamentos:"}
                          </strong>{" "}
                          {data.answers.medications || "None"}
                        </p>
                        <p>
                          <strong>
                            {data.language === "en" ? "Reason:" : "Motivo:"}
                          </strong>{" "}
                          {data.answers.reason}
                        </p>
                      </div>
                    </div>

                    <Alert>
                      <AlertDescription className="text-xs">
                        {data.language === "en"
                          ? "DEMO MODE: No real data is transmitted. This demo simulates EHR write-back."
                          : "MODO DEMO: No se transmiten datos reales. Esta demo simula la escritura al EHR."}
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep("history")}
                        className="flex-1"
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        {data.language === "en" ? "Back" : "Atrás"}
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading
                          ? data.language === "en"
                            ? "Submitting..."
                            : "Enviando..."
                          : data.language === "en"
                          ? "Submit Intake"
                          : "Enviar Admisión"}
                        <CheckCircle2 className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

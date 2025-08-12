import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, CheckCircle } from "lucide-react";

const forgotPasswordSchema = z.object({
  phone: z.string()
    .min(10, "Número deve ter pelo menos 10 dígitos")
    .max(15, "Número muito longo")
    .regex(/^[0-9\s\-\+\(\)]+$/, "Formato de telefone inválido"),
});

const verificationSchema = z.object({
  code: z.string().min(4, "Código deve ter pelo menos 4 dígitos").max(6, "Código muito longo"),
  newPassword: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;

const ForgotPassword = () => {
  const [step, setStep] = useState<"phone" | "verification" | "success">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const phoneForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phone: "",
    },
  });

  const verificationForm = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const onPhoneSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setPhoneNumber(data.phone);
    // Simular envio de SMS
    console.log("Sending SMS to:", data.phone);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verification");
    }, 2000);
  };

  const onVerificationSubmit = async (data: VerificationFormData) => {
    setIsLoading(true);
    // Simular verificação e redefinição de senha
    console.log("Verification data:", data);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 2000);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="netflix-card border-netflix-gray-dark text-center">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-semibold">Senha Redefinida!</CardTitle>
              <CardDescription>
                Sua senha foi redefinida com sucesso. Agora você pode entrar com sua nova senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/login">
                <Button className="w-full btn-netflix">
                  Ir para Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "verification") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-netflix-gradient">Verificação</h1>
            <p className="text-muted-foreground">
              Enviamos um código SMS para {phoneNumber}
            </p>
          </div>

          <Card className="netflix-card border-netflix-gray-dark">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Digite o código</CardTitle>
              <CardDescription>
                Insira o código recebido e sua nova senha
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...verificationForm}>
                <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
                  <FormField
                    control={verificationForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de Verificação</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o código"
                            className="text-center text-lg tracking-widest"
                            maxLength={6}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={verificationForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite sua nova senha"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={verificationForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Nova Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirme sua nova senha"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full btn-netflix"
                    disabled={isLoading}
                  >
                    {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                  </Button>
                </form>
              </Form>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setStep("phone")}
                  className="text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-netflix-gradient">Esqueci minha senha</h1>
          <p className="text-muted-foreground">
            Digite seu número para receber um código de verificação
          </p>
        </div>

        <Card className="netflix-card border-netflix-gray-dark">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Recuperar senha</CardTitle>
            <CardDescription>
              Enviaremos um código SMS para redefinir sua senha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Celular</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="(11) 99999-9999"
                            className="pl-10"
                            {...field}
                            onChange={(e) => {
                              const formatted = formatPhone(e.target.value);
                              field.onChange(formatted);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full btn-netflix"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando código..." : "Enviar Código"}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar para login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
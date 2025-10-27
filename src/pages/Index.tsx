import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";
import backgroundImage from "@/assets/background.jpg";
import logoImage from "@/assets/logo.png";
import InputMask from "react-input-mask";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).max(100),

  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, "")) // mantém só dígitos
    .refine((v) => v.length >= 10 && v.length <= 11, {
      message: "Telefone inválido",
    }),

  email: z.string().email({ message: "Email inválido" }).max(255),
});

type FormData = z.infer<typeof formSchema>;

const WEB_APP_URL = "/.netlify/functions/send-lead"; // cole aqui a sua URL

const Index = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name: data.name,
          phone: data.phone,
          email: data.email,
        }),
      });

      setIsSubmitted(true);
      toast({ title: "Sucesso!", description: "Seus dados foram enviados com sucesso." });

      // Não reseta nem volta para o formulário
      // (remova qualquer setTimeout que te leve de volta)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar seus dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/80" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={logoImage} alt="Logo" className="w-56 h-40 object-contain hover-glow" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-[linear-gradient(135deg,hsl(45,100%,60%),hsl(38,90%,50%))] bg-clip-text text-transparent">
            Aula Gratuita
          </h1>
          <p className="text-base text-foreground/80">
            Rejuvenesça 10 anos com técnicas<br></br>simples de auto massagem facial
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-effect rounded-2xl p-8 shadow-[var(--shadow-elegant)] hover-glow animate-scale-in">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome"
                  {...register("name")}
                  className="bg-input/50 border-border/50 text-foreground placeholder:text-foreground/40 focus:border-accent focus:ring-accent/50 transition-all"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">
                  Telefone
                </Label>

                <InputMask
                  mask="(99) 99999-9999"
                  maskChar={null}
                  {...register("phone")}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="bg-input/50 border-border/50 text-foreground placeholder:text-foreground/40 focus:border-accent focus:ring-accent/50 transition-all"
                    />
                  )}
                </InputMask>

                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className="bg-input/50 border-border/50 text-foreground placeholder:text-foreground/40 focus:border-accent focus:ring-accent/50 transition-all"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[linear-gradient(135deg,hsl(45,100%,60%),hsl(38,90%,50%))] hover:opacity-90 text-gray-900 font-semibold py-6 rounded-xl shadow-[0_0_40px_rgba(255,215,0,0.4)] hover:scale-105 transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  "QUERO A AULA GRATUITA!"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-4">
                <CheckCircle2 className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Tudo Certo!
              </h3>
              <p className="text-foreground/80">
                Nossa aula vai acontecer dia 13/11.<br></br>Te aguardo!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-foreground/60 mt-20">
          © 2025 Anna Lara Estética Integrativa. <br></br>Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Index;

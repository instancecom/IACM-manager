import { MapPin, Clock, Youtube, Instagram, ExternalLink, LogIn, UserPlus, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-church.jpg";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Landing */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <h1 className="heading-1 sm:heading-display text-foreground mb-4 animate-fade-in">
            IACM
          </h1>
          <p className="body-large text-muted-foreground mb-8 animate-fade-in max-w-xl mx-auto">
            Conectando pessoas a Jesus, formando discípulos e impactando o mundo com fé, amor e verdade.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 animate-slide-up">
              <Link to="/register">
                <Button size="lg" className="gap-2 w-full sm:w-auto btn-netflix">
                  <UserPlus className="w-5 h-5" />
                  Criar Conta
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <LogIn className="w-5 h-5" />
                  Entrar
                </Button>
              </Link>
            </div>
          )}

          <a href="#quem-somos" className="inline-flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors animate-fade-in">
            <span className="body-small mb-1">Saiba mais</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Quem Somos */}
      <section id="quem-somos" className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="heading-2 sm:heading-1 text-foreground mb-4">Quem Somos</h2>
          <Separator className="w-16 mx-auto mb-8 bg-primary" />
          <div className="space-y-6">
            <p className="body-large text-muted-foreground leading-relaxed">
              Somos uma igreja que vive e acredita no propósito de Deus para esta geração. 
              Existimos para edificar vidas, fortalecer a fé e levar o amor de Jesus a todos.
            </p>
            <p className="body-large text-muted-foreground leading-relaxed">
              Mais do que um lugar, somos uma família. Um ambiente de comunhão, crescimento e 
              transformação, onde cada pessoa é encorajada a descobrir seu propósito e viver 
              aquilo que Deus sonhou.
            </p>
            <p className="body-large text-muted-foreground leading-relaxed font-semibold">
              Nosso chamado é conectar pessoas a Jesus, formar discípulos e impactar o mundo 
              com fé, amor e verdade.
            </p>
          </div>
        </div>
      </section>

      {/* Nossos Cultos */}
      <section className="py-16 sm:py-24 px-4 bg-card/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="heading-2 sm:heading-1 text-foreground mb-4">Nossos Cultos</h2>
          <Separator className="w-16 mx-auto mb-10 bg-primary" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="netflix-card border-border/50">
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <h3 className="heading-5 text-foreground">Quarta-feira</h3>
                <p className="text-2xl font-bold text-primary">19:30</p>
              </CardContent>
            </Card>
            <Card className="netflix-card border-border/50">
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <h3 className="heading-5 text-foreground">Domingo</h3>
                <p className="text-2xl font-bold text-primary">09h e 18h</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assista Online */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="caption uppercase tracking-widest text-primary mb-2">Assista todos os nossos</p>
          <h2 className="heading-2 sm:heading-1 text-foreground mb-4">Encontros Online</h2>
          <Separator className="w-16 mx-auto mb-10 bg-primary" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="gap-3 text-base border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => window.open("https://youtube.com/@5ministerioschurch?si=zMv6k9VpPZPd61Ep", "_blank")}
            >
              <Youtube className="w-5 h-5" />
              YouTube
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-3 text-base border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400"
              onClick={() => window.open("https://instagram.com/5ministerioschurch", "_blank")}
            >
              <Instagram className="w-5 h-5" />
              @5ministerioschurch
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="py-16 sm:py-24 px-4 bg-card/50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="heading-2 sm:heading-1 text-foreground">Onde Estamos</h2>
          </div>
          <Separator className="w-16 mx-auto mb-10 bg-primary" />
          <div className="rounded-lg overflow-hidden border border-border shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!4v1775061287786!6m8!1m7!1s7zl63JiyKPhww86rSyyN_A!2m2!1d-23.50624950480002!2d-46.19236443013188!3f80.87688008508347!4f-1.5368878851865446!5f0.7820865974627469"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Igreja"
            />
          </div>
        </div>
      </section>

      {/* CTA final */}
      {!user && (
        <section className="py-16 sm:py-24 px-4 text-center">
          <div className="container mx-auto max-w-2xl">
            <h2 className="heading-3 sm:heading-2 text-foreground mb-4">Faça parte desta família</h2>
            <p className="body-large text-muted-foreground mb-8">
              Crie sua conta e fique por dentro de todos os eventos e novidades.
            </p>
            <Link to="/register">
              <Button size="lg" className="btn-netflix gap-2">
                <UserPlus className="w-5 h-5" />
                Criar Conta Agora
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;

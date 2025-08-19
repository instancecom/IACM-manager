import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Eye, Save, Image as ImageIcon, Type, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BannerManager = () => {
  const [bannerData, setBannerData] = useState({
    title: "",
    subtitle: "",
    description: "",
    backgroundImage: ""
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchActiveBanner();
  }, []);

  const fetchActiveBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .single();

      if (data) {
        setBannerData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: "", // Will be loaded after types are updated
          backgroundImage: data.image_url || ""
        });
      } else {
        // Set default values if no active banner exists
        setBannerData({
          title: "Evento Especial",
          subtitle: "06 de Agosto de 2025",
          description: "Junte-se a nós para uma noite especial de adoração e comunhão. Uma experiência transformadora que você não pode perder.",
          backgroundImage: "/src/assets/hero-church.jpg"
        });
      }
    } catch (error) {
      console.error('Error fetching banner:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `banner-${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('event-banners')
          .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('event-banners')
          .getPublicUrl(fileName);

        setPreviewImage(publicUrl);
        setBannerData({ ...bannerData, backgroundImage: publicUrl });
        
        toast({
          title: "Upload realizado",
          description: "Imagem enviada com sucesso!",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Erro no upload",
          description: "Não foi possível enviar a imagem.",
          variant: "destructive",
        });
      }
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!bannerData.title || !bannerData.backgroundImage) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e imagem são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check if there's an existing active banner
      const { data: existingBanner } = await supabase
        .from('banners')
        .select('id')
        .eq('is_active', true)
        .single();

      const bannerPayload = {
        title: bannerData.title,
        subtitle: bannerData.subtitle,
        description: bannerData.description,
        image_url: previewImage || bannerData.backgroundImage,
        is_active: true,
        display_order: 1,
        updated_at: new Date().toISOString()
      };

      if (existingBanner) {
        // Update existing active banner
        const { error } = await supabase
          .from('banners')
          .update(bannerPayload)
          .eq('id', existingBanner.id);

        if (error) throw error;
      } else {
        // Create new banner if none exists
        const { error } = await supabase
          .from('banners')
          .insert(bannerPayload);

        if (error) throw error;
      }

      toast({
        title: "Banner atualizado",
        description: "As configurações do banner foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o banner.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-4 text-foreground">Configurar Banner</h1>
          <p className="text-enhanced-muted">Personalize o banner principal da página inicial</p>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={loading || uploading}>
          <Save className="w-4 h-4" />
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content" className="gap-2">
            <Type className="w-4 h-4" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Imagem
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Textos do Banner</CardTitle>
              <CardDescription>Configure os textos que aparecerão no banner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título Principal</Label>
                  <Input
                    id="title"
                    value={bannerData.title}
                    onChange={(e) => setBannerData({ ...bannerData, title: e.target.value })}
                    placeholder="Digite o título principal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <Input
                    id="subtitle"
                    value={bannerData.subtitle}
                    onChange={(e) => setBannerData({ ...bannerData, subtitle: e.target.value })}
                    placeholder="Digite o subtítulo (ex: data do evento)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={bannerData.description}
                    onChange={(e) => setBannerData({ ...bannerData, description: e.target.value })}
                    placeholder="Digite uma breve descrição"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Imagem de Fundo</CardTitle>
              <CardDescription>Faça upload da imagem que será usada como fundo do banner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="banner-upload"
                  />
                  <Label 
                    htmlFor="banner-upload" 
                    className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="font-medium">
                      {uploading ? "Enviando..." : "Clique para fazer upload"}
                    </span>
                    <span className="text-sm">ou arraste e solte uma imagem</span>
                  </Label>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Recomendado: 1920x1080px (16:9) para melhor qualidade
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview do Banner</CardTitle>
              <CardDescription>Veja como o banner ficará na página inicial</CardDescription>
            </CardHeader>
            <CardContent>
              {(previewImage || bannerData.backgroundImage) ? (
                <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden border">
                  <img
                    src={previewImage || bannerData.backgroundImage}
                    alt="Preview do banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white max-w-2xl px-4">
                      <h3 className="text-2xl sm:text-4xl font-bold mb-2">{bannerData.title}</h3>
                      <p className="text-lg sm:text-xl mb-3 opacity-90">{bannerData.subtitle}</p>
                      <p className="text-sm sm:text-base opacity-80 max-w-md mx-auto">{bannerData.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 sm:h-80 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Faça upload de uma imagem para ver o preview</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BannerManager;
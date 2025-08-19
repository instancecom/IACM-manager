import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeBanner, setActiveBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      setBanners(data || []);
      
      // Find the active banner
      const active = data?.find(banner => banner.is_active);
      setActiveBanner(active || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setActiveBanner(data || null);
    } catch (err) {
      console.error('Error fetching active banner:', err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return {
    banners,
    activeBanner,
    loading,
    error,
    fetchBanners,
    fetchActiveBanner,
  };
};
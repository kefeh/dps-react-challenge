import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { fetchByLocality, fetchByPlz } from '../services/plzApi';

export const useAddressForm = () => {

  const [locality, setLocality] = useState('');
  const [plz, setPlz] = useState('');

  const [availablePlzs, setAvailablePlzs] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedLocality = useDebounce(locality, 1000);
  const debouncedPlz = useDebounce(plz, 1000);

  // Track "Who triggered the update?" to prevent loops
  const [lastEdited, setLastEdited] = useState<'locality' | 'plz' | null>(null);

  useEffect(() => {
    if (lastEdited !== 'locality' || !debouncedLocality) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      setAvailablePlzs([]);

      try {
        const data = await fetchByLocality(debouncedLocality);

        if (data.length === 0) {
          setError('City not found');
        } else if (data.length === 1) {
          // Exact match
          setPlz(data[0].postalCode);
        } else {
          const uniquePlzs = Array.from(new Set(data.map(item => item.postalCode))).sort();
          setAvailablePlzs(uniquePlzs);
          // If the current PLZ isn't in the new list, clear it or set first
          if (!uniquePlzs.includes(plz)) {
            setPlz('');
          }
        }
      } catch (err) {
        setError('API Error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [debouncedLocality]);

  useEffect(() => {
    // We only fetch if user typed a full PLZ and we aren't in dropdown mode
    if (lastEdited !== 'plz' || debouncedPlz.length !== 5 || availablePlzs.length > 0) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchByPlz(debouncedPlz);
        if (data.length > 0) {
          setLocality(data[0].name);
        } else {
          setError('Invalid Postal Code');
        }
      } catch (err) {
        setError('API Error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [debouncedPlz]);

  
  const handleLocalityChange = (val: string) => {
    setLocality(val);
    setLastEdited('locality');
  };

  const handlePlzChange = (val: string) => {
    setPlz(val);
    if (availablePlzs.length === 0) {
      setLastEdited('plz');
    }
  };

  return {
    locality,
    plz,
    availablePlzs,
    loading,
    error,
    handleLocalityChange,
    handlePlzChange
  };
};

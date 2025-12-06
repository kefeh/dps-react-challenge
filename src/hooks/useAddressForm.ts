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

  const withLoading = async (asyncFn: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await asyncFn();
    } catch (err) {
      setError('API Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lastEdited !== 'locality' || !debouncedLocality) return;

    const loadLocalityData = async () => {
      setAvailablePlzs([]);
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
    };

    withLoading(loadLocalityData);
  }, [debouncedLocality]);

  useEffect(() => {
    // We only fetch if user typed a full PLZ and we aren't in dropdown mode
    if (lastEdited !== 'plz' || debouncedPlz.length !== 5 || availablePlzs.length > 0) return;

    const loadPlzData = async () => {
        const data = await fetchByPlz(debouncedPlz);
        if (data.length > 0) {
          setLocality(data[0].name);
        } else {
          setLocality('');
          setError('Invalid Postal Code');
        }
    };

    withLoading(loadPlzData);
  }, [debouncedPlz]);


  const handleLocalityChange = (val: string) => {
    if (val === '') {
      setAvailablePlzs([]);
      setLoading(false);
    }
    setLocality(val);
    setLastEdited('locality');
  };

  const validatePlz = (val: string): string | null => {
    // Allow only digits
    if (!/^\d*$/.test(val)) {
      return 'Postal code must only contain digits.';
    }
    return null;
  };

  const handlePlzChange = (val: string) => {
    const error = validatePlz(val);
    if (error) {
      setError(error);
      setLastEdited('plz');
      return;
    } else {
      setError(null);
    }
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
    lastEdited,
    handleLocalityChange,
    handlePlzChange
  };
};

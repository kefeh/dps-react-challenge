import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { fetchByLocality, fetchByPlz } from '../services/plzApi';
interface AddressData {
  locality: string;
  plz: string;
  availablePlzs: string[];
}

interface State {
  data: AddressData;
  lastEdited: 'locality' | 'plz' | null;
  loading: boolean;
  error: string | null;
}

export const useAddressForm = () => {
  const [state, setState] = useState<State>({
    data: {
      locality: '',
      plz: '',
      availablePlzs: [],
    },
    lastEdited: null,
    loading: false,
    error: null,
  });

  const debouncedLocality = useDebounce(state.data.locality, 1000);
  const debouncedPlz = useDebounce(state.data.plz, 1000);

  const withLoading = async (asyncFn: () => Promise<void>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await asyncFn();
    } catch (err) {
      setState((prev) => ({ ...prev, error: 'API Error' }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (state.lastEdited !== 'locality' || !debouncedLocality) return;

    const loadLocalityData = async () => {
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, availablePlzs: [] }
      }));

      const data = await fetchByLocality(debouncedLocality);

      if (data.length === 0) {
        setState((prev) => ({ ...prev, error: 'City not found' }));
      } else if (data.length === 1) {
        setState((prev) => ({
          ...prev,
          data: { ...prev.data, plz: data[0].postalCode }
        }));
      } else {
        const uniquePlzs = Array.from(new Set(data.map((item) => item.postalCode))).sort();

        setState((prev) => {
          const currentPlz = prev.data.plz;
          const newPlz = uniquePlzs.includes(currentPlz) ? currentPlz : '';

          return {
            ...prev,
            data: {
              ...prev.data,
              availablePlzs: uniquePlzs,
              plz: newPlz
            }
          };
        });
      }
    };

    withLoading(loadLocalityData);
  }, [debouncedLocality]);

  useEffect(() => {
    if (
      state.lastEdited !== 'plz' ||
      debouncedPlz.length !== 5 ||
      state.data.availablePlzs.length > 0
    ) {
      return;
    }

    const loadPlzData = async () => {
      const data = await fetchByPlz(debouncedPlz);
      if (data.length > 0) {
        setState((prev) => ({
          ...prev,
          data: { ...prev.data, locality: data[0].name }
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: 'Invalid Postal Code',
          data: { ...prev.data, locality: '' }
        }));
      }
    };

    withLoading(loadPlzData);
  }, [debouncedPlz]);


  const handleLocalityChange = (val: string) => {
    setState((prev) => ({
      ...prev,
      lastEdited: 'locality',
      error: null,
      data: {
        ...prev.data,
        locality: val,
        availablePlzs: val === '' ? [] : prev.data.availablePlzs,
        plz: val === '' ? '' : prev.data.plz,
      }
    }));
  };

  const validatePlz = (val: string): string | null => {
    if (!/^\d*$/.test(val)) return 'Postal code must only contain digits.';
    return null;
  };

  const handlePlzChange = (val: string) => {
    const validationError = validatePlz(val);

    if (validationError) {
      setState((prev) => ({
        ...prev,
        lastEdited: 'plz',
        error: validationError
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      lastEdited: prev.data.availablePlzs.length === 0 ? 'plz' : prev.lastEdited,
      error: null,
      data: {
        ...prev.data,
        plz: val
      }
    }));
  };

  return {
    ...state,
    locality: state.data.locality,
    plz: state.data.plz,
    availablePlzs: state.data.availablePlzs,
    handleLocalityChange,
    handlePlzChange,
  };
};

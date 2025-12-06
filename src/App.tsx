import { InputField } from './components/InputField';
import { useAddressForm } from './hooks/useAddressForm';

function App() {
  const {
    locality,
    plz,
    availablePlzs,
    loading,
    error,
    lastEdited,
    handleLocalityChange,
    handlePlzChange
  } = useAddressForm();


  return (
    <div className="min-h-screen flex items-center justify-items-center bg-cyan-900 p-4">
      <div className=" p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">German Address Validator</h1>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <InputField
            label="Locality (City)"
            placeholder="e.g. Berlin"
            value={locality}
            error={lastEdited === 'locality' ? (error ?? undefined) : undefined}
            onChange={(e) => handleLocalityChange(e.target.value)}
            isLoading={lastEdited === 'plz' ? loading : false}
          />
          {availablePlzs.length > 0 ? (
            <>
              <label htmlFor="select-plz">Postal Code (PLZ)</label>
              <select
                id="select-plz"
                className="w-full p-2"
                value={plz}
                onChange={(e) => handlePlzChange(e.target.value)}
                disabled={lastEdited === 'locality' ? loading : false}
              >
                <option value="">Select a PLZ...</option>
                {availablePlzs.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </>
          ) : (
            <InputField
              label="Postal Code (PLZ)"
              placeholder="e.g. 10115"
              maxLength={5}
              value={plz}
              onChange={(e) => handlePlzChange(e.target.value)}
              error={lastEdited === 'plz' ? (error ?? undefined) : undefined}
              isLoading={lastEdited === 'locality' ? loading : false}
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default App;

import { InputField } from './components/InputField';
import { useAddressForm } from './hooks/useAddressForm';
import { LastEdited } from './types/address';

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
    <div className="min-h-screen min-w-screen flex justify-center items-center bg-cyan-900 p-4">
      <div className=" p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">German Address Validator</h1>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <InputField
            label="Locality (City)"
            placeholder="e.g. Berlin"
            value={locality}
            error={lastEdited === LastEdited.Locality ? (error ?? undefined) : undefined}
            onChange={(e) => handleLocalityChange(e.target.value)}
            isLoading={lastEdited === LastEdited.Plz ? loading : false}
          />
          {availablePlzs.length > 0 ? (
            <>
              <label htmlFor="select-plz">Postal Code (PLZ)</label>
              <select
                id="select-plz"
                className="w-full p-2"
                value={plz}
                onChange={(e) => handlePlzChange(e.target.value)}
                disabled={lastEdited === LastEdited.Locality ? loading : false}
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
              error={lastEdited === LastEdited.Plz ? (error ?? undefined) : undefined}
              isLoading={lastEdited === LastEdited.Locality ? loading : false}
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default App;

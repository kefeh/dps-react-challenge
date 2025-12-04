import { InputField } from './components/InputField';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-items-center bg-cyan-900 p-4">
      <div className=" p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">German Address Validator</h1>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <InputField
            label="Locality (City)"
            placeholder="e.g. Berlin"
          />

          <InputField
            label="Postal Code (PLZ)"
            placeholder="e.g. 10115"
            maxLength={5}
          />
        </form>
      </div>
    </div>
  );
}

export default App;

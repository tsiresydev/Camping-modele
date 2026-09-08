import { useState } from "react";
import { Radio } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { scoutCodes, ScoutCode } from "./techniques/codes";

export default function Techniques() {
  // Morse code mappings
  const morseCode: Record<string, string> = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
    G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
    M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
    S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    " ": "/"
  };

  const reverseMorse: Record<string, string> = Object.fromEntries(
    Object.entries(morseCode).map(([k, v]) => [v, k])
  );

  // State for Morse section
  const [morseInput, setMorseInput] = useState("");
  const [morseOutput, setMorseOutput] = useState("");
  const [morseMode, setMorseMode] = useState<"encode" | "decode">("encode");
  const [morseError, setMorseError] = useState<string | null>(null);

  // State for substitution codes section
  const [substitutionInput, setSubstitutionInput] = useState("");
  const [substitutionOutput, setSubstitutionOutput] = useState("");
  const [selectedCode, setSelectedCode] = useState<ScoutCode>(scoutCodes[0]);
  const [substitutionMode, setSubstitutionMode] = useState<"encode" | "decode">("encode");
  const [showTable, setShowTable] = useState(false);
  const [substitutionError, setSubstitutionError] = useState<string | null>(null);

  // Morse code functions
  const encodeMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split("")
      .map(char => morseCode[char] || char)
      .join(" ");
  };

  const decodeMorse = (code: string): string => {
    const codes = code.trim().split(/\s+/);
    return codes
      .map(c => {
        if (c === "") return " ";
        return reverseMorse[c] || `?${c}?`;
      })
      .join("");
  };

  const handleMorseConvert = () => {
    setMorseError(null);
    try {
      if (morseInput.trim() === "") {
        setMorseOutput("");
        return;
      }
      
      if (morseMode === "encode") {
        setMorseOutput(encodeMorse(morseInput));
      } else {
        setMorseOutput(decodeMorse(morseInput));
      }
    } catch (error) {
      setMorseError("Erreur lors de la conversion");
      setMorseOutput("");
    }
  };

  // Build mapping from selected code
  const getSubstitutionMapping = (): Record<string, string> => {
    const mapping: Record<string, string> = {};
    selectedCode.mapping.forEach(m => {
      mapping[m.letter] = m.replacement;
    });
    return mapping;
  };

  // Build inverse mapping for decoding
  const getInverseMapping = (): Record<string, string> => {
    const mapping: Record<string, string> = {};
    selectedCode.mapping.forEach(m => {
      mapping[m.replacement] = m.letter;
    });
    return mapping;
  };

  const applySubstitution = (text: string, mapping: Record<string, string>): string => {
    return text.split("").map(char => {
      const upperChar = char.toUpperCase();
      return mapping[upperChar] || char;
    }).join("");
  };

  const handleSubstitutionConvert = () => {
    setSubstitutionError(null);
    try {
      if (substitutionInput.trim() === "") {
        setSubstitutionOutput("");
        return;
      }
      
      const mapping = substitutionMode === "encode" 
        ? getSubstitutionMapping() 
        : getInverseMapping();
      
      setSubstitutionOutput(applySubstitution(substitutionInput, mapping));
    } catch (error) {
      setSubstitutionError("Erreur lors de la conversion");
      setSubstitutionOutput("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-scout-gray-border bg-scout-gray-light">
          <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-scout-yellow/60 bg-scout-yellow/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-scout-black">
              <Radio className="h-4 w-4" /> Techniques de transmission
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold text-scout-black sm:text-4xl">
              Codage et décodage de messages
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-scout-black/70">
              Apprenez et utilisez différentes techniques de transmission et de codage de messages scoutes
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          {/* Morse Code Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-scout-black mb-6">
              Code Morse
            </h2>
            
            <div className="space-y-6">
              {/* Mode Toggle */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setMorseMode("encode")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    morseMode === "encode"
                      ? "bg-scout-black text-white"
                      : "border border-scout-gray-border text-scout-black/80 hover:bg-scout-gray-light"
                  }`}
                >
                  Texte → Morse
                </button>
                <button
                  onClick={() => setMorseMode("decode")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ml-2 ${
                    morseMode === "decode"
                      ? "bg-scout-black text-white"
                      : "border border-scout-gray-border text-scout-black/80 hover:bg-scout-gray-light"
                  }`}
                >
                  Morse → Texte
                </button>
              </div>

              {/* Input */}
              <div className="flex flex-col gap-2">
                <label className="text-scout-black/80 font-medium">
                  {morseMode === "encode" ? "Entrez votre texte" : "Entrez votre code Morse"}
                </label>
                <textarea
                  value={morseInput}
                  onChange={(e) => setMorseInput(e.target.value)}
                  placeholder={morseMode === "encode" ? "Ex: HELLO WORLD" : "Ex: .... . .-.. .-.. --- / .-- --- .-. .-.. -.."}
                  rows={4}
                  className="w-full rounded-xl border border-scout-gray-border bg-white py-3 px-4 text-sm text-scout-black placeholder:text-scout-black/40 focus:outline-none focus:ring-2 focus:ring-scout-black/20 resize-y"
                />
              </div>

              {/* Error Message */}
              {morseError && (
                <div className="rounded-lg border border-scout-red/50 bg-scout-red/10 px-4 py-3 text-sm text-scout-red">
                  {morseError}
                </div>
              )}

              {/* Convert Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleMorseConvert}
                  disabled={morseInput.trim() === ""}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
                    morseInput.trim() === ""
                      ? "bg-scout-gray-light text-scout-black/50 cursor-not-allowed"
                      : "bg-scout-black text-white hover:bg-scout-black/90"
                  }`}
                >
                  Convertir
                </button>
              </div>

              {/* Output */}
              {morseOutput && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-scout-black mb-3">
                    Résultat :
                  </h3>
                  <div className="bg-scout-gray-light rounded-xl p-4 min-h-[60px] flex items-center justify-center text-lg font-mono text-scout-black">
                    {morseOutput}
                  </div>
                  {morseMode === "encode" && (
                    <p className="mt-3 text-xs text-scout-black/60 text-center">
                      Espace = "/" dans le code Morse
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Substitution Codes Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-scout-black mb-6">
              Codes par substitution
            </h2>
            
            <div className="space-y-6">
              {/* Code Selector */}
              <div className="bg-white rounded-xl border border-scout-gray-border p-4">
                <div className="flex flex-col gap-3">
                  <label className="text-scout-black/80 font-medium">
                    Sélectionnez un code de substitution :
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {scoutCodes.map((code) => (
                      <button
                        key={code.key}
                        onClick={() => setSelectedCode(code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                          selectedCode.key === code.key
                            ? "bg-scout-black text-white"
                            : "border border-scout-gray-border text-scout-black/80 hover:bg-scout-gray-light"
                        }`}
                      >
                        <div className="w-3 h-3 bg-scout-black/20 rounded"></div>
                        <span>{code.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Description */}
              <div className="bg-scout-yellow/10 rounded-xl border border-scout-yellow/30 p-4">
                <h3 className="font-bold text-scout-black mb-2">{selectedCode.name}</h3>
                <p className="text-scout-black/70">{selectedCode.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {selectedCode.mapping.map((mapping) => (
                    <span key={`${mapping.letter}-${mapping.replacement}`} className="flex items-center gap-1 px-2 py-0.5 rounded bg-scout-black/10">
                      <span className="font-mono">{mapping.letter}</span> → <span className="font-mono">{mapping.replacement}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setSubstitutionMode("encode")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    substitutionMode === "encode"
                      ? "bg-scout-black text-white"
                      : "border border-scout-gray-border text-scout-black/80 hover:bg-scout-gray-light"
                  }`}
                >
                  Encoder
                </button>
                <button
                  onClick={() => setSubstitutionMode("decode")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ml-2 ${
                    substitutionMode === "decode"
                      ? "bg-scout-black text-white"
                      : "border border-scout-gray-border text-scout-black/80 hover:bg-scout-gray-light"
                  }`}
                >
                  Décoder
                </button>
                <button
                  onClick={() => setShowTable(!showTable)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ml-2 ${
                    showTable
                      ? "bg-scout-black text-white"
                      : "border border-scout-gray-border text-scout-black/80 hover:bg-scout-gray-light"
                  }`}
                >
                  {showTable ? "Masquer la table" : "Afficher la table"}
                </button>
              </div>

              {/* Full Table Display */}
              {showTable && (
                <div className="bg-white rounded-xl border border-scout-gray-border p-4 overflow-x-auto">
                  <h4 className="font-bold text-scout-black mb-3">Table de substitution complète</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-scout-gray-border">
                        <th className="text-left py-2 px-3 font-medium text-scout-black/80">Lettre</th>
                        <th className="text-left py-2 px-3 font-medium text-scout-black/80">→</th>
                        <th className="text-left py-2 px-3 font-medium text-scout-black/80">Substitution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCode.mapping.map((mapping) => (
                        <tr key={`${mapping.letter}-${mapping.replacement}`} className="border-b border-scout-gray-border/50">
                          <td className="py-1.5 px-3 font-mono text-scout-black">{mapping.letter}</td>
                          <td className="py-1.5 px-3 text-scout-black/40">→</td>
                          <td className="py-1.5 px-3 font-mono text-scout-black">{mapping.replacement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Input/Output */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-scout-black/80 font-medium">
                    {substitutionMode === "encode" ? "Entrez votre texte à encoder" : "Entrez le texte à décoder"}
                  </label>
                  <textarea
                    value={substitutionInput}
                    onChange={(e) => setSubstitutionInput(e.target.value)}
                    placeholder={substitutionMode === "encode" ? "Ex: SCOUT" : "Ex: 789ABC"}
                    rows={3}
                    className="w-full rounded-xl border border-scout-gray-border bg-white py-3 px-4 text-sm text-scout-black placeholder:text-scout-black/40 focus:outline-none focus:ring-2 focus:ring-scout-black/20 resize-y"
                  />
                </div>

                {/* Error Message */}
                {substitutionError && (
                  <div className="rounded-lg border border-scout-red/50 bg-scout-red/10 px-4 py-3 text-sm text-scout-red">
                    {substitutionError}
                  </div>
                )}

                {/* Convert Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSubstitutionConvert}
                    disabled={substitutionInput.trim() === ""}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
                      substitutionInput.trim() === ""
                        ? "bg-scout-gray-light text-scout-black/50 cursor-not-allowed"
                        : "bg-scout-black text-white hover:bg-scout-black/90"
                    }`}
                  >
                    {substitutionMode === "encode" ? "Encoder" : "Décoder"} avec {selectedCode.name}
                  </button>
                </div>

                {/* Output */}
                {substitutionOutput && (
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-scout-black mb-3">
                      Résultat :
                    </h3>
                    <div className="bg-scout-gray-light rounded-xl p-4 min-h-[60px] flex items-center justify-center text-lg font-mono text-scout-black">
                      {substitutionOutput}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
import './App.css'

import { useEffect, useState } from "react";
import axios from "axios";
import { API_KEY, API_URL } from './config';

interface Entry {
  id: string;
  sys: {
    modelId: string;
    createdAt: { _seconds: number; _nanoseconds: number };
    updatedAt: { _seconds: number; _nanoseconds: number };
    titleField: string;
  };
  fields: {
    title: string;
    description: string;
  };
}

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get( API_URL + "?modelId=Post", {
          headers: {
            "x-api-key": API_KEY,
          },
        });
        setEntries(response.data.entries);
      } catch (err) {
        console.error(err);
        setError("Failed to load entries");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Posts</h1>
  
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-2xl bg-white p-4 shadow-md hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-1">{entry.fields.title}</h2>
              <p className="text-gray-700">{entry.fields.description}</p>
              <p className="text-sm text-gray-400 mt-2">
                Created at: {new Date(entry.sys.createdAt._seconds * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );  
}

export default App;

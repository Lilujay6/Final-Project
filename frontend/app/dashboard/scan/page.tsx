"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api";

interface ScanResult {
  access_id: string;
  nama: string;
  email: string;
  role: string;
  location: string;
  expired: string;
  time: string;
}

export default function ScanPage() {
  const [cardId, setCardId] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    inputRef.current?.focus();
  }, []);

  const scan = async () => {
    if (!cardId.trim() || !token) {
      setError("Please enter a card ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/scan",
        { card_id: cardId },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        },
      );

      setResult(res.data);
      setCardId("");

      // Auto focus input after successful scan
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      setResult(null);
      console.error("Scan error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scan Card</h1>
        <p className="text-sm opacity-70 mt-1">
          Scan or input a card ID to log access
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-900">
          <p className="font-semibold">Scan Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Card ID</label>
            <Input
              ref={inputRef}
              placeholder="Enter card ID or scan..."
              value={cardId}
              onChange={(e) => {
                setCardId(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  scan();
                }
              }}
              disabled={loading}
            />
          </div>
          <Button onClick={scan} disabled={loading} className="w-full">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
                Scanning...
              </div>
            ) : (
              "Scan Card"
            )}
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Access Log Entry</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm opacity-70 mb-1">Name</p>
              <p className="text-lg font-semibold">{result.nama}</p>
            </div>
            <div>
              <p className="text-sm opacity-70 mb-1">Email</p>
              <p className="text-sm">{result.email}</p>
            </div>
            <div>
              <p className="text-sm opacity-70 mb-1">Role</p>
              <p className="text-sm">{result.role}</p>
            </div>
            <div>
              <p className="text-sm opacity-70 mb-1">Location</p>
              <p
                className={`text-sm font-semibold ${
                  result.location === "inside"
                    ? "text-green-600 dark:text-green-400"
                    : "text-orange-600 dark:text-orange-400"
                }`}
              >
                {result.location === "inside" ? "Inside Library" : "Outside"}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-70 mb-1">Access Time</p>
              <p className="text-sm font-mono">{result.time}</p>
            </div>
            <div>
              <p className="text-sm opacity-70 mb-1">Card Expiry</p>
              <p className="text-sm font-mono">{result.expired}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

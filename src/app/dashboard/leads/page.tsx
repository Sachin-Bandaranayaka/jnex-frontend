"use client";
import { useState, useEffect } from "react";
import { Lead } from "@/interfaces/interfaces";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import LeadDashboard from "@/components/LeadDashboard";
import { useAuth } from "@/context/authContext";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/leads");
      // Check if response.data is an array, if not, check if it's nested
      const leadsData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setLeads(leadsData);
      console.log('Leads data:', leadsData); // Debug log
    } catch (err: any) {
      console.error('Failed to fetch leads:', err);
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError(err.message || 'Failed to fetch leads. Please try again.');
      }
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadUpdate = async (leadData: Partial<Lead>, leadId?: number) => {
    try {
      if (leadId) {
        await api.put(`/api/leads/${leadId}`, leadData);
      } else {
        await api.post('/api/leads', leadData);
      }
      await fetchLeads();
      return true;
    } catch (error) {
      console.error('Error saving lead:', error);
      setError('Failed to save lead');
      return false;
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view leads</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <LeadDashboard
        leads={leads}
        onLeadUpdate={handleLeadUpdate}
      />
    </div>
  );
}

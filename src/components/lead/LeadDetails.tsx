import { useState } from "react";
import { Lead, LeadStatus } from "@/interfaces/interfaces";
import { api } from "@/lib/api";

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: () => void;
}

export default function LeadDetails({ lead, onClose, onUpdate }: LeadDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead>(lead);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await api.put(`/api/leads/${lead.id}`, editedLead);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to update lead:", err);
      setError("Failed to update lead. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={editedLead.name}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, name: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editedLead.email}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, email: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editedLead.phone}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, phone: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={editedLead.status}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, status: e.target.value as LeadStatus })
                  }
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Source
                </label>
                <input
                  type="text"
                  value={editedLead.source}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, source: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  value={editedLead.notes}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, notes: e.target.value })
                  }
                  rows={4}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">{lead.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{lead.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1">{lead.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">{lead.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Source</h3>
                  <p className="mt-1">{lead.source}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 whitespace-pre-wrap">{lead.notes}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
